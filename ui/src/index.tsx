import React from "react";
import ReactDOM from "react-dom/client";
import { ApolloProvider } from "@apollo/client";
import reportWebVitals from "./reportWebVitals";
import App from "./App";
import "./index.css";
import { client } from "./api";
import { ThemeProvider } from "@emotion/react";
import { createTheme, CssBaseline } from "@mui/material";
import {
  BrowserRouter,
  Routes,
  Route,
  Link,
  LinkProps,
} from "react-router-dom";
import { LinkProps as MuiLinkProps } from "@mui/material/Link";
import { Auth, Signin } from "./pages/auth";
import { Dashboard } from "./pages/dashboard";
import { SnackbarProvider } from "notistack";
import { Console } from "./pages/console";
import { Admin, AdminProtected } from "./pages/admin";
import { UserForm } from "./pages/admin/user-form";
import { CompetitionForm } from "./pages/admin/competition-form";
import { ProviderForm } from "./pages/admin/provider-form";
import { VmObjectForm } from "./pages/admin/vm-object-form";
import { TeamForm } from "./pages/admin/team-form";
import { Account } from "./pages/account/index";
import { Logs } from "./pages/logs";
import { ServiceAccountForm } from "./pages/admin/service-account-form";

const LinkBehavior = React.forwardRef<
  HTMLAnchorElement,
  Omit<LinkProps, "to"> & { href: LinkProps["to"] }
>((props, ref) => {
  const { href, ...other } = props;
  // Map href (MUI) -> to (react-router)
  return <Link ref={ref} to={href} {...other} />;
});

const darkTheme = createTheme({
  components: {
    MuiLink: {
      defaultProps: {
        component: LinkBehavior,
      } as MuiLinkProps,
    },
    MuiButtonBase: {
      defaultProps: {
        LinkComponent: LinkBehavior,
      },
    },
    MuiSnackbar: {},
  },
  palette: {
    mode: "dark",
    primary: {
      main: "#c4a7e7",
    },
    secondary: {
      main: "#f6c177",
    },
    error: {
      main: "#eb6f92",
    },
    warning: {
      main: "#ea9a97",
    },
    info: {
      main: "#3e8fb0",
    },
    success: {
      main: "#9ccfd8",
    },
    background: {
      default: "#232136",
      paper: "#2a273f",
    },
    text: {
      primary: "#e0def4",
    },
  },
});

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(
  <React.StrictMode>
    <ApolloProvider client={client}>
      <ThemeProvider theme={darkTheme}>
        <CssBaseline />
        <BrowserRouter>
          <SnackbarProvider maxSnack={3}>
            <Routes>
              {/* Protected App Routes (Auth Required) */}
              <Route path="/" element={<App />}>
                <Route index element={<Dashboard />} />
                <Route path="console/:id" element={<Console />} />
                <Route path="account" element={<Account />} />
                <Route path="admin" element={<Admin />}>
                  <Route index element={<AdminProtected />} />
                  <Route path="user/new" element={<UserForm />} />
                  <Route path="user/:id" element={<UserForm />} />
                  <Route path="competition/new" element={<CompetitionForm />} />
                  <Route path="competition/:id" element={<CompetitionForm />} />
                  <Route path="provider/new" element={<ProviderForm />} />
                  <Route path="provider/:id" element={<ProviderForm />} />
                  <Route path="vm-object/new" element={<VmObjectForm />} />
                  <Route path="vm-object/:id" element={<VmObjectForm />} />
                  <Route path="team/new" element={<TeamForm />} />
                  <Route path="team/:id" element={<TeamForm />} />
                  <Route
                    path="service-account/new"
                    element={<ServiceAccountForm />}
                  />
                  <Route
                    path="service-account/:id"
                    element={<ServiceAccountForm />}
                  />
                  <Route path="logs" element={<Logs />} />
                </Route>
              </Route>
              {/* Unprotected App Routes (No Auth Required) */}
              <Route path="/auth" element={<Auth />}>
                <Route index element={<Signin />} />
                <Route path="signin" element={<Signin />} />
              </Route>
            </Routes>
          </SnackbarProvider>
        </BrowserRouter>
      </ThemeProvider>
    </ApolloProvider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
