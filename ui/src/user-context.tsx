import * as React from 'react'
import { AuthProvider, Role, User } from './api/generated/graphql'

export const UserContext = React.createContext<{
  user: User
  refetchUser: () => any // eslint-disable-line @typescript-eslint/no-explicit-any
}>({
  user: {
    ID: '',
    Username: '',
    FirstName: '',
    LastName: '',
    Role: Role.Undefined,
    Provider: AuthProvider.Undefined,
  } as User,
  refetchUser: () => null,
})
