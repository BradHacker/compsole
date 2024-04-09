import { LockTwoTone, LockOpenTwoTone, Clear } from '@mui/icons-material'
import {
  TableContainer,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Chip,
  ButtonGroup,
  Button,
  CircularProgress,
  Box,
  Typography,
  Divider,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Checkbox,
  OutlinedInput,
  InputAdornment,
  IconButton,
  ToggleButtonGroup,
  ToggleButton,
} from '@mui/material'
import React, { useEffect, useState } from 'react'
import {
  AllVmObjectsQuery,
  useAllVmObjectsQuery,
  useBatchLockoutMutation,
  useLockoutVmMutation,
} from '../../api/generated/graphql'
import { useNavigate } from 'react-router-dom'
import { useSnackbar } from 'notistack'

enum FilterType {
  IP_ADDRESS,
  NAME,
  COMPETITION,
  TEAM,
  ID,
}

enum FilterMode {
  TEXT,
  REGEX,
}

const isFilterValid = (filter: string, filterMode: FilterMode) => {
  if (filterMode === FilterMode.REGEX) {
    try {
      const r = new RegExp(filter)
    } catch {
      return false
    }
  }
  return true
}

export const LockoutForm: React.FC = (): React.ReactElement => {
  const {
    data: allVmObjectsData,
    loading: allVmObjectsLoading,
    error: allVmObjectsError,
    previousData: prevVmObjectsData,
    refetch: refetchVmObjects,
  } = useAllVmObjectsQuery({
    fetchPolicy: 'no-cache',
  })
  const [
    lockoutVm,
    {
      data: lockoutVmData,
      loading: lockoutVmLoading,
      error: lockoutVmError,
      reset: resetLockoutVm,
    },
  ] = useLockoutVmMutation()
  const [
    batchLockout,
    {
      data: batchLockoutData,
      loading: batchLockoutLoading,
      error: batchLockoutError,
      reset: resetBatchLockout,
    },
  ] = useBatchLockoutMutation()
  const [filterType, setFilterType] = useState<FilterType>(FilterType.NAME)
  const [filterMode, setFilterMode] = useState<FilterMode>(FilterMode.TEXT)
  const [filter, setFilter] = useState<string>('')
  const [filteredVmObjects, setFilteredVmObjects] = useState<
    AllVmObjectsQuery['vmObjects']
  >([])
  const [selectedVmObjects, setSelectedVmObjects] = useState<
    AllVmObjectsQuery['vmObjects']
  >([])
  const navigate = useNavigate()
  const { enqueueSnackbar } = useSnackbar()

  useEffect(() => {
    if (allVmObjectsError)
      enqueueSnackbar(`Couldn't get vm objects: ${allVmObjectsError.message}`, {
        variant: 'error',
      })
  }, [allVmObjectsError, enqueueSnackbar])

  useEffect(() => {
    if (batchLockoutError)
      enqueueSnackbar(
        `Couldn't update vm object lockouts: ${batchLockoutError.message}`,
        {
          variant: 'error',
        }
      )
    if (lockoutVmError)
      enqueueSnackbar(
        `Couldn't update vm object lockout: ${lockoutVmError.message}`,
        {
          variant: 'error',
        }
      )
  }, [batchLockoutError, lockoutVmError, enqueueSnackbar])

  useEffect(() => {
    if (batchLockoutLoading)
      enqueueSnackbar('Updating vm object lockouts...', {
        variant: 'info',
        autoHideDuration: 2500,
      })
    if (batchLockoutData?.batchLockout) {
      enqueueSnackbar('Successfully updated vm object lockouts!', {
        variant: 'success',
      })
      refetchVmObjects().then(() => setFilter(''))
      resetBatchLockout()
    }
    if (lockoutVmLoading)
      enqueueSnackbar('Updating vm object lockout...', {
        variant: 'info',
        autoHideDuration: 2500,
      })
    if (lockoutVmData?.lockoutVm) {
      enqueueSnackbar('Successfully updated vm object lockout!', {
        variant: 'success',
      })
      refetchVmObjects()
      resetLockoutVm()
    }
  }, [
    batchLockoutLoading,
    batchLockoutData,
    lockoutVmLoading,
    lockoutVmData,
    refetchVmObjects,
    resetBatchLockout,
    resetLockoutVm,
    enqueueSnackbar,
  ])

  useEffect(() => {
    // If this is the first time we have data
    if (!prevVmObjectsData && allVmObjectsData?.vmObjects)
      setFilteredVmObjects(allVmObjectsData.vmObjects)
  }, [prevVmObjectsData, allVmObjectsData])

  useEffect(() => {
    const filterVmObjects = () => {
      if (!allVmObjectsData) return
      if (filterMode === FilterMode.REGEX && !isFilterValid(filter, filterMode))
        return
      if (filter.length === 0) {
        setFilteredVmObjects(allVmObjectsData?.vmObjects ?? [])
        return
      }
      setFilteredVmObjects(
        allVmObjectsData.vmObjects.filter((vmObject) => {
          let field = ''
          switch (filterType) {
            case FilterType.COMPETITION:
              field = vmObject.VmObjectToTeam?.TeamToCompetition.Name ?? ''
              break
            case FilterType.ID:
              field = vmObject.ID
              break
            case FilterType.IP_ADDRESS:
              field = vmObject.IPAddresses.join(',')
              break
            case FilterType.NAME:
              field = vmObject.Name
              break
            case FilterType.TEAM:
              field =
                (vmObject.VmObjectToTeam?.Name ||
                  `Team ${vmObject.VmObjectToTeam?.TeamNumber}`) ??
                ''
              break
          }
          let passesFilter = false
          if (filterMode === FilterMode.REGEX) {
            const regex = new RegExp(filter)
            passesFilter = regex.test(field)
          } else if (filterMode === FilterMode.TEXT) {
            passesFilter =
              field.toLowerCase().indexOf(filter.toLowerCase()) > -1
          }
          return passesFilter
        })
      )
    }

    const filterDebounce = setTimeout(() => filterVmObjects(), 1000)

    return () => clearTimeout(filterDebounce)
  }, [filter, filterMode, filterType, allVmObjectsData])

  const isSelected = (id: string): boolean => {
    return selectedVmObjects.find((vm) => vm.ID === id) !== undefined
  }

  const areAllSelected = (): boolean[] => {
    // returns [checked, indeterminate]
    if (selectedVmObjects.length === 0) return [false, false]
    const selectedNotVisible = selectedVmObjects.filter(
      (selected) =>
        filteredVmObjects.findIndex((filtered) => filtered.ID === selected.ID) <
        0
    )
    const visibleNotSelected = filteredVmObjects.filter(
      (filtered) =>
        selectedVmObjects.findIndex((selected) => filtered.ID === selected.ID) <
        0
    )
    if (visibleNotSelected.length > 0) return [false, true]
    if (selectedNotVisible.length > 0) return [true, true]
    return [true, false]
  }

  const clearSelection = () => {
    setSelectedVmObjects([])
  }

  const handleSelectVmObject = (
    vmObject: AllVmObjectsQuery['vmObjects'][0]
  ) => {
    console.log(`selecting ${vmObject.ID}`)
    if (!selectedVmObjects.find((vm) => vm.ID === vmObject.ID))
      setSelectedVmObjects([...selectedVmObjects, vmObject])
  }

  const handleDeselectVmObject = (
    vmObject: AllVmObjectsQuery['vmObjects'][0]
  ) => {
    setSelectedVmObjects(
      selectedVmObjects.filter((vm) => vm.ID !== vmObject.ID)
    )
  }

  const handleSelectAll = (
    event: React.ChangeEvent<HTMLInputElement>,
    checked: boolean
  ) => {
    console.log(checked, filteredVmObjects)
    if (checked)
      setSelectedVmObjects([
        ...selectedVmObjects,
        ...filteredVmObjects.filter(
          (vmObject) => !selectedVmObjects.find((vm) => vm.ID === vmObject.ID)
        ),
      ])
    else
      setSelectedVmObjects(
        selectedVmObjects.filter(
          (vm) => !filteredVmObjects.find((fvm) => fvm.ID === vm.ID)
        )
      )
  }

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          width: '100%',
          mb: 1,
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Typography variant="subtitle1" sx={{ mr: 1 }}>
            {selectedVmObjects.length} VM Objects Selected
          </Typography>
          <Button size="small" onClick={clearSelection}>
            <Clear sx={{ mr: 1 }} /> Clear Selection
          </Button>
        </Box>
        <ButtonGroup>
          <Button
            aria-label="left aligned"
            color="error"
            variant="outlined"
            onClick={() =>
              batchLockout({
                variables: {
                  vmObjects: selectedVmObjects.map((vm) => vm.ID),
                  locked: true,
                },
              })
            }
            disabled={
              batchLockoutLoading || lockoutVmLoading || allVmObjectsLoading
            }
          >
            <LockTwoTone sx={{ mr: 1 }} /> Lock Selected
          </Button>
          <Button
            color="secondary"
            onClick={() =>
              batchLockout({
                variables: {
                  vmObjects: selectedVmObjects.map((vm) => vm.ID),
                  locked: false,
                },
              })
            }
            disabled={
              batchLockoutLoading || lockoutVmLoading || allVmObjectsLoading
            }
          >
            <LockOpenTwoTone sx={{ mr: 1 }} /> Unlock Selected
          </Button>
        </ButtonGroup>
      </Box>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '100%',
        }}
      >
        <FormControl
          variant="outlined"
          sx={{
            minWidth: '25%',
            flex: '2',
          }}
        >
          <InputLabel id="filter-type-select-label">Filter Type</InputLabel>
          <Select
            labelId="filter-type-select-label"
            id="filter-type-select"
            value={filterType}
            label="Filter Type"
            onChange={(e) => setFilterType(e.target.value as FilterType)}
          >
            <MenuItem value={FilterType.ID}>ID</MenuItem>
            <MenuItem value={FilterType.NAME}>Name</MenuItem>
            <MenuItem value={FilterType.IP_ADDRESS}>IP Address</MenuItem>
            <MenuItem value={FilterType.TEAM}>Team</MenuItem>
            <MenuItem value={FilterType.COMPETITION}>Competition</MenuItem>
          </Select>
        </FormControl>

        <FormControl
          sx={{ m: 1, width: '25ch', minWidth: '25%', flex: '6' }}
          variant="outlined"
        >
          <InputLabel htmlFor="filter-text">
            {(filterMode === FilterMode.TEXT ? 'Filter Text' : 'Filter Regex') +
              (isFilterValid(filter, filterMode)
                ? ''
                : ' - Must be a valid regular expression')}
          </InputLabel>
          <OutlinedInput
            id="filter-text"
            label={
              (filterMode === FilterMode.TEXT
                ? 'Filter Text'
                : 'Filter Regex') +
              (isFilterValid(filter, filterMode)
                ? ''
                : ' - Must be a valid regular expression')
            }
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            error={!isFilterValid(filter, filterMode)}
            endAdornment={
              <InputAdornment position="end">
                <IconButton
                  aria-label="clear filter"
                  onClick={() => setFilter('')}
                  edge="end"
                >
                  <Clear />
                </IconButton>
              </InputAdornment>
            }
          />
        </FormControl>
        <FormControl
          variant="outlined"
          sx={{
            minWidth: '15%',
            flex: '1',
          }}
        >
          <InputLabel id="filter-mode-select-label">Filter Mode</InputLabel>
          <Select
            labelId="filter-mode-select-label"
            id="filter-mode-select"
            value={filterMode}
            label="Filter Type"
            onChange={(e) => setFilterMode(e.target.value as FilterMode)}
          >
            <MenuItem value={FilterMode.TEXT}>Text</MenuItem>
            <MenuItem value={FilterMode.REGEX}>Regex</MenuItem>
          </Select>
        </FormControl>
      </Box>
      <Divider />
      <TableContainer component={Paper}>
        <Table sx={{ width: '100%' }} aria-label="vm objects table">
          <TableHead>
            <TableRow>
              <TableCell padding="checkbox">
                <Checkbox
                  color="primary"
                  checked={areAllSelected()[0]}
                  indeterminate={areAllSelected()[1]}
                  onChange={(event, checked) => handleSelectAll(event, checked)}
                  inputProps={{
                    'aria-label': 'select all desserts',
                  }}
                />
              </TableCell>
              <TableCell align="center">ID</TableCell>
              <TableCell align="center">Name</TableCell>
              <TableCell align="center">Identifier</TableCell>
              <TableCell align="center">IP Addresses</TableCell>
              <TableCell align="center">Team</TableCell>
              <TableCell align="center">Competition</TableCell>
              <TableCell align="center">Controls</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredVmObjects.map((vmObject) => {
              const isItemSelected = isSelected(vmObject.ID)

              return (
                <TableRow
                  key={vmObject.ID}
                  sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                >
                  <TableCell padding="checkbox" component="th" scope="row">
                    <Checkbox
                      color="primary"
                      checked={isItemSelected}
                      onChange={(e, checked) => {
                        if (checked) handleSelectVmObject(vmObject)
                        else handleDeselectVmObject(vmObject)
                      }}
                      // inputProps={{
                      //   "aria-labelledby": labelId,
                      // }}
                    />
                  </TableCell>
                  <TableCell align="center">{vmObject.ID}</TableCell>
                  <TableCell align="center">{vmObject.Name}</TableCell>
                  <TableCell align="center">{vmObject.Identifier}</TableCell>
                  <TableCell align="center">
                    <Box
                      sx={{
                        display: 'flex',
                        flexDirection: 'column',
                      }}
                    >
                      {vmObject.IPAddresses.map((ip) => (
                        <Typography
                          key={ip}
                          variant="caption"
                          component="code"
                          sx={{
                            mb: 1,
                          }}
                        >
                          {ip}
                        </Typography>
                      ))}
                    </Box>
                  </TableCell>
                  <TableCell align="center">
                    <Chip
                      label={
                        vmObject.VmObjectToTeam
                          ? vmObject.VmObjectToTeam.Name ||
                            `Team ${vmObject.VmObjectToTeam.TeamNumber}`
                          : 'N/A'
                      }
                      color={vmObject.VmObjectToTeam ? 'primary' : 'default'}
                      size="small"
                    />
                  </TableCell>
                  <TableCell align="center">
                    <Chip
                      label={
                        vmObject.VmObjectToTeam
                          ? vmObject.VmObjectToTeam.TeamToCompetition.Name
                          : 'N/A'
                      }
                      color={vmObject.VmObjectToTeam ? 'secondary' : 'default'}
                      size="small"
                    />
                  </TableCell>
                  <TableCell align="center">
                    <ToggleButtonGroup
                      size="small"
                      onChange={(e, locked) =>
                        lockoutVm({
                          variables: {
                            vmObjectId: vmObject.ID,
                            locked,
                          },
                        })
                      }
                      exclusive
                      disabled={
                        batchLockoutLoading ||
                        lockoutVmLoading ||
                        allVmObjectsLoading
                      }
                    >
                      <ToggleButton
                        // variant="outlined"
                        color="error"
                        selected={vmObject.Locked || false}
                        value={true}
                      >
                        <LockTwoTone />
                      </ToggleButton>
                      <ToggleButton
                        // variant="outlined"
                        color="secondary"
                        selected={!vmObject.Locked}
                        value={false}
                      >
                        <LockOpenTwoTone />
                      </ToggleButton>
                    </ToggleButtonGroup>
                  </TableCell>
                </TableRow>
              )
            }) ?? (
              <TableCell colSpan={5} sx={{ textAlign: 'center' }}>
                No Vm Objects Found
              </TableCell>
            )}
            {allVmObjectsLoading && (
              <TableCell colSpan={5} sx={{ textAlign: 'center' }}>
                <CircularProgress />
              </TableCell>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  )
}
