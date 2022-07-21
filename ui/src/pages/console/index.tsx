import {
  ArrowDropDown,
  Autorenew,
  PowerInput,
  PowerOff,
  PowerSettingsNew,
  RestartAlt,
  Terminal,
} from "@mui/icons-material";
import {
  Button,
  ButtonGroup,
  ClickAwayListener,
  Container,
  Grid,
  Grow,
  MenuItem,
  MenuList,
  Paper,
  Popper,
  Skeleton,
  Typography,
} from "@mui/material";
import { LoadingButton } from "@mui/lab";
import { useSnackbar } from "notistack";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  ConsoleType,
  RebootType,
  useGetVmConsoleLazyQuery,
  useGetVmObjectLazyQuery,
  usePowerOffVmMutation,
  usePowerOnVmMutation,
  useRebootVmMutation,
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
      refetch: getVmConsoleRefetch,
    },
  ] = useGetVmConsoleLazyQuery();
  const { enqueueSnackbar } = useSnackbar();
  const [consoleType, setConsoleType] = useState<ConsoleType>(
    ConsoleType.Novnc
  );
  const [fullscreenConsole, setFullscreenConsole] = useState<boolean>(false);
  const [rebootTypeMenuOpen, setRebootTypeMenuOpen] = React.useState(false);
  const rebootTypeMenuAnchorRef = React.useRef<HTMLButtonElement>(null);
  const options = [
    {
      title: "Hard Reboot",
      value: RebootType.Hard,
    },
    {
      title: "Soft Reboot",
      value: RebootType.Soft,
    },
  ];
  const [selectedRebootType, setSelectedRebootType] = React.useState(1);
  const [
    rebootVm,
    { data: rebootVmData, loading: rebootVmLoading, error: rebootVmError },
  ] = useRebootVmMutation();
  const [
    powerOn,
    { data: powerOnVmData, loading: powerOnVmLoading, error: powerOnVmError },
  ] = usePowerOnVmMutation();
  const [
    powerOff,
    {
      data: powerOffVmData,
      loading: powerOffVmLoading,
      error: powerOffVmError,
    },
  ] = usePowerOffVmMutation();

  const handleRefreshConsoleClick = () => {
    if (id)
      getVmConsoleRefetch({
        vmObjectId: id,
        consoleType,
      }).then(
        () =>
          enqueueSnackbar("Refreshed Console", {
            variant: "success",
          }),
        (err) =>
          enqueueSnackbar(`Failed to Refresh Console: ${err}`, {
            variant: "error",
          })
      );
  };

  const handleRebootClick = () => {
    if (id)
      rebootVm({
        variables: {
          vmObjectId: id,
          rebootType: options[selectedRebootType].value,
        },
      }).then(
        () =>
          enqueueSnackbar("Rebooted VM", {
            variant: "success",
          }),
        (err) =>
          enqueueSnackbar(`Failed to Reboot VM: ${err}`, {
            variant: "error",
          })
      );
  };

  const handlePowerOnClick = () => {
    if (id)
      powerOn({
        variables: {
          vmObjectId: id,
        },
      }).then(
        () =>
          enqueueSnackbar("Powered On VM", {
            variant: "success",
          }),
        (err) =>
          enqueueSnackbar(`Failed to Power On VM: ${err}`, {
            variant: "error",
          })
      );
  };

  const handlePowerOffClick = () => {
    if (id)
      powerOff({
        variables: {
          vmObjectId: id,
        },
      }).then(
        () =>
          enqueueSnackbar("Powered Off VM", {
            variant: "success",
          }),
        (err) =>
          enqueueSnackbar(`Failed to Power Off VM: ${err}`, {
            variant: "error",
          })
      );
  };

  const handleRebootTypeClick = (
    event: React.MouseEvent<HTMLLIElement, MouseEvent>,
    index: number
  ) => {
    setSelectedRebootType(index);
    setRebootTypeMenuOpen(false);
  };

  const handleToggleRebootTypeMenu = () => {
    setRebootTypeMenuOpen((prevOpen) => !prevOpen);
  };

  const handleRebootTypeMenuClose = (event: Event) => {
    if (
      rebootTypeMenuAnchorRef.current &&
      rebootTypeMenuAnchorRef.current.contains(event.target as HTMLElement)
    ) {
      return;
    }

    setRebootTypeMenuOpen(false);
  };

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
    if (rebootVmError)
      enqueueSnackbar(rebootVmError.message, {
        variant: "error",
      });
    if (powerOnVmError)
      enqueueSnackbar(powerOnVmError.message, {
        variant: "error",
      });
    if (powerOffVmError)
      enqueueSnackbar(powerOffVmError.message, {
        variant: "error",
      });
  }, [
    getVmObjectError,
    getVmConsoleError,
    rebootVmError,
    powerOnVmError,
    powerOffVmError,
  ]);

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
        <Grid item xs={4}>
          <Typography variant="h5">
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
          xs={8}
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
            <LoadingButton
              color="primary"
              size="small"
              variant="contained"
              startIcon={<Autorenew />}
              loading={
                getVmConsoleLoading ||
                rebootVmLoading ||
                powerOnVmLoading ||
                powerOffVmLoading
              }
              loadingPosition="start"
              onClick={handleRefreshConsoleClick}
            >
              Refresh Console
            </LoadingButton>
            <LoadingButton
              color="error"
              size="small"
              variant="contained"
              startIcon={<PowerOff />}
              loading={rebootVmLoading || powerOnVmLoading || powerOffVmLoading}
              loadingPosition="start"
              onClick={handlePowerOffClick}
            >
              Shutdown
            </LoadingButton>
            <LoadingButton
              color="success"
              size="small"
              variant="contained"
              startIcon={<PowerSettingsNew />}
              loading={rebootVmLoading || powerOnVmLoading || powerOffVmLoading}
              loadingPosition="start"
              onClick={handlePowerOnClick}
            >
              Power On
            </LoadingButton>
            <LoadingButton
              color="warning"
              size="small"
              variant="contained"
              startIcon={<RestartAlt />}
              loading={rebootVmLoading || powerOnVmLoading || powerOffVmLoading}
              loadingPosition="start"
              onClick={handleRebootClick}
              ref={rebootTypeMenuAnchorRef}
            >
              {options[selectedRebootType].title}
            </LoadingButton>
            <Button
              color="warning"
              size="small"
              aria-controls={
                rebootTypeMenuOpen ? "split-button-menu" : undefined
              }
              aria-expanded={rebootTypeMenuOpen ? "true" : undefined}
              aria-label="select merge strategy"
              aria-haspopup="menu"
              onClick={handleToggleRebootTypeMenu}
            >
              <ArrowDropDown />
            </Button>
          </ButtonGroup>
          <Popper
            open={rebootTypeMenuOpen}
            anchorEl={rebootTypeMenuAnchorRef.current}
            role={undefined}
            transition
            disablePortal
          >
            {({ TransitionProps, placement }) => (
              <Grow
                {...TransitionProps}
                style={{
                  transformOrigin:
                    placement === "bottom" ? "center top" : "center bottom",
                }}
              >
                <Paper>
                  <ClickAwayListener onClickAway={handleRebootTypeMenuClose}>
                    <MenuList id="split-button-menu" autoFocusItem>
                      {options.map((option, index) => (
                        <MenuItem
                          key={option.value}
                          disabled={index === 2}
                          selected={index === selectedRebootType}
                          onClick={(event) =>
                            handleRebootTypeClick(event, index)
                          }
                        >
                          {option.title}
                        </MenuItem>
                      ))}
                    </MenuList>
                  </ClickAwayListener>
                </Paper>
              </Grow>
            )}
          </Popper>
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
