import {
  ArrowDropDown,
  Autorenew,
  BatteryUnknownTwoTone,
  FiberManualRecord,
  HotelTwoTone,
  HourglassBottomTwoTone,
  LockTwoTone,
  PowerOff,
  PowerOffTwoTone,
  PowerSettingsNew,
  PowerTwoTone,
  RestartAlt,
  RestartAltTwoTone,
  SyncTwoTone,
  TerminalTwoTone,
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
  Theme,
  Typography,
} from "@mui/material";
import { LoadingButton } from "@mui/lab";
import { useSnackbar } from "notistack";
import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  ConsoleType,
  PowerState,
  RebootType,
  Role,
  useGetVmConsoleLazyQuery,
  useGetVmObjectLazyQuery,
  useLockoutSubscription,
  usePowerOffVmMutation,
  usePowerOnVmMutation,
  usePowerStateSubscription,
  useRebootVmMutation,
} from "../../api/generated/graphql";
import { UserContext } from "../../user-context";
import { Box, SxProps } from "@mui/system";

const VmButtonStyles: SxProps<Theme> = {
  ".MuiButton-startIcon": {
    display: {
      xs: "none",
      md: "inherit",
    },
  },
  fontSize: {
    xs: "0.65rem",
    md: "0.8125rem",
  },
  flexShrink: {
    xs: "0",
    md: "1",
  },
};

