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
  Name: Scalars['String'];
  ProviderType: Scalars['String'];
};

export type CompetitionInput = {
  ID?: InputMaybe<Scalars['ID']>;
  Name: Scalars['String'];
};

export enum ConsoleType {
  Mks = 'MKS',
  Novnc = 'NOVNC',
  Rdp = 'RDP',
  Serial = 'SERIAL',
  Spice = 'SPICE'
}

export type Mutation = {
  __typename?: 'Mutation';
  changePassword: Scalars['Boolean'];
  createCompetition: Competition;
  createTeam: Team;
  createUser: User;
  createVmObject: VmObject;
  deleteCompetition: Scalars['Boolean'];
  deleteTeam: Scalars['Boolean'];
  deleteUser: Scalars['Boolean'];
  deleteVmObject: Scalars['Boolean'];
  powerOff: Scalars['Boolean'];
  powerOn: Scalars['Boolean'];
  reboot: Scalars['Boolean'];
  updateCompetition: Competition;
  updateTeam: Team;
  updateUser: User;
  updateVmObject: VmObject;
};


export type MutationChangePasswordArgs = {
  id: Scalars['ID'];
  password: Scalars['String'];
};


export type MutationCreateCompetitionArgs = {
  input: CompetitionInput;
};


export type MutationCreateTeamArgs = {
  input: TeamInput;
};


export type MutationCreateUserArgs = {
  input: UserInput;
};


export type MutationCreateVmObjectArgs = {
  input: VmObjectInput;
};


export type MutationDeleteCompetitionArgs = {
  id: Scalars['ID'];
};


export type MutationDeleteTeamArgs = {
  id: Scalars['ID'];
};


export type MutationDeleteUserArgs = {
  id: Scalars['ID'];
};


export type MutationDeleteVmObjectArgs = {
  id: Scalars['ID'];
};


export type MutationPowerOffArgs = {
  vmObjectId: Scalars['ID'];
};


export type MutationPowerOnArgs = {
  vmObjectId: Scalars['ID'];
};


export type MutationRebootArgs = {
  rebootType: RebootType;
  vmObjectId: Scalars['ID'];
};


export type MutationUpdateCompetitionArgs = {
  input: CompetitionInput;
};


export type MutationUpdateTeamArgs = {
  input: TeamInput;
};


export type MutationUpdateUserArgs = {
  input: UserInput;
};


export type MutationUpdateVmObjectArgs = {
  input: VmObjectInput;
};

export enum Provider {
  Gitlab = 'GITLAB',
  Local = 'LOCAL',
  Undefined = 'UNDEFINED'
}

export type Query = {
  __typename?: 'Query';
  competitions: Array<Competition>;
  console: Scalars['String'];
  getCompetition: Competition;
  getTeam: Team;
  getUser: User;
  getVmObject: VmObject;
  me: User;
  myCompetition: Competition;
  myTeam: Team;
  myVmObjects: Array<VmObject>;
  teams: Array<Team>;
  users: Array<User>;
  vmObject: VmObject;
  vmObjects: Array<VmObject>;
};


export type QueryConsoleArgs = {
  consoleType: ConsoleType;
  vmObjectId: Scalars['ID'];
};


export type QueryGetCompetitionArgs = {
  id: Scalars['ID'];
};


export type QueryGetTeamArgs = {
  id: Scalars['ID'];
};


export type QueryGetUserArgs = {
  id: Scalars['ID'];
};


export type QueryGetVmObjectArgs = {
  id: Scalars['ID'];
};


export type QueryVmObjectArgs = {
  vmObjectId: Scalars['ID'];
};

export enum RebootType {
  Hard = 'HARD',
  Soft = 'SOFT'
}

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

export type TeamInput = {
  ID?: InputMaybe<Scalars['ID']>;
  Name?: InputMaybe<Scalars['String']>;
  TeamNumber: Scalars['Int'];
  TeamToCompetition: Scalars['ID'];
};

export type User = {
  __typename?: 'User';
  FirstName: Scalars['String'];
  ID: Scalars['ID'];
  LastName: Scalars['String'];
  Provider: Provider;
  Role: Role;
  UserToTeam?: Maybe<Team>;
  Username: Scalars['String'];
};

