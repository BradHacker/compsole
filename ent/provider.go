// Code generated by entc, DO NOT EDIT.

package ent

import (
	"fmt"
	"strings"

	"entgo.io/ent/dialect/sql"
	"github.com/BradHacker/compsole/ent/provider"
	"github.com/google/uuid"
)

// Provider is the model entity for the Provider schema.
type Provider struct {
	config `json:"-"`
	// ID of the ent.
	ID uuid.UUID `json:"id,omitempty"`
	// Name holds the value of the "name" field.
	// [REQUIRED] The unique name (aka. slug) for the provider.
	Name string `json:"name,omitempty"`
	// Config holds the value of the "config" field.
	// [REQUIRED] This is the JSON configuration for the provider.
	Config string `json:"config,omitempty"`
	// Edges holds the relations/edges for other nodes in the graph.
	// The values are being populated by the ProviderQuery when eager-loading is set.
	Edges ProviderEdges `json:"edges"`
}

// ProviderEdges holds the relations/edges for other nodes in the graph.
type ProviderEdges struct {
	// ProviderToCompetition holds the value of the ProviderToCompetition edge.
	ProviderToCompetition []*Competition `json:"ProviderToCompetition,omitempty"`
	// loadedTypes holds the information for reporting if a
	// type was loaded (or requested) in eager-loading or not.
	loadedTypes [1]bool
}

// ProviderToCompetitionOrErr returns the ProviderToCompetition value or an error if the edge
// was not loaded in eager-loading.
func (e ProviderEdges) ProviderToCompetitionOrErr() ([]*Competition, error) {
	if e.loadedTypes[0] {
		return e.ProviderToCompetition, nil
	}
	return nil, &NotLoadedError{edge: "ProviderToCompetition"}
}

// scanValues returns the types for scanning values from sql.Rows.
func (*Provider) scanValues(columns []string) ([]interface{}, error) {
	values := make([]interface{}, len(columns))
	for i := range columns {
		switch columns[i] {
		case provider.FieldName, provider.FieldConfig:
			values[i] = new(sql.NullString)
		case provider.FieldID:
			values[i] = new(uuid.UUID)
		default:
			return nil, fmt.Errorf("unexpected column %q for type Provider", columns[i])
		}
	}
	return values, nil
}

// assignValues assigns the values that were returned from sql.Rows (after scanning)
// to the Provider fields.
func (pr *Provider) assignValues(columns []string, values []interface{}) error {
	if m, n := len(values), len(columns); m < n {
		return fmt.Errorf("mismatch number of scan values: %d != %d", m, n)
	}
	for i := range columns {
		switch columns[i] {
		case provider.FieldID:
			if value, ok := values[i].(*uuid.UUID); !ok {
				return fmt.Errorf("unexpected type %T for field id", values[i])
			} else if value != nil {
				pr.ID = *value
			}
		case provider.FieldName:
			if value, ok := values[i].(*sql.NullString); !ok {
				return fmt.Errorf("unexpected type %T for field name", values[i])
			} else if value.Valid {
				pr.Name = value.String
			}
		case provider.FieldConfig:
			if value, ok := values[i].(*sql.NullString); !ok {
				return fmt.Errorf("unexpected type %T for field config", values[i])
			} else if value.Valid {
				pr.Config = value.String
			}
		}
	}
	return nil
}

// QueryProviderToCompetition queries the "ProviderToCompetition" edge of the Provider entity.
func (pr *Provider) QueryProviderToCompetition() *CompetitionQuery {
	return (&ProviderClient{config: pr.config}).QueryProviderToCompetition(pr)
}

// Update returns a builder for updating this Provider.
// Note that you need to call Provider.Unwrap() before calling this method if this Provider
// was returned from a transaction, and the transaction was committed or rolled back.
func (pr *Provider) Update() *ProviderUpdateOne {
	return (&ProviderClient{config: pr.config}).UpdateOne(pr)
}

// Unwrap unwraps the Provider entity that was returned from a transaction after it was closed,
// so that all future queries will be executed through the driver which created the transaction.
func (pr *Provider) Unwrap() *Provider {
	tx, ok := pr.config.driver.(*txDriver)
	if !ok {
		panic("ent: Provider is not a transactional entity")
	}
	pr.config.driver = tx.drv
	return pr
}

// String implements the fmt.Stringer.
func (pr *Provider) String() string {
	var builder strings.Builder
	builder.WriteString("Provider(")
	builder.WriteString(fmt.Sprintf("id=%v", pr.ID))
	builder.WriteString(", name=")
	builder.WriteString(pr.Name)
	builder.WriteString(", config=")
	builder.WriteString(pr.Config)
	builder.WriteByte(')')
	return builder.String()
}

// Providers is a parsable slice of Provider.
type Providers []*Provider

func (pr Providers) config(cfg config) {
	for _i := range pr {
		pr[_i].config = cfg
	}
}
