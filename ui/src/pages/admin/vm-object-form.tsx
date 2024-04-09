import {
  ArrowBackTwoTone,
  LockOpenTwoTone,
  LockTwoTone,
  Save,
} from '@mui/icons-material'
import {
  Container,
  TextField,
  Typography,
  Divider,
  Skeleton,
  Autocomplete,
  Fab,
  CircularProgress,
  Button,
  ToggleButtonGroup,
  ToggleButton,
  Box,
} from '@mui/material'
import { useSnackbar } from 'notistack'
import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import {
  useGetVmObjectLazyQuery,
  useUpdateVmObjectMutation,
  useCreateVmObjectMutation,
  VmObjectInput,
  GetCompTeamSearchValuesQuery,
  useGetCompTeamSearchValuesQuery,
  Team,
  useLockoutVmMutation,
} from '../../api/generated/graphql'

export const VmObjectForm: React.FC = (): React.ReactElement => {
  const { id } = useParams()
  const [
    getVmObject,
    {
      data: getVmObjectData,
      loading: getVmObjectLoading,
      error: getVmObjectError,
      refetch: refetchGetVmObject,
    },
  ] = useGetVmObjectLazyQuery()
  const { data: getCompTeamData, error: getCompTeamError } =
    useGetCompTeamSearchValuesQuery({
      fetchPolicy: 'no-cache',
    })
  const [
    updateVmObject,
    {
      data: updateVmObjectData,
      loading: updateVmObjectLoading,
      error: updateVmObjectError,
    },
  ] = useUpdateVmObjectMutation()
  const [
    createVmObject,
    {
      data: createVmObjectData,
      loading: createVmObjectLoading,
      error: createVmObjectError,
    },
  ] = useCreateVmObjectMutation()
  const [
    lockoutVm,
    {
      data: lockoutVmData,
      loading: lockoutVmLoading,
      error: lockoutVmError,
      reset: resetLockoutVm,
    },
  ] = useLockoutVmMutation()
  const [vmObject, setVmObject] = useState<VmObjectInput>({
    ID: '',
    IPAddresses: [],
    Identifier: '',
    Name: '',
    VmObjectToTeam: undefined,
  })
  const [viewTeam, setViewTeam] = useState<
    GetCompTeamSearchValuesQuery['teams'][0] | null
  >(null)
  const { enqueueSnackbar } = useSnackbar()
  const navigate = useNavigate()

  useEffect(() => {
    if (id)
      getVmObject({
        variables: {
          vmObjectId: id,
        },
      })
  }, [id, getVmObject])

  useEffect(() => {
    if (getCompTeamError)
      enqueueSnackbar(
        `Couldn't get competitions and teams: ${getCompTeamError.message}`
      )
  }, [getCompTeamError, enqueueSnackbar])

  useEffect(() => {
    if (!updateVmObjectLoading && updateVmObjectData)
      enqueueSnackbar(
        `Updated competition "${updateVmObjectData.updateVmObject.Name}"`,
        {
          variant: 'success',
        }
      )
    if (!createVmObjectLoading && createVmObjectData) {
      enqueueSnackbar(
        `Created competition "${createVmObjectData.createVmObject.Name}"`,
        {
          variant: 'success',
        }
      )
      setTimeout(
        () =>
          navigate(
            `/admin/competition/${createVmObjectData?.createVmObject.ID}`
          ),
        1000
      )
    }
  }, [
    updateVmObjectData,
    updateVmObjectLoading,
    createVmObjectData,
    createVmObjectLoading,
    enqueueSnackbar,
    navigate,
  ])

  useEffect(() => {
    if (getVmObjectError)
      enqueueSnackbar(`Failed to get vm object: ${getVmObjectError.message}`, {
        variant: 'error',
      })
    if (updateVmObjectError)
      enqueueSnackbar(
        `Failed to update vm object: ${updateVmObjectError.message}`,
        {
          variant: 'error',
        }
      )
    if (createVmObjectError)
      enqueueSnackbar(
        `Failed to create vm object: ${createVmObjectError.message}`,
        {
          variant: 'error',
        }
      )
  }, [
    getVmObjectError,
    updateVmObjectError,
    createVmObjectError,
    enqueueSnackbar,
  ])

  useEffect(() => {
    if (getVmObjectData) {
      setVmObject({
        ...getVmObjectData.vmObject,
        VmObjectToTeam: getVmObjectData.vmObject.VmObjectToTeam?.ID,
      } as VmObjectInput)
      if (getCompTeamData && getVmObjectData.vmObject.VmObjectToTeam)
        setViewTeam(
          getCompTeamData.teams.find(
            (t) => t.ID === getVmObjectData.vmObject.VmObjectToTeam?.ID
          ) as GetCompTeamSearchValuesQuery['teams'][0]
        )
    } else
      setVmObject({
        ID: '',
        Name: '',
        Identifier: '',
        IPAddresses: [],
        VmObjectToTeam: '',
      })
  }, [getVmObjectData, getCompTeamData])

  useEffect(() => {
    if (lockoutVmError)
      enqueueSnackbar(
        `Failed to update vm object lockout: ${lockoutVmError.message}`,
        {
          variant: 'error',
        }
      )
    else if (lockoutVmData?.lockoutVm) {
      enqueueSnackbar('Vm object lockout updated', {
        variant: 'success',
      })
      resetLockoutVm()
      refetchGetVmObject({
        vmObjectId: id,
      })
    }
  }, [lockoutVmData, lockoutVmError, enqueueSnackbar])

  const submitCompetition = () => {
    if (vmObject.ID)
      updateVmObject({
        variables: {
          vmObject,
        },
      })
    else
      createVmObject({
        variables: {
          vmObject,
        },
      })
  }

  return (
    <Container component="main" sx={{ p: 2 }}>
      {id && (getVmObjectLoading || getVmObjectError) ? (
        <Skeleton>
          <Box sx={{ width: '100%' }}></Box>
        </Skeleton>
      ) : (
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <Button
            variant="text"
            sx={{ mr: 1 }}
            onClick={() =>
              navigate('/admin', {
                state: {
                  tab: 3,
                },
              })
            }
          >
            <ArrowBackTwoTone />
          </Button>
          <Typography variant="h4" sx={{ mr: 2 }}>
            {id ? `Edit Vm Object: ` : 'New Vm Object'}
          </Typography>
          {id && !getVmObjectLoading && !getVmObjectError && (
            <Typography variant="h5" component="code">
              {getVmObjectData?.vmObject.Name ?? 'N/A'}
            </Typography>
          )}
        </Box>
      )}
      <Divider
        sx={{
          my: 2,
        }}
      />
      <Box
        component="form"
        sx={{
          display: 'flex',
          flexWrap: 'wrap',
          '& .MuiTextField-root': {
            m: 1,
            minWidth: '40%',
            flexGrow: 1,
          },
        }}
        noValidate
        autoComplete="off"
      >
        <TextField
          label="Name"
          variant="filled"
          value={vmObject.Name}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setVmObject({ ...vmObject, Name: e.target.value })
          }
        />
        <TextField
          label="Identifier"
          variant="filled"
          value={vmObject.Identifier}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setVmObject({ ...vmObject, Identifier: e.target.value })
          }
        />
        <Autocomplete
          freeSolo
          multiple
          options={[]}
          renderInput={(params) => (
            <TextField {...params} label="IP Addresses" />
          )}
          onChange={(event, value) => {
            setVmObject({
              ...vmObject,
              IPAddresses: value as string[],
            })
          }}
          value={vmObject.IPAddresses}
          sx={{
            m: '0.5rem',
            width: 'calc(50% - 1rem)',
            '& .MuiTextField-root': {
              m: 0,
              minWidth: '40%',
              flexGrow: 1,
            },
          }}
        />
        <Autocomplete
          options={getCompTeamData?.teams ?? []}
          groupBy={(t) => t.TeamToCompetition?.Name ?? 'N/A'}
          getOptionLabel={(t) =>
            `${t.TeamToCompetition.Name} - ${t.Name || `Team ${t.TeamNumber}`}`
          }
          renderInput={(params) => <TextField {...params} label="Team" />}
          onChange={(event, value) => {
            setViewTeam(value as Team)
            setVmObject({
              ...vmObject,
              VmObjectToTeam: value?.ID ?? '',
            })
          }}
          value={viewTeam}
          sx={{
            m: '0.5rem',
            width: 'calc(50% - 1rem)',
            '& .MuiTextField-root': {
              m: 0,
              minWidth: '40%',
              flexGrow: 1,
            },
          }}
        />
      </Box>

      {id && (
        <ToggleButtonGroup
          disabled={lockoutVmLoading}
          value={vmObject.Locked}
          exclusive
          aria-label="lockout controls"
          sx={{
            display: 'flex',
            '& .MuiToggleButton-root': {
              minWidth: '40%',
              flexGrow: 1,
              padding: 2,
            },
            m: 1,
          }}
          onChange={(
            e: any, // eslint-disable-line @typescript-eslint/no-explicit-any
            locked: boolean
          ) => {
            lockoutVm({
              variables: {
                vmObjectId: id,
                locked,
              },
            })
          }}
        >
          <ToggleButton color="error" value={true}>
            {lockoutVmLoading ? (
              <CircularProgress />
            ) : (
              <LockTwoTone sx={{ mr: 1 }} />
            )}{' '}
            Locked
          </ToggleButton>
          <ToggleButton color="secondary" value={false}>
            {lockoutVmLoading ? (
              <CircularProgress />
            ) : (
              <LockOpenTwoTone sx={{ mr: 1 }} />
            )}{' '}
            Unlocked
          </ToggleButton>
        </ToggleButtonGroup>
      )}
      <Box
        sx={{
          position: 'fixed',
          bottom: 24,
          right: 24,
          m: 1,
        }}
      >
        <Fab
          disabled={updateVmObjectLoading || createVmObjectLoading}
          color="secondary"
          aria-label="save"
          onClick={submitCompetition}
        >
          <Save />
        </Fab>
        {(updateVmObjectLoading || createVmObjectLoading) && (
          <CircularProgress
            size={68}
            sx={{
              color: 'primary',
              position: 'absolute',
              top: -6,
              left: -6,
              zIndex: 1,
            }}
          />
        )}
      </Box>
    </Container>
  )
}