export type UserInput = {
  FirstName: Scalars['String'];
  ID?: InputMaybe<Scalars['ID']>;
  LastName: Scalars['String'];
  Provider: Provider;
  Role: Role;
  UserToTeam?: InputMaybe<Scalars['ID']>;
  Username: Scalars['String'];
};

export type VmObject = {
  __typename?: 'VmObject';
  ID: Scalars['ID'];
  IPAddresses: Array<Scalars['String']>;
  Identifier: Scalars['String'];
  Name: Scalars['String'];
  VmObjectToTeam?: Maybe<Team>;
};

export type VmObjectInput = {
  ID?: InputMaybe<Scalars['ID']>;
  IPAddresses: Array<Scalars['String']>;
  Identifier: Scalars['String'];
  Name: Scalars['String'];
  VmObjectToTeam?: InputMaybe<Scalars['ID']>;
};

export type GetCompTeamSearchValuesQueryVariables = Exact<{ [key: string]: never; }>;


export type GetCompTeamSearchValuesQuery = { __typename?: 'Query', teams: Array<{ __typename?: 'Team', ID: string, TeamNumber: number, Name?: string | null, TeamToCompetition: { __typename?: 'Competition', ID: string, Name: string } }> };

export type GetCompetitionsQueryVariables = Exact<{ [key: string]: never; }>;


export type GetCompetitionsQuery = { __typename?: 'Query', competitions: Array<{ __typename?: 'Competition', ID: string, Name: string, ProviderType: string, CompetitionToTeams: Array<{ __typename?: 'Team', ID: string } | null> }> };

export type GetTeamsQueryVariables = Exact<{ [key: string]: never; }>;


export type GetTeamsQuery = { __typename?: 'Query', teams: Array<{ __typename?: 'Team', ID: string, TeamNumber: number, Name?: string | null, TeamToCompetition: { __typename?: 'Competition', ID: string, Name: string } }> };

export type UserFragmentFragment = { __typename?: 'User', ID: string, Username: string, FirstName: string, LastName: string, Provider: Provider, Role: Role };

export type AdminUserFragmentFragment = { __typename?: 'User', ID: string, Username: string, FirstName: string, LastName: string, Provider: Provider, Role: Role, UserToTeam?: { __typename?: 'Team', ID: string, Name?: string | null, TeamNumber: number, TeamToCompetition: { __typename?: 'Competition', ID: string, Name: string } } | null };

export type GetCurrentUserQueryVariables = Exact<{ [key: string]: never; }>;


export type GetCurrentUserQuery = { __typename?: 'Query', me: { __typename?: 'User', ID: string, Username: string, FirstName: string, LastName: string, Provider: Provider, Role: Role } };

export type GetUsersQueryVariables = Exact<{ [key: string]: never; }>;


export type GetUsersQuery = { __typename?: 'Query', users: Array<{ __typename?: 'User', ID: string, Username: string, FirstName: string, LastName: string, Provider: Provider, Role: Role, UserToTeam?: { __typename?: 'Team', ID: string, Name?: string | null, TeamNumber: number, TeamToCompetition: { __typename?: 'Competition', ID: string, Name: string } } | null }> };

export type GetUserQueryVariables = Exact<{
  id: Scalars['ID'];
}>;


export type GetUserQuery = { __typename?: 'Query', getUser: { __typename?: 'User', ID: string, Username: string, FirstName: string, LastName: string, Provider: Provider, Role: Role, UserToTeam?: { __typename?: 'Team', ID: string, Name?: string | null, TeamNumber: number, TeamToCompetition: { __typename?: 'Competition', ID: string, Name: string } } | null } };

export type UpdateUserMutationVariables = Exact<{
  user: UserInput;
}>;


export type UpdateUserMutation = { __typename?: 'Mutation', updateUser: { __typename?: 'User', ID: string, Username: string, FirstName: string, LastName: string, Provider: Provider, Role: Role, UserToTeam?: { __typename?: 'Team', ID: string, Name?: string | null, TeamNumber: number, TeamToCompetition: { __typename?: 'Competition', ID: string, Name: string } } | null } };

export type CreateUserMutationVariables = Exact<{
  user: UserInput;
}>;


