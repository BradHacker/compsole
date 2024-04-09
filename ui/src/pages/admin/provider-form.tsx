import {
  ArrowBackTwoTone,
  FiberManualRecord,
  Replay,
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
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  InputAdornment,
  Box,
} from "@mui/material";
import { useSnackbar } from "notistack";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  useGetProviderLazyQuery,
  useUpdateProviderMutation,
  useCreateProviderMutation,
  ProviderInput,
  useValidateConfigLazyQuery,
  useLoadProviderMutation,
} from "../../api/generated/graphql";
import { LoadingButton } from "@mui/lab";

export const ProviderForm: React.FC = (): React.ReactElement => {
  const { id } = useParams();
  // Queries
  const [
    getProvider,
    {
      data: getProviderData,
      loading: getProviderLoading,
      error: getProviderError,
      refetch: refetchGetProvider,
    },
  ] = useGetProviderLazyQuery();
  const [
    updateProvider,
    {
      data: updateProviderData,
      loading: updateProviderLoading,
      error: updateProviderError,
    },
  ] = useUpdateProviderMutation();
  const [
    createProvider,
    {
      data: createProviderData,
      loading: createProviderLoading,
      error: createProviderError,
    },
  ] = useCreateProviderMutation();
  const [
    loadProvider,
    {
      data: loadProviderData,
      loading: loadProviderLoading,
      error: loadProviderError,
      reset: resetLoadProvider,
    },
  ] = useLoadProviderMutation();
  const [
    validateConfig,
    {
      data: validateConfigData,
      loading: validateConfigLoading,
      error: validateConfigError,
    },
  ] = useValidateConfigLazyQuery();
  // State
  const [provider, setProvider] = useState<ProviderInput>({
    ID: "",
    Name: "",
    Type: "",
    Config: "",
  });
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();

  useEffect(() => {
    if (id)
      getProvider({
        variables: {
          id,
        },
      });
  }, [id, getProvider]);

  useEffect(() => {
    if (!loadProviderLoading && loadProviderData)
      enqueueSnackbar("Loaded provider", {
        variant: "success",
      });
    if (!updateProviderLoading && updateProviderData)
      enqueueSnackbar(
        `Updated provider "${updateProviderData.updateProvider.Name}"`,
        {
          variant: "success",
        }
      );
    if (!createProviderLoading && createProviderData) {
      enqueueSnackbar(
        `Created provider "${createProviderData.createProvider.Name}"`,
        {
          variant: "success",
        }
      );
      setTimeout(
        () =>
          navigate(`/admin/provider/${createProviderData?.createProvider.ID}`),
        1000
      );
    }
  }, [
    updateProviderData,
    updateProviderLoading,
    loadProviderData,
    loadProviderLoading,
    createProviderData,
    createProviderLoading,
    enqueueSnackbar,
    navigate,
  ]);

  useEffect(() => {
    if (getProviderError)
      enqueueSnackbar(`Failed to get provider: ${getProviderError.message}`, {
        variant: "error",
      });
    if (updateProviderError)
      enqueueSnackbar(
        `Failed to update provider: ${updateProviderError.message}`,
        {
          variant: "error",
        }
      );
    if (createProviderError)
      enqueueSnackbar(
        `Failed to create provider: ${createProviderError.message}`,
        {
          variant: "error",
        }
      );
    if (loadProviderError)
      enqueueSnackbar(`Failed to load provider: ${loadProviderError.message}`, {
        variant: "error",
      });
  }, [
    getProviderError,
    updateProviderError,
    createProviderError,
    loadProviderError,
    enqueueSnackbar,
  ]);

  useEffect(() => {
    if (getProviderData)
      setProvider({
        Config: getProviderData.getProvider.Config,
        Name: getProviderData.getProvider.Name,
        Type: getProviderData.getProvider.Type,
        ID: getProviderData.getProvider.ID,
      } as ProviderInput);
    else
      setProvider({
        ID: "",
        Name: "",
        Type: "",
        Config: "",
      });
  }, [getProviderData]);

  useEffect(() => {
    if (loadProviderData?.loadProvider) {
      resetLoadProvider();
      refetchGetProvider();
    }
  }, [loadProviderData]);

  const submitProvider = () => {
    if (provider.ID)
      updateProvider({
        variables: {
          provider,
        },
      });
    else
      createProvider({
        variables: {
          provider,
        },
      });
  };

  useEffect(() => {
    let delayDebounce: NodeJS.Timeout;
    if (provider.Type && provider.Config)
      delayDebounce = setTimeout(() => {
        validateConfig({
          variables: {
            type: provider.Type,
            config: provider.Config,
          },
          fetchPolicy: "no-cache",
        });
      }, 1000);
    return () => clearTimeout(delayDebounce);
  }, [provider, validateConfig]);

  return (
    <Container component="main" sx={{ p: 2 }}>
      {id && (getProviderLoading || getProviderError) ? (
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
                  tab: 4,
                },
              })
            }
          >
            <ArrowBackTwoTone />
          </Button>
          <Typography variant="h4" sx={{ mr: 2 }}>
            {id ? `Edit Provider: ` : "New Provider"}
          </Typography>
          {id && !getProviderLoading && getProviderData && (
            <>
              <Typography variant="h5" component="code">
                {getProviderData.getProvider.Name ?? "N/A"}
              </Typography>
              <Typography variant="h6" component="span" sx={{ ml: 2 }}>
                <FiberManualRecord
                  sx={{
                    height: "1rem",
                    width: "1rem",
                    mr: 1,
                    color: getProviderData.getProvider.Loaded
                      ? "#00ff00"
                      : "#ff0000",
                  }}
                  titleAccess={
                    getProviderData.getProvider.Loaded ? "Loaded" : "Not Loaded"
                  }
                />
                {getProviderData.getProvider.Loaded ? "Loaded" : "Not Loaded"}
              </Typography>
            </>
          )}

          <LoadingButton
            color="warning"
            // size="small"
            variant="outlined"
            startIcon={<Replay />}
            loading={loadProviderLoading}
            loadingPosition="start"
            onClick={() =>
              loadProvider({ variables: { providerId: id ?? "" } })
            }
            // disabled={isVmLocked()}
            // sx={VmButtonStyles}
            sx={{ ml: "auto" }}
          >
            Load Provider
          </LoadingButton>
          {/* <Button
            color="warning"
            size="small"
            // aria-label="load provider"
            onClick={loadProvider({ variables: { providerId: id ?? "" } })}
            disabled={load}
          ></Button> */}
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
          label="Name"
          variant="filled"
          value={provider.Name}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setProvider({ ...provider, Name: e.target.value })
          }
        />
        <FormControl variant="filled">
          <InputLabel id="type-select-label">Type</InputLabel>
          <Select
            labelId="type-select-label"
            id="type-select"
            value={provider.Type}
            label="Type"
            onChange={(e) => setProvider({ ...provider, Type: e.target.value })}
          >
            <MenuItem value={"OPENSTACK"}>Openstack</MenuItem>
          </Select>
        </FormControl>
        <TextField
          label="Config"
          multiline
          minRows={10}
          variant="filled"
          value={provider.Config}
          helperText={
            validateConfigError !== undefined ||
            validateConfigData?.validateConfig === false
              ? validateConfigError?.message || "Invalid syntax"
              : "Config is valid!"
          }
          InputProps={{
            endAdornment: validateConfigLoading ? (
              <InputAdornment position="end">
                <CircularProgress />
              </InputAdornment>
            ) : null,
          }}
          color={validateConfigData?.validateConfig ? "success" : undefined}
          error={
            validateConfigError !== undefined ||
            validateConfigData?.validateConfig === false
          }
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setProvider({ ...provider, Config: e.target.value })
          }
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
          disabled={updateProviderLoading || createProviderLoading}
          color="secondary"
          aria-label="save"
          onClick={submitProvider}
        >
          <Save />
        </Fab>
        {(updateProviderLoading || createProviderLoading) && (
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
