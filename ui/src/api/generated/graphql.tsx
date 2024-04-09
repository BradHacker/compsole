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
  Time: any;
};

export type AccountInput = {
  FirstName: Scalars['String'];
  LastName: Scalars['String'];
};

export type Action = {
  __typename?: 'Action';
  ActionToUser?: Maybe<User>;
  ID: Scalars['ID'];
  IpAddress: Scalars['String'];
  Message: Scalars['String'];
  PerformedAt: Scalars['Time'];
  Type: ActionType;
};

export enum ActionType {
  ApiCall = 'API_CALL',
  ChangePassword = 'CHANGE_PASSWORD',
  ChangeSelfPassword = 'CHANGE_SELF_PASSWORD',
  ConsoleAccess = 'CONSOLE_ACCESS',
  CreateObject = 'CREATE_OBJECT',
  DeleteObject = 'DELETE_OBJECT',
  FailedSignIn = 'FAILED_SIGN_IN',
  PowerOff = 'POWER_OFF',
  PowerOn = 'POWER_ON',
  Reboot = 'REBOOT',
  Shutdown = 'SHUTDOWN',
  SignIn = 'SIGN_IN',
  SignOut = 'SIGN_OUT',
  Undefined = 'UNDEFINED',
  UpdateLockout = 'UPDATE_LOCKOUT',
  UpdateObject = 'UPDATE_OBJECT'
}

