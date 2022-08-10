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

export enum AuthProvider {
  Gitlab = 'GITLAB',
  Local = 'LOCAL',
  Undefined = 'UNDEFINED'
}

export type Competition = {
  __typename?: 'Competition';
  CompetitionToProvider: Provider;
  CompetitionToTeams: Array<Maybe<Team>>;
  ID: Scalars['ID'];
  Name: Scalars['String'];
};

export type CompetitionInput = {
  CompetitionToProvider: Scalars['ID'];
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
  batchCreateTeams: Array<Team>;
  batchCreateVmObjects: Array<VmObject>;
  changePassword: Scalars['Boolean'];
  createCompetition: Competition;
  createProvider: Provider;
  createTeam: Team;
  createUser: User;
  createVmObject: VmObject;
  deleteCompetition: Scalars['Boolean'];
  deleteProvider: Scalars['Boolean'];
  deleteTeam: Scalars['Boolean'];
  deleteUser: Scalars['Boolean'];
  deleteVmObject: Scalars['Boolean'];
  powerOff: Scalars['Boolean'];
  powerOn: Scalars['Boolean'];
  reboot: Scalars['Boolean'];
  updateCompetition: Competition;
  updateProvider: Provider;
  updateTeam: Team;
  updateUser: User;
  updateVmObject: VmObject;
};


export type MutationBatchCreateTeamsArgs = {
  input: Array<TeamInput>;
};


export type MutationBatchCreateVmObjectsArgs = {
  input: Array<VmObjectInput>;
};


export type MutationChangePasswordArgs = {
  id: Scalars['ID'];
  password: Scalars['String'];
};


export type MutationCreateCompetitionArgs = {
  input: CompetitionInput;
};


