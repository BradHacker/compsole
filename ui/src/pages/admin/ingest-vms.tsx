import {
  CloudDownload,
  CloudDownloadTwoTone,
  Save,
  SaveAlt,
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
  Checkbox,
  FormControlLabel,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Avatar,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
} from "@mui/material";
import { Box } from "@mui/system";
import { useSnackbar } from "notistack";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ListCompetitionsQuery,
  useBatchCreateTeamsMutation,
  useListCompetitionsQuery,
  TeamInput,
  useListProviderVmsLazyQuery,
  useBatchCreateVmObjectsMutation,
  VmObjectInput,
} from "../../api/generated/graphql";

export const IngestVMs: React.FC = (): React.ReactElement => {
  const {
    data: listCompetitionsData,
    loading: listCompetitionsLoading,
    error: listCompetitionsError,
    refetch: refetchListCompetitions,
  } = useListCompetitionsQuery();
  const [
    batchCreateTeams,
    {
      data: batchCreateTeamsData,
      loading: batchCreateTeamsLoading,
      error: batchCreateTeamsError,
    },
  ] = useBatchCreateTeamsMutation();
  const [
    listProviderVms,
    {
      data: listProviderVmsData,
      loading: listProviderVmsLoading,
      error: listProviderVmsError,
    },
  ] = useListProviderVmsLazyQuery();
  const [
    batchCreateVms,
    {
      data: batchCreateVmsData,
      loading: batchCreateVmsLoading,
      error: batchCreateVmsError,
    },
  ] = useBatchCreateVmObjectsMutation();
  const [selectedCompetition, setSelectedCompetition] = useState<
    ListCompetitionsQuery["competitions"][0] | null
  >(null);
  const [shouldCreateTeams, setShouldCreateTeams] = useState<boolean>(false);
  const [numberOfTeams, setNumberOfTeams] = useState<string>("1");
  const [teamAssignments, setTeamAssignments] = useState<{
    [key: string]: string;
  }>({});
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();

  useEffect(() => {
    if (batchCreateTeamsError)
      enqueueSnackbar(
        `Error creating teams: ${batchCreateTeamsError.message}`,
        { variant: "error" }
      );
    else if (
      batchCreateTeamsData &&
      batchCreateTeamsData.batchCreateTeams.length > 0
    ) {
      enqueueSnackbar(`Successfully created ${numberOfTeams} teams!`, {
        variant: "success",
      });
      refetchListCompetitions();
      setSelectedCompetition(null);
    }
  }, [batchCreateTeamsData, batchCreateTeamsError]);

  useEffect(() => {
    if (batchCreateVmsError)
      enqueueSnackbar(`Error creating VMs: ${batchCreateVmsError.message}`, {
        variant: "error",
      });
    else if (
      batchCreateVmsData &&
      batchCreateVmsData.batchCreateVmObjects.length > 0
    ) {
      enqueueSnackbar(`Successfully ingested VMs!`, {
        variant: "success",
      });
      navigate("/admin");
    }
  }, [batchCreateVmsData, batchCreateVmsError]);

  useEffect(() => {
    if (listProviderVmsData?.listProviderVms) {
      let unsortedTeam = selectedCompetition?.CompetitionToTeams.find(
        (t) => t?.TeamNumber === 0
      );
      let newTeamAssignments: {
        [key: string]: string;
      } = {};
      listProviderVmsData.listProviderVms.forEach((vmObject) => {
        newTeamAssignments[vmObject.Identifier] = unsortedTeam?.ID ?? "";
      });
      setTeamAssignments(newTeamAssignments);
    }
  }, [listProviderVmsData]);

  const createTeams = () => {
    const teams: TeamInput[] = [
      {
        ID: "",
        Name: "unsorted",
        TeamNumber: 0,
        TeamToCompetition: selectedCompetition?.ID ?? "",
      },
    ];
    for (let i = 1; i <= parseInt(numberOfTeams); i++) {
      teams.push({
        ID: "",
        Name: `Team ${i}`,
        TeamNumber: i,
        TeamToCompetition: selectedCompetition?.ID ?? "",
      });
    }
    batchCreateTeams({
      variables: {
        teams,
      },
    });
  };

  const listVms = () => {
    if (selectedCompetition)
      listProviderVms({
        variables: {
          id: selectedCompetition.CompetitionToProvider.ID,
        },
        fetchPolicy: "no-cache",
      });
  };

  const ingestVms = () => {
    if (listProviderVmsData) {
      const vmObjects: VmObjectInput[] = [];
      listProviderVmsData.listProviderVms.forEach((vmObject) => {
        vmObjects.push({
          ...vmObject,
          VmObjectToTeam: teamAssignments[vmObject.Identifier],
        } as VmObjectInput);
      });
      batchCreateVms({
        variables: {
          vmObjects,
        },
      });
    }
  };

  return (
    <Container component="main" sx={{ p: 2 }}>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
        }}
      >
        <Typography variant="h4">Ingest VMs</Typography>
      </Box>
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
        <Autocomplete
          options={listCompetitionsData?.competitions ?? []}
          getOptionLabel={(c) =>
            `${c.Name} | ${
              c.CompetitionToProvider.Name
            } (${c.CompetitionToProvider.Type.toLocaleUpperCase()})`
          }
          renderInput={(params) => (
            <TextField {...params} label="Competition" />
          )}
          onChange={(event, value) => {
            setSelectedCompetition(
              value as ListCompetitionsQuery["competitions"][0]
            );
          }}
          isOptionEqualToValue={(option, value) => option.ID === value.ID}
          value={selectedCompetition}
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
        {selectedCompetition &&
          selectedCompetition.CompetitionToTeams.length === 0 && (
            <Box
              sx={{
                minWidth: "100%",
                display: "flex",
                alignItems: "center",
                flexWrap: "wrap",
              }}
            >
              <TextField
                type="number"
                label="# of Teams"
                variant="filled"
                value={numberOfTeams}
                disabled={
                  batchCreateTeamsLoading || batchCreateTeamsData != undefined
                }
                onChange={(e) => setNumberOfTeams(e.target.value)}
              />
              <Button
                variant="contained"
                disabled={
                  batchCreateTeamsLoading || batchCreateTeamsData !== undefined
                }
                onClick={createTeams}
                sx={{
                  m: 1,
                  minWidth: "80%",
                  flexGrow: 1,
                }}
              >
                {batchCreateTeamsLoading ? (
                  <CircularProgress />
                ) : (
                  "Create Teams"
                )}
              </Button>
            </Box>
          )}
      </Box>
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
        {
          <Typography
            variant="caption"
            align="center"
            sx={{
              minWidth: "100%",
              mx: 1,
            }}
            hidden={
              selectedCompetition !== null && selectedCompetition !== undefined
            }
          >
            Please select a competition before continuing.
          </Typography>
        }
        {
          <Typography
            variant="caption"
            align="center"
            sx={{
              minWidth: "100%",
              mx: 1,
            }}
            hidden={
              !selectedCompetition ||
              selectedCompetition.CompetitionToTeams.length > 0
            }
          >
            Competition has no teams. Please create teams before ingesting VMs.
          </Typography>
        }
        <Button
          variant="contained"
          disabled={
            listProviderVmsLoading ||
            !selectedCompetition ||
            selectedCompetition.CompetitionToTeams.length === 0
          }
          onClick={listVms}
          sx={{
            m: 1,
            minWidth: "50%",
            flexGrow: 1,
          }}
        >
          {listProviderVmsLoading ? (
            <CircularProgress size="1rem" sx={{ mr: 2 }} />
          ) : (
            <CloudDownload sx={{ mr: 1 }} />
          )}
          Load VM List
        </Button>
      </Box>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
        }}
      >
        <List>
          {(!listProviderVmsData ||
            listProviderVmsData.listProviderVms.length === 0) && (
            <ListItem>
              <ListItemText>No VMs Found</ListItemText>
            </ListItem>
          )}
          {listProviderVmsData?.listProviderVms
            .sort((a, b) => a.Name.localeCompare(b.Name))
            .map((vmObject) => (
              <ListItem
                key={vmObject.Identifier}
                secondaryAction={
                  <FormControl
                    variant="filled"
                    sx={{
                      width: "100%",
                    }}
                  >
                    <InputLabel id="team-select-label">Team</InputLabel>
                    <Select
                      labelId="team-select-label"
                      id="team-select"
                      value={teamAssignments[vmObject.Identifier] || ""}
                      label="Team"
                      onChange={(e) =>
                        setTeamAssignments({
                          ...teamAssignments,
                          [vmObject.Identifier]: e.target.value,
                        })
                      }
                    >
                      {[...(selectedCompetition?.CompetitionToTeams || [])]
                        .sort(
                          (a, b) => (a?.TeamNumber || 0) - (b?.TeamNumber || 0)
                        )
                        .map((team) => (
                          <MenuItem key={team?.ID} value={team?.ID}>
                            {team?.Name} ({team?.TeamNumber})
                          </MenuItem>
                        ))}
                    </Select>
                  </FormControl>
                }
                sx={{
                  "& .MuiListItemSecondaryAction-root": {
                    minWidth: "25%",
                  },
                }}
              >
                <ListItemText
                  primary={vmObject.Name}
                  secondary={vmObject.IPAddresses.join(", ")}
                />
              </ListItem>
            ))}
        </List>
        <Button
          variant="contained"
          disabled={
            batchCreateVmsLoading ||
            !listProviderVmsData ||
            listProviderVmsData.listProviderVms.length === 0
          }
          onClick={ingestVms}
          sx={{
            m: 1,
            minWidth: "50%",
            flexGrow: 1,
          }}
        >
          {batchCreateVmsLoading ? (
            <CircularProgress size="1rem" sx={{ mr: 2 }} />
          ) : (
            <Save sx={{ mr: 1 }} />
          )}
          Ingest VMs
        </Button>
      </Box>
    </Container>
  );
};
