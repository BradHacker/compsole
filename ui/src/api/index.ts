import { ApolloClient, HttpLink, InMemoryCache, split } from "@apollo/client";
import { User } from "./generated/graphql";
import { GraphQLWsLink } from "@apollo/client/link/subscriptions";
import { createClient } from "graphql-ws";
import { getMainDefinition } from "@apollo/client/utilities";

const wsLink = new GraphQLWsLink(
  createClient({
    url: `${import.meta.env.VITE_APP_WS_URL}/api/graphql/query`,
    lazy: true,
  })
);

const httpLink = new HttpLink({
  uri: `${import.meta.env.VITE_APP_SERVER_URL}/api/graphql/query`,
  credentials: "include",
});

const link = split(
  ({ query }) => {
    const definition = getMainDefinition(query);
    return (
      definition.kind === "OperationDefinition" &&
      definition.operation === "subscription"
    );
  },
  wsLink,
  httpLink
);

export const client = new ApolloClient({
  uri: `${import.meta.env.VITE_APP_SERVER_URL}/api/graphql/query`,
  link,
  cache: new InMemoryCache(),
  credentials: "include",
});

export const LocalLogin = (
  username: string,
  password: string
): Promise<
  | User
  | {
      error: string;
    }
> => {
  return new Promise((resolve, reject) =>
    fetch(`${import.meta.env.VITE_APP_SERVER_URL}/auth/local/login`, {
      method: "POST",
      body: JSON.stringify({
        username,
        password,
      }),
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    })
      .then((res) => res.json())
      .then((res) => {
        if (res.error) {
          console.error(`Auth error: ${res.error}`);
          reject({
            error: res.error,
          });
        } else resolve(res as User);
      })
  );
};

export const Logout = (): Promise<boolean> => {
  return new Promise((resolve, reject) =>
    fetch(`${import.meta.env.VITE_APP_SERVER_URL}/auth/logout`, {
      method: "GET",
      credentials: "include",
    }).then((res) => {
      if (res.status < 200 || res.status > 299) {
        return reject(`error: returned status '${res.statusText}'`);
      }
      resolve(true);
    })
  );
};
