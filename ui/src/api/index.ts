import { ApolloClient, InMemoryCache } from "@apollo/client";
import { User } from "./generated/graphql";

export const client = new ApolloClient({
  uri: `${process.env.REACT_APP_SERVER_URL}/api/query`,
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
    fetch(`${process.env.REACT_APP_SERVER_URL}/auth/local/login`, {
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
    fetch(`${process.env.REACT_APP_SERVER_URL}/auth/logout`, {
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
