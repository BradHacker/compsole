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
  ListTeamsQuery,
  useDeleteTeamMutation,
  useListTeamsQuery,
} from '../../api/generated/graphql'
import { useNavigate } from 'react-router-dom'
import { useSnackbar } from 'notistack'
import {
  EnhancedHeadCell,
  EnhancedTableHead,
  Order,
  getComparator,
} from '../enhanced-table'

interface TeamListData {
  id: string
  number: number
  name: string
  competition: string
}

const createTeamData = (team: ListTeamsQuery['teams'][0]): TeamListData => {
  return {
    id: team.ID,
    number: team.TeamNumber,
    name: team.Name ?? 'Unknown',
    competition: team.TeamToCompetition.Name,
  }
}

const headCells: readonly EnhancedHeadCell<TeamListData>[] = [
  {
    id: 'id',
    numeric: false,
    disablePadding: false,
    label: 'ID',
    align: 'left',
  },
  {
    id: 'competition',
    numeric: false,
    disablePadding: false,
    label: 'Competition Name',
  },
  {
    id: 'number',
    numeric: false,
    disablePadding: false,
    label: 'Team Number',
  },
  {
    id: 'name',
    numeric: false,
    disablePadding: false,
    label: 'Team Name',
  },
]

export const TeamList: React.FC<{
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
    data: listTeamsData,
    loading: listTeamsLoading,
    error: listTeamsError,
    refetch: refetchTeams,
  } = useListTeamsQuery({
    fetchPolicy: 'no-cache',
  })
  const [
    deleteTeam,
    {
      data: deleteTeamData,
      loading: deleteTeamLoading,
      error: deleteTeamError,
    },
  ] = useDeleteTeamMutation()
  const [order, setOrder] = useState<Order>('asc')
  const [orderBy, setOrderBy] = useState<keyof TeamListData>('competition')

  useEffect(() => {
    if (listTeamsError)
      enqueueSnackbar(`Couldn't get teams: ${listTeamsError.message}`, {
        variant: 'error',
      })
  }, [listTeamsError, enqueueSnackbar])

  useEffect(() => {
    if (deleteTeamError)
      enqueueSnackbar(`Couldn't delete team: ${deleteTeamError.message}`, {
        variant: 'error',
      })
  }, [deleteTeamError, enqueueSnackbar])

  useEffect(() => {
    if (deleteTeamLoading)
      enqueueSnackbar('Deleteing team...', {
        variant: 'info',
        autoHideDuration: 2500,
      })
    else if (deleteTeamData?.deleteTeam) {
      enqueueSnackbar('Successfully deleted team!', {
        variant: 'success',
      })
      refetchTeams()
    }
  }, [deleteTeamLoading, deleteTeamData, refetchTeams, enqueueSnackbar])

  const handleRequestSort = (
    event: React.MouseEvent<unknown>,
    property: keyof TeamListData
  ) => {
    const isAsc = orderBy === property && order === 'asc'
    setOrder(isAsc ? 'desc' : 'asc')
    setOrderBy(property)
  }

  const handleDeleteTeam = (teamId: string) => {
    resetDeleteModal()
    deleteTeam({
      variables: {
        teamId,
      },
    })
  }

  const sortedRows = useMemo(
    () =>
      listTeamsData?.teams
        .map(createTeamData)
        .sort(getComparator(order, orderBy)),
    [listTeamsData, order, orderBy]
  )

  return (
    <TableContainer component={Paper}>
      <Table sx={{ width: '100%' }} aria-label="teams table">
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
                <TableCell align="center">
                  <Chip
                    label={row.competition}
                    color="secondary"
                    size="small"
                  />
                </TableCell>
                <TableCell align="center">{row.number}</TableCell>
                <TableCell align="center">
                  <Chip label={row.name} color="primary" size="small" />
                </TableCell>
                <TableCell align="right">
                  <ButtonGroup size="small">
                    <Button
                      variant="outlined"
                      color="secondary"
                      onClick={() => navigate(`/admin/team/${row.id}`)}
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
                          onSubmit: () => handleDeleteTeam(row.id),
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
              No Teams Found
            </TableCell>
          )}
          {listTeamsLoading && (
            <TableCell colSpan={5} sx={{ textAlign: 'center' }}>
              <CircularProgress />
            </TableCell>
          )}
        </TableBody>
      </Table>
    </TableContainer>
  )
}
