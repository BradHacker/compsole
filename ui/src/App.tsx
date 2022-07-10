import {
  AppBar,
  Avatar,
  Box,
  Button,
  Divider,
  IconButton,
  Menu,
  MenuItem,
  Paper,
  Toolbar,
  Tooltip,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { useGetCurrentUserQuery, User } from "./api/generated/graphql";
import { Loading } from "./pages/loading";
import { UserContext } from "./user-context";

function App() {
  const {
    data: currentUser,
    loading: currentUserLoading,
    error: currentUserError,
  } = useGetCurrentUserQuery();
  let navigate = useNavigate();
  let [user, setUser] = useState<User | null | undefined>();
  let [userMenuOpen, setUserMenuOpen] = useState<boolean>(false);

  let handleOpenUserMenu = () => setUserMenuOpen(true);
  let handleCloseUserMenu = () => setUserMenuOpen(false);

  // Ensure the user cannot access protected App without authentication
  useEffect(() => {
    if (!currentUserLoading && (currentUserError || !currentUser))
      navigate("/auth/signin");
    else if (!currentUserLoading && !currentUserError && currentUser)
      setUser(currentUser.me);
  }, [currentUser, currentUserLoading, currentUserError, navigate]);
  return !currentUserLoading && user ? (
    <UserContext.Provider value={user}>
      <Box sx={{ flexGrow: 1 }}>
        <AppBar position="static">
          <Toolbar>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              <Box
                sx={{
                  color: "#8375BC",
                }}
                component="span"
              >
                &lt;Comp/&gt;
              </Box>
              <Box
                sx={{
                  color: "#F7B374",
                }}
                component="span"
              >
                sole
              </Box>
            </Typography>
            <Box
              sx={{
                display: "flex",
                flex: 1,
                alignItems: "center",
                justifyContent: "flex-end",
                "& hr": {
                  mx: 0.5,
                },
              }}
            >
              <Button href="/" color="inherit">
                Dashboard
              </Button>
              <Divider orientation="vertical" variant="middle" flexItem />
              {/*
              <Typography
                variant="subtitle2"
                sx={{
                  ml: 1,
                }}
              >
                Hello, {user.FirstName} {user.LastName}
              </Typography> */}
              <Box sx={{ flexGrow: 0 }}>
                <Tooltip title="Open settings">
                  <IconButton onClick={handleOpenUserMenu} sx={{ p: 0, ml: 1 }}>
                    <Avatar
                      alt={`${user.FirstName} ${user.LastName}`}
                      sx={{
                        bgcolor: "#F7B374",
                      }}
                    >
                      {user.FirstName.at(0)}
                      {user.LastName.at(0)}
                    </Avatar>
                  </IconButton>
                </Tooltip>
                <Menu
                  sx={{ mt: "45px" }}
                  id="menu-appbar"
                  anchorOrigin={{
                    vertical: "top",
                    horizontal: "right",
                  }}
                  keepMounted
                  transformOrigin={{
                    vertical: "top",
                    horizontal: "right",
                  }}
                  open={userMenuOpen}
                  onClose={handleCloseUserMenu}
                >
                  <MenuItem onClick={handleCloseUserMenu}>
                    <Typography textAlign="center">Account Settings</Typography>
                  </MenuItem>
                </Menu>
              </Box>
            </Box>
          </Toolbar>
        </AppBar>
      </Box>
      <Outlet />
    </UserContext.Provider>
  ) : (
    <Loading />
  );
}

export default App;
