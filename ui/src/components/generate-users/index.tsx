import { Check, Download, Factory } from "@mui/icons-material";
import {
  TextField,
  Typography,
  Divider,
  Autocomplete,
  CircularProgress,
  Button,
  List,
  ListItem,
  ListItemText,
  Box,
} from "@mui/material";
import { useSnackbar } from "notistack";
import React, { useEffect, useState } from "react";
import {
  ListCompetitionsQuery,
  useListCompetitionsQuery,
  useGenerateCompetitionUsersMutation,
  GenerateCompetitionUsersMutation,
} from "../../api/generated/graphql";

const downloadUsers = ({
  data,
  filename,
}: {
  data: GenerateCompetitionUsersMutation["generateCompetitionUsers"];
  filename: string;
}) => {
  const rawData = data
    .map(
      (u) =>
        `${u.UserToTeam.TeamToCompetition.Name},${
          u.UserToTeam.Name || u.UserToTeam.TeamNumber
        },${u.Username},${u.Password}`
    )
    .reduce(
      (prev, curr) => prev.concat("\n" + curr),
      "Competition,Team,Username,Password"
    );

  const blob = new Blob([rawData], { type: "text/csv" });
  const a = document.createElement("a");
  a.download = filename;
  a.href = window.URL.createObjectURL(blob);
  const clickEvt = new MouseEvent("click", {
    view: window,
    bubbles: true,
    cancelable: true,
  });
  a.dispatchEvent(clickEvt);
  a.remove();
};

export const GenerateUsers: React.FC = (): React.ReactElement => {
  const {
    data: listCompetitionsData,
    error: listCompetitionsError,
    loading: listCompetitionsLoading,
    refetch: refetchListCompetitions,
  } = useListCompetitionsQuery({
    fetchPolicy: "no-cache",
  });
  const [
    generateCompetitionUsers,
    {
      data: generateCompetitionUsersData,
      loading: generateCompetitionUsersLoading,
      error: generateCompetitionUsersError,
      reset: resetGenerateCompetitionUsers,
    },
  ] = useGenerateCompetitionUsersMutation();
  const [selectedCompetition, setSelectedCompetition] = useState<
    ListCompetitionsQuery["competitions"][0] | null
  >(null);
  const [usersPerTeam, setUsersPerTeam] = useState<string>("1");
  const [hasDownloadedUsers, setHasDownloadedUsers] = useState<boolean>(false);
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    if (listCompetitionsError)
      enqueueSnackbar(
        `Couldn't get competitions: ${listCompetitionsError.message}`,
        {
          variant: "error",
        }
      );
    if (generateCompetitionUsersError)
      enqueueSnackbar(
        `Couldn't generate users: ${generateCompetitionUsersError.message}`,
        {
          variant: "error",
        }
      );
  }, [listCompetitionsError, generateCompetitionUsersError, enqueueSnackbar]);

  useEffect(() => {
    if (generateCompetitionUsersData?.generateCompetitionUsers !== undefined)
      enqueueSnackbar(
        `Generated users for competition "${selectedCompetition?.Name}". Please note these down`,
        {
          variant: "success",
        }
      );
  }, [generateCompetitionUsersData, selectedCompetition, enqueueSnackbar]);

  const generateUsers = () => {
    if (parseInt(usersPerTeam) <= 0) {
      enqueueSnackbar("Users per team must be > 0", {
        variant: "warning",
      });
      return;
    }
    if (selectedCompetition)
      generateCompetitionUsers({
        variables: {
          usersPerTeam: parseInt(usersPerTeam),
          competitionId: selectedCompetition.ID,
        },
      });
  };

  const resetForm = () => {
    setSelectedCompetition(null);
    setUsersPerTeam("1");
    refetchListCompetitions();
    resetGenerateCompetitionUsers();
    setHasDownloadedUsers(false);
  };

  return (
    <Box>
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
          disableClearable={
            generateCompetitionUsersData?.generateCompetitionUsers !== undefined
          }
        />
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
            minWidth: "50%",
            flexGrow: 1,
          },
        }}
        noValidate
        autoComplete="off"
      >
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
        <TextField
          type="number"
          label="# of Users per Team"
          variant="filled"
          value={usersPerTeam}
          InputProps={{ inputProps: { min: 1 } }}
          disabled={listCompetitionsLoading || !selectedCompetition}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setUsersPerTeam(e.target.value)
          }
        />
        <Button
          variant="contained"
          disabled={
            listCompetitionsLoading ||
            !selectedCompetition ||
            generateCompetitionUsersData?.generateCompetitionUsers !== undefined
          }
          onClick={generateUsers}
          sx={{
            m: 1,
            minWidth: "50%",
            flexGrow: 1,
          }}
        >
          {generateCompetitionUsersLoading ? (
            <CircularProgress size="1rem" sx={{ mr: 2 }} />
          ) : (
            <Factory sx={{ mr: 1 }} />
          )}
          Generate Competition Users
        </Button>
      </Box>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
        }}
      >
        <List>
          {(!generateCompetitionUsersData ||
            generateCompetitionUsersData.generateCompetitionUsers.length ===
              0) && (
            <ListItem>
              <ListItemText>No Users Generated</ListItemText>
            </ListItem>
          )}
          {generateCompetitionUsersData?.generateCompetitionUsers.map(
            (competitionUser) => (
              <ListItem key={competitionUser.ID}>
                <ListItemText
                  primary={competitionUser.UserToTeam.TeamToCompetition.Name}
                  secondary="Competition"
                ></ListItemText>
                <ListItemText
                  primary={
                    competitionUser.UserToTeam.Name ||
                    `Team ${competitionUser.UserToTeam.TeamNumber}`
                  }
                  secondary="Team"
                ></ListItemText>
                <ListItemText
                  primary={competitionUser.Username}
                  secondary="Username"
                ></ListItemText>
                <ListItemText
                  primary={competitionUser.Password}
                  secondary="Password"
                ></ListItemText>
              </ListItem>
            )
          )}
        </List>
        <Box sx={{ display: "flex" }}>
          <Button
            variant="contained"
            disabled={
              generateCompetitionUsersLoading || !generateCompetitionUsersData
            }
            onClick={() => {
              downloadUsers({
                data:
                  generateCompetitionUsersData?.generateCompetitionUsers ?? [],
                filename: `${selectedCompetition?.Name.toLocaleLowerCase()}_users.csv`,
              });
              setHasDownloadedUsers(true);
            }}
            sx={{
              m: 1,
              minWidth: "40%",
              flexGrow: 1,
            }}
          >
            {generateCompetitionUsersLoading ? (
              <CircularProgress size="1rem" sx={{ mr: 2 }} />
            ) : (
              <Download sx={{ mr: 1 }} />
            )}
            Download
          </Button>
          <Button
            variant="contained"
            disabled={
              generateCompetitionUsersLoading ||
              !generateCompetitionUsersData ||
              !hasDownloadedUsers
            }
            onClick={resetForm}
            sx={{
              m: 1,
              minWidth: "40%",
              flexGrow: 1,
            }}
          >
            {generateCompetitionUsersLoading ? (
              <CircularProgress size="1rem" sx={{ mr: 2 }} />
            ) : (
              <Check sx={{ mr: 1 }} />
            )}
            Ok
          </Button>
        </Box>
      </Box>
    </Box>
  );
};
