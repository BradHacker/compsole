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
  Typography,
} from "@mui/material";
import { LoadingButton } from "@mui/lab";
import { useSnackbar } from "notistack";
import React, { useContext, useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import {
  ConsoleType,
  PowerState,
  RebootType,
  Role,
  useGetVmConsoleLazyQuery,
  useGetVmObjectLazyQuery,
  useGetVmPowerStateLazyQuery,
  useLockoutSubscription,
  usePowerOffVmMutation,
  usePowerOnVmMutation,
  useRebootVmMutation,
} from "../../api/generated/graphql";
import { UserContext } from "../../user-context";
import { Box } from "@mui/system";

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
  let [
    getVmPowerState,
    {
      data: getVmPowerStateData,
      loading: getVmPowerStateLoading,
      error: getVmPowerStateError,
      refetch: refetchGetVmPowerState,
    },
  ] = useGetVmPowerStateLazyQuery({
    pollInterval: 2500,
    fetchPolicy: "no-cache",
  });
  let { data: lockoutData, error: lockoutError } = useLockoutSubscription({
    variables: {
      vmObjectId: id || "",
    },
  });
  const { enqueueSnackbar } = useSnackbar();
  let [consoleUrl, setConsoleUrl] = useState<string>("");
  let [powerState, setPowerState] = useState<PowerState>(PowerState.Unknown);
  const [consoleType, _setConsoleType] = useState<ConsoleType>(
    ConsoleType.Novnc
  );
  const [fullscreenConsole, setFullscreenConsole] = useState<boolean>(false);
  const [rebootTypeMenuOpen, setRebootTypeMenuOpen] = useState(false);
  const rebootTypeMenuAnchorRef = useRef<HTMLButtonElement>(null);
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

  const getPowerStateString = (powerState: PowerState | undefined): string => {
    if (getVmPowerStateLoading) return "Loading VM State...";
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
    if (getVmPowerStateLoading) return <SyncTwoTone />;
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

  const getPowerStateColor = (
    powerState: PowerState | undefined
  ):
    | "error"
    | "success"
    | "warning"
    | "info"
    | "disabled"
    | "action"
    | "inherit"
    | "primary"
    | "secondary"
    | undefined => {
    switch (powerState) {
      case PowerState.PoweredOff:
        return "disabled";
      case PowerState.PoweredOn:
        return "success";
      case PowerState.Rebooting:
        return "info";
      case PowerState.ShuttingDown:
        return "warning";
      case PowerState.Suspended:
        return "disabled";
      default:
        return undefined;
    }
  };

  const shouldShowConsole = (): boolean => {
    // If the vm is locked
    if (getVmObjectData?.vmObject.Locked || lockoutData?.lockout.Locked)
      return false;
    // If the vm is not powered on
    if (getVmPowerStateData?.powerState !== PowerState.PoweredOn) return false;
    return true;
  };

  useEffect(() => {
    if (id) {
      getVmObject({
        variables: {
          vmObjectId: id,
        },
      });
      getVmPowerState({
        variables: {
          vmObjectId: id,
        },
      });
    }
  }, [id, getVmObject, getVmPowerState]);

  useEffect(() => {
    if (
      getVmObjectData?.vmObject.ID &&
      (!getVmObjectData.vmObject.Locked || user.Role === Role.Admin)
    ) {
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
  }, [
    getVmObjectError,
    getVmConsoleError,
    rebootVmError,
    powerOnVmError,
    powerOffVmError,
    lockoutError,
    enqueueSnackbar,
  ]);

  useEffect(() => {
    if (rebootVmData?.reboot)
      enqueueSnackbar("Rebooted VM.", {
        variant: "success",
      });
    if (powerOffVmData?.powerOff)
      enqueueSnackbar("Powered Off VM.", {
        variant: "success",
      });
    if (powerOnVmData?.powerOn)
      enqueueSnackbar("Powered On VM.", {
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
    if (getVmPowerStateData) setPowerState(getVmPowerStateData.powerState);
  }, [getVmConsoleData, getVmPowerStateData]);

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
          <Typography
            variant="h5"
            sx={{
              display: "flex",
              alignItems: "center",
            }}
          >
            <FiberManualRecord
              sx={{ height: "1rem", width: "1rem", mr: 1 }}
              color={getPowerStateColor(powerState)}
              titleAccess={getPowerStateString(powerState)}
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
          xs={8}
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "flex-end",
          }}
        >
          <ButtonGroup variant="contained">
            <Button
              size="small"
              startIcon={<TerminalTwoTone />}
              onClick={() => setFullscreenConsole(!fullscreenConsole)}
              color="secondary"
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
              disabled={
                !(user.Role === Role.Admin) &&
                (lockoutData?.lockout.Locked ||
                  getVmObjectData?.vmObject.Locked ||
                  false)
              }
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
              disabled={
                !(user.Role === Role.Admin) &&
                (lockoutData?.lockout.Locked ||
                  getVmObjectData?.vmObject.Locked ||
                  false)
              }
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
              disabled={
                !(user.Role === Role.Admin) &&
                (lockoutData?.lockout.Locked ||
                  getVmObjectData?.vmObject.Locked ||
                  false)
              }
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
              disabled={
                !(user.Role === Role.Admin) &&
                (lockoutData?.lockout.Locked ||
                  getVmObjectData?.vmObject.Locked ||
                  false)
              }
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
              disabled={
                !(user.Role === Role.Admin) &&
                (lockoutData?.lockout.Locked ||
                  getVmObjectData?.vmObject.Locked ||
                  false)
              }
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
      {shouldShowConsole() ? (
        !getVmConsoleLoading && consoleUrl ? (
          <iframe
            id="console"
            title="console"
            src={consoleUrl}
            style={{
              width: "100%",
              height: "800px",
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
            height: "800px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexDirection: "column",
          }}
        >
          {lockoutData?.lockout.Locked || getVmObjectData?.vmObject.Locked ? (
            <>
              <LockTwoTone />
              <Typography variant="subtitle1">VM is Locked</Typography>
            </>
          ) : (
            <>
              {getPowerStateIcon(powerState)}
              <Typography variant="subtitle1">
                {getPowerStateString(powerState)}
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
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexDirection: "column",
          }}
        >
          <Box
            sx={{
              height: "3rem",
              width: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "flex-end",
              paddingX: 1,
            }}
          >
            <ButtonGroup variant="contained">
              <Button
                size="small"
                startIcon={<TerminalTwoTone />}
                onClick={() => setFullscreenConsole(!fullscreenConsole)}
                color="secondary"
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
                disabled={
                  !(user.Role === Role.Admin) &&
                  (lockoutData?.lockout.Locked ||
                    getVmObjectData?.vmObject.Locked ||
                    false)
                }
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
                disabled={
                  !(user.Role === Role.Admin) &&
                  (lockoutData?.lockout.Locked ||
                    getVmObjectData?.vmObject.Locked ||
                    false)
                }
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
                disabled={
                  !(user.Role === Role.Admin) &&
                  (lockoutData?.lockout.Locked ||
                    getVmObjectData?.vmObject.Locked ||
                    false)
                }
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
                ref={rebootTypeMenuAnchorRef}
                disabled={
                  !(user.Role === Role.Admin) &&
                  (lockoutData?.lockout.Locked ||
                    getVmObjectData?.vmObject.Locked ||
                    false)
                }
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
                disabled={
                  !(user.Role === Role.Admin) &&
                  (lockoutData?.lockout.Locked ||
                    getVmObjectData?.vmObject.Locked ||
                    false)
                }
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
          </Box>
          <Box
            sx={{
              height: "calc(100% - 3rem)",
              width: "100%",
            }}
          >
            {fullscreenConsole && !getVmConsoleLoading && consoleUrl ? (
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
              <Skeleton width="100%" height="800px" />
            )}
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};
