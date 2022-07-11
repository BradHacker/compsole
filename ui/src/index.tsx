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
import { Auth, Signin, Signup } from "./pages/auth";
import { Dashboard } from "./pages/dashboard";
import { SnackbarProvider } from "notistack";
import { Console } from "./pages/console";

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
  },
  palette: {
    mode: "dark",
    primary: {
      main: "#8375BC",
    },
    secondary: {
      main: "#F7B374",
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
              </Route>
              {/* Unprotected App Routes (No Auth Required) */}
              <Route path="/auth" element={<Auth />}>
                <Route index element={<Signin />} />
                <Route path="signin" element={<Signin />} />
                <Route path="signup" element={<Signup />} />
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
