import { ArrowBackTwoTone, Save } from "@mui/icons-material";
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
} from "@mui/material";
import { Box } from "@mui/system";
import { useSnackbar } from "notistack";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  useGetTeamLazyQuery,
  useUpdateTeamMutation,
  useCreateTeamMutation,
  TeamInput,
  ListCompetitionsQuery,
  useListCompetitionsQuery,
} from "../../api/generated/graphql";

export const TeamForm: React.FC = (): React.ReactElement => {
  const { id } = useParams();
  const [
    getTeam,
    { data: getTeamData, loading: getTeamLoading, error: getTeamError },
  ] = useGetTeamLazyQuery();
  const [
    updateTeam,
    {
      data: updateTeamData,
      loading: updateTeamLoading,
      error: updateTeamError,
    },
  ] = useUpdateTeamMutation();
  const [
    createTeam,
    {
      data: createTeamData,
      loading: createTeamLoading,
      error: createTeamError,
    },
  ] = useCreateTeamMutation();
  const { data: listCompetitionsData, error: listCompetitionsError } =
    useListCompetitionsQuery({
      fetchPolicy: "no-cache",
    });
  const [team, setTeam] = useState<TeamInput>({
    ID: "",
    Name: "",
    TeamNumber: 0,
    TeamToCompetition: "",
  });
  const [viewCompetition, setViewCompetition] = useState<
    ListCompetitionsQuery["competitions"][0] | null
  >(null);
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();

  useEffect(() => {
    if (id)
      getTeam({
        variables: {
          id,
        },
      });
  }, [id, getTeam]);

  useEffect(() => {
    if (!updateTeamLoading && updateTeamData)
      enqueueSnackbar(`Updated team "${updateTeamData.updateTeam.Name}"`, {
        variant: "success",
      });
    if (!createTeamLoading && createTeamData) {
      enqueueSnackbar(`Created team "${createTeamData.createTeam.Name}"`, {
        variant: "success",
      });
      setTimeout(
        () => navigate(`/admin/team/${createTeamData?.createTeam.ID}`),
        1000
      );
    }
  }, [
    updateTeamData,
    updateTeamLoading,
    createTeamData,
    createTeamLoading,
    enqueueSnackbar,
    navigate,
  ]);

  useEffect(() => {
    if (getTeamError)
      enqueueSnackbar(`Failed to get team: ${getTeamError.message}`, {
        variant: "error",
      });
    if (updateTeamError)
      enqueueSnackbar(`Failed to update team: ${updateTeamError.message}`, {
        variant: "error",
      });
    if (createTeamError)
      enqueueSnackbar(`Failed to create team: ${createTeamError.message}`, {
        variant: "error",
      });
    if (listCompetitionsError)
      enqueueSnackbar(
        `Failed to list competitions: ${listCompetitionsError.message}`,
        {
          variant: "error",
        }
      );
  }, [
    getTeamError,
    updateTeamError,
    createTeamError,
    listCompetitionsError,
    enqueueSnackbar,
  ]);

  useEffect(() => {
    if (getTeamData) {
      setTeam({
        ...getTeamData.getTeam,
        TeamToCompetition: getTeamData.getTeam.TeamToCompetition.ID,
      } as TeamInput);
      if (listCompetitionsData)
        setViewCompetition(
          listCompetitionsData.competitions.find(
            (v) => v.ID === getTeamData.getTeam.TeamToCompetition.ID
          ) as ListCompetitionsQuery["competitions"][0]
        );
    } else
      setTeam({
        ID: "",
        Name: "",
        TeamNumber: 0,
        TeamToCompetition: "",
      });
  }, [getTeamData, listCompetitionsData]);

  const submitTeam = () => {
    if (team.ID)
      updateTeam({
        variables: {
          team,
        },
      });
    else
      createTeam({
        variables: {
          team,
        },
      });
  };

  return (
    <Container component="main" sx={{ p: 2 }}>
      {id && (getTeamLoading || getTeamError) ? (
        <Skeleton>
          <Box sx={{ width: "100%" }}></Box>
        </Skeleton>
      ) : (
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
          }}
        >
          <Button
            variant="text"
            sx={{ mr: 1 }}
            onClick={() =>
              navigate("/admin", {
                state: {
                  tab: 2,
                },
              })
            }
          >
            <ArrowBackTwoTone />
          </Button>
          <Typography variant="h4" sx={{ mr: 2 }}>
            {id ? `Edit Team: ` : "New Team"}
          </Typography>
          {id && !getTeamLoading && !getTeamError && getTeamData && (
            <Typography variant="h5" component="code">
              {getTeamData.getTeam.Name ||
                `Team ${getTeamData.getTeam.TeamNumber}` ||
                "N/A"}
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
          display: "flex",
          flexWrap: "wrap",
          "& .MuiTextField-root": {
            m: 1,
            minWidth: "40%",
            flexGrow: 1,
          },
        }}
        noValidate
        autoComplete="off"
      >
        <TextField
          label="Team Number"
          type="number"
          variant="filled"
          value={team.TeamNumber}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setTeam({ ...team, TeamNumber: parseInt(e.target.value) })
          }
        />
        <TextField
          label="Name"
          variant="filled"
          value={team.Name}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setTeam({ ...team, Name: e.target.value })
          }
        />
        <Autocomplete
          options={listCompetitionsData?.competitions ?? []}
          getOptionLabel={(c) => `${c.Name}`}
          renderInput={(params) => (
            <TextField {...params} label="Competition" />
          )}
          onChange={(event, value) => {
            setViewCompetition(value);
            setTeam({
              ...team,
              TeamToCompetition: value?.ID ?? "",
            });
          }}
          isOptionEqualToValue={(option, value) => option.ID === value.ID}
          value={viewCompetition}
          sx={{
            m: 1,
            minWidth: "50%",
            flexGrow: 1,
            "& .MuiTextField-root": {
              m: 0,
              minWidth: "40%",
              flexGrow: 1,
            },
          }}
        />
      </Box>
      <Box
        sx={{
          position: "fixed",
          bottom: 24,
          right: 24,
          m: 1,
        }}
      >
        <Fab
          disabled={updateTeamLoading || createTeamLoading}
          color="secondary"
          aria-label="save"
          onClick={submitTeam}
        >
          <Save />
        </Fab>
        {(updateTeamLoading || createTeamLoading) && (
          <CircularProgress
            size={68}
            sx={{
              color: "primary",
              position: "absolute",
              top: -6,
              left: -6,
              zIndex: 1,
            }}
          />
        )}
      </Box>
    </Container>
  );
};
