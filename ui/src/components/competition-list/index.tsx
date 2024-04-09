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
  ListCompetitionsQuery,
  useDeleteCompetitionMutation,
  useListCompetitionsQuery,
} from '../../api/generated/graphql'
import { useNavigate } from 'react-router-dom'
import { useSnackbar } from 'notistack'
import {
  EnhancedHeadCell,
  EnhancedTableHead,
  Order,
  getComparator,
} from '../enhanced-table'

interface CompetitionListData {
  id: string
  name: string
  provider: string
  teamCount: number
}

const createCompetitionData = (
  competition: ListCompetitionsQuery['competitions'][0]
): CompetitionListData => {
  return {
    id: competition.ID,
    name: competition.Name,
    provider: `${
      competition.CompetitionToProvider.Name
    } (${competition.CompetitionToProvider.Type.toLocaleUpperCase()})`,
    teamCount: competition.CompetitionToTeams.length,
  }
}

const headCells: readonly EnhancedHeadCell<CompetitionListData>[] = [
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
    id: 'teamCount',
    numeric: false,
    disablePadding: false,
    label: 'Team Count',
  },
  {
    id: 'provider',
    numeric: false,
    disablePadding: false,
    label: 'Provider',
  },
]

export const CompetitionList: React.FC<{
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
    data: listCompetitionsData,
    loading: listCompetitionsLoading,
    error: listCompetitionsError,
    refetch: refetchCompetitions,
  } = useListCompetitionsQuery({
    fetchPolicy: 'no-cache',
  })
  const [
    deleteCompetition,
    {
      data: deleteCompetitionData,
      loading: deleteCompetitionLoading,
      error: deleteCompetitionError,
    },
  ] = useDeleteCompetitionMutation()
  const [order, setOrder] = useState<Order>('asc')
  const [orderBy, setOrderBy] = useState<keyof CompetitionListData>('name')

  useEffect(() => {
    if (listCompetitionsError)
      enqueueSnackbar(
        `Couldn't get competitions: ${listCompetitionsError.message}`,
        {
          variant: 'error',
        }
      )
  }, [listCompetitionsError, enqueueSnackbar])

  useEffect(() => {
    if (deleteCompetitionError)
      enqueueSnackbar(
        `Couldn't delete competition: ${deleteCompetitionError.message}`,
        {
          variant: 'error',
        }
      )
  }, [deleteCompetitionError, enqueueSnackbar])

  useEffect(() => {
    if (deleteCompetitionLoading)
      enqueueSnackbar('Deleteing competition...', {
        variant: 'info',
        autoHideDuration: 2500,
      })
    else if (deleteCompetitionData?.deleteCompetition) {
      enqueueSnackbar('Successfully deleted competition!', {
        variant: 'success',
      })
      refetchCompetitions()
    }
  }, [
    deleteCompetitionLoading,
    deleteCompetitionData,
    refetchCompetitions,
    enqueueSnackbar,
  ])

  const handleRequestSort = (
    event: React.MouseEvent<unknown>,
    property: keyof CompetitionListData
  ) => {
    const isAsc = orderBy === property && order === 'asc'
    setOrder(isAsc ? 'desc' : 'asc')
    setOrderBy(property)
  }

  const handleDeleteCompetition = (competitionId: string) => {
    resetDeleteModal()
    deleteCompetition({
      variables: {
        competitionId,
      },
    })
  }

  const sortedRows = useMemo(
    () =>
      listCompetitionsData?.competitions
        .map(createCompetitionData)
        .sort(getComparator(order, orderBy)),
    [listCompetitionsData, order, orderBy]
  )

  return (
    <TableContainer component={Paper}>
      <Table sx={{ width: '100%' }} aria-label="competitions table">
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
                  <Chip label={row.name} color="secondary" size="small" />
                </TableCell>
                <TableCell align="center">{row.teamCount}</TableCell>
                <TableCell align="center">
                  <Chip label={row.provider} color="warning" size="small" />
                </TableCell>
                <TableCell align="right">
                  <ButtonGroup size="small">
                    <Button
                      variant="outlined"
                      color="secondary"
                      onClick={() => navigate(`/admin/competition/${row.id}`)}
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
                          onSubmit: () => handleDeleteCompetition(row.id),
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
              No Competitions Found
            </TableCell>
          )}
          {listCompetitionsLoading && (
            <TableCell colSpan={5} sx={{ textAlign: 'center' }}>
              <CircularProgress />
            </TableCell>
          )}
        </TableBody>
      </Table>
    </TableContainer>
  )
}
