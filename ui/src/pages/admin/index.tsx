import {
  Add,
  DeleteTwoTone,
  Person,
  Stadium,
  Group,
  Laptop,
  Link,
  ImportExport,
  Factory,
  Lock,
} from "@mui/icons-material";
import {
  Box,
  Button,
  Container,
  Divider,
  Drawer,
  Fab,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Modal,
  TextField,
  Toolbar,
  Typography,
} from "@mui/material";
import React, { useContext, useEffect, useState } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { Role } from "../../api/generated/graphql";
import { UserContext } from "../../user-context";
import { IngestVMs } from "../../components/ingest-vms";
import { UserList } from "../../components/user-list";
import { CompetitionList } from "../../components/competition-list";
import { TeamList } from "../../components/team-list";
import { VmObjectList } from "../../components/vm-object-list/index";
import { ProviderList } from "../../components/provider-list";
import { GenerateUsers } from "../../components/generate-users";
import { LockoutForm } from "../../components/lockout-form";

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

interface DeleteObjectModalProps {
  objectName: string;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: () => void;
}

const DeleteObjectModal: React.FC<DeleteObjectModalProps> = ({
  objectName,
  isOpen,
  onClose,
  onSubmit,
}): React.ReactElement => {
  const [inputName, setInputName] = useState<string>("");
  const [isValid, setIsValid] = useState<boolean>(false);
  const checkObjectName = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputName(e.target.value);
    setIsValid(e.target.value === objectName);
  };

  return (
    <Modal open={isOpen} onClose={onClose}>
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: "50%",
          bgcolor: "#2a273f",
          borderRadius: 2,
          boxShadow: "0 0 2rem #000",
          p: 4,
        }}
      >
        <Typography variant="h6" component="h2">
          Do you want to delete{" "}
          <Typography variant="h6" component="code">
            {objectName}
          </Typography>
          ?
        </Typography>
        <Typography sx={{ my: 2 }}>
          Doing this is a permanent action and cannot be reversed. All objects
          dependent with this one will be deleted. If you wish to do this please
          type <Typography component="code"> {objectName}</Typography> in the
          box below.
        </Typography>
        <TextField
          label="Confirm deletion"
          variant="filled"
          sx={{ width: "100%" }}
          value={inputName}
          onChange={checkObjectName}
        />
        <Button
          type="button"
          variant="contained"
          startIcon={<DeleteTwoTone />}
          sx={{ width: "100%", mt: 2 }}
          disabled={!isValid}
          onClick={() => {
            setInputName("");
            onSubmit();
          }}
        >
          Delete Forever
        </Button>
      </Box>
    </Modal>
  );
};

