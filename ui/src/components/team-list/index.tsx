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
  ListTeamsQuery,
  useDeleteTeamMutation,
  useListTeamsQuery,
} from "../../api/generated/graphql";
import { useNavigate } from "react-router-dom";
import { useSnackbar } from "notistack";

const createTeamData = (
  team: ListTeamsQuery["teams"][0]
): {
  id: string;
  number: number;
  teamName?: string | null;
  competitionName: string;
} => {
  return {
    id: team.ID,
    number: team.TeamNumber,
    teamName: team.Name,
    competitionName: team.TeamToCompetition.Name,
  };
};

export const TeamList: React.FC<{
  setDeleteModalData: (data: {
    objectName: string;
    isOpen: boolean;
    onClose: () => void;
    onSubmit: () => void;
  }) => void;
  resetDeleteModal: () => void;
}> = ({ setDeleteModalData, resetDeleteModal }): React.ReactElement => {
  const {
    data: listTeamsData,
    loading: listTeamsLoading,
    error: listTeamsError,
    refetch: refetchTeams,
  } = useListTeamsQuery({
    fetchPolicy: "no-cache",
  });
  const [
    deleteTeam,
    {
      data: deleteTeamData,
      loading: deleteTeamLoading,
      error: deleteTeamError,
    },
  ] = useDeleteTeamMutation();
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    if (listTeamsError)
      enqueueSnackbar(`Couldn't get teams: ${listTeamsError.message}`, {
        variant: "error",
      });
  }, [listTeamsError, enqueueSnackbar]);

  useEffect(() => {
    if (deleteTeamError)
      enqueueSnackbar(`Couldn't delete team: ${deleteTeamError.message}`, {
        variant: "error",
      });
  }, [deleteTeamError, enqueueSnackbar]);

  useEffect(() => {
    if (deleteTeamLoading)
      enqueueSnackbar("Deleteing team...", {
        variant: "info",
        autoHideDuration: 2500,
      });
    else if (deleteTeamData?.deleteTeam) {
      enqueueSnackbar("Successfully deleted team!", {
        variant: "success",
      });
      refetchTeams();
    }
  }, [deleteTeamLoading, deleteTeamData, refetchTeams, enqueueSnackbar]);

  const handleDeleteTeam = (teamId: string) => {
    resetDeleteModal();
    deleteTeam({
      variables: {
        teamId,
      },
    });
  };

  return (
    <TableContainer component={Paper}>
      <Table sx={{ width: "100%" }} aria-label="teams table">
        <TableHead>
          <TableRow>
            <TableCell align="left">ID</TableCell>
            <TableCell align="center">Competition Name</TableCell>
            <TableCell align="center">Team Number</TableCell>
            <TableCell align="center">Team Name</TableCell>
            <TableCell align="right">Controls</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {listTeamsData?.teams.map(createTeamData).map((row) => (
            <TableRow
              key={row.id}
              sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
            >
              <TableCell component="th" scope="row">
                {row.id}
              </TableCell>
              <TableCell align="center">
                <Chip
                  label={row.competitionName}
                  color="secondary"
                  size="small"
                />
              </TableCell>
              <TableCell align="center">{row.number}</TableCell>
              <TableCell align="center">
                <Chip label={row.teamName} color="primary" size="small" />
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
                        objectName: row.teamName ?? `Team ${row.number}`,
                        isOpen: true,
                        onClose: resetDeleteModal,
                        onSubmit: () => handleDeleteTeam(row.id),
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
              No Teams Found
            </TableCell>
          )}
          {listTeamsLoading && (
            <TableCell colSpan={5} sx={{ textAlign: "center" }}>
              <CircularProgress />
            </TableCell>
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
};