export type CreateUserMutation = { __typename?: 'Mutation', createUser: { __typename?: 'User', ID: string, Username: string, FirstName: string, LastName: string, Provider: Provider, Role: Role, UserToTeam?: { __typename?: 'Team', ID: string, Name?: string | null, TeamNumber: number, TeamToCompetition: { __typename?: 'Competition', ID: string, Name: string } } | null } };

export type ChangePasswordMutationVariables = Exact<{
  id: Scalars['ID'];
  newPassword: Scalars['String'];
}>;


export type ChangePasswordMutation = { __typename?: 'Mutation', changePassword: boolean };

export type VmObjectFragmentFragment = { __typename?: 'VmObject', ID: string, Identifier: string, Name: string, IPAddresses: Array<string>, VmObjectToTeam?: { __typename?: 'Team', ID: string, TeamNumber: number, Name?: string | null, TeamToCompetition: { __typename?: 'Competition', ID: string, Name: string } } | null };

export type MyVmObjectsQueryVariables = Exact<{ [key: string]: never; }>;


export type MyVmObjectsQuery = { __typename?: 'Query', myVmObjects: Array<{ __typename?: 'VmObject', ID: string, Identifier: string, Name: string, IPAddresses: Array<string>, VmObjectToTeam?: { __typename?: 'Team', ID: string, TeamNumber: number, Name?: string | null, TeamToCompetition: { __typename?: 'Competition', ID: string, Name: string } } | null }> };

export type AllVmObjectsQueryVariables = Exact<{ [key: string]: never; }>;


export type AllVmObjectsQuery = { __typename?: 'Query', vmObjects: Array<{ __typename?: 'VmObject', ID: string, Identifier: string, Name: string, IPAddresses: Array<string>, VmObjectToTeam?: { __typename?: 'Team', ID: string, TeamNumber: number, Name?: string | null, TeamToCompetition: { __typename?: 'Competition', ID: string, Name: string } } | null }> };

export type GetVmObjectQueryVariables = Exact<{
  vmObjectId: Scalars['ID'];
}>;


export type GetVmObjectQuery = { __typename?: 'Query', vmObject: { __typename?: 'VmObject', ID: string, Identifier: string, Name: string, IPAddresses: Array<string>, VmObjectToTeam?: { __typename?: 'Team', ID: string, TeamNumber: number, Name?: string | null, TeamToCompetition: { __typename?: 'Competition', ID: string, Name: string } } | null } };

export type GetVmConsoleQueryVariables = Exact<{
  vmObjectId: Scalars['ID'];
  consoleType: ConsoleType;
}>;


export type GetVmConsoleQuery = { __typename?: 'Query', console: string };

export type RebootVmMutationVariables = Exact<{
  vmObjectId: Scalars['ID'];
  rebootType: RebootType;
}>;


export type RebootVmMutation = { __typename?: 'Mutation', reboot: boolean };

export type PowerOnVmMutationVariables = Exact<{
  vmObjectId: Scalars['ID'];
}>;


export type PowerOnVmMutation = { __typename?: 'Mutation', powerOn: boolean };

export type PowerOffVmMutationVariables = Exact<{
  vmObjectId: Scalars['ID'];
}>;


export type PowerOffVmMutation = { __typename?: 'Mutation', powerOff: boolean };

export const UserFragmentFragmentDoc = gql`
    fragment UserFragment on User {
  ID
  Username
  FirstName
  LastName
  Provider
  Role
}
    `;
export const AdminUserFragmentFragmentDoc = gql`
    fragment AdminUserFragment on User {
  ...UserFragment
  UserToTeam {
    ID
    Name
    TeamNumber
    TeamToCompetition {
      ID
      Name
    }
  }
}
    ${UserFragmentFragmentDoc}`;
export const VmObjectFragmentFragmentDoc = gql`
    fragment VmObjectFragment on VmObject {
  ID
  Identifier
  Name
  IPAddresses
  VmObjectToTeam {
    ID
    TeamNumber
    Name
    TeamToCompetition {
      ID
      Name
    }
  }
}
    `;
export const GetCompTeamSearchValuesDocument = gql`
    query GetCompTeamSearchValues {
  teams {
    ID
    TeamNumber
    Name
    TeamToCompetition {
      ID
      Name
    }
  }
}
    `;

