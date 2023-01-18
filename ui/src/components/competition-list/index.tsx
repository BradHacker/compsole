import { EditTwoTone, DeleteTwoTone } from "@mui/icons-material";
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
} from "@mui/material";
import React, { useEffect } from "react";
import {
  ListCompetitionsQuery,
  useDeleteCompetitionMutation,
  useListCompetitionsQuery,
} from "../../api/generated/graphql";
import { useNavigate } from "react-router-dom";
import { useSnackbar } from "notistack";

const createCompetitionData = (
  competition: ListCompetitionsQuery["competitions"][0]
): {
  id: string;
  name: string;
  providerType: string;
  teamCount: number;
} => {
  return {
    id: competition.ID,
    name: competition.Name,
    providerType: `${
      competition.CompetitionToProvider.Name
    } (${competition.CompetitionToProvider.Type.toLocaleUpperCase()})`,
    teamCount: competition.CompetitionToTeams.length,
  };
};

export const CompetitionList: React.FC<{
  setDeleteModalData: (data: {
    objectName: string;
    isOpen: boolean;
    onClose: () => void;
    onSubmit: () => void;
  }) => void;
  resetDeleteModal: () => void;
}> = ({ setDeleteModalData, resetDeleteModal }): React.ReactElement => {
  const {
    data: listCompetitionsData,
    loading: listCompetitionsLoading,
    error: listCompetitionsError,
    refetch: refetchCompetitions,
  } = useListCompetitionsQuery({
    fetchPolicy: "no-cache",
  });
  const [
    deleteCompetition,
    {
      data: deleteCompetitionData,
      loading: deleteCompetitionLoading,
      error: deleteCompetitionError,
    },
  ] = useDeleteCompetitionMutation();
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    if (listCompetitionsError)
      enqueueSnackbar(
        `Couldn't get competitions: ${listCompetitionsError.message}`,
        {
          variant: "error",
        }
      );
  }, [listCompetitionsError, enqueueSnackbar]);

  useEffect(() => {
    if (deleteCompetitionError)
      enqueueSnackbar(
        `Couldn't delete competition: ${deleteCompetitionError.message}`,
        {
          variant: "error",
        }
      );
  }, [deleteCompetitionError, enqueueSnackbar]);

  useEffect(() => {
    if (deleteCompetitionLoading)
      enqueueSnackbar("Deleteing competition...", {
        variant: "info",
        autoHideDuration: 2500,
      });
    else if (deleteCompetitionData?.deleteCompetition) {
      enqueueSnackbar("Successfully deleted competition!", {
        variant: "success",
      });
      refetchCompetitions();
    }
  }, [
    deleteCompetitionLoading,
    deleteCompetitionData,
    refetchCompetitions,
    enqueueSnackbar,
  ]);

  const handleDeleteCompetition = (competitionId: string) => {
    resetDeleteModal();
    deleteCompetition({
      variables: {
        competitionId,
      },
    });
  };

  return (
    <TableContainer component={Paper}>
      <Table sx={{ width: "100%" }} aria-label="competitions table">
        <TableHead>
          <TableRow>
            <TableCell align="left">ID</TableCell>
            <TableCell align="center">Name</TableCell>
            <TableCell align="center">Team Count</TableCell>
            <TableCell align="center">Provider</TableCell>
            <TableCell align="right">Controls</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {listCompetitionsData?.competitions
            .map(createCompetitionData)
            .map((row) => (
              <TableRow
                key={row.id}
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                <TableCell component="th" scope="row">
                  {row.id}
                </TableCell>
                <TableCell align="center">
                  <Chip label={row.name} color="secondary" size="small" />
                </TableCell>
                <TableCell align="center">{row.teamCount}</TableCell>
                <TableCell align="center">
                  <Chip label={row.providerType} color="warning" size="small" />
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
                        });
                      }}
                    >
                      <DeleteTwoTone />
                    </Button>
                  </ButtonGroup>
                </TableCell>
              </TableRow>
            )) ?? (
            <TableCell colSpan={5} sx={{ textAlign: "center" }}>
              No Competitions Found
            </TableCell>
          )}
          {listCompetitionsLoading && (
            <TableCell colSpan={5} sx={{ textAlign: "center" }}>
              <CircularProgress />
            </TableCell>
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
};
