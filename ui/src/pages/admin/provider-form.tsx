import { ArrowBackTwoTone, Save } from "@mui/icons-material";
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
} from "@mui/material";
import { Box } from "@mui/system";
import { useSnackbar } from "notistack";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  useGetProviderLazyQuery,
  useUpdateProviderMutation,
  useCreateProviderMutation,
  ProviderInput,
  useValidateConfigLazyQuery,
} from "../../api/generated/graphql";

export const ProviderForm: React.FC = (): React.ReactElement => {
  const { id } = useParams();
  // Queries
  const [
    getProvider,
    {
      data: getProviderData,
      loading: getProviderLoading,
      error: getProviderError,
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
  }, [
    getProviderError,
    updateProviderError,
    createProviderError,
    enqueueSnackbar,
  ]);

  useEffect(() => {
    if (getProviderData)
      setProvider({
        ...getProviderData.getProvider,
      } as ProviderInput);
    else
      setProvider({
        ID: "",
        Name: "",
        Type: "",
        Config: "",
      });
  }, [getProviderData]);

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
            onClick={() => navigate("/admin")}
          >
            <ArrowBackTwoTone />
          </Button>
          <Typography variant="h4" sx={{ mr: 2 }}>
            {id ? `Edit Provider: ` : "New Provider"}
          </Typography>
          {id && !getProviderLoading && !getProviderError && (
            <Typography variant="h5" component="code">
              {getProviderData?.getProvider.Name ?? "N/A"}
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
          position: "absolute",
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
