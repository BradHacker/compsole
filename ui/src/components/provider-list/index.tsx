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
} from '@mui/material'
import React, { useEffect, useMemo, useState } from 'react'
import {
  ListProvidersQuery,
  useDeleteProviderMutation,
  useListProvidersQuery,
} from '../../api/generated/graphql'
import { useNavigate } from 'react-router-dom'
import { useSnackbar } from 'notistack'
import {
  EnhancedHeadCell,
  EnhancedTableHead,
  Order,
  getComparator,
} from '../enhanced-table'

interface ProviderListData {
  id: string
  name: string
  type: string
}

const createProviderData = (
  provider: ListProvidersQuery['providers'][0]
): ProviderListData => {
  return {
    id: provider.ID,
    name: provider.Name,
    type: provider.Type,
  }
}

const headCells: readonly EnhancedHeadCell<ProviderListData>[] = [
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
    id: 'type',
    numeric: false,
    disablePadding: false,
    label: 'Type',
  },
]

export const ProviderList: React.FC<{
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
    data: listProvidersData,
    loading: listProvidersLoading,
    error: listProvidersError,
    refetch: refetchProviders,
  } = useListProvidersQuery({
    fetchPolicy: 'no-cache',
  })
  const [
    deleteProvider,
    {
      data: deleteProviderData,
      loading: deleteProviderLoading,
      error: deleteProviderError,
    },
  ] = useDeleteProviderMutation()
  const [order, setOrder] = useState<Order>('asc')
  const [orderBy, setOrderBy] = useState<keyof ProviderListData>('name')

  useEffect(() => {
    if (listProvidersError)
      enqueueSnackbar(`Couldn't get providers: ${listProvidersError.message}`, {
        variant: 'error',
      })
  }, [listProvidersError, enqueueSnackbar])

  useEffect(() => {
    if (deleteProviderError)
      enqueueSnackbar(
        `Couldn't delete provider: ${deleteProviderError.message}`,
        {
          variant: 'error',
        }
      )
  }, [deleteProviderError, enqueueSnackbar])

  useEffect(() => {
    if (deleteProviderLoading)
      enqueueSnackbar('Deleteing provider...', {
        variant: 'info',
        autoHideDuration: 2500,
      })
    else if (deleteProviderData?.deleteProvider) {
      enqueueSnackbar('Successfully deleted provider!', {
        variant: 'success',
      })
      refetchProviders()
    }
  }, [
    deleteProviderLoading,
    deleteProviderData,
    refetchProviders,
    enqueueSnackbar,
  ])

  const handleRequestSort = (
    event: React.MouseEvent<unknown>,
    property: keyof ProviderListData
  ) => {
    const isAsc = orderBy === property && order === 'asc'
    setOrder(isAsc ? 'desc' : 'asc')
    setOrderBy(property)
  }

  const handleDeleteProvider = (providerId: string) => {
    resetDeleteModal()
    deleteProvider({
      variables: {
        providerId,
      },
    })
  }

  const sortedRows = useMemo(
    () =>
      listProvidersData?.providers
        .map(createProviderData)
        .sort(getComparator(order, orderBy)),
    [listProvidersData, order, orderBy]
  )

  return (
    <TableContainer component={Paper}>
      <Table sx={{ width: '100%' }} aria-label="providers table">
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
                <TableCell align="center">
                  <Chip label={row.type} color="warning" size="small" />
                </TableCell>
                <TableCell align="right">
                  <ButtonGroup size="small">
                    <Button
                      variant="outlined"
                      color="secondary"
                      onClick={() => navigate(`/admin/provider/${row.id}`)}
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
                          onSubmit: () => handleDeleteProvider(row.id),
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
              No Providers Found
            </TableCell>
          )}
          {listProvidersLoading && (
            <TableCell colSpan={5} sx={{ textAlign: 'center' }}>
              <CircularProgress />
            </TableCell>
          )}
        </TableBody>
      </Table>
    </TableContainer>
  )
}