/**
 * __useGetCompTeamSearchValuesQuery__
 *
 * To run a query within a React component, call `useGetCompTeamSearchValuesQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetCompTeamSearchValuesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetCompTeamSearchValuesQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetCompTeamSearchValuesQuery(baseOptions?: Apollo.QueryHookOptions<GetCompTeamSearchValuesQuery, GetCompTeamSearchValuesQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetCompTeamSearchValuesQuery, GetCompTeamSearchValuesQueryVariables>(GetCompTeamSearchValuesDocument, options);
      }
export function useGetCompTeamSearchValuesLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetCompTeamSearchValuesQuery, GetCompTeamSearchValuesQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetCompTeamSearchValuesQuery, GetCompTeamSearchValuesQueryVariables>(GetCompTeamSearchValuesDocument, options);
        }
export type GetCompTeamSearchValuesQueryHookResult = ReturnType<typeof useGetCompTeamSearchValuesQuery>;
export type GetCompTeamSearchValuesLazyQueryHookResult = ReturnType<typeof useGetCompTeamSearchValuesLazyQuery>;
export type GetCompTeamSearchValuesQueryResult = Apollo.QueryResult<GetCompTeamSearchValuesQuery, GetCompTeamSearchValuesQueryVariables>;
export const GetCompetitionsDocument = gql`
    query GetCompetitions {
  competitions {
    ID
    Name
    ProviderType
    CompetitionToTeams {
      ID
    }
  }
}
    `;

/**
 * __useGetCompetitionsQuery__
 *
 * To run a query within a React component, call `useGetCompetitionsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetCompetitionsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetCompetitionsQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetCompetitionsQuery(baseOptions?: Apollo.QueryHookOptions<GetCompetitionsQuery, GetCompetitionsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetCompetitionsQuery, GetCompetitionsQueryVariables>(GetCompetitionsDocument, options);
      }
export function useGetCompetitionsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetCompetitionsQuery, GetCompetitionsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetCompetitionsQuery, GetCompetitionsQueryVariables>(GetCompetitionsDocument, options);
        }
export type GetCompetitionsQueryHookResult = ReturnType<typeof useGetCompetitionsQuery>;
export type GetCompetitionsLazyQueryHookResult = ReturnType<typeof useGetCompetitionsLazyQuery>;
export type GetCompetitionsQueryResult = Apollo.QueryResult<GetCompetitionsQuery, GetCompetitionsQueryVariables>;
export const GetTeamsDocument = gql`
    query GetTeams {
  teams {
    ID
    TeamNumber
    Name
    TeamToCompetition {
      ID
      Name
    }
  }
}
    `;

/**
 * __useGetTeamsQuery__
 *
 * To run a query within a React component, call `useGetTeamsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetTeamsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetTeamsQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetTeamsQuery(baseOptions?: Apollo.QueryHookOptions<GetTeamsQuery, GetTeamsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetTeamsQuery, GetTeamsQueryVariables>(GetTeamsDocument, options);
      }
export function useGetTeamsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetTeamsQuery, GetTeamsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetTeamsQuery, GetTeamsQueryVariables>(GetTeamsDocument, options);
        }
export type GetTeamsQueryHookResult = ReturnType<typeof useGetTeamsQuery>;
export type GetTeamsLazyQueryHookResult = ReturnType<typeof useGetTeamsLazyQuery>;
export type GetTeamsQueryResult = Apollo.QueryResult<GetTeamsQuery, GetTeamsQueryVariables>;
export const GetCurrentUserDocument = gql`
    query GetCurrentUser {
  me {
    ...UserFragment
  }
}
    ${UserFragmentFragmentDoc}`;

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
export const GetUsersDocument = gql`
    query GetUsers {
  users {
    ...AdminUserFragment
  }
}
    ${AdminUserFragmentFragmentDoc}`;

/**
 * __useGetUsersQuery__
 *
 * To run a query within a React component, call `useGetUsersQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetUsersQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetUsersQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetUsersQuery(baseOptions?: Apollo.QueryHookOptions<GetUsersQuery, GetUsersQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetUsersQuery, GetUsersQueryVariables>(GetUsersDocument, options);
      }
export function useGetUsersLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetUsersQuery, GetUsersQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetUsersQuery, GetUsersQueryVariables>(GetUsersDocument, options);
        }
export type GetUsersQueryHookResult = ReturnType<typeof useGetUsersQuery>;
export type GetUsersLazyQueryHookResult = ReturnType<typeof useGetUsersLazyQuery>;
export type GetUsersQueryResult = Apollo.QueryResult<GetUsersQuery, GetUsersQueryVariables>;
export const GetUserDocument = gql`
    query GetUser($id: ID!) {
  getUser(id: $id) {
    ...AdminUserFragment
  }
}
    ${AdminUserFragmentFragmentDoc}`;

/**
 * __useGetUserQuery__
 *
 * To run a query within a React component, call `useGetUserQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetUserQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetUserQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useGetUserQuery(baseOptions: Apollo.QueryHookOptions<GetUserQuery, GetUserQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetUserQuery, GetUserQueryVariables>(GetUserDocument, options);
      }
export function useGetUserLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetUserQuery, GetUserQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetUserQuery, GetUserQueryVariables>(GetUserDocument, options);
        }
export type GetUserQueryHookResult = ReturnType<typeof useGetUserQuery>;
export type GetUserLazyQueryHookResult = ReturnType<typeof useGetUserLazyQuery>;
export type GetUserQueryResult = Apollo.QueryResult<GetUserQuery, GetUserQueryVariables>;
export const UpdateUserDocument = gql`
    mutation UpdateUser($user: UserInput!) {
  updateUser(input: $user) {
    ...AdminUserFragment
  }
}
    ${AdminUserFragmentFragmentDoc}`;
export type UpdateUserMutationFn = Apollo.MutationFunction<UpdateUserMutation, UpdateUserMutationVariables>;

/**
 * __useUpdateUserMutation__
 *
 * To run a mutation, you first call `useUpdateUserMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateUserMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateUserMutation, { data, loading, error }] = useUpdateUserMutation({
 *   variables: {
 *      user: // value for 'user'
 *   },
 * });
 */
