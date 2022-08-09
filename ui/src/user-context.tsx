import * as React from "react";
import { AuthProvider, Role, User } from "./api/generated/graphql";

export const UserContext = React.createContext({
  ID: "",
  Username: "",
  FirstName: "",
  LastName: "",
  Role: Role.Undefined,
  Provider: AuthProvider.Undefined,
} as User);
