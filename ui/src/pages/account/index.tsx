import {
  Box,
  Button,
  CircularProgress,
  Divider,
  Fab,
  TextField,
  Typography,
} from "@mui/material";
import { Container } from "@mui/system";
import React, { useContext, useEffect, useState } from "react";
import {
  AccountInput,
  useChangeSelfPasswordMutation,
  useUpdateAccountMutation,
} from "../../api/generated/graphql";
import { UserContext } from "../../user-context";
import { useSnackbar } from "notistack";
import { LockResetTwoTone, Save } from "@mui/icons-material";

export const Account: React.FC = (): React.ReactElement => {
  const { user, refetchUser } = useContext(UserContext);
  const [account, setAccount] = useState<AccountInput>({
    FirstName: user.FirstName,
    LastName: user.LastName,
  });
  const [
    updateAccount,
    {
      data: updateAccountData,
      loading: updateAccountLoading,
      error: updateAccountError,
      reset: resetUpdateAccount,
    },
  ] = useUpdateAccountMutation();
  const [
    changeSelfPassword,
    {
      data: changeSelfPasswordData,
      loading: changeSelfPasswordLoading,
      error: changeSelfPasswordError,
      reset: resetChangeSelfPassword,
    },
  ] = useChangeSelfPasswordMutation();
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    if (updateAccountError)
      enqueueSnackbar(updateAccountError.message, {
        variant: "error",
      });
    if (changeSelfPasswordError)
      enqueueSnackbar(changeSelfPasswordError.message, {
        variant: "error",
      });
  }, [updateAccountError, changeSelfPasswordError, enqueueSnackbar]);

  useEffect(() => {
    if (updateAccountData?.updateAccount) {
      setAccount({
        FirstName: updateAccountData.updateAccount.FirstName,
        LastName: updateAccountData.updateAccount.LastName,
      });
      enqueueSnackbar("Updated account settings", {
        variant: "success",
      });
      resetUpdateAccount();
      refetchUser();
    }
    if (changeSelfPasswordData?.changeSelfPassword) {
      setPassword("");
      setConfirmPassword("");
      enqueueSnackbar("Updated account password", {
        variant: "success",
      });
      resetChangeSelfPassword();
    }
  }, [
    updateAccountData,
    changeSelfPasswordData,
    setAccount,
    resetUpdateAccount,
    setPassword,
    setConfirmPassword,
    resetChangeSelfPassword,
    enqueueSnackbar,
    refetchUser,
  ]);

  const handleUpdateAccount = () => {
    updateAccount({
      variables: {
        input: account,
      },
    });
  };

  const handleChangePassword = () => {
    if (password !== confirmPassword)
      return enqueueSnackbar("Passwords do not match", {
        variant: "warning",
      });
    changeSelfPassword({
      variables: {
        newPassword: password,
      },
    });
  };

  return (
    <Container component="main" sx={{ p: 2 }}>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
        }}
      >
        <Typography variant="h4" sx={{ mr: 2 }}>
          Account Settings
        </Typography>
        <Typography variant="h5" component="code">
          {user.Username}
        </Typography>
      </Box>
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
          value={account.FirstName}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setAccount({ ...account, FirstName: e.target.value })
          }
        />
        <TextField
          label="Last Name"
          variant="filled"
          value={account.LastName}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setAccount({ ...account, LastName: e.target.value })
          }
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
          value={password}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setPassword(e.target.value)
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
          onClick={handleChangePassword}
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
          disabled={updateAccountLoading || changeSelfPasswordLoading}
          color="secondary"
          aria-label="save"
          onClick={handleUpdateAccount}
        >
          <Save />
        </Fab>
        {(updateAccountLoading || changeSelfPasswordLoading) && (
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