export function useUpdateUserMutation(baseOptions?: Apollo.MutationHookOptions<UpdateUserMutation, UpdateUserMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateUserMutation, UpdateUserMutationVariables>(UpdateUserDocument, options);
      }
export type UpdateUserMutationHookResult = ReturnType<typeof useUpdateUserMutation>;
export type UpdateUserMutationResult = Apollo.MutationResult<UpdateUserMutation>;
export type UpdateUserMutationOptions = Apollo.BaseMutationOptions<UpdateUserMutation, UpdateUserMutationVariables>;
export const CreateUserDocument = gql`
    mutation CreateUser($user: UserInput!) {
  createUser(input: $user) {
    ...AdminUserFragment
  }
}
    ${AdminUserFragmentFragmentDoc}`;
export type CreateUserMutationFn = Apollo.MutationFunction<CreateUserMutation, CreateUserMutationVariables>;

/**
 * __useCreateUserMutation__
 *
 * To run a mutation, you first call `useCreateUserMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateUserMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createUserMutation, { data, loading, error }] = useCreateUserMutation({
 *   variables: {
 *      user: // value for 'user'
 *   },
 * });
 */
export function useCreateUserMutation(baseOptions?: Apollo.MutationHookOptions<CreateUserMutation, CreateUserMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateUserMutation, CreateUserMutationVariables>(CreateUserDocument, options);
      }
export type CreateUserMutationHookResult = ReturnType<typeof useCreateUserMutation>;
export type CreateUserMutationResult = Apollo.MutationResult<CreateUserMutation>;
export type CreateUserMutationOptions = Apollo.BaseMutationOptions<CreateUserMutation, CreateUserMutationVariables>;
export const ChangePasswordDocument = gql`
    mutation ChangePassword($id: ID!, $newPassword: String!) {
  changePassword(id: $id, password: $newPassword)
}
    `;
export type ChangePasswordMutationFn = Apollo.MutationFunction<ChangePasswordMutation, ChangePasswordMutationVariables>;

/**
 * __useChangePasswordMutation__
 *
 * To run a mutation, you first call `useChangePasswordMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useChangePasswordMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [changePasswordMutation, { data, loading, error }] = useChangePasswordMutation({
 *   variables: {
 *      id: // value for 'id'
 *      newPassword: // value for 'newPassword'
 *   },
 * });
 */
