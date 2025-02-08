import { Box, Typography, BoxProps, Skeleton, Link } from '@mui/material'
import { ConsoleType, useGetVmConsoleQuery } from '../../api/generated/graphql'
import OpenStackNoVNC from './openstack/novnc'
import OpenStackSerial from './openstack/serial'

export interface ConsoleProps {
  vmObjectId: string
  providerType: string
  consoleType: ConsoleType
}

export default function Console({
  vmObjectId,
  providerType,
  consoleType,
  ...props
}: ConsoleProps & BoxProps) {
  const {
    data: getVmConsoleData,
    loading: getVmConsoleLoading,
    error: getVmConsoleError,
    refetch: getVmConsoleRefetch,
  } = useGetVmConsoleQuery({ variables: { vmObjectId, consoleType } })

  if (getVmConsoleLoading) {
    return <Skeleton width="100%" height="calc(100vh - 10rem)" />
  }

  if (getVmConsoleError || !getVmConsoleData) {
    return (
      <Box
        sx={{
          width: '100%',
          height: 'calc(100vh - 10rem)',
        }}
        {...props}
      >
        <Typography fontWeight="bold" color="red">
          An error has occurred
        </Typography>
      </Box>
    )
  }

  let consoleUi = (
    <Typography align="center">
      Console type not suppported. Please submit a feature request on{' '}
      <Link href="https://github.com/BradHacker/compsole">GitHub</Link>.
    </Typography>
  )

  switch (providerType) {
    case 'OPENSTACK':
      switch (consoleType) {
        case ConsoleType.Novnc:
          consoleUi = <OpenStackNoVNC consoleUrl={getVmConsoleData.console} />
          break
        case ConsoleType.Serial:
          consoleUi = <OpenStackSerial consoleUrl={getVmConsoleData.console} />
          break
      }
  }

  return (
    <Box
      sx={{
        width: '100%',
        height: 'calc(100vh - 10rem)',
      }}
      {...props}
    >
      {consoleUi}
    </Box>
  )
}
