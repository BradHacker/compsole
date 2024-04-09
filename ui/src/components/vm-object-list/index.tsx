import { EditTwoTone, DeleteTwoTone } from '@mui/icons-material'
import {
  TableContainer,
  Paper,
  Table,
  TableRow,
  TableCell,
  TableBody,
  Chip,
  ButtonGroup,
  Button,
  CircularProgress,
  Box,
  Typography,
} from '@mui/material'
import React, { useEffect, useMemo, useState } from 'react'
import {
  AllVmObjectsQuery,
  useAllVmObjectsQuery,
  useDeleteVmObjectMutation,
} from '../../api/generated/graphql'
import { useNavigate } from 'react-router-dom'
import { useSnackbar } from 'notistack'
import {
  EnhancedTableHead,
  EnhancedHeadCell,
  Order,
  getComparator,
} from '../enhanced-table'

interface VmListData {
  id: string
  name: string
  identifier: string
  ipAddresses: string
  team: number
  competition: string
}

const createVmObjectData = (
  vmObject: AllVmObjectsQuery['vmObjects'][0]
): VmListData => {
  return {
    id: vmObject.ID,
    name: vmObject.Name,
    identifier: vmObject.Identifier,
    ipAddresses: vmObject.IPAddresses.join(', '),
    team: vmObject.VmObjectToTeam?.TeamNumber ?? -1,
    competition: vmObject.VmObjectToTeam?.TeamToCompetition.Name ?? 'Unknown',
  }
}

const headCells: readonly EnhancedHeadCell<VmListData>[] = [
  {
    id: 'id',
    numeric: false,
    disablePadding: false,
    label: 'ID',
    align: 'left',
  },
  {
    id: 'name',
    numeric: false,
    disablePadding: false,
    label: 'Name',
  },
  {
    id: 'identifier',
    numeric: false,
    disablePadding: false,
    label: 'VM Identifier',
  },
  {
    id: 'ipAddresses',
    numeric: false,
    disablePadding: false,
    label: 'IP Addresses',
  },
  {
    id: 'team',
    numeric: true,
    disablePadding: false,
    label: 'Team',
  },
  {
    id: 'competition',
    numeric: false,
    disablePadding: false,
    label: 'Competition',
  },
]

export const VmObjectList: React.FC<{
  setDeleteModalData: (data: {
    objectName: string
    isOpen: boolean
    onClose: () => void
    onSubmit: () => void
  }) => void
  resetDeleteModal: () => void
}> = ({ setDeleteModalData, resetDeleteModal }): React.ReactElement => {
  const navigate = useNavigate()
  const { enqueueSnackbar } = useSnackbar()
  const {
    data: allVmObjectsData,
    loading: allVmObjectsLoading,
    error: allVmObjectsError,
    refetch: refetchVmObjects,
  } = useAllVmObjectsQuery({
    fetchPolicy: 'no-cache',
  })
  const [
    deleteVmObject,
    {
      data: deleteVmObjectData,
      loading: deleteVmObjectLoading,
      error: deleteVmObjectError,
    },
  ] = useDeleteVmObjectMutation()
  const [order, setOrder] = useState<Order>('asc')
  const [orderBy, setOrderBy] = useState<keyof VmListData>('name')

  useEffect(() => {
    if (allVmObjectsError)
      enqueueSnackbar(`Couldn't get vm objects: ${allVmObjectsError.message}`, {
        variant: 'error',
      })
  }, [allVmObjectsError, enqueueSnackbar])

  useEffect(() => {
    if (deleteVmObjectError)
      enqueueSnackbar(
        `Couldn't delete vm object: ${deleteVmObjectError.message}`,
        {
          variant: 'error',
        }
      )
  }, [deleteVmObjectError, enqueueSnackbar])

  useEffect(() => {
    if (deleteVmObjectLoading)
      enqueueSnackbar('Deleteing vm object...', {
        variant: 'info',
        autoHideDuration: 2500,
      })
    else if (deleteVmObjectData?.deleteVmObject) {
      enqueueSnackbar('Successfully deleted vm object!', {
        variant: 'success',
      })
      refetchVmObjects()
    }
  }, [
    deleteVmObjectLoading,
    deleteVmObjectData,
    refetchVmObjects,
    enqueueSnackbar,
  ])

  const handleRequestSort = (
    event: React.MouseEvent<unknown>,
    property: keyof VmListData
  ) => {
    const isAsc = orderBy === property && order === 'asc'
    setOrder(isAsc ? 'desc' : 'asc')
    setOrderBy(property)
  }

  const handleDeleteVmObject = (vmObjectId: string) => {
    resetDeleteModal()
    deleteVmObject({
      variables: {
        vmObjectId,
      },
    })
  }

  const sortedRows = useMemo(
    () =>
      allVmObjectsData?.vmObjects
        .map(createVmObjectData)
        .sort(getComparator(order, orderBy)),
    [allVmObjectsData, order, orderBy]
  )

  return (
    <TableContainer component={Paper}>
      <Table sx={{ width: '100%' }} aria-label="vm objects table">
        <EnhancedTableHead
          headCells={headCells}
          order={order}
          orderBy={orderBy}
          onRequestSort={handleRequestSort}
        />
        <TableBody>
          {sortedRows ? (
            sortedRows.map((row) => (
              <TableRow
                key={row.id}
                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
              >
                <TableCell component="th" scope="row">
                  {row.id}
                </TableCell>
                <TableCell align="center">{row.name}</TableCell>
                <TableCell align="center">{row.identifier}</TableCell>
                <TableCell align="center">
                  <Box
                    sx={{
                      display: 'flex',
                      flexDirection: 'column',
                    }}
                  >
                    <Typography
                      variant="caption"
                      component="code"
                      sx={{
                        mb: 1,
                      }}
                    >
                      {row.ipAddresses}
                    </Typography>
                  </Box>
                </TableCell>
                <TableCell align="center">
                  <Chip
                    label={`Team ${row.team}`}
                    color={row.team ? 'primary' : 'default'}
                    size="small"
                  />
                </TableCell>
                <TableCell align="center">
                  <Chip
                    label={row.competition}
                    color={row.competition ? 'secondary' : 'default'}
                    size="small"
                  />
                </TableCell>
                <TableCell align="right">
                  <ButtonGroup size="small">
                    <Button
                      variant="outlined"
                      color="secondary"
                      onClick={() => navigate(`/admin/vm-object/${row.id}`)}
                    >
                      <EditTwoTone />
                    </Button>
                    <Button
                      variant="outlined"
                      color="error"
                      onClick={() => {
                        setDeleteModalData({
                          objectName: row.name,
                          isOpen: true,
                          onClose: resetDeleteModal,
                          onSubmit: () => handleDeleteVmObject(row.id),
                        })
                      }}
                    >
                      <DeleteTwoTone />
                    </Button>
                  </ButtonGroup>
                </TableCell>
              </TableRow>
            ))
          ) : (
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
  )
}