export function useChangePasswordMutation(baseOptions?: Apollo.MutationHookOptions<ChangePasswordMutation, ChangePasswordMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<ChangePasswordMutation, ChangePasswordMutationVariables>(ChangePasswordDocument, options);
      }
export type ChangePasswordMutationHookResult = ReturnType<typeof useChangePasswordMutation>;
export type ChangePasswordMutationResult = Apollo.MutationResult<ChangePasswordMutation>;
export type ChangePasswordMutationOptions = Apollo.BaseMutationOptions<ChangePasswordMutation, ChangePasswordMutationVariables>;
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
export const AllVmObjectsDocument = gql`
    query AllVmObjects {
  vmObjects {
    ...VmObjectFragment
  }
}
    ${VmObjectFragmentFragmentDoc}`;

/**
 * __useAllVmObjectsQuery__
 *
 * To run a query within a React component, call `useAllVmObjectsQuery` and pass it any options that fit your needs.
 * When your component renders, `useAllVmObjectsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useAllVmObjectsQuery({
 *   variables: {
 *   },
 * });
 */
export function useAllVmObjectsQuery(baseOptions?: Apollo.QueryHookOptions<AllVmObjectsQuery, AllVmObjectsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<AllVmObjectsQuery, AllVmObjectsQueryVariables>(AllVmObjectsDocument, options);
      }
export function useAllVmObjectsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<AllVmObjectsQuery, AllVmObjectsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<AllVmObjectsQuery, AllVmObjectsQueryVariables>(AllVmObjectsDocument, options);
        }
export type AllVmObjectsQueryHookResult = ReturnType<typeof useAllVmObjectsQuery>;
export type AllVmObjectsLazyQueryHookResult = ReturnType<typeof useAllVmObjectsLazyQuery>;
export type AllVmObjectsQueryResult = Apollo.QueryResult<AllVmObjectsQuery, AllVmObjectsQueryVariables>;
export const GetVmObjectDocument = gql`
    query GetVmObject($vmObjectId: ID!) {
  vmObject(vmObjectId: $vmObjectId) {
    ...VmObjectFragment
  }
}
    ${VmObjectFragmentFragmentDoc}`;

/**
 * __useGetVmObjectQuery__
 *
 * To run a query within a React component, call `useGetVmObjectQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetVmObjectQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetVmObjectQuery({
 *   variables: {
 *      vmObjectId: // value for 'vmObjectId'
 *   },
 * });
 */
export function useGetVmObjectQuery(baseOptions: Apollo.QueryHookOptions<GetVmObjectQuery, GetVmObjectQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetVmObjectQuery, GetVmObjectQueryVariables>(GetVmObjectDocument, options);
      }
export function useGetVmObjectLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetVmObjectQuery, GetVmObjectQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetVmObjectQuery, GetVmObjectQueryVariables>(GetVmObjectDocument, options);
        }
export type GetVmObjectQueryHookResult = ReturnType<typeof useGetVmObjectQuery>;
export type GetVmObjectLazyQueryHookResult = ReturnType<typeof useGetVmObjectLazyQuery>;
export type GetVmObjectQueryResult = Apollo.QueryResult<GetVmObjectQuery, GetVmObjectQueryVariables>;
export const GetVmConsoleDocument = gql`
    query GetVmConsole($vmObjectId: ID!, $consoleType: ConsoleType!) {
  console(vmObjectId: $vmObjectId, consoleType: $consoleType)
}
    `;

/**
 * __useGetVmConsoleQuery__
 *
 * To run a query within a React component, call `useGetVmConsoleQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetVmConsoleQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetVmConsoleQuery({
 *   variables: {
 *      vmObjectId: // value for 'vmObjectId'
 *      consoleType: // value for 'consoleType'
 *   },
 * });
 */
export function useGetVmConsoleQuery(baseOptions: Apollo.QueryHookOptions<GetVmConsoleQuery, GetVmConsoleQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetVmConsoleQuery, GetVmConsoleQueryVariables>(GetVmConsoleDocument, options);
      }