export type MutationCreateProviderArgs = {
  input: ProviderInput;
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


export type MutationDeleteProviderArgs = {
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


export type MutationUpdateProviderArgs = {
  input: ProviderInput;
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

export type Provider = {
  __typename?: 'Provider';
  Config: Scalars['String'];
  ID: Scalars['ID'];
  Name: Scalars['String'];
  Type: Scalars['String'];
};

export type ProviderInput = {
  Config: Scalars['String'];
  ID?: InputMaybe<Scalars['ID']>;
  Name: Scalars['String'];
  Type: Scalars['String'];
};

export type Query = {
  __typename?: 'Query';
  competitions: Array<Competition>;
  console: Scalars['String'];
  getCompetition: Competition;
  getProvider: Provider;
  getTeam: Team;
  getUser: User;
  getVmObject: VmObject;
  listProviderVms: Array<SkeletonVmObject>;
  me: User;
  myCompetition: Competition;
  myTeam: Team;
  myVmObjects: Array<VmObject>;
  providers: Array<Provider>;
  teams: Array<Team>;
  users: Array<User>;
  validateConfig: Scalars['Boolean'];
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


export type QueryGetProviderArgs = {
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


export type QueryListProviderVmsArgs = {
  id: Scalars['ID'];
};


export type QueryValidateConfigArgs = {
  config: Scalars['String'];
  type: Scalars['String'];
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

export type SkeletonVmObject = {
  __typename?: 'SkeletonVmObject';
  IPAddresses: Array<Scalars['String']>;
  Identifier: Scalars['String'];
  Name: Scalars['String'];
};

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
  Provider: AuthProvider;
  Role: Role;
  UserToTeam?: Maybe<Team>;
  Username: Scalars['String'];
};

export type UserInput = {
  FirstName: Scalars['String'];
  ID?: InputMaybe<Scalars['ID']>;
  LastName: Scalars['String'];
  Provider: AuthProvider;
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

export type CompetitionFragmentFragment = { __typename?: 'Competition', ID: string, Name: string, CompetitionToProvider: { __typename?: 'Provider', ID: string, Name: string, Type: string } };

export type GetCompTeamSearchValuesQueryVariables = Exact<{ [key: string]: never; }>;


export type GetCompTeamSearchValuesQuery = { __typename?: 'Query', teams: Array<{ __typename?: 'Team', ID: string, TeamNumber: number, Name?: string | null, TeamToCompetition: { __typename?: 'Competition', ID: string, Name: string } }> };

export type ListCompetitionsQueryVariables = Exact<{ [key: string]: never; }>;


export type ListCompetitionsQuery = { __typename?: 'Query', competitions: Array<{ __typename?: 'Competition', ID: string, Name: string, CompetitionToTeams: Array<{ __typename?: 'Team', ID: string, Name?: string | null, TeamNumber: number } | null>, CompetitionToProvider: { __typename?: 'Provider', ID: string, Name: string, Type: string } }> };

export type GetCompetitionQueryVariables = Exact<{
  id: Scalars['ID'];
}>;


export type GetCompetitionQuery = { __typename?: 'Query', getCompetition: { __typename?: 'Competition', ID: string, Name: string, CompetitionToProvider: { __typename?: 'Provider', ID: string, Name: string, Type: string } } };

export type UpdateCompetitionMutationVariables = Exact<{
  competition: CompetitionInput;
}>;


export type UpdateCompetitionMutation = { __typename?: 'Mutation', updateCompetition: { __typename?: 'Competition', ID: string, Name: string, CompetitionToProvider: { __typename?: 'Provider', ID: string, Name: string, Type: string } } };

export type CreateCompetitionMutationVariables = Exact<{
  competition: CompetitionInput;
}>;


export type CreateCompetitionMutation = { __typename?: 'Mutation', createCompetition: { __typename?: 'Competition', ID: string, Name: string, CompetitionToProvider: { __typename?: 'Provider', ID: string, Name: string, Type: string } } };

export type ProviderFragmentFragment = { __typename?: 'Provider', ID: string, Name: string, Type: string, Config: string };

export type ListProvidersQueryVariables = Exact<{ [key: string]: never; }>;


export type ListProvidersQuery = { __typename?: 'Query', providers: Array<{ __typename?: 'Provider', ID: string, Name: string, Type: string, Config: string }> };

export type GetProviderQueryVariables = Exact<{
  id: Scalars['ID'];
}>;


export type GetProviderQuery = { __typename?: 'Query', getProvider: { __typename?: 'Provider', ID: string, Name: string, Type: string, Config: string } };

export type ValidateConfigQueryVariables = Exact<{
  type: Scalars['String'];
  config: Scalars['String'];
}>;


export type ValidateConfigQuery = { __typename?: 'Query', validateConfig: boolean };

export type ListProviderVmsQueryVariables = Exact<{
  id: Scalars['ID'];
}>;


export type ListProviderVmsQuery = { __typename?: 'Query', listProviderVms: Array<{ __typename?: 'SkeletonVmObject', Identifier: string, Name: string, IPAddresses: Array<string> }> };

export type UpdateProviderMutationVariables = Exact<{
  provider: ProviderInput;
}>;


export type UpdateProviderMutation = { __typename?: 'Mutation', updateProvider: { __typename?: 'Provider', ID: string, Name: string, Type: string, Config: string } };

export type CreateProviderMutationVariables = Exact<{
  provider: ProviderInput;
}>;


export type CreateProviderMutation = { __typename?: 'Mutation', createProvider: { __typename?: 'Provider', ID: string, Name: string, Type: string, Config: string } };

export type TeamFragmentFragment = { __typename?: 'Team', ID: string, TeamNumber: number, Name?: string | null, TeamToCompetition: { __typename?: 'Competition', ID: string, Name: string } };

export type ListTeamsQueryVariables = Exact<{ [key: string]: never; }>;


export type ListTeamsQuery = { __typename?: 'Query', teams: Array<{ __typename?: 'Team', ID: string, TeamNumber: number, Name?: string | null, TeamToCompetition: { __typename?: 'Competition', ID: string, Name: string } }> };

export type BatchCreateTeamsMutationVariables = Exact<{
  teams: Array<TeamInput> | TeamInput;
}>;


export type BatchCreateTeamsMutation = { __typename?: 'Mutation', batchCreateTeams: Array<{ __typename?: 'Team', ID: string, TeamNumber: number, Name?: string | null, TeamToCompetition: { __typename?: 'Competition', ID: string, Name: string } }> };

export type UserFragmentFragment = { __typename?: 'User', ID: string, Username: string, FirstName: string, LastName: string, Provider: AuthProvider, Role: Role };

export type AdminUserFragmentFragment = { __typename?: 'User', ID: string, Username: string, FirstName: string, LastName: string, Provider: AuthProvider, Role: Role, UserToTeam?: { __typename?: 'Team', ID: string, Name?: string | null, TeamNumber: number, TeamToCompetition: { __typename?: 'Competition', ID: string, Name: string } } | null };

export type GetCurrentUserQueryVariables = Exact<{ [key: string]: never; }>;


export type GetCurrentUserQuery = { __typename?: 'Query', me: { __typename?: 'User', ID: string, Username: string, FirstName: string, LastName: string, Provider: AuthProvider, Role: Role } };

export type ListUsersQueryVariables = Exact<{ [key: string]: never; }>;


export type ListUsersQuery = { __typename?: 'Query', users: Array<{ __typename?: 'User', ID: string, Username: string, FirstName: string, LastName: string, Provider: AuthProvider, Role: Role, UserToTeam?: { __typename?: 'Team', ID: string, Name?: string | null, TeamNumber: number, TeamToCompetition: { __typename?: 'Competition', ID: string, Name: string } } | null }> };

export type GetUserQueryVariables = Exact<{
  id: Scalars['ID'];
}>;


export type GetUserQuery = { __typename?: 'Query', getUser: { __typename?: 'User', ID: string, Username: string, FirstName: string, LastName: string, Provider: AuthProvider, Role: Role, UserToTeam?: { __typename?: 'Team', ID: string, Name?: string | null, TeamNumber: number, TeamToCompetition: { __typename?: 'Competition', ID: string, Name: string } } | null } };

export type UpdateUserMutationVariables = Exact<{
  user: UserInput;
}>;


export type UpdateUserMutation = { __typename?: 'Mutation', updateUser: { __typename?: 'User', ID: string, Username: string, FirstName: string, LastName: string, Provider: AuthProvider, Role: Role, UserToTeam?: { __typename?: 'Team', ID: string, Name?: string | null, TeamNumber: number, TeamToCompetition: { __typename?: 'Competition', ID: string, Name: string } } | null } };

export type CreateUserMutationVariables = Exact<{
  user: UserInput;
}>;


export type CreateUserMutation = { __typename?: 'Mutation', createUser: { __typename?: 'User', ID: string, Username: string, FirstName: string, LastName: string, Provider: AuthProvider, Role: Role, UserToTeam?: { __typename?: 'Team', ID: string, Name?: string | null, TeamNumber: number, TeamToCompetition: { __typename?: 'Competition', ID: string, Name: string } } | null } };

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

export type UpdateVmObjectMutationVariables = Exact<{
  vmObject: VmObjectInput;
}>;


export type UpdateVmObjectMutation = { __typename?: 'Mutation', updateVmObject: { __typename?: 'VmObject', ID: string, Identifier: string, Name: string, IPAddresses: Array<string>, VmObjectToTeam?: { __typename?: 'Team', ID: string, TeamNumber: number, Name?: string | null, TeamToCompetition: { __typename?: 'Competition', ID: string, Name: string } } | null } };

export type CreateVmObjectMutationVariables = Exact<{
  vmObject: VmObjectInput;
}>;


export type CreateVmObjectMutation = { __typename?: 'Mutation', createVmObject: { __typename?: 'VmObject', ID: string, Identifier: string, Name: string, IPAddresses: Array<string>, VmObjectToTeam?: { __typename?: 'Team', ID: string, TeamNumber: number, Name?: string | null, TeamToCompetition: { __typename?: 'Competition', ID: string, Name: string } } | null } };

export type BatchCreateVmObjectsMutationVariables = Exact<{
  vmObjects: Array<VmObjectInput> | VmObjectInput;
}>;


export type BatchCreateVmObjectsMutation = { __typename?: 'Mutation', batchCreateVmObjects: Array<{ __typename?: 'VmObject', ID: string, Identifier: string, Name: string, IPAddresses: Array<string>, VmObjectToTeam?: { __typename?: 'Team', ID: string, TeamNumber: number, Name?: string | null, TeamToCompetition: { __typename?: 'Competition', ID: string, Name: string } } | null }> };

export const CompetitionFragmentFragmentDoc = gql`
    fragment CompetitionFragment on Competition {
  ID
  Name
  CompetitionToProvider {
    ID
    Name
    Type
  }
}
    `;
export const ProviderFragmentFragmentDoc = gql`
    fragment ProviderFragment on Provider {
  ID
  Name
  Type
  Config
}
    `;
export const TeamFragmentFragmentDoc = gql`
    fragment TeamFragment on Team {
  ID
  TeamNumber
  Name
  TeamToCompetition {
    ID
    Name
  }
}
    `;
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
export const ListCompetitionsDocument = gql`
    query ListCompetitions {
  competitions {
    ...CompetitionFragment
    CompetitionToTeams {
      ID
      Name
      TeamNumber
    }
  }
}
    ${CompetitionFragmentFragmentDoc}`;

/**
 * __useListCompetitionsQuery__
 *
 * To run a query within a React component, call `useListCompetitionsQuery` and pass it any options that fit your needs.
 * When your component renders, `useListCompetitionsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useListCompetitionsQuery({
 *   variables: {
 *   },
 * });
 */
export function useListCompetitionsQuery(baseOptions?: Apollo.QueryHookOptions<ListCompetitionsQuery, ListCompetitionsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<ListCompetitionsQuery, ListCompetitionsQueryVariables>(ListCompetitionsDocument, options);
      }
export function useListCompetitionsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<ListCompetitionsQuery, ListCompetitionsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<ListCompetitionsQuery, ListCompetitionsQueryVariables>(ListCompetitionsDocument, options);
        }
export type ListCompetitionsQueryHookResult = ReturnType<typeof useListCompetitionsQuery>;
export type ListCompetitionsLazyQueryHookResult = ReturnType<typeof useListCompetitionsLazyQuery>;
export type ListCompetitionsQueryResult = Apollo.QueryResult<ListCompetitionsQuery, ListCompetitionsQueryVariables>;
export const GetCompetitionDocument = gql`
    query GetCompetition($id: ID!) {
  getCompetition(id: $id) {
    ...CompetitionFragment
  }
}
    ${CompetitionFragmentFragmentDoc}`;

/**
 * __useGetCompetitionQuery__
 *
 * To run a query within a React component, call `useGetCompetitionQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetCompetitionQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetCompetitionQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useGetCompetitionQuery(baseOptions: Apollo.QueryHookOptions<GetCompetitionQuery, GetCompetitionQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetCompetitionQuery, GetCompetitionQueryVariables>(GetCompetitionDocument, options);
      }
export function useGetCompetitionLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetCompetitionQuery, GetCompetitionQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetCompetitionQuery, GetCompetitionQueryVariables>(GetCompetitionDocument, options);
        }
export type GetCompetitionQueryHookResult = ReturnType<typeof useGetCompetitionQuery>;
export type GetCompetitionLazyQueryHookResult = ReturnType<typeof useGetCompetitionLazyQuery>;
export type GetCompetitionQueryResult = Apollo.QueryResult<GetCompetitionQuery, GetCompetitionQueryVariables>;
export const UpdateCompetitionDocument = gql`
    mutation UpdateCompetition($competition: CompetitionInput!) {
  updateCompetition(input: $competition) {
    ...CompetitionFragment
  }
}
    ${CompetitionFragmentFragmentDoc}`;
export type UpdateCompetitionMutationFn = Apollo.MutationFunction<UpdateCompetitionMutation, UpdateCompetitionMutationVariables>;

/**
 * __useUpdateCompetitionMutation__
 *
 * To run a mutation, you first call `useUpdateCompetitionMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateCompetitionMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateCompetitionMutation, { data, loading, error }] = useUpdateCompetitionMutation({
 *   variables: {
 *      competition: // value for 'competition'
 *   },
 * });
 */
export function useUpdateCompetitionMutation(baseOptions?: Apollo.MutationHookOptions<UpdateCompetitionMutation, UpdateCompetitionMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateCompetitionMutation, UpdateCompetitionMutationVariables>(UpdateCompetitionDocument, options);
      }
export type UpdateCompetitionMutationHookResult = ReturnType<typeof useUpdateCompetitionMutation>;
export type UpdateCompetitionMutationResult = Apollo.MutationResult<UpdateCompetitionMutation>;
export type UpdateCompetitionMutationOptions = Apollo.BaseMutationOptions<UpdateCompetitionMutation, UpdateCompetitionMutationVariables>;
export const CreateCompetitionDocument = gql`
    mutation CreateCompetition($competition: CompetitionInput!) {
  createCompetition(input: $competition) {
    ...CompetitionFragment
  }
}
    ${CompetitionFragmentFragmentDoc}`;
export type CreateCompetitionMutationFn = Apollo.MutationFunction<CreateCompetitionMutation, CreateCompetitionMutationVariables>;

/**
 * __useCreateCompetitionMutation__
 *
 * To run a mutation, you first call `useCreateCompetitionMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateCompetitionMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createCompetitionMutation, { data, loading, error }] = useCreateCompetitionMutation({
 *   variables: {
 *      competition: // value for 'competition'
 *   },
 * });
 */
export function useCreateCompetitionMutation(baseOptions?: Apollo.MutationHookOptions<CreateCompetitionMutation, CreateCompetitionMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateCompetitionMutation, CreateCompetitionMutationVariables>(CreateCompetitionDocument, options);
      }
export type CreateCompetitionMutationHookResult = ReturnType<typeof useCreateCompetitionMutation>;
export type CreateCompetitionMutationResult = Apollo.MutationResult<CreateCompetitionMutation>;
export type CreateCompetitionMutationOptions = Apollo.BaseMutationOptions<CreateCompetitionMutation, CreateCompetitionMutationVariables>;
export const ListProvidersDocument = gql`
    query ListProviders {
  providers {
    ...ProviderFragment
  }
}
    ${ProviderFragmentFragmentDoc}`;

/**
 * __useListProvidersQuery__
 *
 * To run a query within a React component, call `useListProvidersQuery` and pass it any options that fit your needs.
 * When your component renders, `useListProvidersQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useListProvidersQuery({
 *   variables: {
 *   },
 * });
 */
export function useListProvidersQuery(baseOptions?: Apollo.QueryHookOptions<ListProvidersQuery, ListProvidersQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<ListProvidersQuery, ListProvidersQueryVariables>(ListProvidersDocument, options);
      }
export function useListProvidersLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<ListProvidersQuery, ListProvidersQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<ListProvidersQuery, ListProvidersQueryVariables>(ListProvidersDocument, options);
        }
export type ListProvidersQueryHookResult = ReturnType<typeof useListProvidersQuery>;
export type ListProvidersLazyQueryHookResult = ReturnType<typeof useListProvidersLazyQuery>;
export type ListProvidersQueryResult = Apollo.QueryResult<ListProvidersQuery, ListProvidersQueryVariables>;
export const GetProviderDocument = gql`
    query GetProvider($id: ID!) {
  getProvider(id: $id) {
    ...ProviderFragment
  }
}
    ${ProviderFragmentFragmentDoc}`;

/**
 * __useGetProviderQuery__
 *
 * To run a query within a React component, call `useGetProviderQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetProviderQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetProviderQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useGetProviderQuery(baseOptions: Apollo.QueryHookOptions<GetProviderQuery, GetProviderQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetProviderQuery, GetProviderQueryVariables>(GetProviderDocument, options);
      }
export function useGetProviderLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetProviderQuery, GetProviderQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetProviderQuery, GetProviderQueryVariables>(GetProviderDocument, options);
        }
export type GetProviderQueryHookResult = ReturnType<typeof useGetProviderQuery>;
export type GetProviderLazyQueryHookResult = ReturnType<typeof useGetProviderLazyQuery>;
export type GetProviderQueryResult = Apollo.QueryResult<GetProviderQuery, GetProviderQueryVariables>;
export const ValidateConfigDocument = gql`
    query ValidateConfig($type: String!, $config: String!) {
  validateConfig(type: $type, config: $config)
}
    `;

/**
 * __useValidateConfigQuery__
 *
 * To run a query within a React component, call `useValidateConfigQuery` and pass it any options that fit your needs.
 * When your component renders, `useValidateConfigQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useValidateConfigQuery({
 *   variables: {
 *      type: // value for 'type'
 *      config: // value for 'config'
 *   },
 * });
 */
export function useValidateConfigQuery(baseOptions: Apollo.QueryHookOptions<ValidateConfigQuery, ValidateConfigQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<ValidateConfigQuery, ValidateConfigQueryVariables>(ValidateConfigDocument, options);
      }
export function useValidateConfigLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<ValidateConfigQuery, ValidateConfigQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<ValidateConfigQuery, ValidateConfigQueryVariables>(ValidateConfigDocument, options);
        }
export type ValidateConfigQueryHookResult = ReturnType<typeof useValidateConfigQuery>;
export type ValidateConfigLazyQueryHookResult = ReturnType<typeof useValidateConfigLazyQuery>;
export type ValidateConfigQueryResult = Apollo.QueryResult<ValidateConfigQuery, ValidateConfigQueryVariables>;
export const ListProviderVmsDocument = gql`
    query ListProviderVms($id: ID!) {
  listProviderVms(id: $id) {
    Identifier
    Name
    IPAddresses
  }
}
    `;

/**
 * __useListProviderVmsQuery__
 *
 * To run a query within a React component, call `useListProviderVmsQuery` and pass it any options that fit your needs.
 * When your component renders, `useListProviderVmsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useListProviderVmsQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useListProviderVmsQuery(baseOptions: Apollo.QueryHookOptions<ListProviderVmsQuery, ListProviderVmsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<ListProviderVmsQuery, ListProviderVmsQueryVariables>(ListProviderVmsDocument, options);
      }
export function useListProviderVmsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<ListProviderVmsQuery, ListProviderVmsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<ListProviderVmsQuery, ListProviderVmsQueryVariables>(ListProviderVmsDocument, options);
        }
export type ListProviderVmsQueryHookResult = ReturnType<typeof useListProviderVmsQuery>;
export type ListProviderVmsLazyQueryHookResult = ReturnType<typeof useListProviderVmsLazyQuery>;
export type ListProviderVmsQueryResult = Apollo.QueryResult<ListProviderVmsQuery, ListProviderVmsQueryVariables>;
export const UpdateProviderDocument = gql`
    mutation UpdateProvider($provider: ProviderInput!) {
  updateProvider(input: $provider) {
    ...ProviderFragment
  }
}
    ${ProviderFragmentFragmentDoc}`;
export type UpdateProviderMutationFn = Apollo.MutationFunction<UpdateProviderMutation, UpdateProviderMutationVariables>;

/**
 * __useUpdateProviderMutation__
 *
 * To run a mutation, you first call `useUpdateProviderMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateProviderMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateProviderMutation, { data, loading, error }] = useUpdateProviderMutation({
 *   variables: {
 *      provider: // value for 'provider'
 *   },
 * });
 */
export function useUpdateProviderMutation(baseOptions?: Apollo.MutationHookOptions<UpdateProviderMutation, UpdateProviderMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateProviderMutation, UpdateProviderMutationVariables>(UpdateProviderDocument, options);
      }
export type UpdateProviderMutationHookResult = ReturnType<typeof useUpdateProviderMutation>;
export type UpdateProviderMutationResult = Apollo.MutationResult<UpdateProviderMutation>;
export type UpdateProviderMutationOptions = Apollo.BaseMutationOptions<UpdateProviderMutation, UpdateProviderMutationVariables>;
export const CreateProviderDocument = gql`
    mutation CreateProvider($provider: ProviderInput!) {
  createProvider(input: $provider) {
    ...ProviderFragment
  }
}
    ${ProviderFragmentFragmentDoc}`;
export type CreateProviderMutationFn = Apollo.MutationFunction<CreateProviderMutation, CreateProviderMutationVariables>;

/**
 * __useCreateProviderMutation__
 *
 * To run a mutation, you first call `useCreateProviderMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateProviderMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createProviderMutation, { data, loading, error }] = useCreateProviderMutation({
 *   variables: {
 *      provider: // value for 'provider'
 *   },
 * });
 */
export function useCreateProviderMutation(baseOptions?: Apollo.MutationHookOptions<CreateProviderMutation, CreateProviderMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateProviderMutation, CreateProviderMutationVariables>(CreateProviderDocument, options);
      }
export type CreateProviderMutationHookResult = ReturnType<typeof useCreateProviderMutation>;
export type CreateProviderMutationResult = Apollo.MutationResult<CreateProviderMutation>;
export type CreateProviderMutationOptions = Apollo.BaseMutationOptions<CreateProviderMutation, CreateProviderMutationVariables>;
export const ListTeamsDocument = gql`
    query ListTeams {
  teams {
    ...TeamFragment
  }
}
    ${TeamFragmentFragmentDoc}`;

/**
 * __useListTeamsQuery__
 *
 * To run a query within a React component, call `useListTeamsQuery` and pass it any options that fit your needs.
 * When your component renders, `useListTeamsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useListTeamsQuery({
 *   variables: {
 *   },
 * });
 */
export function useListTeamsQuery(baseOptions?: Apollo.QueryHookOptions<ListTeamsQuery, ListTeamsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<ListTeamsQuery, ListTeamsQueryVariables>(ListTeamsDocument, options);
      }
export function useListTeamsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<ListTeamsQuery, ListTeamsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<ListTeamsQuery, ListTeamsQueryVariables>(ListTeamsDocument, options);
        }
export type ListTeamsQueryHookResult = ReturnType<typeof useListTeamsQuery>;
export type ListTeamsLazyQueryHookResult = ReturnType<typeof useListTeamsLazyQuery>;
export type ListTeamsQueryResult = Apollo.QueryResult<ListTeamsQuery, ListTeamsQueryVariables>;
export const BatchCreateTeamsDocument = gql`
    mutation BatchCreateTeams($teams: [TeamInput!]!) {
  batchCreateTeams(input: $teams) {
    ...TeamFragment
  }
}
    ${TeamFragmentFragmentDoc}`;
export type BatchCreateTeamsMutationFn = Apollo.MutationFunction<BatchCreateTeamsMutation, BatchCreateTeamsMutationVariables>;

/**
 * __useBatchCreateTeamsMutation__
 *
 * To run a mutation, you first call `useBatchCreateTeamsMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useBatchCreateTeamsMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [batchCreateTeamsMutation, { data, loading, error }] = useBatchCreateTeamsMutation({
 *   variables: {
 *      teams: // value for 'teams'
 *   },
 * });
 */
export function useBatchCreateTeamsMutation(baseOptions?: Apollo.MutationHookOptions<BatchCreateTeamsMutation, BatchCreateTeamsMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<BatchCreateTeamsMutation, BatchCreateTeamsMutationVariables>(BatchCreateTeamsDocument, options);
      }
export type BatchCreateTeamsMutationHookResult = ReturnType<typeof useBatchCreateTeamsMutation>;
export type BatchCreateTeamsMutationResult = Apollo.MutationResult<BatchCreateTeamsMutation>;
export type BatchCreateTeamsMutationOptions = Apollo.BaseMutationOptions<BatchCreateTeamsMutation, BatchCreateTeamsMutationVariables>;
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
export const ListUsersDocument = gql`
    query ListUsers {
  users {
    ...AdminUserFragment
  }
}
    ${AdminUserFragmentFragmentDoc}`;

/**
 * __useListUsersQuery__
 *
 * To run a query within a React component, call `useListUsersQuery` and pass it any options that fit your needs.
 * When your component renders, `useListUsersQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useListUsersQuery({
 *   variables: {
 *   },
 * });
 */
export function useListUsersQuery(baseOptions?: Apollo.QueryHookOptions<ListUsersQuery, ListUsersQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<ListUsersQuery, ListUsersQueryVariables>(ListUsersDocument, options);
      }
export function useListUsersLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<ListUsersQuery, ListUsersQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<ListUsersQuery, ListUsersQueryVariables>(ListUsersDocument, options);
        }
export type ListUsersQueryHookResult = ReturnType<typeof useListUsersQuery>;
export type ListUsersLazyQueryHookResult = ReturnType<typeof useListUsersLazyQuery>;
export type ListUsersQueryResult = Apollo.QueryResult<ListUsersQuery, ListUsersQueryVariables>;
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
export const UpdateVmObjectDocument = gql`
    mutation UpdateVmObject($vmObject: VmObjectInput!) {
  updateVmObject(input: $vmObject) {
    ...VmObjectFragment
  }
}
    ${VmObjectFragmentFragmentDoc}`;
export type UpdateVmObjectMutationFn = Apollo.MutationFunction<UpdateVmObjectMutation, UpdateVmObjectMutationVariables>;

/**
 * __useUpdateVmObjectMutation__
 *
 * To run a mutation, you first call `useUpdateVmObjectMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateVmObjectMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateVmObjectMutation, { data, loading, error }] = useUpdateVmObjectMutation({
 *   variables: {
 *      vmObject: // value for 'vmObject'
 *   },
 * });
 */
export function useUpdateVmObjectMutation(baseOptions?: Apollo.MutationHookOptions<UpdateVmObjectMutation, UpdateVmObjectMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateVmObjectMutation, UpdateVmObjectMutationVariables>(UpdateVmObjectDocument, options);
      }
export type UpdateVmObjectMutationHookResult = ReturnType<typeof useUpdateVmObjectMutation>;
export type UpdateVmObjectMutationResult = Apollo.MutationResult<UpdateVmObjectMutation>;
export type UpdateVmObjectMutationOptions = Apollo.BaseMutationOptions<UpdateVmObjectMutation, UpdateVmObjectMutationVariables>;
export const CreateVmObjectDocument = gql`
    mutation CreateVmObject($vmObject: VmObjectInput!) {
  createVmObject(input: $vmObject) {
    ...VmObjectFragment
  }
}
    ${VmObjectFragmentFragmentDoc}`;
export type CreateVmObjectMutationFn = Apollo.MutationFunction<CreateVmObjectMutation, CreateVmObjectMutationVariables>;

/**
 * __useCreateVmObjectMutation__
 *
 * To run a mutation, you first call `useCreateVmObjectMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateVmObjectMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createVmObjectMutation, { data, loading, error }] = useCreateVmObjectMutation({
 *   variables: {
 *      vmObject: // value for 'vmObject'
 *   },
 * });
 */
export function useCreateVmObjectMutation(baseOptions?: Apollo.MutationHookOptions<CreateVmObjectMutation, CreateVmObjectMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateVmObjectMutation, CreateVmObjectMutationVariables>(CreateVmObjectDocument, options);
      }
export type CreateVmObjectMutationHookResult = ReturnType<typeof useCreateVmObjectMutation>;
export type CreateVmObjectMutationResult = Apollo.MutationResult<CreateVmObjectMutation>;
export type CreateVmObjectMutationOptions = Apollo.BaseMutationOptions<CreateVmObjectMutation, CreateVmObjectMutationVariables>;
export const BatchCreateVmObjectsDocument = gql`
    mutation BatchCreateVmObjects($vmObjects: [VmObjectInput!]!) {
  batchCreateVmObjects(input: $vmObjects) {
    ...VmObjectFragment
  }
}
    ${VmObjectFragmentFragmentDoc}`;
export type BatchCreateVmObjectsMutationFn = Apollo.MutationFunction<BatchCreateVmObjectsMutation, BatchCreateVmObjectsMutationVariables>;

/**
 * __useBatchCreateVmObjectsMutation__
 *
 * To run a mutation, you first call `useBatchCreateVmObjectsMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useBatchCreateVmObjectsMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [batchCreateVmObjectsMutation, { data, loading, error }] = useBatchCreateVmObjectsMutation({
 *   variables: {
 *      vmObjects: // value for 'vmObjects'
 *   },
 * });
 */
export function useBatchCreateVmObjectsMutation(baseOptions?: Apollo.MutationHookOptions<BatchCreateVmObjectsMutation, BatchCreateVmObjectsMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<BatchCreateVmObjectsMutation, BatchCreateVmObjectsMutationVariables>(BatchCreateVmObjectsDocument, options);
      }
export type BatchCreateVmObjectsMutationHookResult = ReturnType<typeof useBatchCreateVmObjectsMutation>;
export type BatchCreateVmObjectsMutationResult = Apollo.MutationResult<BatchCreateVmObjectsMutation>;
export type BatchCreateVmObjectsMutationOptions = Apollo.BaseMutationOptions<BatchCreateVmObjectsMutation, BatchCreateVmObjectsMutationVariables>;