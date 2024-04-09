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
  ListUsersQuery,
  Role,
  useDeleteUserMutation,
  useListUsersQuery,
} from '../../api/generated/graphql'
import { useNavigate } from 'react-router-dom'
import { useSnackbar } from 'notistack'
import {
  EnhancedTableHead,
  EnhancedHeadCell,
  Order,
  getComparator,
} from '../enhanced-table'

interface UserListData {
  id: string
  username: string
  name: string
  provider: string
  role: Role
  assignment: string
}

const createUserData = (user: ListUsersQuery['users'][0]): UserListData => {
  return {
    id: user.ID,
    username: user.Username,
    name: `${user.FirstName} ${user.LastName}`,
    provider: user.Provider,
    role: user.Role,
    assignment: `${
      user.UserToTeam?.TeamNumber || user.UserToTeam?.Name || ''
    } ${user.UserToTeam?.TeamToCompetition.Name || ''}`,
  }
}

const headCells: readonly EnhancedHeadCell<UserListData>[] = [
  {
    id: 'id',
    numeric: false,
    disablePadding: false,
    label: 'ID',
    align: 'left',
  },
  {
    id: 'username',
    numeric: false,
    disablePadding: false,
    label: 'Username',
  },
  {
    id: 'name',
    numeric: false,
    disablePadding: false,
    label: 'Name',
  },
  {
    id: 'provider',
    numeric: false,
    disablePadding: false,
    label: 'Provider',
  },
  {
    id: 'role',
    numeric: true,
    disablePadding: false,
    label: 'Role',
  },
  {
    id: 'assignment',
    numeric: false,
    disablePadding: false,
    label: 'Assignment',
  },
]

export const UserList: React.FC<{
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
    data: listUsersData,
    loading: listUsersLoading,
    error: listUsersError,
    refetch: refetchUsers,
  } = useListUsersQuery({
    fetchPolicy: 'no-cache',
  })
  const [
    deleteUser,
    {
      data: deleteUserData,
      loading: deleteUserLoading,
      error: deleteUserError,
    },
  ] = useDeleteUserMutation()
  const [order, setOrder] = useState<Order>('asc')
  const [orderBy, setOrderBy] = useState<keyof UserListData>('username')

  useEffect(() => {
    if (listUsersError)
      enqueueSnackbar(`Couldn't get users: ${listUsersError.message}`, {
        variant: 'error',
      })
  }, [listUsersError, enqueueSnackbar])

  useEffect(() => {
    if (deleteUserError)
      enqueueSnackbar(`Couldn't delete user: ${deleteUserError.message}`, {
        variant: 'error',
      })
  }, [deleteUserError, enqueueSnackbar])

  useEffect(() => {
    if (deleteUserLoading)
      enqueueSnackbar('Deleteing user...', {
        variant: 'info',
        autoHideDuration: 2500,
      })
    else if (deleteUserData?.deleteUser) {
      enqueueSnackbar('Successfully deleted user!', {
        variant: 'success',
      })
      refetchUsers()
    }
  }, [deleteUserLoading, deleteUserData, refetchUsers, enqueueSnackbar])

  const handleRequestSort = (
    event: React.MouseEvent<unknown>,
    property: keyof UserListData
  ) => {
    const isAsc = orderBy === property && order === 'asc'
    setOrder(isAsc ? 'desc' : 'asc')
    setOrderBy(property)
  }

  const handleDeleteUser = (userId: string) => {
    resetDeleteModal()
    deleteUser({
      variables: {
        userId,
      },
    })
  }

  const sortedRows = useMemo(
    () =>
      listUsersData?.users
        .map(createUserData)
        .sort(getComparator(order, orderBy)),
    [listUsersData, order, orderBy]
  )

  return (
    <TableContainer component={Paper}>
      <Table sx={{ width: '100%' }} aria-label="users table">
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
                <TableCell align="center">{row.username}</TableCell>
                <TableCell align="center">{row.name}</TableCell>
                <TableCell align="center">
                  <Chip label={row.provider} color="info" size="small" />
                </TableCell>
                <TableCell align="center">
                  <Chip
                    label={row.role}
                    color={row.role === Role.Admin ? 'error' : 'warning'}
                    size="small"
                  />
                </TableCell>
                <TableCell align="center">{row.assignment}</TableCell>
                <TableCell align="right">
                  <ButtonGroup size="small">
                    <Button
                      variant="outlined"
                      color="secondary"
                      onClick={() => navigate(`/admin/user/${row.id}`)}
                    >
                      <EditTwoTone />
                    </Button>
                    <Button
                      variant="outlined"
                      color="error"
                      onClick={() => {
                        setDeleteModalData({
                          objectName: row.username,
                          isOpen: true,
                          onClose: resetDeleteModal,
                          onSubmit: () => handleDeleteUser(row.id),
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
              No Users Found
            </TableCell>
          )}
          {listUsersLoading && (
            <TableCell colSpan={5} sx={{ textAlign: 'center' }}>
              <CircularProgress />
            </TableCell>
          )}
        </TableBody>
      </Table>
    </TableContainer>
  )
}