export function useGetVmConsoleLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetVmConsoleQuery, GetVmConsoleQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetVmConsoleQuery, GetVmConsoleQueryVariables>(GetVmConsoleDocument, options);
        }
export type GetVmConsoleQueryHookResult = ReturnType<typeof useGetVmConsoleQuery>;
export type GetVmConsoleLazyQueryHookResult = ReturnType<typeof useGetVmConsoleLazyQuery>;
export type GetVmConsoleQueryResult = Apollo.QueryResult<GetVmConsoleQuery, GetVmConsoleQueryVariables>;
export const RebootVmDocument = gql`
    mutation RebootVm($vmObjectId: ID!, $rebootType: RebootType!) {
  reboot(vmObjectId: $vmObjectId, rebootType: $rebootType)
}
    `;
export type RebootVmMutationFn = Apollo.MutationFunction<RebootVmMutation, RebootVmMutationVariables>;

/**
 * __useRebootVmMutation__
 *
 * To run a mutation, you first call `useRebootVmMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useRebootVmMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [rebootVmMutation, { data, loading, error }] = useRebootVmMutation({
 *   variables: {
 *      vmObjectId: // value for 'vmObjectId'
 *      rebootType: // value for 'rebootType'
 *   },
 * });
 */
export function useRebootVmMutation(baseOptions?: Apollo.MutationHookOptions<RebootVmMutation, RebootVmMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<RebootVmMutation, RebootVmMutationVariables>(RebootVmDocument, options);
      }
export type RebootVmMutationHookResult = ReturnType<typeof useRebootVmMutation>;
export type RebootVmMutationResult = Apollo.MutationResult<RebootVmMutation>;
export type RebootVmMutationOptions = Apollo.BaseMutationOptions<RebootVmMutation, RebootVmMutationVariables>;
export const PowerOnVmDocument = gql`
    mutation PowerOnVm($vmObjectId: ID!) {
  powerOn(vmObjectId: $vmObjectId)
}
    `;
export type PowerOnVmMutationFn = Apollo.MutationFunction<PowerOnVmMutation, PowerOnVmMutationVariables>;

/**
 * __usePowerOnVmMutation__
 *
 * To run a mutation, you first call `usePowerOnVmMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `usePowerOnVmMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [powerOnVmMutation, { data, loading, error }] = usePowerOnVmMutation({
 *   variables: {
 *      vmObjectId: // value for 'vmObjectId'
 *   },
 * });
 */
export function usePowerOnVmMutation(baseOptions?: Apollo.MutationHookOptions<PowerOnVmMutation, PowerOnVmMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<PowerOnVmMutation, PowerOnVmMutationVariables>(PowerOnVmDocument, options);
      }
export type PowerOnVmMutationHookResult = ReturnType<typeof usePowerOnVmMutation>;
export type PowerOnVmMutationResult = Apollo.MutationResult<PowerOnVmMutation>;
export type PowerOnVmMutationOptions = Apollo.BaseMutationOptions<PowerOnVmMutation, PowerOnVmMutationVariables>;
export const PowerOffVmDocument = gql`
    mutation PowerOffVm($vmObjectId: ID!) {
  powerOff(vmObjectId: $vmObjectId)
}
    `;
export type PowerOffVmMutationFn = Apollo.MutationFunction<PowerOffVmMutation, PowerOffVmMutationVariables>;

/**
 * __usePowerOffVmMutation__
 *
 * To run a mutation, you first call `usePowerOffVmMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `usePowerOffVmMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [powerOffVmMutation, { data, loading, error }] = usePowerOffVmMutation({
 *   variables: {
 *      vmObjectId: // value for 'vmObjectId'
 *   },
 * });
 */
export function usePowerOffVmMutation(baseOptions?: Apollo.MutationHookOptions<PowerOffVmMutation, PowerOffVmMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<PowerOffVmMutation, PowerOffVmMutationVariables>(PowerOffVmDocument, options);
      }
export type PowerOffVmMutationHookResult = ReturnType<typeof usePowerOffVmMutation>;
export type PowerOffVmMutationResult = Apollo.MutationResult<PowerOffVmMutation>;
export type PowerOffVmMutationOptions = Apollo.BaseMutationOptions<PowerOffVmMutation, PowerOffVmMutationVariables>;