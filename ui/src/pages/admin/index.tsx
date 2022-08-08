import {
  InfoTwoTone,
  Add,
  LoopTwoTone,
  EditTwoTone,
} from "@mui/icons-material";
import {
  Box,
  Button,
  ButtonGroup,
  Chip,
  CircularProgress,
  Container,
  Fab,
  Paper,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tabs,
  Typography,
} from "@mui/material";
import { useSnackbar } from "notistack";
import React, { useContext, useEffect } from "react";
import { Outlet } from "react-router-dom";
import {
  Role,
  useGetUsersQuery,
  useGetCompetitionsQuery,
  User,
  Competition,
  GetCompetitionsQuery,
  GetUsersQuery,
  useGetTeamsQuery,
  GetTeamsQuery,
  AllVmObjectsQuery,
  useAllVmObjectsQuery,
} from "../../api/generated/graphql";
import { UserContext } from "../../user-context";

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

const createUserData = (
  user: GetUsersQuery["users"][0]
): {
  id: string;
  username: string;
  name: string;
  provider: string;
  role: Role;
  assignment: string;
} => {
  return {
    id: user.ID,
    username: user.Username,
    name: `${user.FirstName} ${user.LastName}`,
    provider: user.Provider,
    role: user.Role,
    assignment: `${
      user.UserToTeam?.TeamNumber || user.UserToTeam?.Name || ""
    } ${user.UserToTeam?.TeamToCompetition.Name || ""}`,
  };
};

const createCompetitionData = (
  competition: GetCompetitionsQuery["competitions"][0]
): {
  id: string;
  name: string;
  providerType: string;
  teamCount: number;
} => {
  return {
    id: competition.ID,
    name: competition.Name,
    providerType: competition.ProviderType,
    teamCount: competition.CompetitionToTeams.length,
  };
};

const createTeamData = (
  team: GetTeamsQuery["teams"][0]
): {
  id: string;
  number: number;
  teamName?: string | null;
  competitionName: string;
} => {
  return {
    id: team.ID,
    number: team.TeamNumber,
    teamName: team.Name,
    competitionName: team.TeamToCompetition.Name,
  };
};

const createVmObjectData = (
  vmObject: AllVmObjectsQuery["vmObjects"][0]
): {
  id: AllVmObjectsQuery["vmObjects"][0]["ID"];
  name: AllVmObjectsQuery["vmObjects"][0]["Name"];
  identifier: AllVmObjectsQuery["vmObjects"][0]["Identifier"];
  ipAddresses: AllVmObjectsQuery["vmObjects"][0]["IPAddresses"];
  team: AllVmObjectsQuery["vmObjects"][0]["VmObjectToTeam"];
} => {
  return {
    id: vmObject.ID,
    name: vmObject.Name,
    identifier: vmObject.Identifier,
    ipAddresses: vmObject.IPAddresses,
    team: vmObject.VmObjectToTeam,
  };
};

