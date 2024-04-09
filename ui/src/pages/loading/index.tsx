import { CircularProgress, Container, Box } from '@mui/material'
import * as React from 'react'
import { useEffect } from 'react'

export const Loading: React.FC = (): React.ReactElement => {
  // Set the title of the tab only on first load
  useEffect(() => {
    document.title = 'Loading...'
  }, [])

  return (
    <Container
      component="main"
      maxWidth="xs"
      sx={{
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Box
        sx={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <CircularProgress />
      </Box>
    </Container>
  )
}
