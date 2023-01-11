import {
  ArrowBackTwoTone,
  LockOpenTwoTone,
  LockTwoTone,
  Save,
} from "@mui/icons-material";
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
  ButtonGroup,
} from "@mui/material";
import { Box } from "@mui/system";
import { useSnackbar } from "notistack";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  useGetCompetitionLazyQuery,
  useUpdateCompetitionMutation,
  CompetitionInput,
  useListProvidersQuery,
  ListProvidersQuery,
  useCreateCompetitionMutation,
  useLockoutCompetitionMutation,
} from "../../api/generated/graphql";

export const CompetitionForm: React.FC = (): React.ReactElement => {
  const { id } = useParams();
  const [
    getCompetition,
    {
      data: getCompetitionData,
      loading: getCompetitionLoading,
      error: getCompetitionError,
    },
  ] = useGetCompetitionLazyQuery();
  const [
    updateCompetition,
    {
      data: updateCompetitionData,
      loading: updateCompetitionLoading,
      error: updateCompetitionError,
    },
  ] = useUpdateCompetitionMutation();
  const [
    createCompetition,
    {
      data: createCompetitionData,
      loading: createCompetitionLoading,
      error: createCompetitionError,
    },
  ] = useCreateCompetitionMutation();
  const { data: listProvidersData, error: listProvidersError } =
    useListProvidersQuery({
      fetchPolicy: "no-cache",
    });
  const [
    lockoutCompetition,
    {
      data: lockoutCompetitionData,
      loading: lockoutCompetitionLoading,
      error: lockoutCompetitionError,
    },
  ] = useLockoutCompetitionMutation();
  const [competition, setCompetition] = useState<CompetitionInput>({
    ID: "",
    Name: "",
    CompetitionToProvider: "",
  });
  const [viewProvider, setViewProvider] = useState<
    ListProvidersQuery["providers"][0] | null
  >(null);
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();

  useEffect(() => {
    if (id)
      getCompetition({
        variables: {
          id,
        },
      });
  }, [id, getCompetition]);

  useEffect(() => {
    if (!updateCompetitionLoading && updateCompetitionData)
      enqueueSnackbar(
        `Updated competition "${updateCompetitionData.updateCompetition.Name}"`,
        {
          variant: "success",
        }
      );
    if (!createCompetitionLoading && createCompetitionData) {
      enqueueSnackbar(
        `Created competition "${createCompetitionData.createCompetition.Name}"`,
        {
          variant: "success",
        }
      );
      setTimeout(
        () =>
          navigate(
            `/admin/competition/${createCompetitionData?.createCompetition.ID}`
          ),
        1000
      );
    }
  }, [
    updateCompetitionData,
    updateCompetitionLoading,
    createCompetitionData,
    createCompetitionLoading,
    enqueueSnackbar,
    navigate,
  ]);

  useEffect(() => {
    if (getCompetitionError)
      enqueueSnackbar(
        `Failed to get competition: ${getCompetitionError.message}`,
        {
          variant: "error",
        }
      );
    if (updateCompetitionError)
      enqueueSnackbar(
        `Failed to update competition: ${updateCompetitionError.message}`,
        {
          variant: "error",
        }
      );
    if (createCompetitionError)
      enqueueSnackbar(
        `Failed to create competition: ${createCompetitionError.message}`,
        {
          variant: "error",
        }
      );
    if (listProvidersError)
      enqueueSnackbar(
        `Failed to list competitions: ${listProvidersError.message}`,
        {
          variant: "error",
        }
      );
  }, [
    getCompetitionError,
    updateCompetitionError,
    createCompetitionError,
    listProvidersError,
    enqueueSnackbar,
  ]);

  useEffect(() => {
    if (getCompetitionData) {
      setCompetition({
        ...getCompetitionData.getCompetition,
        CompetitionToProvider:
          getCompetitionData.getCompetition.CompetitionToProvider.ID,
      } as CompetitionInput);
      if (listProvidersData)
        setViewProvider(
          listProvidersData.providers.find(
            (v) =>
              v.ID ===
              getCompetitionData.getCompetition.CompetitionToProvider.ID
          ) as ListProvidersQuery["providers"][0]
        );
    } else
      setCompetition({
        ID: "",
        Name: "",
        CompetitionToProvider: "",
      });
  }, [getCompetitionData, listProvidersData]);

  useEffect(() => {
    if (lockoutCompetitionError)
      enqueueSnackbar(
        `Failed to update competition lockout: ${lockoutCompetitionError.message}`,
        {
          variant: "error",
        }
      );
    else if (lockoutCompetitionData?.lockoutCompetition)
      enqueueSnackbar("Competition lockout updated", {
        variant: "success",
      });
  }, [lockoutCompetitionData, lockoutCompetitionError, enqueueSnackbar]);

  const submitCompetition = () => {
    if (competition.ID)
      updateCompetition({
        variables: {
          competition,
        },
      });
    else
      createCompetition({
        variables: {
          competition,
        },
      });
  };

  return (
    <Container component="main" sx={{ p: 2 }}>
      {id && (getCompetitionLoading || getCompetitionError) ? (
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
            onClick={() => navigate("/admin")}
          >
            <ArrowBackTwoTone />
          </Button>
          <Typography variant="h4" sx={{ mr: 2 }}>
            {id ? `Edit Competition: ` : "New Competition"}
          </Typography>
          {id && !getCompetitionLoading && !getCompetitionError && (
            <Typography variant="h5" component="code">
              {getCompetitionData?.getCompetition.Name ?? "N/A"}
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
          label="Name"
          variant="filled"
          value={competition.Name}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setCompetition({ ...competition, Name: e.target.value })
          }
        />
        <Autocomplete
          options={listProvidersData?.providers ?? []}
          getOptionLabel={(p) => `${p.Name} (${p.Type})`}
          renderInput={(params) => <TextField {...params} label="Provider" />}
          onChange={(event, value) => {
            setViewProvider(value);
            setCompetition({
              ...competition,
              CompetitionToProvider: value?.ID ?? "",
            });
          }}
          isOptionEqualToValue={(option, value) => option.ID === value.ID}
          value={viewProvider}
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
      {id && (
        <Box
          component="form"
          sx={{
            display: "flex",
            flexWrap: "wrap",
            "& .MuiButtonGroup-root": {
              m: 1,
              minWidth: "40%",
              flexGrow: 1,
            },
          }}
          noValidate
          autoComplete="off"
        >
          <ButtonGroup
            variant="outlined"
            aria-label="lockout controls"
            sx={{
              display: "flex",
              "& .MuiButton-root": {
                minWidth: "40%",
                flexGrow: 1,
                padding: 2,
              },
            }}
          >
            <Button
              color="error"
              disabled={lockoutCompetitionLoading}
              onClick={() => {
                lockoutCompetition({
                  variables: {
                    competitionId: id,
                    locked: true,
                  },
                });
              }}
            >
              {lockoutCompetitionLoading ? (
                <CircularProgress />
              ) : (
                <LockTwoTone sx={{ mr: 1 }} />
              )}{" "}
              Lockout Competition
            </Button>
            <Button
              color="secondary"
              disabled={lockoutCompetitionLoading}
              onClick={() => {
                lockoutCompetition({
                  variables: {
                    competitionId: id,
                    locked: false,
                  },
                });
              }}
            >
              {lockoutCompetitionLoading ? (
                <CircularProgress />
              ) : (
                <LockOpenTwoTone sx={{ mr: 1 }} />
              )}{" "}
              Unlock Competition
            </Button>
          </ButtonGroup>
        </Box>
      )}
      <Box
        sx={{
          position: "absolute",
          bottom: 24,
          right: 24,
          m: 1,
        }}
      >
        <Fab
          disabled={updateCompetitionLoading || createCompetitionLoading}
          color="secondary"
          aria-label="save"
          onClick={submitCompetition}
        >
          <Save />
        </Fab>
        {(updateCompetitionLoading || createCompetitionLoading) && (
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