export const AdminProtected: React.FC = (): React.ReactElement => {
  const [selectedTab, setSelectedTab] = React.useState(0);
  const {
    data: getUsersData,
    loading: getUsersLoading,
    error: getUsersError,
  } = useGetUsersQuery();
  const {
    data: getCompetitionsData,
    loading: getCompetitionsLoading,
    error: getCompetitionsError,
  } = useGetCompetitionsQuery();
  const {
    data: getTeamsData,
    loading: getTeamsLoading,
    error: getTeamsError,
  } = useGetTeamsQuery();
  const {
    data: allVmObjectsData,
    loading: allVmObjectsLoading,
    error: allVmObjectsError,
  } = useAllVmObjectsQuery();
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    if (getUsersError)
      enqueueSnackbar(`Couldn't get users: ${getUsersError.message}`, {
        variant: "error",
      });
    if (getCompetitionsError)
      enqueueSnackbar(
        `Couldn't get competitions: ${getCompetitionsError.message}`,
        {
          variant: "error",
        }
      );
    if (getTeamsError)
      enqueueSnackbar(`Couldn't get teams: ${getTeamsError.message}`, {
        variant: "error",
      });
  }, [getUsersError, getCompetitionsError, getTeamsError]);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setSelectedTab(newValue);
  };
  return (
    <Container
      component="main"
      sx={{
        p: 2,
      }}
    >
      <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
        <Tabs
          value={selectedTab}
          onChange={handleChange}
          aria-label="admin pages"
        >
          <Tab label="Users" />
          <Tab label="Competitions" />
          <Tab label="Teams" />
          <Tab label="VM Objects" />
        </Tabs>
      </Box>
      <TabPanel value={selectedTab} index={0}>
        <TableContainer component={Paper}>
          <Table sx={{ width: "100%" }} aria-label="users table">
            <TableHead>
              <TableRow>
                <TableCell align="left">ID</TableCell>
                <TableCell align="center">Username</TableCell>
                <TableCell align="center">Name</TableCell>
                <TableCell align="center">Provider</TableCell>
                <TableCell align="center">Role</TableCell>
                <TableCell align="center">Assignment</TableCell>
                <TableCell align="right">Controls</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {getUsersData?.users.map(createUserData).map((row) => (
                <TableRow
                  key={row.id}
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                >
                  <TableCell component="th" scope="row">
                    {row.id}
                  </TableCell>
                  <TableCell align="center">{row.username}</TableCell>
                  <TableCell align="center">{row.name}</TableCell>
                  <TableCell align="center">
                    <Chip label={row.provider} color="info" size="small" />
                  </TableCell>
                  <TableCell align="center">
                    <Chip
                      label={row.role}
                      color={row.role === Role.Admin ? "error" : "warning"}
                      size="small"
                    />
                  </TableCell>
                  <TableCell align="center">{row.assignment}</TableCell>
                  <TableCell align="right">
                    <ButtonGroup size="small">
                      <Button
                        variant="outlined"
                        color="secondary"
                        href={`/admin/user/${row.id}`}
                      >
                        <EditTwoTone />
                      </Button>
                    </ButtonGroup>
                  </TableCell>
                </TableRow>
              )) ?? (
                <TableCell colSpan={5} sx={{ textAlign: "center" }}>
                  No Users Found
                </TableCell>
              )}
              {getUsersLoading && (
                <TableCell colSpan={5} sx={{ textAlign: "center" }}>
                  <CircularProgress />
                </TableCell>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </TabPanel>
      <TabPanel value={selectedTab} index={1}>
        <TableContainer component={Paper}>
          <Table sx={{ width: "100%" }} aria-label="competitions table">
            <TableHead>
              <TableRow>
                <TableCell align="left">ID</TableCell>
                <TableCell align="center">Name</TableCell>
                <TableCell align="center">Team Count</TableCell>
                <TableCell align="center">Provider</TableCell>
                <TableCell align="right">Controls</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {getCompetitionsData?.competitions
                .map(createCompetitionData)
                .map((row) => (
                  <TableRow
                    key={row.id}
                    sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                  >
                    <TableCell component="th" scope="row">
                      {row.id}
                    </TableCell>
                    <TableCell align="center">
                      <Chip label={row.name} color="secondary" size="small" />
                    </TableCell>
                    <TableCell align="center">{row.teamCount}</TableCell>
                    <TableCell align="center">
                      <Chip
                        label={row.providerType}
                        color="warning"
                        size="small"
                      />
                    </TableCell>
                    <TableCell align="right">
                      <ButtonGroup size="small">
                        <Button variant="outlined" color="primary">
                          <InfoTwoTone />
                        </Button>
                      </ButtonGroup>
                    </TableCell>
                  </TableRow>
                )) ?? (
                <TableCell colSpan={5} sx={{ textAlign: "center" }}>
                  No Competitions Found
                </TableCell>
              )}
              {getCompetitionsLoading && (
                <TableCell colSpan={5} sx={{ textAlign: "center" }}>
                  <CircularProgress />
                </TableCell>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </TabPanel>
      <TabPanel value={selectedTab} index={2}>
        <TableContainer component={Paper}>
          <Table sx={{ width: "100%" }} aria-label="teams table">
            <TableHead>
              <TableRow>
                <TableCell align="left">ID</TableCell>
                <TableCell align="center">Competition Name</TableCell>
                <TableCell align="center">Team Number</TableCell>
                <TableCell align="center">Team Name</TableCell>
                <TableCell align="right">Controls</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {getTeamsData?.teams.map(createTeamData).map((row) => (
                <TableRow
                  key={row.id}
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                >
                  <TableCell component="th" scope="row">
                    {row.id}
                  </TableCell>
                  <TableCell align="center">
                    <Chip
                      label={row.competitionName}
                      color="secondary"
                      size="small"
                    />
                  </TableCell>
                  <TableCell align="center">{row.number}</TableCell>
                  <TableCell align="center">
                    <Chip label={row.teamName} color="primary" size="small" />
                  </TableCell>
                  <TableCell align="right">
                    <ButtonGroup size="small">
                      <Button variant="outlined" color="primary">
                        <InfoTwoTone />
                      </Button>
                    </ButtonGroup>
                  </TableCell>
                </TableRow>
              )) ?? (
                <TableCell colSpan={5} sx={{ textAlign: "center" }}>
                  No Teams Found
                </TableCell>
              )}
              {getTeamsLoading && (
                <TableCell colSpan={5} sx={{ textAlign: "center" }}>
                  <CircularProgress />
                </TableCell>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </TabPanel>
      <TabPanel value={selectedTab} index={3}>
        <TableContainer component={Paper}>
          <Table sx={{ width: "100%" }} aria-label="vm objects table">
            <TableHead>
              <TableRow>
                <TableCell align="left">ID</TableCell>
                <TableCell align="center">Name</TableCell>
                <TableCell align="center">Identifier</TableCell>
                <TableCell align="center">IP Addresses</TableCell>
                <TableCell align="center">Team</TableCell>
                <TableCell align="center">Competition</TableCell>
                <TableCell align="right">Controls</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {allVmObjectsData?.vmObjects
                .map(createVmObjectData)
                .map((row) => (
                  <TableRow
                    key={row.id}
                    sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                  >
                    <TableCell component="th" scope="row">
                      {row.id}
                    </TableCell>
                    <TableCell align="center">{row.name}</TableCell>
                    <TableCell align="center">{row.identifier}</TableCell>
                    <TableCell align="center">
                      <Box
                        sx={{
                          display: "flex",
                          flexDirection: "column",
                        }}
                      >
                        {row.ipAddresses.map((ip) => (
                          <Typography
                            key={ip}
                            variant="caption"
                            component="code"
                            sx={{
                              mb: 1,
                            }}
                          >
                            {ip}
                          </Typography>
                        ))}
                      </Box>
                    </TableCell>
                    <TableCell align="center">
                      <Chip
                        label={
                          row.team
                            ? row.team.Name || `Team ${row.team?.TeamNumber}`
                            : "N/A"
                        }
                        color={row.team ? "primary" : "default"}
                        size="small"
                      />
                    </TableCell>
                    <TableCell align="center">
                      <Chip
                        label={
                          row.team ? row.team.TeamToCompetition.Name : "N/A"
                        }
                        color={row.team ? "secondary" : "default"}
                        size="small"
                      />
                    </TableCell>
                    <TableCell align="right">
                      <ButtonGroup size="small">
                        <Button variant="outlined" color="primary">
                          <InfoTwoTone />
                        </Button>
                      </ButtonGroup>
                    </TableCell>
                  </TableRow>
                )) ?? (
                <TableCell colSpan={5} sx={{ textAlign: "center" }}>
                  No Teams Found
                </TableCell>
              )}
              {getTeamsLoading && (
                <TableCell colSpan={5} sx={{ textAlign: "center" }}>
                  <CircularProgress />
                </TableCell>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </TabPanel>
      <Fab
        sx={{
          position: "absolute",
          bottom: 24,
          right: 24,
        }}
        color="secondary"
        aria-label="add"
        href="/admin/user/new"
      >
        <Add />
      </Fab>
    </Container>
  );
};

export const Admin: React.FC = (): React.ReactElement => {
  const user = useContext(UserContext);
  return (
    <React.Fragment>
      {user && user.Role == Role.Admin ? (
        <Outlet />
      ) : (
        <Container
          component="main"
          sx={{
            p: 2,
            display: "flex",
            alignItems: "center",
            flexDirection: "column",
          }}
        >
          <Typography variant="body1">
            You are not authorized to view this page.
          </Typography>
        </Container>
      )}
    </React.Fragment>
  );
};
