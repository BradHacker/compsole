import {
  EditTwoTone,
  DeleteTwoTone,
  CheckTwoTone,
  BlockTwoTone,
} from '@mui/icons-material'
import {
  TableContainer,
  Paper,
  Table,
  TableRow,
  TableCell,
  TableBody,
  ButtonGroup,
  Button,
  CircularProgress,
  Typography,
} from '@mui/material'
import React, { useEffect, useMemo, useState } from 'react'
import {
  ListServiceAccountsQuery,
  useDeleteServiceAccountMutation,
  useListServiceAccountsQuery,
} from '../../api/generated/graphql'
import { useNavigate } from 'react-router-dom'
import { useSnackbar } from 'notistack'
import {
  EnhancedHeadCell,
  EnhancedTableHead,
  Order,
  getComparator,
} from '../enhanced-table'

interface ServiceAccountListData {
  id: string
  name: string
  key: string
  active: boolean
}

const createServiceAccountData = (
  serviceAccount: ListServiceAccountsQuery['serviceAccounts'][number]
): ServiceAccountListData => {
  return {
    id: serviceAccount.ID,
    name: serviceAccount.DisplayName,
    key: serviceAccount.ApiKey,
    active: serviceAccount.Active,
  }
}

const headCells: readonly EnhancedHeadCell<ServiceAccountListData>[] = [
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
    label: 'Display Name',
  },
  {
    id: 'key',
    numeric: false,
    disablePadding: false,
    label: 'API Key',
  },
  {
    id: 'active',
    numeric: false,
    disablePadding: false,
    label: 'Active?',
  },
]

export const ServiceAccountList: React.FC<{
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
    data: listServiceAccountsData,
    loading: listServiceAccountsLoading,
    error: listServiceAccountsError,
    refetch: refetchProviders,
  } = useListServiceAccountsQuery({
    fetchPolicy: 'no-cache',
  })
  const [
    deleteServiceAccount,
    {
      data: deleteServiceAccountData,
      loading: deleteServiceAccountLoading,
      error: deleteServiceAccountError,
    },
  ] = useDeleteServiceAccountMutation()
  const [order, setOrder] = useState<Order>('asc')
  const [orderBy, setOrderBy] = useState<keyof ServiceAccountListData>('name')

  useEffect(() => {
    if (listServiceAccountsError)
      enqueueSnackbar(
        `Couldn't get service accounts: ${listServiceAccountsError.message}`,
        {
          variant: 'error',
        }
      )
  }, [listServiceAccountsError, enqueueSnackbar])

  useEffect(() => {
    if (deleteServiceAccountError)
      enqueueSnackbar(
        `Couldn't delete service account: ${deleteServiceAccountError.message}`,
        {
          variant: 'error',
        }
      )
  }, [deleteServiceAccountError, enqueueSnackbar])

  useEffect(() => {
    if (deleteServiceAccountLoading)
      enqueueSnackbar('Deleteing service account...', {
        variant: 'info',
        autoHideDuration: 2500,
      })
    else if (deleteServiceAccountData?.deleteServiceAccount) {
      enqueueSnackbar('Successfully deleted service account!', {
        variant: 'success',
      })
      refetchProviders()
    }
  }, [
    deleteServiceAccountLoading,
    deleteServiceAccountData,
    refetchProviders,
    enqueueSnackbar,
  ])

  const handleRequestSort = (
    event: React.MouseEvent<unknown>,
    property: keyof ServiceAccountListData
  ) => {
    const isAsc = orderBy === property && order === 'asc'
    setOrder(isAsc ? 'desc' : 'asc')
    setOrderBy(property)
  }

  const handleDeleteProvider = (id: string) => {
    resetDeleteModal()
    deleteServiceAccount({
      variables: {
        id,
      },
    })
  }

  const sortedRows = useMemo(
    () =>
      listServiceAccountsData?.serviceAccounts
        .map(createServiceAccountData)
        .sort(getComparator(order, orderBy)),
    [listServiceAccountsData, order, orderBy]
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
            sortedRows.map((serviceAccount) => (
              <TableRow
                key={serviceAccount.id}
                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
              >
                <TableCell component="th" scope="row">
                  {serviceAccount.id}
                </TableCell>
                <TableCell align="center">{serviceAccount.name}</TableCell>
                <TableCell align="center">
                  <Typography
                    variant="caption"
                    component="code"
                    sx={{
                      mb: 1,
                    }}
                  >
                    {serviceAccount.key}
                  </Typography>
                </TableCell>
                <TableCell align="center">
                  {serviceAccount.active ? (
                    <CheckTwoTone color="success" />
                  ) : (
                    <BlockTwoTone color="error" />
                  )}
                </TableCell>
                <TableCell align="right">
                  <ButtonGroup size="small">
                    <Button
                      variant="outlined"
                      color="secondary"
                      onClick={() =>
                        navigate(`/admin/service-account/${serviceAccount.id}`)
                      }
                    >
                      <EditTwoTone />
                    </Button>
                    <Button
                      variant="outlined"
                      color="error"
                      onClick={() => {
                        setDeleteModalData({
                          objectName: serviceAccount.name,
                          isOpen: true,
                          onClose: resetDeleteModal,
                          onSubmit: () =>
                            handleDeleteProvider(serviceAccount.id),
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
          {listServiceAccountsLoading && (
            <TableCell colSpan={5} sx={{ textAlign: 'center' }}>
              <CircularProgress />
            </TableCell>
          )}
        </TableBody>
      </Table>
    </TableContainer>
  )
}
