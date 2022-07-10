import { Button, Container } from "@mui/material";
import React, { useContext } from "react";
import { UserContext } from "../../user-context";

export const Dashboard: React.FC = (): React.ReactElement => {
  let user = useContext(UserContext);

  return (
    <Container component="main">
      <main>
        Welcome {user.FirstName} {user.LastName}
      </main>
    </Container>
  );
};
