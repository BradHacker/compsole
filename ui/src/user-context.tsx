import * as React from "react";
import { Provider, Role, User } from "./api/generated/graphql";

export const UserContext = React.createContext({
  ID: "",
  Username: "",
  FirstName: "",
  LastName: "",
  Role: Role.Undefined,
  Provider: Provider.Undefined,
} as User);
