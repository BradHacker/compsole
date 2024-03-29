// Code generated by entc, DO NOT EDIT.

package user

import (
	"fmt"
	"io"
	"strconv"

	"github.com/google/uuid"
)

const (
	// Label holds the string label denoting the user type in the database.
	Label = "user"
	// FieldID holds the string denoting the id field in the database.
	FieldID = "oid"
	// FieldUsername holds the string denoting the username field in the database.
	FieldUsername = "username"
	// FieldPassword holds the string denoting the password field in the database.
	FieldPassword = "password"
	// FieldFirstName holds the string denoting the first_name field in the database.
	FieldFirstName = "first_name"
	// FieldLastName holds the string denoting the last_name field in the database.
	FieldLastName = "last_name"
	// FieldRole holds the string denoting the role field in the database.
	FieldRole = "role"
	// FieldProvider holds the string denoting the provider field in the database.
	FieldProvider = "provider"
	// EdgeUserToTeam holds the string denoting the usertoteam edge name in mutations.
	EdgeUserToTeam = "UserToTeam"
	// EdgeUserToToken holds the string denoting the usertotoken edge name in mutations.
	EdgeUserToToken = "UserToToken"
	// EdgeUserToActions holds the string denoting the usertoactions edge name in mutations.
	EdgeUserToActions = "UserToActions"
	// TokenFieldID holds the string denoting the ID field of the Token.
	TokenFieldID = "id"
	// Table holds the table name of the user in the database.
	Table = "users"
	// UserToTeamTable is the table that holds the UserToTeam relation/edge.
	UserToTeamTable = "users"
	// UserToTeamInverseTable is the table name for the Team entity.
	// It exists in this package in order to avoid circular dependency with the "team" package.
	UserToTeamInverseTable = "teams"
	// UserToTeamColumn is the table column denoting the UserToTeam relation/edge.
	UserToTeamColumn = "team_team_to_users"
	// UserToTokenTable is the table that holds the UserToToken relation/edge.
	UserToTokenTable = "tokens"
	// UserToTokenInverseTable is the table name for the Token entity.
	// It exists in this package in order to avoid circular dependency with the "token" package.
	UserToTokenInverseTable = "tokens"
	// UserToTokenColumn is the table column denoting the UserToToken relation/edge.
	UserToTokenColumn = "user_user_to_token"
	// UserToActionsTable is the table that holds the UserToActions relation/edge.
	UserToActionsTable = "actions"
	// UserToActionsInverseTable is the table name for the Action entity.
	// It exists in this package in order to avoid circular dependency with the "action" package.
	UserToActionsInverseTable = "actions"
	// UserToActionsColumn is the table column denoting the UserToActions relation/edge.
	UserToActionsColumn = "user_user_to_actions"
)

// Columns holds all SQL columns for user fields.
var Columns = []string{
	FieldID,
	FieldUsername,
	FieldPassword,
	FieldFirstName,
	FieldLastName,
	FieldRole,
	FieldProvider,
}

// ForeignKeys holds the SQL foreign-keys that are owned by the "users"
// table and are not defined as standalone fields in the schema.
var ForeignKeys = []string{
	"team_team_to_users",
}

// ValidColumn reports if the column name is valid (part of the table columns).
func ValidColumn(column string) bool {
	for i := range Columns {
		if column == Columns[i] {
			return true
		}
	}
	for i := range ForeignKeys {
		if column == ForeignKeys[i] {
			return true
		}
	}
	return false
}

var (
	// DefaultFirstName holds the default value on creation for the "first_name" field.
	DefaultFirstName string
	// DefaultLastName holds the default value on creation for the "last_name" field.
	DefaultLastName string
	// DefaultID holds the default value on creation for the "id" field.
	DefaultID func() uuid.UUID
)

// Role defines the type for the "role" enum field.
type Role string

// Role values.
const (
	RoleUSER  Role = "USER"
	RoleADMIN Role = "ADMIN"
)

func (r Role) String() string {
	return string(r)
}

// RoleValidator is a validator for the "role" field enum values. It is called by the builders before save.
func RoleValidator(r Role) error {
	switch r {
	case RoleUSER, RoleADMIN:
		return nil
	default:
		return fmt.Errorf("user: invalid enum value for role field: %q", r)
	}
}

// Provider defines the type for the "provider" enum field.
type Provider string

// Provider values.
const (
	ProviderLOCAL  Provider = "LOCAL"
	ProviderGITLAB Provider = "GITLAB"
)

func (pr Provider) String() string {
	return string(pr)
}

// ProviderValidator is a validator for the "provider" field enum values. It is called by the builders before save.
func ProviderValidator(pr Provider) error {
	switch pr {
	case ProviderLOCAL, ProviderGITLAB:
		return nil
	default:
		return fmt.Errorf("user: invalid enum value for provider field: %q", pr)
	}
}

// MarshalGQL implements graphql.Marshaler interface.
func (r Role) MarshalGQL(w io.Writer) {
	io.WriteString(w, strconv.Quote(r.String()))
}

// UnmarshalGQL implements graphql.Unmarshaler interface.
func (r *Role) UnmarshalGQL(val interface{}) error {
	str, ok := val.(string)
	if !ok {
		return fmt.Errorf("enum %T must be a string", val)
	}
	*r = Role(str)
	if err := RoleValidator(*r); err != nil {
		return fmt.Errorf("%s is not a valid Role", str)
	}
	return nil
}

// MarshalGQL implements graphql.Marshaler interface.
func (pr Provider) MarshalGQL(w io.Writer) {
	io.WriteString(w, strconv.Quote(pr.String()))
}

// UnmarshalGQL implements graphql.Unmarshaler interface.
func (pr *Provider) UnmarshalGQL(val interface{}) error {
	str, ok := val.(string)
	if !ok {
		return fmt.Errorf("enum %T must be a string", val)
	}
	*pr = Provider(str)
	if err := ProviderValidator(*pr); err != nil {
		return fmt.Errorf("%s is not a valid Provider", str)
	}
	return nil
}