export const AdminProtected: React.FC = (): React.ReactElement => {
  const [selectedTab, setSelectedTab] = React.useState(0);
  const [deleteModalData, setDeleteModalData] = useState<{
    objectName: string;
    isOpen: boolean;
    onClose: () => void;
    onSubmit: () => void;
  }>({
    objectName: "",
    isOpen: false,
    onClose: () => undefined,
    onSubmit: () => undefined,
  });
  let location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (
      location?.state &&
      (location.state as any).tab &&
      typeof (location.state as any).tab === "number"
    )
      setSelectedTab((location.state as any).tab);
  }, [location, setSelectedTab]);

  const handleTabChange = (newValue: number) => {
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

  const resetDeleteModal = () => {
    setDeleteModalData({
      objectName: "",
      isOpen: false,
      onClose: () => undefined,
      onSubmit: () => undefined,
    });
  };

  return (
    <Box
      sx={{
        display: "flex",
      }}
    >
      <Drawer
        variant="permanent"
        sx={{
          width: 240,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: {
            width: 240,
            boxSizing: "border-box",
          },
        }}
      >
        <Toolbar />
        <Box sx={{ overflow: "auto" }}>
          <List>
            <ListItem disablePadding>
              <ListItemButton
                onClick={() => handleTabChange(0)}
                selected={selectedTab === 0}
              >
                <ListItemIcon>
                  <Person />
                </ListItemIcon>
                <ListItemText primary="Users" />
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding>
              <ListItemButton
                onClick={() => handleTabChange(1)}
                selected={selectedTab === 1}
              >
                <ListItemIcon>
                  <Stadium />
                </ListItemIcon>
                <ListItemText primary="Competitions" />
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding>
              <ListItemButton
                onClick={() => handleTabChange(2)}
                selected={selectedTab === 2}
              >
                <ListItemIcon>
                  <Group />
                </ListItemIcon>
                <ListItemText primary="Teams" />
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding>
              <ListItemButton
                onClick={() => handleTabChange(3)}
                selected={selectedTab === 3}
              >
                <ListItemIcon>
                  <Laptop />
                </ListItemIcon>
                <ListItemText primary="VM Objects" />
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding>
              <ListItemButton
                onClick={() => handleTabChange(4)}
                selected={selectedTab === 4}
              >
                <ListItemIcon>
                  <Link />
                </ListItemIcon>
                <ListItemText primary="Providers" />
              </ListItemButton>
            </ListItem>
          </List>
          <Divider />
          <List>
            <ListItem disablePadding>
              <ListItemButton
                onClick={() => handleTabChange(5)}
                selected={selectedTab === 5}
              >
                <ListItemIcon>
                  <ImportExport />
                </ListItemIcon>
                <ListItemText primary="Ingest VMs" />
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding>
              <ListItemButton
                onClick={() => handleTabChange(6)}
                selected={selectedTab === 6}
              >
                <ListItemIcon>
                  <Factory />
                </ListItemIcon>
                <ListItemText primary="Generate Users" />
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding>
              <ListItemButton
                onClick={() => handleTabChange(7)}
                selected={selectedTab === 7}
              >
                <ListItemIcon>
                  <Lock />
                </ListItemIcon>
                <ListItemText primary="Manage Lockouts" />
              </ListItemButton>
            </ListItem>
          </List>
        </Box>
      </Drawer>
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <TabPanel value={selectedTab} index={0}>
          <UserList
            setDeleteModalData={setDeleteModalData}
            resetDeleteModal={resetDeleteModal}
          />
        </TabPanel>
        <TabPanel value={selectedTab} index={1}>
          <CompetitionList
            setDeleteModalData={setDeleteModalData}
            resetDeleteModal={resetDeleteModal}
          />
        </TabPanel>
        <TabPanel value={selectedTab} index={2}>
          <TeamList
            setDeleteModalData={setDeleteModalData}
            resetDeleteModal={resetDeleteModal}
          />
        </TabPanel>
        <TabPanel value={selectedTab} index={3}>
          <VmObjectList
            setDeleteModalData={setDeleteModalData}
            resetDeleteModal={resetDeleteModal}
          />
        </TabPanel>
        <TabPanel value={selectedTab} index={4}>
          <ProviderList
            setDeleteModalData={setDeleteModalData}
            resetDeleteModal={resetDeleteModal}
          />
        </TabPanel>
        <TabPanel value={selectedTab} index={5}>
          <IngestVMs />
        </TabPanel>
        <TabPanel value={selectedTab} index={6}>
          <GenerateUsers />
        </TabPanel>
        <TabPanel value={selectedTab} index={7}>
          <LockoutForm />
        </TabPanel>
        {selectedTab < 5 && (
          <Fab
            sx={{
              position: "fixed",
              bottom: 24,
              right: 24,
            }}
            color="secondary"
            aria-label="add"
            onClick={addObject}
          >
            <Add />
          </Fab>
        )}
        <DeleteObjectModal {...deleteModalData} />
      </Box>
    </Box>
  );
};

export const Admin: React.FC = (): React.ReactElement => {
  const { user } = useContext(UserContext);
  return (
    <React.Fragment>
      {user && user.Role === Role.Admin ? (
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
