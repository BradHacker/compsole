// Code generated by entc, DO NOT EDIT.

package provider

import (
	"github.com/google/uuid"
)

const (
	// Label holds the string label denoting the provider type in the database.
	Label = "provider"
	// FieldID holds the string denoting the id field in the database.
	FieldID = "oid"
	// FieldName holds the string denoting the name field in the database.
	FieldName = "name"
	// FieldConfig holds the string denoting the config field in the database.
	FieldConfig = "config"
	// EdgeProviderToCompetition holds the string denoting the providertocompetition edge name in mutations.
	EdgeProviderToCompetition = "ProviderToCompetition"
	// Table holds the table name of the provider in the database.
	Table = "providers"
	// ProviderToCompetitionTable is the table that holds the ProviderToCompetition relation/edge. The primary key declared below.
	ProviderToCompetitionTable = "competition_CompetitionToProvider"
	// ProviderToCompetitionInverseTable is the table name for the Competition entity.
	// It exists in this package in order to avoid circular dependency with the "competition" package.
	ProviderToCompetitionInverseTable = "competitions"
)

// Columns holds all SQL columns for provider fields.
var Columns = []string{
	FieldID,
	FieldName,
	FieldConfig,
}

var (
	// ProviderToCompetitionPrimaryKey and ProviderToCompetitionColumn2 are the table columns denoting the
	// primary key for the ProviderToCompetition relation (M2M).
	ProviderToCompetitionPrimaryKey = []string{"competition_id", "provider_id"}
)

// ValidColumn reports if the column name is valid (part of the table columns).
func ValidColumn(column string) bool {
	for i := range Columns {
		if column == Columns[i] {
			return true
		}
	}
	return false
}

var (
	// DefaultID holds the default value on creation for the "id" field.
	DefaultID func() uuid.UUID
)