import { useEffect } from 'react'
import { useXTerm } from 'react-xtermjs'
import { FitAddon } from '@xterm/addon-fit'
import { WebLinksAddon } from '@xterm/addon-web-links'
import { Box, Typography } from '@mui/material'
import { WarningAmber } from '@mui/icons-material'

import '@xterm/xterm/css/xterm.css'

function str2ab(str: string) {
  const buf = new ArrayBuffer(str.length) // 2 bytes for each char
  const bufView = new Uint8Array(buf)
  for (let i = 0, strLen = str.length; i < strLen; i++) {
    bufView[i] = str.charCodeAt(i)
  }
  return buf
}

const fitAddon = new FitAddon()
const webLinksAddon = new WebLinksAddon()

export default function OpenStackSerial({
  consoleUrl,
}: {
  consoleUrl: string
}) {
  const { instance: term, ref: termRef } = useXTerm()

  const resizeTerm = () => {
    fitAddon.fit()
  }

  useEffect(() => {
    if (term) {
      // Clear terminal
      term?.clear()
      // Load fit addon
      term?.loadAddon(fitAddon)
      window.addEventListener('resize', resizeTerm)
      resizeTerm()
      // Load web links addon
      term?.loadAddon(webLinksAddon)

      const ws = new WebSocket(consoleUrl, ['binary', 'base64'])

      term?.onData(function (data) {
        ws.send(str2ab(data))
      })

      ws.onopen = () => {
        console.log('WebSocket connected')
        ws.send(str2ab(String.fromCharCode(13)))
      }

      ws.onerror = (error) => {
        console.error('WebSocket error:', error)
      }

      ws.onclose = (event) => {
        console.log('WebSocket closed:', event.code, event.reason)
      }

      ws.onmessage = function (e) {
        if (e.data instanceof Blob) {
          const f = new FileReader()
          f.onload = function () {
            term?.write(String(f.result))
          }
          f.readAsText(e.data)
        } else {
          term?.write(e.data)
        }
      }

      return () => {
        ws.close()
        window.removeEventListener('resize', resizeTerm)
      }
    }
  }, [term, consoleUrl])

  return (
    <Box
      sx={{
        width: '100%',
        flexGrow: '1',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <Typography
        sx={{ color: '#ea9a97', display: 'flex', gap: 1, padding: 1 }}
      >
        <WarningAmber /> Warning: Only one user can use the serial console at a
        time. Additional users will see a blank console until the first
        disconnects.
      </Typography>
      <div ref={termRef} style={{ flexGrow: '1' }}></div>
    </Box>
  )
}