export const Console: React.FC = (): React.ReactElement => {
  let { user } = useContext(UserContext);
  let { id } = useParams();
  let [
    getVmObject,
    {
      data: getVmObjectData,
      loading: getVmObjectLoading,
      error: getVmObjectError,
      refetch: refetchVmObject,
    },
  ] = useGetVmObjectLazyQuery();
  let [
    getVmConsole,
    {
      previousData: prevGetVmConsoleData,
      data: getVmConsoleData,
      loading: getVmConsoleLoading,
      error: getVmConsoleError,
      refetch: getVmConsoleRefetch,
    },
  ] = useGetVmConsoleLazyQuery();
  let { data: lockoutData, error: lockoutError } = useLockoutSubscription({
    variables: {
      vmObjectId: id || "",
    },
  });
  let { data: powerStateData, error: powerStateError } =
    usePowerStateSubscription({
      variables: {
        vmObjectId: id || "",
      },
    });
  const { enqueueSnackbar } = useSnackbar();
  let [consoleUrl, setConsoleUrl] = useState<string>("");
  const [consoleType, _setConsoleType] = useState<ConsoleType>(
    ConsoleType.Novnc
  );
  const [fullscreenConsole, setFullscreenConsole] = useState<boolean>(false);
  const [rebootTypeMenuOpen, setRebootTypeMenuOpen] = useState(false);
  // const rebootTypeMenuAnchorRef = useRef<HTMLButtonElement>(null);
  const [rebootTypeMenuAnchor, setRebootTypeMenuAnchor] =
    useState<null | HTMLElement>(null);
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
  const [selectedRebootType, setSelectedRebootType] = useState<number>(1);
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
      });
  };

  const handlePowerOnClick = () => {
    if (id)
      powerOn({
        variables: {
          vmObjectId: id,
        },
      });
  };

  const handlePowerOffClick = () => {
    if (id)
      powerOff({
        variables: {
          vmObjectId: id,
        },
      });
  };

  const handleRebootTypeClick = (
    event: React.MouseEvent<HTMLLIElement, MouseEvent>,
    index: number
  ) => {
    setSelectedRebootType(index);
    setRebootTypeMenuOpen(false);
  };

  const handleToggleRebootTypeMenu = (
    e: React.MouseEvent<HTMLElement> | null
  ) => {
    // setRebootTypeMenuOpen((prevOpen) => !prevOpen);
    setRebootTypeMenuAnchor(
      rebootTypeMenuAnchor ? null : e?.currentTarget ?? null
    );
  };

  const getPowerStateString = (powerState: PowerState | undefined): string => {
    if (!powerStateData) return "Loading VM State...";
    switch (powerState) {
      case PowerState.PoweredOff:
        return "VM is Powered Off";
      case PowerState.PoweredOn:
        return "VM is Powered On";
      case PowerState.Rebooting:
        return "VM is Rebooting";
      case PowerState.ShuttingDown:
        return "VM is Shutting Down";
      case PowerState.Suspended:
        return "VM is Suspended";
      default:
        return "VM is in an Unknown State";
    }
  };

  const getPowerStateIcon = (
    powerState: PowerState | undefined
  ): React.ReactElement => {
    if (!powerStateData) return <SyncTwoTone />;
    switch (powerState) {
      case PowerState.PoweredOff:
        return <PowerOffTwoTone />;
      case PowerState.PoweredOn:
        return <PowerTwoTone />;
      case PowerState.Rebooting:
        return <RestartAltTwoTone />;
      case PowerState.ShuttingDown:
        return <HourglassBottomTwoTone />;
      case PowerState.Suspended:
        return <HotelTwoTone />;
      default:
        return <BatteryUnknownTwoTone />;
    }
  };

  const getPowerStateColor = (powerState: PowerState | undefined): string => {
    switch (powerState) {
      case PowerState.PoweredOff:
        return "#ff0000";
      case PowerState.PoweredOn:
        return "#00ff00";
      case PowerState.Rebooting:
        return "#ffc400";
      case PowerState.ShuttingDown:
        return "#ffc400";
      default:
        return "rgba(255, 255, 255, 0.3)";
    }
  };

  const isVmLocked = (): boolean => {
    // Never lock VM's for admins
    if (user.Role === Role.Admin) return false;
    // VM is still loading
    if (getVmObjectData === undefined) return false;
    // Got lockout message from websocket
    if (lockoutData?.lockout.Locked) return true;
    // If it's loaded and locked
    if (getVmObjectData.vmObject.Locked) return true;
    else return false;
  };

  const shouldShowConsole = (): boolean => {
    // If the vm is locked
    if (isVmLocked()) return false;
    // If the vm is not powered on
    if (powerStateData?.powerState.State !== PowerState.PoweredOn) return false;
    return true;
  };

  // Set the title of the tab only on first load
  useEffect(() => {
    document.title = "VM Console - Compsole";
  }, []);

  useEffect(() => {
    if (id) {
      getVmObject({
        variables: {
          vmObjectId: id,
        },
      });
    }
  }, [id, getVmObject]);

  useEffect(() => {
    if (getVmObjectData?.vmObject.Name)
      document.title = `${getVmObjectData.vmObject.Name} - Compsole`;
    if (getVmObjectData?.vmObject.ID && !isVmLocked()) {
      if (!prevGetVmConsoleData?.console)
        getVmConsole({
          variables: {
            vmObjectId: getVmObjectData?.vmObject.ID,
            consoleType,
          },
        });
      else
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
    }
  }, [
    id,
    getVmObjectData,
    consoleType,
    user,
    getVmConsole,
    getVmConsoleRefetch,
    enqueueSnackbar,
  ]);

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
    if (lockoutError)
      enqueueSnackbar(lockoutError.message, {
        variant: "error",
      });
    if (powerStateError)
      enqueueSnackbar(powerStateError.message, {
        variant: "error",
      });
  }, [
    getVmObjectError,
    getVmConsoleError,
    rebootVmError,
    powerOnVmError,
    powerOffVmError,
    lockoutError,
    powerStateError,
    enqueueSnackbar,
  ]);

  useEffect(() => {
    if (rebootVmData?.reboot)
      enqueueSnackbar("Rebooting VM.", {
        variant: "success",
      });
    if (powerOffVmData?.powerOff)
      enqueueSnackbar("Powering Off VM.", {
        variant: "success",
      });
    if (powerOnVmData?.powerOn)
      enqueueSnackbar("Powering On VM.", {
        variant: "success",
      });
  }, [rebootVmData, powerOnVmData, powerOffVmData, enqueueSnackbar]);

  useEffect(() => {
    if (lockoutData?.lockout.Locked && user.Role !== Role.Admin) {
      enqueueSnackbar("VM Locked", {
        variant: "warning",
        autoHideDuration: 2000,
      });
    } else if (getVmObjectData && user.Role !== Role.Admin) {
      enqueueSnackbar("VM Unlocked", {
        variant: "success",
        autoHideDuration: 2000,
      });
      refetchVmObject({
        vmObjectId: getVmObjectData.vmObject.ID,
      });
    }
  }, [lockoutData, getVmObjectData, refetchVmObject, enqueueSnackbar]);

  useEffect(() => {
    if (getVmConsoleData) setConsoleUrl(getVmConsoleData.console);
  }, [getVmConsoleData]);

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
        <Grid item md={4} xs={12}>
          <Typography
            variant="h5"
            sx={{
              display: "flex",
              alignItems: "center",
            }}
          >
            <FiberManualRecord
              sx={{
                height: "1rem",
                width: "1rem",
                mr: 1,
                color: getPowerStateColor(powerStateData?.powerState.State),
              }}
              titleAccess={getPowerStateString(
                powerStateData?.powerState.State
              )}
            />
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
          md={8}
          xs={12}
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: {
              sm: "flex-start",
              md: "flex-end",
            },
          }}
        >
          <ButtonGroup variant="contained">
            <Button
              size="small"
              startIcon={<TerminalTwoTone />}
              onClick={() => setFullscreenConsole(!fullscreenConsole)}
              color="secondary"
              sx={VmButtonStyles}
            >
              Fullscreen
            </Button>
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
              disabled={isVmLocked()}
              sx={VmButtonStyles}
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
              disabled={isVmLocked()}
              sx={VmButtonStyles}
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
              disabled={isVmLocked()}
              sx={VmButtonStyles}
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
              disabled={isVmLocked()}
              sx={VmButtonStyles}
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
              disabled={isVmLocked()}
            >
              <ArrowDropDown />
            </Button>
          </ButtonGroup>
          <Popper
            open={Boolean(rebootTypeMenuAnchor)}
            anchorEl={rebootTypeMenuAnchor}
            role={undefined}
            transition
            disablePortal
            nonce={1}
            onResize
            onResizeCapture
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
                  <ClickAwayListener
                    onClickAway={() => handleToggleRebootTypeMenu(null)}
                  >
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
      {shouldShowConsole() ? (
        !getVmConsoleLoading && consoleUrl ? (
          <iframe
            id="console"
            title="console"
            src={consoleUrl}
            style={{
              width: "100%",
              height: "calc(100vh - 10rem)",
            }}
          />
        ) : (
          <Skeleton width="100%" height="800px" />
        )
      ) : (
        <Paper
          elevation={2}
          sx={{
            width: "100%",
            height: "calc(100vh - 10rem)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexDirection: "column",
          }}
        >
          {isVmLocked() ? (
            <>
              <LockTwoTone />
              <Typography variant="subtitle1">VM is Locked</Typography>
            </>
          ) : (
            <>
              {getPowerStateIcon(powerStateData?.powerState.State)}
              <Typography variant="subtitle1">
                {getPowerStateString(powerStateData?.powerState.State)}
              </Typography>
            </>
          )}
        </Paper>
      )}
      <Box
        sx={{
          opacity: fullscreenConsole ? "100%" : 0,
          position: "absolute",
          pointerEvents: "none",
          top: 0,
          left: 0,
          width: "100vw",
          height: "100vh",
          background: "rgba(0,0,0,0.75)",
          transition: "all 0.5s ease-in-out",
          zIndex: 1302,
        }}
      ></Box>
      <Box
        sx={{
          top: fullscreenConsole ? 0 : "100vh",
          width: "100vw",
          height: fullscreenConsole ? "100vh" : 0,
          left: 0,
          position: "absolute",
          transition: "all 0.3s ease-in-out",
          overflow: "hidden",
          zIndex: 1303,
        }}
      >
        <Paper
          elevation={2}
          sx={{
            width: "100%",
            height: "100%",
            padding: 1,
          }}
        >
          <Grid
            container
            spacing={1}
            direction="column"
            sx={{
              height: "100%",
            }}
          >
            {/* VM Metadata */}
            <Grid
              item
              container
              spacing={2}
              md={"auto"}
              xs={4}
              sx={{ width: "100%" }}
            >
              {/* VM Name/IP */}
              <Grid
                item
                md={4}
                xs={12}
                sx={{
                  padding: 1,
                  boxSizing: "border-box",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <Typography
                  variant="h5"
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    mr: 2,
                  }}
                >
                  <FiberManualRecord
                    sx={{
                      height: "1rem",
                      width: "1rem",
                      mr: 1,
                      color: getPowerStateColor(
                        powerStateData?.powerState.State
                      ),
                    }}
                    titleAccess={getPowerStateString(
                      powerStateData?.powerState.State
                    )}
                  />
                  {getVmObjectLoading || !getVmObjectData ? (
                    <Skeleton />
                  ) : (
                    getVmObjectData.vmObject.Name
                  )}
                </Typography>
                {getVmObjectLoading || !getVmObjectData ? (
                  <Skeleton />
                ) : (
                  <Typography
                    variant="caption"
                    component="code"
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      flexShrink: 1,
                    }}
                  >
                    {getVmObjectData.vmObject.IPAddresses?.join(", ") ??
                      "No IP Addresses Found"}
                  </Typography>
                )}
              </Grid>
              {/* VM Controls */}
              <Grid
                item
                md={8}
                xs={12}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "flex-end",
                  flexShrink: 0,
                  flexGrow: 0,
                }}
              >
                <ButtonGroup variant="contained">
                  <Button
                    size="small"
                    startIcon={<TerminalTwoTone />}
                    onClick={() => setFullscreenConsole(!fullscreenConsole)}
                    color="secondary"
                    sx={VmButtonStyles}
                  >
                    Exit
                  </Button>
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
                    disabled={isVmLocked()}
                    sx={VmButtonStyles}
                  >
                    Refresh Console
                  </LoadingButton>
                  <LoadingButton
                    color="error"
                    size="small"
                    variant="contained"
                    startIcon={<PowerOff />}
                    loading={
                      rebootVmLoading || powerOnVmLoading || powerOffVmLoading
                    }
                    loadingPosition="start"
                    onClick={handlePowerOffClick}
                    disabled={isVmLocked()}
                    sx={VmButtonStyles}
                  >
                    Shutdown
                  </LoadingButton>
                  <LoadingButton
                    color="success"
                    size="small"
                    variant="contained"
                    startIcon={<PowerSettingsNew />}
                    loading={
                      rebootVmLoading || powerOnVmLoading || powerOffVmLoading
                    }
                    loadingPosition="start"
                    onClick={handlePowerOnClick}
                    disabled={isVmLocked()}
                    sx={VmButtonStyles}
                  >
                    Power On
                  </LoadingButton>
                  <LoadingButton
                    color="warning"
                    size="small"
                    variant="contained"
                    startIcon={<RestartAlt />}
                    loading={
                      rebootVmLoading || powerOnVmLoading || powerOffVmLoading
                    }
                    loadingPosition="start"
                    onClick={handleRebootClick}
                    disabled={isVmLocked()}
                    sx={VmButtonStyles}
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
                    disabled={isVmLocked()}
                  >
                    <ArrowDropDown />
                  </Button>
                </ButtonGroup>
                <Popper
                  open={Boolean(rebootTypeMenuAnchor)}
                  anchorEl={rebootTypeMenuAnchor}
                  role={undefined}
                  transition
                  disablePortal
                  nonce={1}
                  onResize
                  onResizeCapture
                >
                  {({ TransitionProps, placement }) => (
                    <Grow
                      {...TransitionProps}
                      style={{
                        transformOrigin:
                          placement === "bottom"
                            ? "center top"
                            : "center bottom",
                      }}
                    >
                      <Paper>
                        <ClickAwayListener
                          onClickAway={() => handleToggleRebootTypeMenu(null)}
                        >
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
            {/* VM Console */}
            <Grid item md={true} xs={8} sx={{ width: "100%", padding: 0 }}>
              {shouldShowConsole() ? (
                fullscreenConsole && !getVmConsoleLoading && consoleUrl ? (
                  <iframe
                    id="console"
                    title="console"
                    src={consoleUrl}
                    style={{
                      position: "relative",
                      width: "100%",
                      height: "100%",
                    }}
                  />
                ) : (
                  <Skeleton width="100%" height="100%" />
                )
              ) : (
                <Paper
                  elevation={6}
                  sx={{
                    width: "100%",
                    height: "100%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexDirection: "column",
                  }}
                >
                  {isVmLocked() ? (
                    <>
                      <LockTwoTone />
                      <Typography variant="subtitle1">VM is Locked</Typography>
                    </>
                  ) : (
                    <>
                      {getPowerStateIcon(powerStateData?.powerState.State)}
                      <Typography variant="subtitle1">
                        {getPowerStateString(powerStateData?.powerState.State)}
                      </Typography>
                    </>
                  )}
                </Paper>
              )}
            </Grid>
          </Grid>
        </Paper>
      </Box>
    </Container>
  );
};
