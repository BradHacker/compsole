import {
  Container,
  Box,
  Avatar,
  Button,
  Grid,
  TextField,
  Typography,
} from "@mui/material";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import * as React from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { LocalLogin } from "../../api";
import Logo from "../../res/logo512.png";
import { useEffect } from "react";

export const Auth: React.FC = (): React.ReactElement => {
  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          marginTop: 8,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "space-evenly",
        }}
      >
        <img src={Logo} alt="Logo" style={{ maxWidth: "80%" }} />
        <Outlet />
      </Box>
    </Container>
  );
};

export const Signin: React.FC = (): React.ReactElement => {
  let navigate = useNavigate();
  let location = useLocation();

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    LocalLogin(
      data.get("username")?.toString() ?? "",
      data.get("password")?.toString() ?? ""
    ).then(() => {
      if (location?.state) {
        if ((location.state as any).from instanceof Location) {
          if (
            location.state &&
            ((location?.state as any).from as Location).pathname.indexOf(
              "/auth/"
            ) >= 0
          ) {
            navigate("/");
          } else navigate((location.state as any).from as Location);
        } else if (typeof (location.state as any).from === "string")
          navigate((location.state as any).from);
      } else navigate("/");
    }, console.error);
  };

  // Set the title of the tab only on first load
  useEffect(() => {
    document.title = "Sign In - Compsole";
  }, []);

  return (
    <React.Fragment>
      <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
        <LockOutlinedIcon />
      </Avatar>
      <Typography component="h1" variant="h5">
        Sign in
      </Typography>
      <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
        <TextField
          margin="normal"
          required
          fullWidth
          id="username"
          label="Username"
          name="username"
          autoComplete="username"
          autoFocus
        />
        <TextField
          margin="normal"
          required
          fullWidth
          name="password"
          label="Password"
          type="password"
          id="password"
          autoComplete="current-password"
        />
        <Button
          type="submit"
          fullWidth
          variant="contained"
          sx={{ mt: 3, mb: 2 }}
        >
          Sign In
        </Button>
        <Grid container justifyContent="flex-end">
          {/* <Grid item xs>
            <Link href="#" variant="body2">
              Forgot password?
            </Link>
          </Grid> */}
        </Grid>
      </Box>
    </React.Fragment>
  );
};
