import { Terminal } from "@mui/icons-material";
import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  Chip,
  Container,
  Divider,
  Grid,
  IconButton,
  Skeleton,
  Stack,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import { useSnackbar } from "notistack";
import React, { useContext, useEffect } from "react";
import {
  AllVmObjectsQuery,
  MyVmObjectsQuery,
  MyVmObjectsQueryResult,
  Role,
  useAllVmObjectsLazyQuery,
  useMyVmObjectsLazyQuery,
  useMyVmObjectsQuery,
  VmObject,
} from "../../api/generated/graphql";
import { UserContext } from "../../user-context";

const VmCard: React.FC<{
  vmObject?:
    | MyVmObjectsQuery["myVmObjects"][0]
    | AllVmObjectsQuery["vmObjects"][0];
  isAdmin?: boolean;
}> = ({ vmObject, isAdmin }): React.ReactElement => {
  return (
    <Card>
      <CardContent>
        <Typography variant="subtitle1" gutterBottom>
          {vmObject?.Name ?? <Skeleton />}
        </Typography>
        {isAdmin && (
          <Stack
            direction="row"
            spacing={1}
            sx={{
              mb: 1,
            }}
          >
            <Chip
              label={
                (vmObject as AllVmObjectsQuery["vmObjects"][0]).VmObjectToTeam
                  ?.Name ||
                `Team ${
                  (vmObject as AllVmObjectsQuery["vmObjects"][0]).VmObjectToTeam
                    ?.TeamNumber
                }`
              }
              color="primary"
              size="small"
            />
            <Chip
              label={
                (vmObject as AllVmObjectsQuery["vmObjects"][0]).VmObjectToTeam
                  ?.TeamToCompetition.Name || "default"
              }
              color="secondary"
              size="small"
            />
          </Stack>
        )}
        <Typography color="text.secondary">
          {vmObject?.IPAddresses?.join(", ") ?? <Skeleton />}
        </Typography>
      </CardContent>
      <CardActions>
        <Tooltip title="Console">
          <IconButton
            aria-label="Console"
            href={`/console/${vmObject?.ID ?? "undefined"}`}
          >
            <Terminal />
          </IconButton>
        </Tooltip>
      </CardActions>
    </Card>
  );
};

export const Dashboard: React.FC = (): React.ReactElement => {
  let user = useContext(UserContext);
  let [
    getMyVmObjects,
    {
      data: myVmObjectsData,
      loading: myVmObjectsLoading,
      error: myVmObjectsError,
    },
  ] = useMyVmObjectsLazyQuery();
  let [
    getAllVmObjects,
    {
      data: allVmObjectsData,
      loading: allVmObjectsLoading,
      error: allVmObjectsError,
    },
  ] = useAllVmObjectsLazyQuery();
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    if (user.Role == Role.User) getMyVmObjects();
    else if (user.Role == Role.Admin) getAllVmObjects();
  }, [user]);

  useEffect(() => {
    if (myVmObjectsError || allVmObjectsError)
      enqueueSnackbar(
        (myVmObjectsError || allVmObjectsError)?.message ??
          "Unknown error occurred",
        {
          variant: "error",
        }
      );
  }, [myVmObjectsError, allVmObjectsError]);

  return (
    <Container
      component="main"
      sx={{
        p: 2,
      }}
    >
      <Stack spacing={2}>
        <TextField id="outlined-basic" label="Outlined" variant="outlined" />
        {myVmObjectsLoading ||
        allVmObjectsLoading ||
        myVmObjectsError ||
        allVmObjectsError ? (
          <Grid container spacing={2}>
            <Grid item xs={4}>
              <VmCard />
            </Grid>
          </Grid>
        ) : (
          <Grid container spacing={2}>
            {(
              myVmObjectsData?.myVmObjects ||
              allVmObjectsData?.vmObjects ||
              []
            ).map((vmObject) => (
              <Grid item key={vmObject.ID} xs={4}>
                <VmCard
                  vmObject={vmObject}
                  isAdmin={user.Role === Role.Admin}
                />
              </Grid>
            ))}
          </Grid>
        )}
      </Stack>
    </Container>
  );
};
