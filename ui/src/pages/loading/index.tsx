import { CircularProgress } from "@mui/material";
import { Container, Box } from "@mui/system";
import * as React from "react";

export const Loading: React.FC = (): React.ReactElement => {
  return (
    <Container
      component="main"
      maxWidth="xs"
      sx={{
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Box
        sx={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <CircularProgress />
      </Box>
    </Container>
  );
};
