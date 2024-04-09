import {
  Box,
  Checkbox,
  Chip,
  CircularProgress,
  Container,
  FormControl,
  InputLabel,
  ListItemText,
  MenuItem,
  OutlinedInput,
  Pagination,
  Paper,
  Select,
  SelectChangeEvent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from '@mui/material'
import { GRAPHQL_MAX_INT } from 'graphql'
import { useSnackbar } from 'notistack'
import React, { useEffect, useState } from 'react'
import {
  ActionType,
  ListActionsQuery,
  useListActionsQuery,
} from '../../api/generated/graphql'

const createActionData = (
  action: ListActionsQuery['actions']['results'][0]
): {
  id: string
  ipAddress: string
  type: ActionType
  message: string
  performedAt: Date
  username: string
} => {
  return {
    id: action?.ID ?? '',
    ipAddress: action?.IpAddress ?? '',
    type: action?.Type ?? ActionType.Undefined,
    message: action?.Message ?? '',
    performedAt: new Date(action?.PerformedAt ?? ''),
    username: action?.ActionToUser?.Username ?? '',
  }
}

const getActionTypeColor = (
  type: ActionType
):
  | 'error'
  | 'default'
  | 'info'
  | 'secondary'
  | 'primary'
  | 'success'
  | 'warning'
  | undefined => {
  switch (type) {
    // Logins
    case ActionType.SignIn:
      return 'info'
    case ActionType.FailedSignIn:
      return 'info'
    case ActionType.SignOut:
      return 'info'
    // Consoles
    case ActionType.ConsoleAccess:
      return 'secondary'
    case ActionType.Reboot:
      return 'secondary'
    case ActionType.Shutdown:
      return 'secondary'
    case ActionType.PowerOn:
      return 'secondary'
    case ActionType.PowerOff:
      return 'secondary'
    case ActionType.UpdateLockout:
      return 'secondary'
    // Account
    case ActionType.ChangeSelfPassword:
      return 'success'
    case ActionType.ChangePassword:
      return 'success'
    // Database
    case ActionType.CreateObject:
      return 'primary'
    case ActionType.UpdateObject:
      return 'primary'
    case ActionType.DeleteObject:
      return 'primary'
    default:
      return 'default'
  }
}

const ActionTypeMap: { [key in ActionType]: string } = {
  API_CALL: 'API Call',
  SIGN_IN: 'Sign IN',
  FAILED_SIGN_IN: 'Failed Sign In',
  SIGN_OUT: 'Sign Out',
  CONSOLE_ACCESS: 'Console Access',
  REBOOT: 'Reboot',
  SHUTDOWN: 'Shutdown',
  POWER_ON: 'Power On',
  POWER_OFF: 'Power Off',
  CHANGE_SELF_PASSWORD: 'Change Self Password',
  CHANGE_PASSWORD: 'Change Password',
  CREATE_OBJECT: 'Create Object',
  UPDATE_OBJECT: 'Update Object',
  DELETE_OBJECT: 'Delete Object',
  UPDATE_LOCKOUT: 'Update Lockout',
  UNDEFINED: 'Undefined',
}

export const Logs: React.FC = (): React.ReactElement => {
  const [resultsPerPage, setResultsPerPage] = useState<number>(10)
  const [page, setPage] = useState<number>(1)
  const [logTypes, setLogTypes] = useState<ActionType[]>(
    Object.keys(ActionTypeMap).map((k) => k as ActionType)
  )
  const { enqueueSnackbar } = useSnackbar()
  const {
    data: listActionsData,
    previousData: listActionsPrevData,
    loading: listActionsLoading,
    error: listActionsError,
    refetch: refetchActions,
  } = useListActionsQuery({
    variables: {
      offset: resultsPerPage * (page - 1),
      limit: resultsPerPage,
      types: logTypes,
    },
  })

  // Set the title of the tab only on first load
  useEffect(() => {
    document.title = 'Logs - Compsole'
  }, [])

  useEffect(() => {
    if (listActionsError)
      enqueueSnackbar(`Couldn't get actions: ${listActionsError.message}`, {
        variant: 'error',
      })
  }, [listActionsError, enqueueSnackbar])

  useEffect(() => {
    // If we change the results per page or log types, reset the page to 0
    if (
      listActionsPrevData?.actions.limit !== resultsPerPage ||
      !listActionsPrevData.actions.types.every((v) => logTypes.includes(v))
    ) {
      setPage(1) // This should retrigger this effect
      return
    }
    if (!listActionsLoading) {
      refetchActions({
        offset: resultsPerPage * (page - 1),
        limit: resultsPerPage,
        types: logTypes,
      })
    }
  }, [
    page,
    resultsPerPage,
    logTypes,
    listActionsLoading,
    listActionsPrevData,
    refetchActions,
  ])

  const handleLogTypeChange = (event: SelectChangeEvent<typeof logTypes>) => {
    setLogTypes(
      typeof event.target.value === 'string'
        ? event.target.value.split(',').map((v) => v as ActionType)
        : event.target.value
    )
  }

  return (
    <Container component="main" sx={{ p: 2 }}>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Typography variant="subtitle2">Showing</Typography>
          <TextField
            variant="filled"
            size="small"
            hiddenLabel
            inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }}
            value={resultsPerPage}
            onChange={(e) =>
              setResultsPerPage(
                typeof e.target.value === 'number'
                  ? e.target.value
                  : resultsPerPage
              )
            }
            select
            sx={{ mx: 1 }}
          >
            <MenuItem value={10}>10</MenuItem>
            <MenuItem value={25}>25</MenuItem>
            <MenuItem value={50}>50</MenuItem>
            <MenuItem value={100}>100</MenuItem>
          </TextField>
          <Typography variant="subtitle2">results per page</Typography>
        </Box>
        <Typography variant="subtitle2">
          Showing{' '}
          {page === 1
            ? `first ${
                resultsPerPage >
                (listActionsData?.actions.totalResults ?? GRAPHQL_MAX_INT)
                  ? listActionsData?.actions.totalResults
                  : resultsPerPage
              }`
            : `${(page - 1) * resultsPerPage}-${
                page * resultsPerPage >
                (listActionsData?.actions.totalResults ?? GRAPHQL_MAX_INT)
                  ? listActionsData?.actions.totalResults ?? 0
                  : page * resultsPerPage
              }`}{' '}
          of {listActionsData?.actions.totalResults ?? 'N/A'}
        </Typography>
        <Pagination
          count={listActionsData?.actions.totalPages ?? 1}
          sx={{ m: 1 }}
          page={page}
          onChange={(e, value) => setPage(value)}
        ></Pagination>
      </Box>
      <TableContainer component={Paper}>
        <Table sx={{ width: '100%' }} aria-label="users table">
          <TableHead>
            <TableRow>
              <TableCell align="center">ID</TableCell>
              <TableCell align="center">IP Address</TableCell>
              <TableCell align="center">Type</TableCell>
              <TableCell align="center">Message</TableCell>
              <TableCell align="center">Username</TableCell>
              <TableCell align="center">Performed At</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {listActionsData?.actions.results
              .map(createActionData)
              .map((row) => (
                <TableRow
                  key={row.id}
                  sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                >
                  <TableCell component="th" scope="row" align="center">
                    {row.id}
                  </TableCell>
                  <TableCell align="center">{row.ipAddress}</TableCell>
                  <TableCell align="center">
                    <Chip
                      label={row.type}
                      color={getActionTypeColor(row.type)}
                      size="small"
                    />
                  </TableCell>
                  <TableCell align="center">{row.message}</TableCell>
                  <TableCell align="center">{row.username}</TableCell>
                  <TableCell align="center">
                    {row.performedAt.toLocaleString()}
                  </TableCell>
                </TableRow>
              )) ?? (
              <TableCell colSpan={6} sx={{ textAlign: 'center' }}>
                No Actions Found
              </TableCell>
            )}
            {listActionsLoading && (
              <TableCell colSpan={6} sx={{ textAlign: 'center' }}>
                <CircularProgress />
              </TableCell>
            )}
          </TableBody>
        </Table>
      </TableContainer>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <FormControl sx={{ m: 1, width: 300 }}>
          <InputLabel id="demo-multiple-checkbox-label">Tag</InputLabel>
          <Select
            labelId="demo-multiple-checkbox-label"
            id="demo-multiple-checkbox"
            multiple
            value={logTypes}
            onChange={handleLogTypeChange}
            input={<OutlinedInput label="Tag" />}
            renderValue={(selected) => selected.join(', ')}
            // MenuProps={MenuProps}
          >
            {Object.keys(ActionTypeMap).map((type) => (
              <MenuItem key={type} value={type}>
                <Checkbox checked={logTypes.indexOf(type as ActionType) > -1} />
                <ListItemText primary={ActionTypeMap[type as ActionType]} />
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <Pagination
          count={listActionsData?.actions.totalPages ?? 1}
          sx={{ m: 1 }}
          page={page}
          onChange={(e, value) => setPage(value)}
        ></Pagination>
      </Box>
    </Container>
  )
}
