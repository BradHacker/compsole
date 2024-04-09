import {
  ArrowBackTwoTone,
  CheckTwoTone,
  PersonOffTwoTone,
  PersonTwoTone,
  Save,
} from "@mui/icons-material";
import {
  Container,
  TextField,
  Typography,
  Divider,
  Skeleton,
  Fab,
  CircularProgress,
  Button,
  ToggleButton,
  ToggleButtonGroup,
  Modal,
  Box,
} from "@mui/material";
import { useSnackbar } from "notistack";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  useGetServiceAccountLazyQuery,
  useUpdateServiceAccountMutation,
  useCreateServiceAccountMutation,
  ServiceAccountInput,
  GetServiceAccountQuery,
} from "../../api/generated/graphql";

export const ServiceAccountForm: React.FC = (): React.ReactElement => {
  const { id } = useParams();
  // Queries
  const [
    getServiceAccount,
    {
      data: getServiceAccountData,
      loading: getServiceAccountLoading,
      error: getServiceAccountError,
    },
  ] = useGetServiceAccountLazyQuery({
    fetchPolicy: "no-cache",
  });
  const [
    updateServiceAccount,
    {
      data: updateServiceAccountData,
      loading: updateServiceAccountLoading,
      error: updateServiceAccountError,
    },
  ] = useUpdateServiceAccountMutation();
  const [
    createServiceAccount,
    {
      data: createServiceAccountData,
      loading: createServiceAccountLoading,
      error: createServiceAccountError,
      reset: resetCreateServiceAccount,
    },
  ] = useCreateServiceAccountMutation();
  // State
  const [serviceAccount, setServiceAccount] = useState<ServiceAccountInput>({
    ID: "",
    DisplayName: "",
    Active: true,
  });
  const [showCreatedModal, setShowCreatedModal] = useState<boolean>(false);
  const [timeTillDismissShowModal, setTimeTillDismissShowModal] =
    useState<number>(0);
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();

  useEffect(() => {
    if (id)
      getServiceAccount({
        variables: {
          id,
        },
      });
  }, [id, getServiceAccount]);

  useEffect(() => {
    if (!updateServiceAccountLoading && updateServiceAccountData)
      enqueueSnackbar(
        `Updated service account "${updateServiceAccountData.updateServiceAccount.DisplayName}"`,
        {
          variant: "success",
        }
      );
    if (!createServiceAccountLoading && createServiceAccountData) {
      enqueueSnackbar(
        `Created service account "${createServiceAccountData.createServiceAccount.DisplayName}"`,
        {
          variant: "success",
        }
      );
      setShowCreatedModal(true);
      setTimeTillDismissShowModal(5);
      // setTimeout(
      //   () =>
      //     navigate(
      //       `/admin/service-account/${createServiceAccountData?.createServiceAccount.ID}`
      //     ),
      //   1000
      // );
    }
  }, [
    updateServiceAccountData,
    updateServiceAccountLoading,
    createServiceAccountData,
    createServiceAccountLoading,
    enqueueSnackbar,
    navigate,
  ]);

  useEffect(() => {
    if (getServiceAccountError)
      enqueueSnackbar(
        `Failed to get service account: ${getServiceAccountError.message}`,
        {
          variant: "error",
        }
      );
    if (updateServiceAccountError)
      enqueueSnackbar(
        `Failed to update service account: ${updateServiceAccountError.message}`,
        {
          variant: "error",
        }
      );
    if (createServiceAccountError)
      enqueueSnackbar(
        `Failed to create service account: ${createServiceAccountError.message}`,
        {
          variant: "error",
        }
      );
  }, [
    getServiceAccountError,
    updateServiceAccountError,
    createServiceAccountError,
    enqueueSnackbar,
  ]);

  useEffect(() => {
    if (getServiceAccountData) {
      setServiceAccount({
        ...getServiceAccountData.getServiceAccount,
      } as ServiceAccountInput);
    } else
      setServiceAccount({
        ID: "",
        DisplayName: "",
        Active: true,
      });
  }, [getServiceAccountData]);

  useEffect(() => {
    let timeout: NodeJS.Timer | undefined;
    if (showCreatedModal && timeTillDismissShowModal > 0) {
      timeout = setTimeout(
        () => setTimeTillDismissShowModal(timeTillDismissShowModal - 1),
        1000
      );
    }

    return () => clearTimeout(timeout);
  }, [
    showCreatedModal,
    timeTillDismissShowModal,
    setShowCreatedModal,
    setTimeTillDismissShowModal,
  ]);

  const submitServiceAccount = () => {
    if (serviceAccount.ID)
      updateServiceAccount({
        variables: {
          input: {
            ID: serviceAccount.ID,
            DisplayName: serviceAccount.DisplayName,
            Active: serviceAccount.Active,
          },
        },
      });
    else
      createServiceAccount({
        variables: {
          input: serviceAccount,
        },
      });
  };

  const closeCreatedModal = () => {
    if (createServiceAccountData?.createServiceAccount) {
      setShowCreatedModal(false);
      resetCreateServiceAccount();
      navigate(
        `/admin/service-account/${createServiceAccountData?.createServiceAccount.ID}`
      );
    }
  };

  return (
    <Container component="main" sx={{ p: 2 }}>
      <Modal open={showCreatedModal}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: "50%",
            bgcolor: "#2a273f",
            borderRadius: 2,
            boxShadow: "0 0 2rem #000",
            p: 4,
          }}
        >
          <Typography variant="body1" component="h2">
            Please copy these values down.{" "}
            <b>
              This is the only time you will see your
              <Typography variant="body1" component="code" sx={{ ml: 1 }}>
                API Secret
              </Typography>
              !
            </b>
          </Typography>
          <Box sx={{ px: 1 }}>
            <TextField
              InputProps={{
                readOnly: true,
              }}
              label="API Key"
              variant="filled"
              value={
                createServiceAccountData?.createServiceAccount.ApiKey ??
                "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
              }
              sx={{
                width: "100%",
                mb: 1,
                mt: 1,
              }}
            />
            <TextField
              InputProps={{
                readOnly: true,
              }}
              label="API Secret"
              variant="filled"
              value={
                createServiceAccountData?.createServiceAccount.ApiSecret ??
                "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
              }
              sx={{
                width: "100%",
              }}
            />
          </Box>
          <Button
            type="button"
            variant="contained"
            startIcon={<CheckTwoTone />}
            sx={{ width: "100%", mt: 2 }}
            disabled={timeTillDismissShowModal > 0}
            onClick={closeCreatedModal}
          >
            I Copied Them{" "}
            {timeTillDismissShowModal > 0
              ? `(${timeTillDismissShowModal})`
              : ""}
          </Button>
        </Box>
      </Modal>
      {id && (getServiceAccountLoading || getServiceAccountError) ? (
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
                  tab: 5,
                },
              })
            }
          >
            <ArrowBackTwoTone />
          </Button>
          <Typography variant="h4" sx={{ mr: 2 }}>
            {id ? `Edit Service Account: ` : "New Service Account"}
          </Typography>
          {id && !getServiceAccountLoading && !getServiceAccountError && (
            <Typography variant="h5" component="code">
              {getServiceAccountData?.getServiceAccount.DisplayName ?? "N/A"}
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
          "& .MuiFormControl-root": {
            m: 1,
            minWidth: "40%",
            flexGrow: 1,
          },
        }}
        noValidate
        autoComplete="off"
      >
        <TextField
          label="Display Name"
          variant="filled"
          value={serviceAccount.DisplayName}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setServiceAccount({
              ...serviceAccount,
              DisplayName: e.target.value,
            })
          }
        />
        <ToggleButtonGroup
          value={serviceAccount.Active}
          exclusive
          onChange={(e: any, newActive: boolean) =>
            setServiceAccount({ ...serviceAccount, Active: newActive })
          }
          aria-label="text alignment"
          id="service-account-active"
          sx={{
            m: 1,
          }}
        >
          <ToggleButton value={true} aria-label="centered" color="primary">
            <PersonTwoTone sx={{ mr: 1 }} /> Active
          </ToggleButton>
          <ToggleButton value={false} aria-label="centered" color="error">
            <PersonOffTwoTone sx={{ mr: 1 }} /> Inactive
          </ToggleButton>
        </ToggleButtonGroup>
        {id &&
          (serviceAccount as GetServiceAccountQuery["getServiceAccount"])
            .ApiKey && (
            <TextField
              InputProps={{
                readOnly: true,
              }}
              label="API Key"
              variant="filled"
              value={
                (serviceAccount as GetServiceAccountQuery["getServiceAccount"])
                  .ApiKey
              }
            />
          )}
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
          disabled={updateServiceAccountLoading || createServiceAccountLoading}
          color="secondary"
          aria-label="save"
          onClick={submitServiceAccount}
        >
          <Save />
        </Fab>
        {(updateServiceAccountLoading || createServiceAccountLoading) && (
          <CircularProgress
            size={68}
            sx={{
              color: "primary",
              position: "fixed",
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
