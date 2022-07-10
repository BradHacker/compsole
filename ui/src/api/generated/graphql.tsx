import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
const defaultOptions = {} as const;
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
};

export type Competition = {
  __typename?: 'Competition';
  CompetitionToTeams: Array<Maybe<Team>>;
  ID: Scalars['ID'];
  Name?: Maybe<Scalars['String']>;
};

export enum ConsoleType {
  Mks = 'MKS',
  Novnc = 'NOVNC',
  Rdp = 'RDP',
  Serial = 'SERIAL',
  Spice = 'SPICE'
}

export enum Provider {
  Gitlab = 'GITLAB',
  Local = 'LOCAL',
  Undefined = 'UNDEFINED'
}

export type Query = {
  __typename?: 'Query';
  competitions: Array<Competition>;
  console: Scalars['String'];
  me?: Maybe<User>;
  myCompetition: Competition;
  myTeam: Team;
  myVmObjects: Array<VmObject>;
  teams: Array<Team>;
  vmObjects: Array<VmObject>;
};


export type QueryConsoleArgs = {
  consoleType: ConsoleType;
  vmObjectId: Scalars['ID'];
};

export enum Role {
  Admin = 'ADMIN',
  Undefined = 'UNDEFINED',
  User = 'USER'
}

export type Team = {
  __typename?: 'Team';
  ID: Scalars['ID'];
  Name?: Maybe<Scalars['String']>;
  TeamNumber: Scalars['Int'];
  TeamToCompetition: Competition;
  TeamToVmObjects: Array<Maybe<VmObject>>;
};

export type User = {
  __typename?: 'User';
  FirstName: Scalars['String'];
  ID: Scalars['ID'];
  LastName: Scalars['String'];
  Provider: Provider;
  Role: Role;
  Username: Scalars['String'];
};

export type VmObject = {
  __typename?: 'VmObject';
  ID: Scalars['ID'];
  IPAddresses?: Maybe<Array<Maybe<Scalars['String']>>>;
  Identifier: Scalars['String'];
  Name: Scalars['String'];
  VmObjectToTeam?: Maybe<Team>;
};

export type GetCurrentUserQueryVariables = Exact<{ [key: string]: never; }>;


export type GetCurrentUserQuery = { __typename?: 'Query', me?: { __typename?: 'User', ID: string, Username: string, FirstName: string, LastName: string, Provider: Provider, Role: Role } | null };

export type VmObjectFragmentFragment = { __typename?: 'VmObject', ID: string, Identifier: string, Name: string, IPAddresses?: Array<string | null> | null };

export type MyVmObjectsQueryVariables = Exact<{ [key: string]: never; }>;


export type MyVmObjectsQuery = { __typename?: 'Query', myVmObjects: Array<{ __typename?: 'VmObject', ID: string, Identifier: string, Name: string, IPAddresses?: Array<string | null> | null }> };

export const VmObjectFragmentFragmentDoc = gql`
    fragment VmObjectFragment on VmObject {
  ID
  Identifier
  Name
  IPAddresses
}
    `;
export const GetCurrentUserDocument = gql`
    query GetCurrentUser {
  me {
    ID
    Username
    FirstName
    LastName
    Provider
    Role
  }
}
    `;

/**
 * __useGetCurrentUserQuery__
 *
 * To run a query within a React component, call `useGetCurrentUserQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetCurrentUserQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetCurrentUserQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetCurrentUserQuery(baseOptions?: Apollo.QueryHookOptions<GetCurrentUserQuery, GetCurrentUserQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetCurrentUserQuery, GetCurrentUserQueryVariables>(GetCurrentUserDocument, options);
      }
export function useGetCurrentUserLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetCurrentUserQuery, GetCurrentUserQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetCurrentUserQuery, GetCurrentUserQueryVariables>(GetCurrentUserDocument, options);
        }
export type GetCurrentUserQueryHookResult = ReturnType<typeof useGetCurrentUserQuery>;
export type GetCurrentUserLazyQueryHookResult = ReturnType<typeof useGetCurrentUserLazyQuery>;
export type GetCurrentUserQueryResult = Apollo.QueryResult<GetCurrentUserQuery, GetCurrentUserQueryVariables>;
export const MyVmObjectsDocument = gql`
    query MyVmObjects {
  myVmObjects {
    ...VmObjectFragment
  }
}
    ${VmObjectFragmentFragmentDoc}`;

/**
 * __useMyVmObjectsQuery__
 *
 * To run a query within a React component, call `useMyVmObjectsQuery` and pass it any options that fit your needs.
 * When your component renders, `useMyVmObjectsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useMyVmObjectsQuery({
 *   variables: {
 *   },
 * });
 */
export function useMyVmObjectsQuery(baseOptions?: Apollo.QueryHookOptions<MyVmObjectsQuery, MyVmObjectsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<MyVmObjectsQuery, MyVmObjectsQueryVariables>(MyVmObjectsDocument, options);
      }
export function useMyVmObjectsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<MyVmObjectsQuery, MyVmObjectsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<MyVmObjectsQuery, MyVmObjectsQueryVariables>(MyVmObjectsDocument, options);
        }
export type MyVmObjectsQueryHookResult = ReturnType<typeof useMyVmObjectsQuery>;
export type MyVmObjectsLazyQueryHookResult = ReturnType<typeof useMyVmObjectsLazyQuery>;
export type MyVmObjectsQueryResult = Apollo.QueryResult<MyVmObjectsQuery, MyVmObjectsQueryVariables>;