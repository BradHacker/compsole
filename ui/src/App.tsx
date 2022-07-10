import { Box, Button, Divider, Paper, Typography } from "@mui/material";
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

  // Ensure the user cannot access protected App without authentication
  useEffect(() => {
    if (!currentUserLoading && (currentUserError || !currentUser))
      navigate("/auth/signin");
    else if (!currentUserLoading && !currentUserError && currentUser)
      setUser(currentUser.me);
  }, [currentUser, currentUserLoading, currentUserError, navigate]);
  return !currentUserLoading && user ? (
    <UserContext.Provider value={user}>
      <Paper
        sx={{
          width: "100%",
          padding: "0.5rem 10%",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
        elevation={1}
      >
        <Box>
          <Typography variant="h6">
            <Box
              sx={{
                color: "#76ff03",
              }}
              component="span"
            >
              &lt;Comp/&gt;
            </Box>
            <Box
              sx={{
                color: "#00b0ff",
              }}
              component="span"
            >
              sole
            </Box>
          </Typography>
        </Box>
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
          <Button href="/">Dashboard</Button>
          <Divider orientation="vertical" variant="middle" flexItem />
          <Typography
            variant="subtitle2"
            sx={{
              ml: 1,
            }}
          >
            Hello, {user.FirstName} {user.LastName}
          </Typography>
        </Box>
      </Paper>
      <Outlet />
    </UserContext.Provider>
  ) : (
    <Loading />
  );
}

export default App;
