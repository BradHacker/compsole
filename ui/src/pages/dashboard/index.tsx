import { Terminal } from "@mui/icons-material";
import {
  Autocomplete,
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
  Team,
  useAllVmObjectsLazyQuery,
  useGetCompTeamSearchValuesLazyQuery,
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
  const { enqueueSnackbar } = useSnackbar();
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
  let [
    getSearchValues,
    {
      data: getSearchValuesData,
      loading: getSearchValuesLoading,
      error: getSearchValuesError,
    },
  ] = useGetCompTeamSearchValuesLazyQuery();
  const [teamFilter, setTeamFilter] = React.useState<Team | null>(null);
  const [filteredVmObjects, setFilteredVmObjects] = React.useState<
    MyVmObjectsQuery["myVmObjects"] | AllVmObjectsQuery["vmObjects"]
  >([]);

  useEffect(() => {
    if (user.Role == Role.User) getMyVmObjects();
    else if (user.Role == Role.Admin) {
      getAllVmObjects();
      getSearchValues();
    }
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

  useEffect(() => {
    if (myVmObjectsData?.myVmObjects || allVmObjectsData?.vmObjects) {
      if (teamFilter) {
        setFilteredVmObjects([
          ...(
            myVmObjectsData?.myVmObjects ||
            allVmObjectsData?.vmObjects ||
            []
          ).filter((vm) => (vm.VmObjectToTeam?.ID ?? "") === teamFilter.ID),
        ]);
      } else {
        setFilteredVmObjects([
          ...(myVmObjectsData?.myVmObjects ||
            allVmObjectsData?.vmObjects ||
            []),
        ]);
      }
    }
  }, [teamFilter, myVmObjectsData, allVmObjectsData]);

  return (
    <Container
      component="main"
      sx={{
        p: 2,
      }}
    >
      <Stack spacing={2}>
        {user && user.Role === Role.Admin && (
          <Autocomplete
            options={getSearchValuesData?.teams ?? []}
            groupBy={(t) => t.TeamToCompetition?.Name ?? "N/A"}
            getOptionLabel={(t) =>
              `${t.TeamToCompetition.Name} - ${
                t.Name || `Team ${t.TeamNumber}`
              }`
            }
            renderInput={(params) => (
              <TextField {...params} label="With categories" />
            )}
            onChange={(event, value) => {
              setTeamFilter(value as Team);
            }}
          />
        )}
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
            {filteredVmObjects.map((vmObject) => (
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
