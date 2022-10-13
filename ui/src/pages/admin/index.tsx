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
import { Outlet, useNavigate } from "react-router-dom";
import {
  Role,
  AllVmObjectsQuery,
  useAllVmObjectsQuery,
  useListUsersQuery,
  useListCompetitionsQuery,
  useListTeamsQuery,
  ListTeamsQuery,
  ListCompetitionsQuery,
  ListUsersQuery,
  ListProvidersQuery,
  useListProvidersQuery,
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
  user: ListUsersQuery["users"][0]
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
  competition: ListCompetitionsQuery["competitions"][0]
): {
  id: string;
  name: string;
  providerType: string;
  teamCount: number;
} => {
  return {
    id: competition.ID,
    name: competition.Name,
    providerType: `${
      competition.CompetitionToProvider.Name
    } (${competition.CompetitionToProvider.Type.toLocaleUpperCase()})`,
    teamCount: competition.CompetitionToTeams.length,
  };
};

const createTeamData = (
  team: ListTeamsQuery["teams"][0]
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

const createProviderData = (
  provider: ListProvidersQuery["providers"][0]
): {
  id: ListProvidersQuery["providers"][0]["ID"];
  name: ListProvidersQuery["providers"][0]["Name"];
  type: ListProvidersQuery["providers"][0]["Type"];
} => {
  return {
    id: provider.ID,
    name: provider.Name,
    type: provider.Type,
  };
};

export const AdminProtected: React.FC = (): React.ReactElement => {
  const [selectedTab, setSelectedTab] = React.useState(0);
  const {
    data: listUsersData,
    loading: listUsersLoading,
    error: listUsersError,
  } = useListUsersQuery();
  const {
    data: listCompetitionsData,
    loading: listCompetitionsLoading,
    error: listCompetitionsError,
  } = useListCompetitionsQuery();
  const {
    data: listTeamsData,
    loading: listTeamsLoading,
    error: listTeamsError,
  } = useListTeamsQuery();
  const {
    data: allVmObjectsData,
    loading: allVmObjectsLoading,
    error: allVmObjectsError,
  } = useAllVmObjectsQuery();
  const {
    data: listProvidersData,
    loading: listProvidersLoading,
    error: listProvidersError,
  } = useListProvidersQuery();
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();

  useEffect(() => {
    if (listUsersError)
      enqueueSnackbar(`Couldn't get users: ${listUsersError.message}`, {
        variant: "error",
      });
    if (listCompetitionsError)
      enqueueSnackbar(
        `Couldn't get competitions: ${listCompetitionsError.message}`,
        {
          variant: "error",
        }
      );
    if (listTeamsError)
      enqueueSnackbar(`Couldn't get teams: ${listTeamsError.message}`, {
        variant: "error",
      });
    if (allVmObjectsError)
      enqueueSnackbar(`Couldn't get vm objects: ${allVmObjectsError.message}`, {
        variant: "error",
      });
    if (listProvidersError)
      enqueueSnackbar(`Couldn't get providers: ${listProvidersError.message}`, {
        variant: "error",
      });
  }, [
    listUsersError,
    listCompetitionsError,
    listTeamsError,
    allVmObjectsError,
    listProvidersError,
  ]);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setSelectedTab(newValue);
  };

  const addObject = () => {
    switch (selectedTab) {
      case 0:
        navigate("/admin/user/new");
        break;
      case 1:
        navigate("/admin/competition/new");
        break;
      case 2:
        navigate("/admin/team/new");
        break;
      case 3:
        navigate("/admin/vm-object/new");
        break;
      case 4:
        navigate("/admin/provider/new");
        break;
      default:
        navigate("/admin");
        break;
    }
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
          onChange={handleTabChange}
          aria-label="admin pages"
        >
          <Tab label="Users" />
          <Tab label="Competitions" />
          <Tab label="Teams" />
          <Tab label="VM Objects" />
          <Tab label="Providers" />
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
              {listUsersData?.users.map(createUserData).map((row) => (
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
              {listUsersLoading && (
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
              {listCompetitionsData?.competitions
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
                        <Button
                          variant="outlined"
                          color="secondary"
                          href={`/admin/competition/${row.id}`}
                        >
                          <EditTwoTone />
                        </Button>
                      </ButtonGroup>
                    </TableCell>
                  </TableRow>
                )) ?? (
                <TableCell colSpan={5} sx={{ textAlign: "center" }}>
                  No Competitions Found
                </TableCell>
              )}
              {listCompetitionsLoading && (
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
              {listTeamsData?.teams.map(createTeamData).map((row) => (
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
                      <Button
                        variant="outlined"
                        color="secondary"
                        href={`/admin/team/${row.id}`}
                      >
                        <EditTwoTone />
                      </Button>
                    </ButtonGroup>
                  </TableCell>
                </TableRow>
              )) ?? (
                <TableCell colSpan={5} sx={{ textAlign: "center" }}>
                  No Teams Found
                </TableCell>
              )}
              {listTeamsLoading && (
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
                        <Button
                          variant="outlined"
                          color="secondary"
                          href={`/admin/vm-object/${row.id}`}
                        >
                          <EditTwoTone />
                        </Button>
                      </ButtonGroup>
                    </TableCell>
                  </TableRow>
                )) ?? (
                <TableCell colSpan={5} sx={{ textAlign: "center" }}>
                  No Vm Objects Found
                </TableCell>
              )}
              {allVmObjectsLoading && (
                <TableCell colSpan={5} sx={{ textAlign: "center" }}>
                  <CircularProgress />
                </TableCell>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </TabPanel>
      <TabPanel value={selectedTab} index={4}>
        <TableContainer component={Paper}>
          <Table sx={{ width: "100%" }} aria-label="providers table">
            <TableHead>
              <TableRow>
                <TableCell align="left">ID</TableCell>
                <TableCell align="center">Name</TableCell>
                <TableCell align="center">Type</TableCell>
                <TableCell align="right">Controls</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {listProvidersData?.providers
                .map(createProviderData)
                .map((row) => (
                  <TableRow
                    key={row.id}
                    sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                  >
                    <TableCell component="th" scope="row">
                      {row.id}
                    </TableCell>
                    <TableCell align="center">{row.name}</TableCell>
                    <TableCell align="center">
                      <Chip label={row.type} color="warning" size="small" />
                    </TableCell>
                    <TableCell align="right">
                      <ButtonGroup size="small">
                        <Button
                          variant="outlined"
                          color="secondary"
                          href={`/admin/provider/${row.id}`}
                        >
                          <EditTwoTone />
                        </Button>
                      </ButtonGroup>
                    </TableCell>
                  </TableRow>
                )) ?? (
                <TableCell colSpan={5} sx={{ textAlign: "center" }}>
                  No Providers Found
                </TableCell>
              )}
              {listProvidersLoading && (
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
        onClick={addObject}
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