export type ActionsResult = {
  __typename?: 'ActionsResult';
  limit: Scalars['Int'];
  offset: Scalars['Int'];
  page: Scalars['Int'];
  results: Array<Maybe<Action>>;
  totalPages: Scalars['Int'];
  totalResults: Scalars['Int'];
  types: Array<ActionType>;
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

export type CompetitionUser = {
  __typename?: 'CompetitionUser';
  ID: Scalars['ID'];
  Password: Scalars['String'];
  UserToTeam: Team;
  Username: Scalars['String'];
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
  batchLockout: Scalars['Boolean'];
  changePassword: Scalars['Boolean'];
  changeSelfPassword: Scalars['Boolean'];
  createCompetition: Competition;
  createProvider: Provider;
  createServiceAccount: ServiceAccountDetails;
  createTeam: Team;
  createUser: User;
  createVmObject: VmObject;
  deleteCompetition: Scalars['Boolean'];
  deleteProvider: Scalars['Boolean'];
  deleteServiceAccount: Scalars['Boolean'];
  deleteTeam: Scalars['Boolean'];
  deleteUser: Scalars['Boolean'];
  deleteVmObject: Scalars['Boolean'];
  generateCompetitionUsers: Array<CompetitionUser>;
  loadProvider: Scalars['Boolean'];
  lockoutCompetition: Scalars['Boolean'];
  lockoutVm: Scalars['Boolean'];
  powerOff: Scalars['Boolean'];
  powerOn: Scalars['Boolean'];
  reboot: Scalars['Boolean'];
  updateAccount: User;
  updateCompetition: Competition;
  updateProvider: Provider;
  updateServiceAccount: ServiceAccount;
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


export type MutationBatchLockoutArgs = {
  locked: Scalars['Boolean'];
  vmObjects: Array<Scalars['ID']>;
};


export type MutationChangePasswordArgs = {
  id: Scalars['ID'];
  password: Scalars['String'];
};


export type MutationChangeSelfPasswordArgs = {
  password: Scalars['String'];
};


export type MutationCreateCompetitionArgs = {
  input: CompetitionInput;
};


export type MutationCreateProviderArgs = {
  input: ProviderInput;
};


export type MutationCreateServiceAccountArgs = {
  input: ServiceAccountInput;
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


export type MutationDeleteServiceAccountArgs = {
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


export type MutationGenerateCompetitionUsersArgs = {
  competitionId: Scalars['ID'];
  usersPerTeam: Scalars['Int'];
};


export type MutationLoadProviderArgs = {
  id: Scalars['ID'];
};


export type MutationLockoutCompetitionArgs = {
  id: Scalars['ID'];
  locked: Scalars['Boolean'];
};


export type MutationLockoutVmArgs = {
  id: Scalars['ID'];
  locked: Scalars['Boolean'];
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


export type MutationUpdateAccountArgs = {
  input: AccountInput;
};


export type MutationUpdateCompetitionArgs = {
  input: CompetitionInput;
};


export type MutationUpdateProviderArgs = {
  input: ProviderInput;
};


export type MutationUpdateServiceAccountArgs = {
  input: ServiceAccountInput;
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

export enum PowerState {
  PoweredOff = 'POWERED_OFF',
  PoweredOn = 'POWERED_ON',
  Rebooting = 'REBOOTING',
  ShuttingDown = 'SHUTTING_DOWN',
  Suspended = 'SUSPENDED',
  Unknown = 'UNKNOWN'
}

export type PowerStateUpdate = {
  __typename?: 'PowerStateUpdate';
  ID: Scalars['ID'];
  State: PowerState;
};

export type Provider = {
  __typename?: 'Provider';
  Config: Scalars['String'];
  ID: Scalars['ID'];
  Loaded: Scalars['Boolean'];
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
  actions: ActionsResult;
  competitions: Array<Competition>;
  console: Scalars['String'];
  getCompetition: Competition;
  getProvider: Provider;
  getServiceAccount: ServiceAccount;
  getTeam: Team;
  getUser: User;
  getVmObject: VmObject;
  listProviderVms: Array<SkeletonVmObject>;
  me: User;
  myCompetition: Competition;
  myTeam: Team;
  myVmObjects: Array<VmObject>;
  powerState: PowerState;
  providers: Array<Provider>;
  serviceAccounts: Array<ServiceAccount>;
  teams: Array<Team>;
  users: Array<User>;
  validateConfig: Scalars['Boolean'];
  vmObject: VmObject;
  vmObjects: Array<VmObject>;
};


export type QueryActionsArgs = {
  limit: Scalars['Int'];
  offset: Scalars['Int'];
  types: Array<ActionType>;
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


export type QueryGetServiceAccountArgs = {
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


export type QueryPowerStateArgs = {
  vmObjectId: Scalars['ID'];
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

export type ServiceAccount = {
  __typename?: 'ServiceAccount';
  Active: Scalars['Boolean'];
  ApiKey: Scalars['String'];
  DisplayName: Scalars['String'];
  ID: Scalars['ID'];
};

export type ServiceAccountDetails = {
  __typename?: 'ServiceAccountDetails';
  Active: Scalars['Boolean'];
  ApiKey: Scalars['String'];
  ApiSecret: Scalars['String'];
  DisplayName: Scalars['String'];
  ID: Scalars['ID'];
};

export type ServiceAccountInput = {
  Active: Scalars['Boolean'];
  DisplayName: Scalars['String'];
  ID?: InputMaybe<Scalars['ID']>;
};

export type SkeletonVmObject = {
  __typename?: 'SkeletonVmObject';
  IPAddresses: Array<Scalars['String']>;
  Identifier: Scalars['String'];
  Name: Scalars['String'];
};

export type Subscription = {
  __typename?: 'Subscription';
  lockout: VmObject;
  powerState: PowerStateUpdate;
};


export type SubscriptionLockoutArgs = {
  id: Scalars['ID'];
};


export type SubscriptionPowerStateArgs = {
  id: Scalars['ID'];
};

export type Team = {
  __typename?: 'Team';
  ID: Scalars['ID'];
  Name?: Maybe<Scalars['String']>;
  TeamNumber: Scalars['Int'];
  TeamToCompetition: Competition;
  TeamToVmObjects?: Maybe<Array<Maybe<VmObject>>>;
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
  Locked?: Maybe<Scalars['Boolean']>;
  Name: Scalars['String'];
  VmObjectToTeam?: Maybe<Team>;
};

export type VmObjectInput = {
  ID?: InputMaybe<Scalars['ID']>;
  IPAddresses: Array<Scalars['String']>;
  Identifier: Scalars['String'];
  Locked?: InputMaybe<Scalars['Boolean']>;
  Name: Scalars['String'];
  VmObjectToTeam?: InputMaybe<Scalars['ID']>;
};

export type ActionFragmentFragment = { __typename?: 'Action', ID: string, IpAddress: string, Type: ActionType, Message: string, PerformedAt: any, ActionToUser?: { __typename?: 'User', ID: string, Username: string, FirstName: string, LastName: string, Provider: AuthProvider, Role: Role } | null };

export type ListActionsQueryVariables = Exact<{
  offset: Scalars['Int'];
  limit: Scalars['Int'];
  types: Array<ActionType> | ActionType;
}>;


export type ListActionsQuery = { __typename?: 'Query', actions: { __typename?: 'ActionsResult', offset: number, limit: number, page: number, totalPages: number, totalResults: number, types: Array<ActionType>, results: Array<{ __typename?: 'Action', ID: string, IpAddress: string, Type: ActionType, Message: string, PerformedAt: any, ActionToUser?: { __typename?: 'User', ID: string, Username: string, FirstName: string, LastName: string, Provider: AuthProvider, Role: Role } | null } | null> } };

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

export type LockoutCompetitionMutationVariables = Exact<{
  competitionId: Scalars['ID'];
  locked: Scalars['Boolean'];
}>;


export type LockoutCompetitionMutation = { __typename?: 'Mutation', lockoutCompetition: boolean };

export type DeleteCompetitionMutationVariables = Exact<{
  competitionId: Scalars['ID'];
}>;


export type DeleteCompetitionMutation = { __typename?: 'Mutation', deleteCompetition: boolean };

export type ProviderFragmentFragment = { __typename?: 'Provider', ID: string, Name: string, Type: string, Config: string, Loaded: boolean };

export type ListProvidersQueryVariables = Exact<{ [key: string]: never; }>;


export type ListProvidersQuery = { __typename?: 'Query', providers: Array<{ __typename?: 'Provider', ID: string, Name: string, Type: string, Config: string, Loaded: boolean }> };

export type GetProviderQueryVariables = Exact<{
  id: Scalars['ID'];
}>;


export type GetProviderQuery = { __typename?: 'Query', getProvider: { __typename?: 'Provider', ID: string, Name: string, Type: string, Config: string, Loaded: boolean } };

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


export type UpdateProviderMutation = { __typename?: 'Mutation', updateProvider: { __typename?: 'Provider', ID: string, Name: string, Type: string, Config: string, Loaded: boolean } };

export type CreateProviderMutationVariables = Exact<{
  provider: ProviderInput;
}>;


export type CreateProviderMutation = { __typename?: 'Mutation', createProvider: { __typename?: 'Provider', ID: string, Name: string, Type: string, Config: string, Loaded: boolean } };

export type DeleteProviderMutationVariables = Exact<{
  providerId: Scalars['ID'];
}>;


export type DeleteProviderMutation = { __typename?: 'Mutation', deleteProvider: boolean };

export type LoadProviderMutationVariables = Exact<{
  providerId: Scalars['ID'];
}>;


export type LoadProviderMutation = { __typename?: 'Mutation', loadProvider: boolean };

export type ServiceAccountFragmentFragment = { __typename?: 'ServiceAccount', ID: string, DisplayName: string, ApiKey: string, Active: boolean };

export type ServiceAccountDetailsFragmentFragment = { __typename?: 'ServiceAccountDetails', ID: string, DisplayName: string, ApiKey: string, ApiSecret: string, Active: boolean };

export type ListServiceAccountsQueryVariables = Exact<{ [key: string]: never; }>;


export type ListServiceAccountsQuery = { __typename?: 'Query', serviceAccounts: Array<{ __typename?: 'ServiceAccount', ID: string, DisplayName: string, ApiKey: string, Active: boolean }> };

export type GetServiceAccountQueryVariables = Exact<{
  id: Scalars['ID'];
}>;


export type GetServiceAccountQuery = { __typename?: 'Query', getServiceAccount: { __typename?: 'ServiceAccount', ID: string, DisplayName: string, ApiKey: string, Active: boolean } };

export type UpdateServiceAccountMutationVariables = Exact<{
  input: ServiceAccountInput;
}>;


export type UpdateServiceAccountMutation = { __typename?: 'Mutation', updateServiceAccount: { __typename?: 'ServiceAccount', ID: string, DisplayName: string, ApiKey: string, Active: boolean } };

export type CreateServiceAccountMutationVariables = Exact<{
  input: ServiceAccountInput;
}>;


export type CreateServiceAccountMutation = { __typename?: 'Mutation', createServiceAccount: { __typename?: 'ServiceAccountDetails', ID: string, DisplayName: string, ApiKey: string, ApiSecret: string, Active: boolean } };

export type DeleteServiceAccountMutationVariables = Exact<{
  id: Scalars['ID'];
}>;


export type DeleteServiceAccountMutation = { __typename?: 'Mutation', deleteServiceAccount: boolean };

export type TeamFragmentFragment = { __typename?: 'Team', ID: string, TeamNumber: number, Name?: string | null, TeamToCompetition: { __typename?: 'Competition', ID: string, Name: string } };

export type ListTeamsQueryVariables = Exact<{ [key: string]: never; }>;


export type ListTeamsQuery = { __typename?: 'Query', teams: Array<{ __typename?: 'Team', ID: string, TeamNumber: number, Name?: string | null, TeamToCompetition: { __typename?: 'Competition', ID: string, Name: string } }> };

export type GetTeamQueryVariables = Exact<{
  id: Scalars['ID'];
}>;


export type GetTeamQuery = { __typename?: 'Query', getTeam: { __typename?: 'Team', ID: string, TeamNumber: number, Name?: string | null, TeamToCompetition: { __typename?: 'Competition', ID: string, Name: string } } };

export type UpdateTeamMutationVariables = Exact<{
  team: TeamInput;
}>;


export type UpdateTeamMutation = { __typename?: 'Mutation', updateTeam: { __typename?: 'Team', ID: string, TeamNumber: number, Name?: string | null, TeamToCompetition: { __typename?: 'Competition', ID: string, Name: string } } };

export type CreateTeamMutationVariables = Exact<{
  team: TeamInput;
}>;


export type CreateTeamMutation = { __typename?: 'Mutation', createTeam: { __typename?: 'Team', ID: string, TeamNumber: number, Name?: string | null, TeamToCompetition: { __typename?: 'Competition', ID: string, Name: string } } };

export type BatchCreateTeamsMutationVariables = Exact<{
  teams: Array<TeamInput> | TeamInput;
}>;


export type BatchCreateTeamsMutation = { __typename?: 'Mutation', batchCreateTeams: Array<{ __typename?: 'Team', ID: string, TeamNumber: number, Name?: string | null, TeamToCompetition: { __typename?: 'Competition', ID: string, Name: string } }> };

export type DeleteTeamMutationVariables = Exact<{
  teamId: Scalars['ID'];
}>;


export type DeleteTeamMutation = { __typename?: 'Mutation', deleteTeam: boolean };

export type UserFragmentFragment = { __typename?: 'User', ID: string, Username: string, FirstName: string, LastName: string, Provider: AuthProvider, Role: Role };

export type AdminUserFragmentFragment = { __typename?: 'User', ID: string, Username: string, FirstName: string, LastName: string, Provider: AuthProvider, Role: Role, UserToTeam?: { __typename?: 'Team', ID: string, Name?: string | null, TeamNumber: number, TeamToCompetition: { __typename?: 'Competition', ID: string, Name: string } } | null };

export type CompetitionUserFragmentFragment = { __typename?: 'CompetitionUser', ID: string, Username: string, Password: string, UserToTeam: { __typename?: 'Team', ID: string, TeamNumber: number, Name?: string | null, TeamToCompetition: { __typename?: 'Competition', ID: string, Name: string } } };

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

export type DeleteUserMutationVariables = Exact<{
  userId: Scalars['ID'];
}>;


export type DeleteUserMutation = { __typename?: 'Mutation', deleteUser: boolean };

export type UpdateAccountMutationVariables = Exact<{
  input: AccountInput;
}>;


export type UpdateAccountMutation = { __typename?: 'Mutation', updateAccount: { __typename?: 'User', ID: string, Username: string, FirstName: string, LastName: string, Provider: AuthProvider, Role: Role } };

export type ChangeSelfPasswordMutationVariables = Exact<{
  newPassword: Scalars['String'];
}>;


export type ChangeSelfPasswordMutation = { __typename?: 'Mutation', changeSelfPassword: boolean };

export type GenerateCompetitionUsersMutationVariables = Exact<{
  competitionId: Scalars['ID'];
  usersPerTeam: Scalars['Int'];
}>;


export type GenerateCompetitionUsersMutation = { __typename?: 'Mutation', generateCompetitionUsers: Array<{ __typename?: 'CompetitionUser', ID: string, Username: string, Password: string, UserToTeam: { __typename?: 'Team', ID: string, TeamNumber: number, Name?: string | null, TeamToCompetition: { __typename?: 'Competition', ID: string, Name: string } } }> };

export type VmObjectFragmentFragment = { __typename?: 'VmObject', ID: string, Identifier: string, Name: string, IPAddresses: Array<string>, Locked?: boolean | null, VmObjectToTeam?: { __typename?: 'Team', ID: string, TeamNumber: number, Name?: string | null, TeamToCompetition: { __typename?: 'Competition', ID: string, Name: string } } | null };

export type MyVmObjectsQueryVariables = Exact<{ [key: string]: never; }>;


export type MyVmObjectsQuery = { __typename?: 'Query', myVmObjects: Array<{ __typename?: 'VmObject', ID: string, Identifier: string, Name: string, IPAddresses: Array<string>, Locked?: boolean | null, VmObjectToTeam?: { __typename?: 'Team', ID: string, TeamNumber: number, Name?: string | null, TeamToCompetition: { __typename?: 'Competition', ID: string, Name: string } } | null }> };

export type AllVmObjectsQueryVariables = Exact<{ [key: string]: never; }>;


export type AllVmObjectsQuery = { __typename?: 'Query', vmObjects: Array<{ __typename?: 'VmObject', ID: string, Identifier: string, Name: string, IPAddresses: Array<string>, Locked?: boolean | null, VmObjectToTeam?: { __typename?: 'Team', ID: string, TeamNumber: number, Name?: string | null, TeamToCompetition: { __typename?: 'Competition', ID: string, Name: string } } | null }> };

export type GetVmObjectQueryVariables = Exact<{
  vmObjectId: Scalars['ID'];
}>;


export type GetVmObjectQuery = { __typename?: 'Query', vmObject: { __typename?: 'VmObject', ID: string, Identifier: string, Name: string, IPAddresses: Array<string>, Locked?: boolean | null, VmObjectToTeam?: { __typename?: 'Team', ID: string, TeamNumber: number, Name?: string | null, TeamToCompetition: { __typename?: 'Competition', ID: string, Name: string } } | null } };

export type GetVmConsoleQueryVariables = Exact<{
  vmObjectId: Scalars['ID'];
  consoleType: ConsoleType;
}>;


export type GetVmConsoleQuery = { __typename?: 'Query', console: string };

export type GetVmPowerStateQueryVariables = Exact<{
  vmObjectId: Scalars['ID'];
}>;


export type GetVmPowerStateQuery = { __typename?: 'Query', powerState: PowerState };

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


export type UpdateVmObjectMutation = { __typename?: 'Mutation', updateVmObject: { __typename?: 'VmObject', ID: string, Identifier: string, Name: string, IPAddresses: Array<string>, Locked?: boolean | null, VmObjectToTeam?: { __typename?: 'Team', ID: string, TeamNumber: number, Name?: string | null, TeamToCompetition: { __typename?: 'Competition', ID: string, Name: string } } | null } };

export type CreateVmObjectMutationVariables = Exact<{
  vmObject: VmObjectInput;
}>;


export type CreateVmObjectMutation = { __typename?: 'Mutation', createVmObject: { __typename?: 'VmObject', ID: string, Identifier: string, Name: string, IPAddresses: Array<string>, Locked?: boolean | null, VmObjectToTeam?: { __typename?: 'Team', ID: string, TeamNumber: number, Name?: string | null, TeamToCompetition: { __typename?: 'Competition', ID: string, Name: string } } | null } };

export type BatchCreateVmObjectsMutationVariables = Exact<{
  vmObjects: Array<VmObjectInput> | VmObjectInput;
}>;


export type BatchCreateVmObjectsMutation = { __typename?: 'Mutation', batchCreateVmObjects: Array<{ __typename?: 'VmObject', ID: string, Identifier: string, Name: string, IPAddresses: Array<string>, Locked?: boolean | null, VmObjectToTeam?: { __typename?: 'Team', ID: string, TeamNumber: number, Name?: string | null, TeamToCompetition: { __typename?: 'Competition', ID: string, Name: string } } | null }> };

export type LockoutVmMutationVariables = Exact<{
  vmObjectId: Scalars['ID'];
  locked: Scalars['Boolean'];
}>;


export type LockoutVmMutation = { __typename?: 'Mutation', lockoutVm: boolean };

export type LockoutSubscriptionVariables = Exact<{
  vmObjectId: Scalars['ID'];
}>;


export type LockoutSubscription = { __typename?: 'Subscription', lockout: { __typename?: 'VmObject', ID: string, Identifier: string, Name: string, IPAddresses: Array<string>, Locked?: boolean | null, VmObjectToTeam?: { __typename?: 'Team', ID: string, TeamNumber: number, Name?: string | null, TeamToCompetition: { __typename?: 'Competition', ID: string, Name: string } } | null } };

export type PowerStateSubscriptionVariables = Exact<{
  vmObjectId: Scalars['ID'];
}>;


export type PowerStateSubscription = { __typename?: 'Subscription', powerState: { __typename?: 'PowerStateUpdate', ID: string, State: PowerState } };

export type DeleteVmObjectMutationVariables = Exact<{
  vmObjectId: Scalars['ID'];
}>;


export type DeleteVmObjectMutation = { __typename?: 'Mutation', deleteVmObject: boolean };

export type BatchLockoutMutationVariables = Exact<{
  vmObjects: Array<Scalars['ID']> | Scalars['ID'];
  locked: Scalars['Boolean'];
}>;


export type BatchLockoutMutation = { __typename?: 'Mutation', batchLockout: boolean };

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
export const ActionFragmentFragmentDoc = gql`
    fragment ActionFragment on Action {
  ID
  IpAddress
  Type
  Message
  PerformedAt
  ActionToUser {
    ...UserFragment
  }
}
    ${UserFragmentFragmentDoc}`;
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
  Loaded
}
    `;
export const ServiceAccountFragmentFragmentDoc = gql`
    fragment ServiceAccountFragment on ServiceAccount {
  ID
  DisplayName
  ApiKey
  Active
}
    `;
export const ServiceAccountDetailsFragmentFragmentDoc = gql`
    fragment ServiceAccountDetailsFragment on ServiceAccountDetails {
  ID
  DisplayName
  ApiKey
  ApiSecret
  Active
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
export const CompetitionUserFragmentFragmentDoc = gql`
    fragment CompetitionUserFragment on CompetitionUser {
  ID
  Username
  Password
  UserToTeam {
    ...TeamFragment
  }
}
    ${TeamFragmentFragmentDoc}`;
export const VmObjectFragmentFragmentDoc = gql`
    fragment VmObjectFragment on VmObject {
  ID
  Identifier
  Name
  IPAddresses
  Locked
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
export const ListActionsDocument = gql`
    query ListActions($offset: Int!, $limit: Int!, $types: [ActionType!]!) {
  actions(offset: $offset, limit: $limit, types: $types) {
    results {
      ...ActionFragment
    }
    offset
    limit
    page
    totalPages
    totalResults
    types
  }
}
    ${ActionFragmentFragmentDoc}`;

/**
 * __useListActionsQuery__
 *
 * To run a query within a React component, call `useListActionsQuery` and pass it any options that fit your needs.
 * When your component renders, `useListActionsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useListActionsQuery({
 *   variables: {
 *      offset: // value for 'offset'
 *      limit: // value for 'limit'
 *      types: // value for 'types'
 *   },
 * });
 */
export function useListActionsQuery(baseOptions: Apollo.QueryHookOptions<ListActionsQuery, ListActionsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<ListActionsQuery, ListActionsQueryVariables>(ListActionsDocument, options);
      }
export function useListActionsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<ListActionsQuery, ListActionsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<ListActionsQuery, ListActionsQueryVariables>(ListActionsDocument, options);
        }
export type ListActionsQueryHookResult = ReturnType<typeof useListActionsQuery>;
export type ListActionsLazyQueryHookResult = ReturnType<typeof useListActionsLazyQuery>;
export type ListActionsQueryResult = Apollo.QueryResult<ListActionsQuery, ListActionsQueryVariables>;
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
export const LockoutCompetitionDocument = gql`
    mutation LockoutCompetition($competitionId: ID!, $locked: Boolean!) {
  lockoutCompetition(id: $competitionId, locked: $locked)
}
    `;
export type LockoutCompetitionMutationFn = Apollo.MutationFunction<LockoutCompetitionMutation, LockoutCompetitionMutationVariables>;

/**
 * __useLockoutCompetitionMutation__
 *
 * To run a mutation, you first call `useLockoutCompetitionMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useLockoutCompetitionMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [lockoutCompetitionMutation, { data, loading, error }] = useLockoutCompetitionMutation({
 *   variables: {
 *      competitionId: // value for 'competitionId'
 *      locked: // value for 'locked'
 *   },
 * });
 */
export function useLockoutCompetitionMutation(baseOptions?: Apollo.MutationHookOptions<LockoutCompetitionMutation, LockoutCompetitionMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<LockoutCompetitionMutation, LockoutCompetitionMutationVariables>(LockoutCompetitionDocument, options);
      }
export type LockoutCompetitionMutationHookResult = ReturnType<typeof useLockoutCompetitionMutation>;
export type LockoutCompetitionMutationResult = Apollo.MutationResult<LockoutCompetitionMutation>;
export type LockoutCompetitionMutationOptions = Apollo.BaseMutationOptions<LockoutCompetitionMutation, LockoutCompetitionMutationVariables>;
export const DeleteCompetitionDocument = gql`
    mutation DeleteCompetition($competitionId: ID!) {
  deleteCompetition(id: $competitionId)
}
    `;
export type DeleteCompetitionMutationFn = Apollo.MutationFunction<DeleteCompetitionMutation, DeleteCompetitionMutationVariables>;

/**
 * __useDeleteCompetitionMutation__
 *
 * To run a mutation, you first call `useDeleteCompetitionMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteCompetitionMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteCompetitionMutation, { data, loading, error }] = useDeleteCompetitionMutation({
 *   variables: {
 *      competitionId: // value for 'competitionId'
 *   },
 * });
 */
export function useDeleteCompetitionMutation(baseOptions?: Apollo.MutationHookOptions<DeleteCompetitionMutation, DeleteCompetitionMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<DeleteCompetitionMutation, DeleteCompetitionMutationVariables>(DeleteCompetitionDocument, options);
      }
export type DeleteCompetitionMutationHookResult = ReturnType<typeof useDeleteCompetitionMutation>;
export type DeleteCompetitionMutationResult = Apollo.MutationResult<DeleteCompetitionMutation>;
export type DeleteCompetitionMutationOptions = Apollo.BaseMutationOptions<DeleteCompetitionMutation, DeleteCompetitionMutationVariables>;
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
export const DeleteProviderDocument = gql`
    mutation DeleteProvider($providerId: ID!) {
  deleteProvider(id: $providerId)
}
    `;
export type DeleteProviderMutationFn = Apollo.MutationFunction<DeleteProviderMutation, DeleteProviderMutationVariables>;

/**
 * __useDeleteProviderMutation__
 *
 * To run a mutation, you first call `useDeleteProviderMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteProviderMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteProviderMutation, { data, loading, error }] = useDeleteProviderMutation({
 *   variables: {
 *      providerId: // value for 'providerId'
 *   },
 * });
 */
export function useDeleteProviderMutation(baseOptions?: Apollo.MutationHookOptions<DeleteProviderMutation, DeleteProviderMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<DeleteProviderMutation, DeleteProviderMutationVariables>(DeleteProviderDocument, options);
      }
export type DeleteProviderMutationHookResult = ReturnType<typeof useDeleteProviderMutation>;
export type DeleteProviderMutationResult = Apollo.MutationResult<DeleteProviderMutation>;
export type DeleteProviderMutationOptions = Apollo.BaseMutationOptions<DeleteProviderMutation, DeleteProviderMutationVariables>;
export const LoadProviderDocument = gql`
    mutation LoadProvider($providerId: ID!) {
  loadProvider(id: $providerId)
}
    `;
export type LoadProviderMutationFn = Apollo.MutationFunction<LoadProviderMutation, LoadProviderMutationVariables>;

/**
 * __useLoadProviderMutation__
 *
 * To run a mutation, you first call `useLoadProviderMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useLoadProviderMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [loadProviderMutation, { data, loading, error }] = useLoadProviderMutation({
 *   variables: {
 *      providerId: // value for 'providerId'
 *   },
 * });
 */
export function useLoadProviderMutation(baseOptions?: Apollo.MutationHookOptions<LoadProviderMutation, LoadProviderMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<LoadProviderMutation, LoadProviderMutationVariables>(LoadProviderDocument, options);
      }
export type LoadProviderMutationHookResult = ReturnType<typeof useLoadProviderMutation>;
export type LoadProviderMutationResult = Apollo.MutationResult<LoadProviderMutation>;
export type LoadProviderMutationOptions = Apollo.BaseMutationOptions<LoadProviderMutation, LoadProviderMutationVariables>;
export const ListServiceAccountsDocument = gql`
    query ListServiceAccounts {
  serviceAccounts {
    ...ServiceAccountFragment
  }
}
    ${ServiceAccountFragmentFragmentDoc}`;

/**
 * __useListServiceAccountsQuery__
 *
 * To run a query within a React component, call `useListServiceAccountsQuery` and pass it any options that fit your needs.
 * When your component renders, `useListServiceAccountsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useListServiceAccountsQuery({
 *   variables: {
 *   },
 * });
 */
export function useListServiceAccountsQuery(baseOptions?: Apollo.QueryHookOptions<ListServiceAccountsQuery, ListServiceAccountsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<ListServiceAccountsQuery, ListServiceAccountsQueryVariables>(ListServiceAccountsDocument, options);
      }
export function useListServiceAccountsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<ListServiceAccountsQuery, ListServiceAccountsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<ListServiceAccountsQuery, ListServiceAccountsQueryVariables>(ListServiceAccountsDocument, options);
        }
export type ListServiceAccountsQueryHookResult = ReturnType<typeof useListServiceAccountsQuery>;
export type ListServiceAccountsLazyQueryHookResult = ReturnType<typeof useListServiceAccountsLazyQuery>;
export type ListServiceAccountsQueryResult = Apollo.QueryResult<ListServiceAccountsQuery, ListServiceAccountsQueryVariables>;
export const GetServiceAccountDocument = gql`
    query GetServiceAccount($id: ID!) {
  getServiceAccount(id: $id) {
    ...ServiceAccountFragment
  }
}
    ${ServiceAccountFragmentFragmentDoc}`;

/**
 * __useGetServiceAccountQuery__
 *
 * To run a query within a React component, call `useGetServiceAccountQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetServiceAccountQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetServiceAccountQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useGetServiceAccountQuery(baseOptions: Apollo.QueryHookOptions<GetServiceAccountQuery, GetServiceAccountQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetServiceAccountQuery, GetServiceAccountQueryVariables>(GetServiceAccountDocument, options);
      }
export function useGetServiceAccountLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetServiceAccountQuery, GetServiceAccountQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetServiceAccountQuery, GetServiceAccountQueryVariables>(GetServiceAccountDocument, options);
        }
export type GetServiceAccountQueryHookResult = ReturnType<typeof useGetServiceAccountQuery>;
export type GetServiceAccountLazyQueryHookResult = ReturnType<typeof useGetServiceAccountLazyQuery>;
export type GetServiceAccountQueryResult = Apollo.QueryResult<GetServiceAccountQuery, GetServiceAccountQueryVariables>;
export const UpdateServiceAccountDocument = gql`
    mutation UpdateServiceAccount($input: ServiceAccountInput!) {
  updateServiceAccount(input: $input) {
    ...ServiceAccountFragment
  }
}
    ${ServiceAccountFragmentFragmentDoc}`;
export type UpdateServiceAccountMutationFn = Apollo.MutationFunction<UpdateServiceAccountMutation, UpdateServiceAccountMutationVariables>;

/**
 * __useUpdateServiceAccountMutation__
 *
 * To run a mutation, you first call `useUpdateServiceAccountMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateServiceAccountMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateServiceAccountMutation, { data, loading, error }] = useUpdateServiceAccountMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useUpdateServiceAccountMutation(baseOptions?: Apollo.MutationHookOptions<UpdateServiceAccountMutation, UpdateServiceAccountMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateServiceAccountMutation, UpdateServiceAccountMutationVariables>(UpdateServiceAccountDocument, options);
      }
export type UpdateServiceAccountMutationHookResult = ReturnType<typeof useUpdateServiceAccountMutation>;
export type UpdateServiceAccountMutationResult = Apollo.MutationResult<UpdateServiceAccountMutation>;
export type UpdateServiceAccountMutationOptions = Apollo.BaseMutationOptions<UpdateServiceAccountMutation, UpdateServiceAccountMutationVariables>;
export const CreateServiceAccountDocument = gql`
    mutation CreateServiceAccount($input: ServiceAccountInput!) {
  createServiceAccount(input: $input) {
    ...ServiceAccountDetailsFragment
  }
}
    ${ServiceAccountDetailsFragmentFragmentDoc}`;
export type CreateServiceAccountMutationFn = Apollo.MutationFunction<CreateServiceAccountMutation, CreateServiceAccountMutationVariables>;

/**
 * __useCreateServiceAccountMutation__
 *
 * To run a mutation, you first call `useCreateServiceAccountMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateServiceAccountMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createServiceAccountMutation, { data, loading, error }] = useCreateServiceAccountMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useCreateServiceAccountMutation(baseOptions?: Apollo.MutationHookOptions<CreateServiceAccountMutation, CreateServiceAccountMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateServiceAccountMutation, CreateServiceAccountMutationVariables>(CreateServiceAccountDocument, options);
      }
export type CreateServiceAccountMutationHookResult = ReturnType<typeof useCreateServiceAccountMutation>;
export type CreateServiceAccountMutationResult = Apollo.MutationResult<CreateServiceAccountMutation>;
export type CreateServiceAccountMutationOptions = Apollo.BaseMutationOptions<CreateServiceAccountMutation, CreateServiceAccountMutationVariables>;
export const DeleteServiceAccountDocument = gql`
    mutation DeleteServiceAccount($id: ID!) {
  deleteServiceAccount(id: $id)
}
    `;
export type DeleteServiceAccountMutationFn = Apollo.MutationFunction<DeleteServiceAccountMutation, DeleteServiceAccountMutationVariables>;

/**
 * __useDeleteServiceAccountMutation__
 *
 * To run a mutation, you first call `useDeleteServiceAccountMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteServiceAccountMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteServiceAccountMutation, { data, loading, error }] = useDeleteServiceAccountMutation({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useDeleteServiceAccountMutation(baseOptions?: Apollo.MutationHookOptions<DeleteServiceAccountMutation, DeleteServiceAccountMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<DeleteServiceAccountMutation, DeleteServiceAccountMutationVariables>(DeleteServiceAccountDocument, options);
      }
export type DeleteServiceAccountMutationHookResult = ReturnType<typeof useDeleteServiceAccountMutation>;
export type DeleteServiceAccountMutationResult = Apollo.MutationResult<DeleteServiceAccountMutation>;
export type DeleteServiceAccountMutationOptions = Apollo.BaseMutationOptions<DeleteServiceAccountMutation, DeleteServiceAccountMutationVariables>;
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
export const GetTeamDocument = gql`
    query GetTeam($id: ID!) {
  getTeam(id: $id) {
    ...TeamFragment
  }
}
    ${TeamFragmentFragmentDoc}`;

/**
 * __useGetTeamQuery__
 *
 * To run a query within a React component, call `useGetTeamQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetTeamQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetTeamQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useGetTeamQuery(baseOptions: Apollo.QueryHookOptions<GetTeamQuery, GetTeamQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetTeamQuery, GetTeamQueryVariables>(GetTeamDocument, options);
      }
export function useGetTeamLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetTeamQuery, GetTeamQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetTeamQuery, GetTeamQueryVariables>(GetTeamDocument, options);
        }
export type GetTeamQueryHookResult = ReturnType<typeof useGetTeamQuery>;
export type GetTeamLazyQueryHookResult = ReturnType<typeof useGetTeamLazyQuery>;
export type GetTeamQueryResult = Apollo.QueryResult<GetTeamQuery, GetTeamQueryVariables>;
export const UpdateTeamDocument = gql`
    mutation UpdateTeam($team: TeamInput!) {
  updateTeam(input: $team) {
    ...TeamFragment
  }
}
    ${TeamFragmentFragmentDoc}`;
export type UpdateTeamMutationFn = Apollo.MutationFunction<UpdateTeamMutation, UpdateTeamMutationVariables>;

/**
 * __useUpdateTeamMutation__
 *
 * To run a mutation, you first call `useUpdateTeamMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateTeamMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateTeamMutation, { data, loading, error }] = useUpdateTeamMutation({
 *   variables: {
 *      team: // value for 'team'
 *   },
 * });
 */
export function useUpdateTeamMutation(baseOptions?: Apollo.MutationHookOptions<UpdateTeamMutation, UpdateTeamMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateTeamMutation, UpdateTeamMutationVariables>(UpdateTeamDocument, options);
      }
export type UpdateTeamMutationHookResult = ReturnType<typeof useUpdateTeamMutation>;
export type UpdateTeamMutationResult = Apollo.MutationResult<UpdateTeamMutation>;
export type UpdateTeamMutationOptions = Apollo.BaseMutationOptions<UpdateTeamMutation, UpdateTeamMutationVariables>;
export const CreateTeamDocument = gql`
    mutation CreateTeam($team: TeamInput!) {
  createTeam(input: $team) {
    ...TeamFragment
  }
}
    ${TeamFragmentFragmentDoc}`;
export type CreateTeamMutationFn = Apollo.MutationFunction<CreateTeamMutation, CreateTeamMutationVariables>;

/**
 * __useCreateTeamMutation__
 *
 * To run a mutation, you first call `useCreateTeamMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateTeamMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createTeamMutation, { data, loading, error }] = useCreateTeamMutation({
 *   variables: {
 *      team: // value for 'team'
 *   },
 * });
 */
export function useCreateTeamMutation(baseOptions?: Apollo.MutationHookOptions<CreateTeamMutation, CreateTeamMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateTeamMutation, CreateTeamMutationVariables>(CreateTeamDocument, options);
      }
export type CreateTeamMutationHookResult = ReturnType<typeof useCreateTeamMutation>;
export type CreateTeamMutationResult = Apollo.MutationResult<CreateTeamMutation>;
export type CreateTeamMutationOptions = Apollo.BaseMutationOptions<CreateTeamMutation, CreateTeamMutationVariables>;
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
export const DeleteTeamDocument = gql`
    mutation DeleteTeam($teamId: ID!) {
  deleteTeam(id: $teamId)
}
    `;
export type DeleteTeamMutationFn = Apollo.MutationFunction<DeleteTeamMutation, DeleteTeamMutationVariables>;

/**
 * __useDeleteTeamMutation__
 *
 * To run a mutation, you first call `useDeleteTeamMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteTeamMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteTeamMutation, { data, loading, error }] = useDeleteTeamMutation({
 *   variables: {
 *      teamId: // value for 'teamId'
 *   },
 * });
 */
export function useDeleteTeamMutation(baseOptions?: Apollo.MutationHookOptions<DeleteTeamMutation, DeleteTeamMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<DeleteTeamMutation, DeleteTeamMutationVariables>(DeleteTeamDocument, options);
      }
export type DeleteTeamMutationHookResult = ReturnType<typeof useDeleteTeamMutation>;
export type DeleteTeamMutationResult = Apollo.MutationResult<DeleteTeamMutation>;
export type DeleteTeamMutationOptions = Apollo.BaseMutationOptions<DeleteTeamMutation, DeleteTeamMutationVariables>;
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
export const DeleteUserDocument = gql`
    mutation DeleteUser($userId: ID!) {
  deleteUser(id: $userId)
}
    `;
export type DeleteUserMutationFn = Apollo.MutationFunction<DeleteUserMutation, DeleteUserMutationVariables>;

/**
 * __useDeleteUserMutation__
 *
 * To run a mutation, you first call `useDeleteUserMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteUserMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteUserMutation, { data, loading, error }] = useDeleteUserMutation({
 *   variables: {
 *      userId: // value for 'userId'
 *   },
 * });
 */
export function useDeleteUserMutation(baseOptions?: Apollo.MutationHookOptions<DeleteUserMutation, DeleteUserMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<DeleteUserMutation, DeleteUserMutationVariables>(DeleteUserDocument, options);
      }
export type DeleteUserMutationHookResult = ReturnType<typeof useDeleteUserMutation>;
export type DeleteUserMutationResult = Apollo.MutationResult<DeleteUserMutation>;
export type DeleteUserMutationOptions = Apollo.BaseMutationOptions<DeleteUserMutation, DeleteUserMutationVariables>;
export const UpdateAccountDocument = gql`
    mutation UpdateAccount($input: AccountInput!) {
  updateAccount(input: $input) {
    ...UserFragment
  }
}
    ${UserFragmentFragmentDoc}`;
export type UpdateAccountMutationFn = Apollo.MutationFunction<UpdateAccountMutation, UpdateAccountMutationVariables>;

/**
 * __useUpdateAccountMutation__
 *
 * To run a mutation, you first call `useUpdateAccountMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateAccountMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateAccountMutation, { data, loading, error }] = useUpdateAccountMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useUpdateAccountMutation(baseOptions?: Apollo.MutationHookOptions<UpdateAccountMutation, UpdateAccountMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateAccountMutation, UpdateAccountMutationVariables>(UpdateAccountDocument, options);
      }
export type UpdateAccountMutationHookResult = ReturnType<typeof useUpdateAccountMutation>;
export type UpdateAccountMutationResult = Apollo.MutationResult<UpdateAccountMutation>;
export type UpdateAccountMutationOptions = Apollo.BaseMutationOptions<UpdateAccountMutation, UpdateAccountMutationVariables>;
export const ChangeSelfPasswordDocument = gql`
    mutation ChangeSelfPassword($newPassword: String!) {
  changeSelfPassword(password: $newPassword)
}
    `;
export type ChangeSelfPasswordMutationFn = Apollo.MutationFunction<ChangeSelfPasswordMutation, ChangeSelfPasswordMutationVariables>;

/**
 * __useChangeSelfPasswordMutation__
 *
 * To run a mutation, you first call `useChangeSelfPasswordMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useChangeSelfPasswordMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [changeSelfPasswordMutation, { data, loading, error }] = useChangeSelfPasswordMutation({
 *   variables: {
 *      newPassword: // value for 'newPassword'
 *   },
 * });
 */
export function useChangeSelfPasswordMutation(baseOptions?: Apollo.MutationHookOptions<ChangeSelfPasswordMutation, ChangeSelfPasswordMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<ChangeSelfPasswordMutation, ChangeSelfPasswordMutationVariables>(ChangeSelfPasswordDocument, options);
      }
export type ChangeSelfPasswordMutationHookResult = ReturnType<typeof useChangeSelfPasswordMutation>;
export type ChangeSelfPasswordMutationResult = Apollo.MutationResult<ChangeSelfPasswordMutation>;
export type ChangeSelfPasswordMutationOptions = Apollo.BaseMutationOptions<ChangeSelfPasswordMutation, ChangeSelfPasswordMutationVariables>;
export const GenerateCompetitionUsersDocument = gql`
    mutation GenerateCompetitionUsers($competitionId: ID!, $usersPerTeam: Int!) {
  generateCompetitionUsers(
    competitionId: $competitionId
    usersPerTeam: $usersPerTeam
  ) {
    ...CompetitionUserFragment
  }
}
    ${CompetitionUserFragmentFragmentDoc}`;
export type GenerateCompetitionUsersMutationFn = Apollo.MutationFunction<GenerateCompetitionUsersMutation, GenerateCompetitionUsersMutationVariables>;

/**
 * __useGenerateCompetitionUsersMutation__
 *
 * To run a mutation, you first call `useGenerateCompetitionUsersMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useGenerateCompetitionUsersMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [generateCompetitionUsersMutation, { data, loading, error }] = useGenerateCompetitionUsersMutation({
 *   variables: {
 *      competitionId: // value for 'competitionId'
 *      usersPerTeam: // value for 'usersPerTeam'
 *   },
 * });
 */
export function useGenerateCompetitionUsersMutation(baseOptions?: Apollo.MutationHookOptions<GenerateCompetitionUsersMutation, GenerateCompetitionUsersMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<GenerateCompetitionUsersMutation, GenerateCompetitionUsersMutationVariables>(GenerateCompetitionUsersDocument, options);
      }
export type GenerateCompetitionUsersMutationHookResult = ReturnType<typeof useGenerateCompetitionUsersMutation>;
export type GenerateCompetitionUsersMutationResult = Apollo.MutationResult<GenerateCompetitionUsersMutation>;
export type GenerateCompetitionUsersMutationOptions = Apollo.BaseMutationOptions<GenerateCompetitionUsersMutation, GenerateCompetitionUsersMutationVariables>;
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
export const GetVmPowerStateDocument = gql`
    query GetVmPowerState($vmObjectId: ID!) {
  powerState(vmObjectId: $vmObjectId)
}
    `;

/**
 * __useGetVmPowerStateQuery__
 *
 * To run a query within a React component, call `useGetVmPowerStateQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetVmPowerStateQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetVmPowerStateQuery({
 *   variables: {
 *      vmObjectId: // value for 'vmObjectId'
 *   },
 * });
 */
export function useGetVmPowerStateQuery(baseOptions: Apollo.QueryHookOptions<GetVmPowerStateQuery, GetVmPowerStateQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetVmPowerStateQuery, GetVmPowerStateQueryVariables>(GetVmPowerStateDocument, options);
      }
export function useGetVmPowerStateLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetVmPowerStateQuery, GetVmPowerStateQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetVmPowerStateQuery, GetVmPowerStateQueryVariables>(GetVmPowerStateDocument, options);
        }
export type GetVmPowerStateQueryHookResult = ReturnType<typeof useGetVmPowerStateQuery>;
export type GetVmPowerStateLazyQueryHookResult = ReturnType<typeof useGetVmPowerStateLazyQuery>;
export type GetVmPowerStateQueryResult = Apollo.QueryResult<GetVmPowerStateQuery, GetVmPowerStateQueryVariables>;
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
export const LockoutVmDocument = gql`
    mutation LockoutVm($vmObjectId: ID!, $locked: Boolean!) {
  lockoutVm(id: $vmObjectId, locked: $locked)
}
    `;
export type LockoutVmMutationFn = Apollo.MutationFunction<LockoutVmMutation, LockoutVmMutationVariables>;

/**
 * __useLockoutVmMutation__
 *
 * To run a mutation, you first call `useLockoutVmMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useLockoutVmMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [lockoutVmMutation, { data, loading, error }] = useLockoutVmMutation({
 *   variables: {
 *      vmObjectId: // value for 'vmObjectId'
 *      locked: // value for 'locked'
 *   },
 * });
 */
export function useLockoutVmMutation(baseOptions?: Apollo.MutationHookOptions<LockoutVmMutation, LockoutVmMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<LockoutVmMutation, LockoutVmMutationVariables>(LockoutVmDocument, options);
      }
export type LockoutVmMutationHookResult = ReturnType<typeof useLockoutVmMutation>;
export type LockoutVmMutationResult = Apollo.MutationResult<LockoutVmMutation>;
export type LockoutVmMutationOptions = Apollo.BaseMutationOptions<LockoutVmMutation, LockoutVmMutationVariables>;
export const LockoutDocument = gql`
    subscription Lockout($vmObjectId: ID!) {
  lockout(id: $vmObjectId) {
    ...VmObjectFragment
  }
}
    ${VmObjectFragmentFragmentDoc}`;

/**
 * __useLockoutSubscription__
 *
 * To run a query within a React component, call `useLockoutSubscription` and pass it any options that fit your needs.
 * When your component renders, `useLockoutSubscription` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the subscription, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useLockoutSubscription({
 *   variables: {
 *      vmObjectId: // value for 'vmObjectId'
 *   },
 * });
 */
export function useLockoutSubscription(baseOptions: Apollo.SubscriptionHookOptions<LockoutSubscription, LockoutSubscriptionVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useSubscription<LockoutSubscription, LockoutSubscriptionVariables>(LockoutDocument, options);
      }
export type LockoutSubscriptionHookResult = ReturnType<typeof useLockoutSubscription>;
export type LockoutSubscriptionResult = Apollo.SubscriptionResult<LockoutSubscription>;
export const PowerStateDocument = gql`
    subscription PowerState($vmObjectId: ID!) {
  powerState(id: $vmObjectId) {
    ID
    State
  }
}
    `;

/**
 * __usePowerStateSubscription__
 *
 * To run a query within a React component, call `usePowerStateSubscription` and pass it any options that fit your needs.
 * When your component renders, `usePowerStateSubscription` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the subscription, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = usePowerStateSubscription({
 *   variables: {
 *      vmObjectId: // value for 'vmObjectId'
 *   },
 * });
 */
export function usePowerStateSubscription(baseOptions: Apollo.SubscriptionHookOptions<PowerStateSubscription, PowerStateSubscriptionVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useSubscription<PowerStateSubscription, PowerStateSubscriptionVariables>(PowerStateDocument, options);
      }
export type PowerStateSubscriptionHookResult = ReturnType<typeof usePowerStateSubscription>;
export type PowerStateSubscriptionResult = Apollo.SubscriptionResult<PowerStateSubscription>;
export const DeleteVmObjectDocument = gql`
    mutation DeleteVmObject($vmObjectId: ID!) {
  deleteVmObject(id: $vmObjectId)
}
    `;
export type DeleteVmObjectMutationFn = Apollo.MutationFunction<DeleteVmObjectMutation, DeleteVmObjectMutationVariables>;

/**
 * __useDeleteVmObjectMutation__
 *
 * To run a mutation, you first call `useDeleteVmObjectMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteVmObjectMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteVmObjectMutation, { data, loading, error }] = useDeleteVmObjectMutation({
 *   variables: {
 *      vmObjectId: // value for 'vmObjectId'
 *   },
 * });
 */
export function useDeleteVmObjectMutation(baseOptions?: Apollo.MutationHookOptions<DeleteVmObjectMutation, DeleteVmObjectMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<DeleteVmObjectMutation, DeleteVmObjectMutationVariables>(DeleteVmObjectDocument, options);
      }
export type DeleteVmObjectMutationHookResult = ReturnType<typeof useDeleteVmObjectMutation>;
export type DeleteVmObjectMutationResult = Apollo.MutationResult<DeleteVmObjectMutation>;
export type DeleteVmObjectMutationOptions = Apollo.BaseMutationOptions<DeleteVmObjectMutation, DeleteVmObjectMutationVariables>;
export const BatchLockoutDocument = gql`
    mutation BatchLockout($vmObjects: [ID!]!, $locked: Boolean!) {
  batchLockout(vmObjects: $vmObjects, locked: $locked)
}
    `;
export type BatchLockoutMutationFn = Apollo.MutationFunction<BatchLockoutMutation, BatchLockoutMutationVariables>;

/**
 * __useBatchLockoutMutation__
 *
 * To run a mutation, you first call `useBatchLockoutMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useBatchLockoutMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [batchLockoutMutation, { data, loading, error }] = useBatchLockoutMutation({
 *   variables: {
 *      vmObjects: // value for 'vmObjects'
 *      locked: // value for 'locked'
 *   },
 * });
 */
export function useBatchLockoutMutation(baseOptions?: Apollo.MutationHookOptions<BatchLockoutMutation, BatchLockoutMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<BatchLockoutMutation, BatchLockoutMutationVariables>(BatchLockoutDocument, options);
      }
export type BatchLockoutMutationHookResult = ReturnType<typeof useBatchLockoutMutation>;
export type BatchLockoutMutationResult = Apollo.MutationResult<BatchLockoutMutation>;
export type BatchLockoutMutationOptions = Apollo.BaseMutationOptions<BatchLockoutMutation, BatchLockoutMutationVariables>;