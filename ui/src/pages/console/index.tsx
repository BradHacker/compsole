import {
  PowerInput,
  PowerOff,
  PowerSettingsNew,
  RestartAlt,
  Terminal,
} from "@mui/icons-material";
import {
  Button,
  ButtonGroup,
  Container,
  Grid,
  Skeleton,
  Typography,
} from "@mui/material";
import { useSnackbar } from "notistack";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  ConsoleType,
  useGetVmConsoleLazyQuery,
  useGetVmObjectLazyQuery,
} from "../../api/generated/graphql";

export const Console: React.FC = (): React.ReactElement => {
  let { id } = useParams();
  let [
    getVmObject,
    {
      data: getVmObjectData,
      loading: getVmObjectLoading,
      error: getVmObjectError,
    },
  ] = useGetVmObjectLazyQuery();
  let [
    getVmConsole,
    {
      data: getVmConsoleData,
      loading: getVmConsoleLoading,
      error: getVmConsoleError,
    },
  ] = useGetVmConsoleLazyQuery();
  const { enqueueSnackbar } = useSnackbar();
  const [consoleType, setConsoleType] = useState<ConsoleType>(
    ConsoleType.Novnc
  );
  const [fullscreenConsole, setFullscreenConsole] = useState<boolean>(false);

  useEffect(() => {
    if (id) {
      getVmObject({
        variables: {
          vmObjectId: id,
        },
      });
    }
  }, [id]);

  useEffect(() => {
    if (id)
      getVmConsole({
        variables: {
          vmObjectId: id,
          consoleType,
        },
      });
  }, [id, consoleType]);

  useEffect(() => {
    if (getVmObjectError)
      enqueueSnackbar(getVmObjectError.message, {
        variant: "error",
      });
    if (getVmConsoleError)
      enqueueSnackbar(getVmConsoleError.message, {
        variant: "error",
      });
  }, [getVmObjectError, getVmConsoleError]);

  return (
    <Container
      component="main"
      sx={{
        p: 2,
      }}
    >
      <Grid
        container
        spacing={2}
        sx={{
          mb: 1,
        }}
      >
        <Grid item xs={8}>
          <Typography variant="h4">
            {getVmObjectLoading || !getVmObjectData ? (
              <Skeleton />
            ) : (
              getVmObjectData.vmObject.Name
            )}
          </Typography>
          <Typography variant="subtitle2" color="text.secondary">
            {getVmObjectLoading || !getVmObjectData ? (
              <Skeleton />
            ) : (
              getVmObjectData.vmObject.IPAddresses?.join(", ") ??
              "No IP Addresses Found"
            )}
          </Typography>
        </Grid>
        <Grid
          item
          xs={4}
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "flex-end",
          }}
        >
          <ButtonGroup variant="contained">
            {/* <Button
              size="small"
              startIcon={<Terminal />}
              onClick={() => setFullscreenConsole(true)}
            >
              Fullscreen
            </Button> */}
            <Button color="error" size="small" startIcon={<PowerOff />}>
              Shutdown
            </Button>
            <Button
              color="success"
              size="small"
              startIcon={<PowerSettingsNew />}
            >
              Power On
            </Button>
            <Button color="warning" size="small" startIcon={<RestartAlt />}>
              Reboot
            </Button>
          </ButtonGroup>
        </Grid>
      </Grid>
      {getVmConsoleLoading || !getVmConsoleData ? (
        <Skeleton width="100%" height="200" />
      ) : (
        <iframe
          id="console"
          src={getVmConsoleData.console}
          style={
            fullscreenConsole
              ? {
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: "100vw",
                  height: "100vh",
                }
              : {}
          }
          width="100%"
          height="800"
        />
      )}
    </Container>
  );
};
