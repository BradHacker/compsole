import { FetchResult } from "@apollo/client";
import {
  AdminPanelSettings,
  AdminPanelSettingsTwoTone,
  LockResetTwoTone,
  Save,
  SupervisorAccountTwoTone,
} from "@mui/icons-material";
import {
  Container,
  ToggleButtonGroup,
  ToggleButton,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  ListSubheader,
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
  CreateUserMutation,
  GetCompTeamSearchValuesQuery,
  GetUserQuery,
  Provider,
  Role,
  UpdateUserMutation,
  useCreateUserMutation,
  useGetCompTeamSearchValuesQuery,
  useGetUserLazyQuery,
  User,
  UserInput,
  useUpdateUserMutation,
} from "../../api/generated/graphql";

export const UserForm: React.FC = (): React.ReactElement => {
  const { id } = useParams();
  const [
    getUser,
    { data: getUserData, loading: getUserLoading, error: getUserError },
  ] = useGetUserLazyQuery();
  let {
    data: getCompTeamSearchValuesData,
    loading: getCompTeamSearchValuesLoading,
    error: getCompTeamSearchValuesError,
  } = useGetCompTeamSearchValuesQuery();
  let [
    updateUser,
    {
      data: updateUserData,
      loading: updateUserLoading,
      error: updateUserError,
    },
  ] = useUpdateUserMutation();
  let [
    createUser,
    {
      data: createUserData,
      loading: createUserLoading,
      error: createUserError,
    },
  ] = useCreateUserMutation();
  const [user, setUser] = useState<UserInput>({
    ID: "",
    Username: "",
    FirstName: "",
    LastName: "",
    Provider: Provider.Local, // TODO: Add other providers
    Role: Role.Undefined,
    UserToTeam: undefined,
  });
  const [viewTeam, setViewTeam] = useState<
    GetCompTeamSearchValuesQuery["teams"][0] | null
  >(null);
  const [newPassword, setNewPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();

  useEffect(() => {
    if (id)
      getUser({
        variables: {
          id,
        },
      });
  }, [id]);

  useEffect(() => {
    if (updateUserData && !updateUserLoading)
      enqueueSnackbar(`Updated user "${updateUserData.updateUser.Username}`, {
        variant: "success",
      });
    if (createUserData && !createUserLoading) {
      enqueueSnackbar(`Created user "${createUserData.createUser.Username}`, {
        variant: "success",
      });
      setTimeout(
        () => navigate(`/admin/user/${createUserData?.createUser.ID}`),
        1000
      );
    }
  }, [updateUserData, updateUserLoading, createUserData, createUserLoading]);

  useEffect(() => {
    if (getUserError)
      enqueueSnackbar(`Failed to get user: ${getUserError.message}`, {
        variant: "error",
      });
    if (updateUserError)
      enqueueSnackbar(
        `Failed to update user: ${updateUserError.cause?.message}`,
        {
          variant: "error",
        }
      );
    if (createUserError)
      enqueueSnackbar(
        `Failed to create user: ${createUserError.graphQLErrors
          .map((e) => e.message)
          .join("; ")}`,
        {
          variant: "error",
        }
      );
  }, [getUserError, updateUserError, createUserError]);

  useEffect(() => {
    if (getUserData) {
      setUser({
        ...getUserData.getUser,
        UserToTeam: getUserData.getUser.UserToTeam?.ID,
      } as UserInput);
      if (getUserData?.getUser.UserToTeam && getCompTeamSearchValuesData)
        setViewTeam(
          getCompTeamSearchValuesData.teams.find(
            (v) => v.ID === getUserData.getUser.UserToTeam?.ID
          ) as GetCompTeamSearchValuesQuery["teams"][0]
        );
    } else
      setUser({
        ID: "",
        Username: "",
        FirstName: "",
        LastName: "",
        Provider: Provider.Local, // TODO: Add other providers
        Role: Role.Undefined,
      });
  }, [getUserData, getCompTeamSearchValuesData]);

  const submitUser = () => {
    if (user.ID)
      updateUser({
        variables: {
          user,
        },
      });
    else
      createUser({
        variables: {
          user,
        },
      });
  };

  return (
    <Container component="main" sx={{ p: 2 }}>
      {id && (getUserLoading || getUserError) ? (
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
          <Typography variant="h4" sx={{ mr: 2 }}>
            {id ? `Edit User: ` : "New User"}
          </Typography>
          {id && !getUserLoading && !getUserError && (
            <Typography variant="h5" component="code">
              {getUserData?.getUser.Username ?? "N/A"}
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
          label="First Name"
          defaultValue=""
          variant="filled"
          value={user.FirstName}
          onChange={(e) => setUser({ ...user, FirstName: e.target.value })}
        />
        <TextField
          label="Last Name"
          defaultValue=""
          variant="filled"
          value={user.LastName}
          onChange={(e) => setUser({ ...user, LastName: e.target.value })}
        />
        <TextField
          required
          label="Username"
          defaultValue=""
          variant="filled"
          value={user.Username}
          onChange={(e) => setUser({ ...user, Username: e.target.value })}
        />
        <ToggleButtonGroup
          value={user.Role}
          exclusive
          onChange={(e, newRole: Role) => setUser({ ...user, Role: newRole })}
          aria-label="text alignment"
          id="user-type"
          sx={{
            m: 1,
          }}
        >
          <ToggleButton
            value={Role.Admin}
            aria-label="left aligned"
            color="error"
          >
            <AdminPanelSettingsTwoTone sx={{ mr: 1 }} /> Admin
          </ToggleButton>
          <ToggleButton value={Role.User} aria-label="centered" color="primary">
            <SupervisorAccountTwoTone sx={{ mr: 1 }} /> User
          </ToggleButton>
        </ToggleButtonGroup>
        <Autocomplete
          options={getCompTeamSearchValuesData?.teams ?? []}
          groupBy={(t) => t.TeamToCompetition?.Name ?? "N/A"}
          getOptionLabel={(t) =>
            `${t.TeamToCompetition.Name} - ${t.Name || `Team ${t.TeamNumber}`}`
          }
          renderInput={(params) => <TextField {...params} label="Team" />}
          onChange={(event, value) => {
            setViewTeam(value);
            setUser({
              ...user,
              UserToTeam: value?.ID,
            });
          }}
          isOptionEqualToValue={(option, value) => option.ID === value.ID}
          value={viewTeam}
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
      <Divider
        sx={{
          my: 2,
        }}
      />
      <Typography variant="h6">Change Password</Typography>
      <Box
        component="form"
        sx={{
          display: "flex",
          flexWrap: "wrap",
          "& .MuiTextField-root": {
            m: 1,
            minWidth: "45%",
            flexGrow: 1,
          },
        }}
        noValidate
        autoComplete="off"
      >
        <TextField
          label="New Password"
          type="password"
          defaultValue=""
          variant="filled"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
        />
        <TextField
          label="Confirm New Password"
          type="password"
          defaultValue=""
          variant="filled"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />
        <Button
          type="button"
          variant="contained"
          startIcon={<LockResetTwoTone />}
          sx={{
            m: 1,
          }}
        >
          Change Password
        </Button>
      </Box>
      <Box
        sx={{
          position: "absolute",
          bottom: 24,
          right: 24,
          m: 1,
        }}
      >
        <Fab
          disabled={updateUserLoading || createUserLoading}
          color="secondary"
          aria-label="save"
          onClick={submitUser}
        >
          <Save />
        </Fab>
        {(updateUserLoading || createUserLoading) && (
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