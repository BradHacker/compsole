import {
  AdminPanelSettingsTwoTone,
  ArrowBackTwoTone,
  LockResetTwoTone,
  Save,
  SupervisorAccountTwoTone,
} from "@mui/icons-material";
import {
  Container,
  ToggleButtonGroup,
  ToggleButton,
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
  GetCompTeamSearchValuesQuery,
  Role,
  useCreateUserMutation,
  useGetCompTeamSearchValuesQuery,
  useGetUserLazyQuery,
  UserInput,
  useUpdateUserMutation,
  useChangePasswordMutation,
  AuthProvider,
} from "../../api/generated/graphql";

export const UserForm: React.FC = (): React.ReactElement => {
  const { id } = useParams();
  const [
    getUser,
    { data: getUserData, loading: getUserLoading, error: getUserError },
  ] = useGetUserLazyQuery();
  const {
    data: getCompTeamSearchValuesData,
    error: getCompTeamSearchValuesError,
  } = useGetCompTeamSearchValuesQuery({
    fetchPolicy: "no-cache",
  });
  const [
    updateUser,
    {
      data: updateUserData,
      loading: updateUserLoading,
      error: updateUserError,
    },
  ] = useUpdateUserMutation();
  const [
    createUser,
    {
      data: createUserData,
      loading: createUserLoading,
      error: createUserError,
    },
  ] = useCreateUserMutation();
  const [
    changePassword,
    {
      data: changePasswordData,
      loading: changePasswordLoading,
      error: changePasswordError,
    },
  ] = useChangePasswordMutation();
  const [user, setUser] = useState<UserInput>({
    ID: "",
    Username: "",
    FirstName: "",
    LastName: "",
    Provider: AuthProvider.Local, // TODO: Add other providers
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
  }, [id, getUser]);

  useEffect(() => {
    if (getCompTeamSearchValuesError)
      enqueueSnackbar(
        `Couldn't get competitions and teams: ${getCompTeamSearchValuesError.message}`
      );
  }, [getCompTeamSearchValuesError, enqueueSnackbar]);

  useEffect(() => {
    if (!updateUserLoading && updateUserData)
      enqueueSnackbar(`Updated user "${updateUserData.updateUser.Username}"`, {
        variant: "success",
      });
    if (!createUserLoading && createUserData) {
      enqueueSnackbar(`Created user "${createUserData.createUser.Username}"`, {
        variant: "success",
      });
      setTimeout(
        () => navigate(`/admin/user/${createUserData?.createUser.ID}`),
        1000
      );
    }
    if (!changePasswordLoading && changePasswordData) {
      enqueueSnackbar(`Password successfully changed!`, {
        variant: "success",
      });
      setNewPassword("");
      setConfirmPassword("");
    }
  }, [
    updateUserData,
    updateUserLoading,
    createUserData,
    createUserLoading,
    changePasswordData,
    changePasswordLoading,
    enqueueSnackbar,
    navigate,
  ]);

  useEffect(() => {
    if (getUserError)
      enqueueSnackbar(`Failed to get user: ${getUserError.message}`, {
        variant: "error",
      });
    if (updateUserError)
      enqueueSnackbar(`Failed to update user: ${updateUserError.message}`, {
        variant: "error",
      });
    if (createUserError)
      enqueueSnackbar(`Failed to create user: ${createUserError.message}`, {
        variant: "error",
      });
    if (changePasswordError)
      enqueueSnackbar(
        `Failed to change password: ${changePasswordError.message}`,
        {
          variant: "error",
        }
      );
  }, [
    getUserError,
    updateUserError,
    createUserError,
    changePasswordError,
    enqueueSnackbar,
  ]);

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
        Provider: AuthProvider.Local, // TODO: Add other providers
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

  const submitPasswordChange = () => {
    if (newPassword !== confirmPassword) {
      enqueueSnackbar("Confirm Password must match New Password", {
        variant: "error",
      });
    } else if (!id || id === "new") {
      enqueueSnackbar("Please save the new user prior to setting a password", {
        variant: "warning",
      });
    } else {
      changePassword({
        variables: {
          id,
          newPassword,
        },
      });
    }
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
          <Button
            variant="text"
            sx={{ mr: 1 }}
            onClick={() => navigate("/admin")}
          >
            <ArrowBackTwoTone />
          </Button>
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
          variant="filled"
          value={user.FirstName}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setUser({ ...user, FirstName: e.target.value })
          }
        />
        <TextField
          label="Last Name"
          variant="filled"
          value={user.LastName}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setUser({ ...user, LastName: e.target.value })
          }
        />
        <TextField
          required
          label="Username"
          variant="filled"
          value={user.Username}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setUser({ ...user, Username: e.target.value })
          }
        />
        <ToggleButtonGroup
          value={user.Role}
          exclusive
          onChange={(e: any, newRole: Role) =>
            setUser({ ...user, Role: newRole })
          }
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
          options={
            [...(getCompTeamSearchValuesData?.teams || [])].sort((a, b) =>
              `${a.TeamToCompetition.Name}${String(a.TeamNumber).padStart(
                2,
                "0"
              )}`.localeCompare(
                `${b.TeamToCompetition.Name}${String(b.TeamNumber).padStart(
                  2,
                  "0"
                )}`
              )
            ) ?? []
          }
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
          variant="filled"
          value={newPassword}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setNewPassword(e.target.value)
          }
        />
        <TextField
          label="Confirm New Password"
          type="password"
          variant="filled"
          value={confirmPassword}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setConfirmPassword(e.target.value)
          }
        />
        <Button
          type="button"
          variant="contained"
          startIcon={<LockResetTwoTone />}
          sx={{
            m: 1,
          }}
          onClick={submitPasswordChange}
        >
          Change Password
        </Button>
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
