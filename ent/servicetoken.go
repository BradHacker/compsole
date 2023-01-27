// Code generated by entc, DO NOT EDIT.

package ent

import (
	"fmt"
	"strings"

	"entgo.io/ent/dialect/sql"
	"github.com/BradHacker/compsole/ent/serviceaccount"
	"github.com/BradHacker/compsole/ent/servicetoken"
	"github.com/google/uuid"
)

// ServiceToken is the model entity for the ServiceToken schema.
type ServiceToken struct {
	config `json:"-"`
	// ID of the ent.
	ID uuid.UUID `json:"id,omitempty"`
	// Token holds the value of the "token" field.
	// [REQUIRED] The API token for a service account session.
	Token string `json:"token,omitempty"`
	// RefreshToken holds the value of the "refresh_token" field.
	// [REQUIRED] The refresh token used to renew an expired service account session. These are only valid for 1 hour after the associated token expires.
	RefreshToken uuid.UUID `json:"refresh_token,omitempty"`
	// ExpireAt holds the value of the "expire_at" field.
	// [REQUIRED] The time the token should expire.
	ExpireAt int64 `json:"expire_at,omitempty"`
	// Edges holds the relations/edges for other nodes in the graph.
	// The values are being populated by the ServiceTokenQuery when eager-loading is set.
	Edges                                    ServiceTokenEdges `json:"edges"`
	service_account_service_account_to_token *uuid.UUID
}

// ServiceTokenEdges holds the relations/edges for other nodes in the graph.
type ServiceTokenEdges struct {
	// TokenToServiceAccount holds the value of the TokenToServiceAccount edge.
	TokenToServiceAccount *ServiceAccount `json:"TokenToServiceAccount,omitempty"`
	// loadedTypes holds the information for reporting if a
	// type was loaded (or requested) in eager-loading or not.
	loadedTypes [1]bool
}

// TokenToServiceAccountOrErr returns the TokenToServiceAccount value or an error if the edge
// was not loaded in eager-loading, or loaded but was not found.
func (e ServiceTokenEdges) TokenToServiceAccountOrErr() (*ServiceAccount, error) {
	if e.loadedTypes[0] {
		if e.TokenToServiceAccount == nil {
			// The edge TokenToServiceAccount was loaded in eager-loading,
			// but was not found.
			return nil, &NotFoundError{label: serviceaccount.Label}
		}
		return e.TokenToServiceAccount, nil
	}
	return nil, &NotLoadedError{edge: "TokenToServiceAccount"}
}

// scanValues returns the types for scanning values from sql.Rows.
func (*ServiceToken) scanValues(columns []string) ([]interface{}, error) {
	values := make([]interface{}, len(columns))
	for i := range columns {
		switch columns[i] {
		case servicetoken.FieldExpireAt:
			values[i] = new(sql.NullInt64)
		case servicetoken.FieldToken:
			values[i] = new(sql.NullString)
		case servicetoken.FieldID, servicetoken.FieldRefreshToken:
			values[i] = new(uuid.UUID)
		case servicetoken.ForeignKeys[0]: // service_account_service_account_to_token
			values[i] = &sql.NullScanner{S: new(uuid.UUID)}
		default:
			return nil, fmt.Errorf("unexpected column %q for type ServiceToken", columns[i])
		}
	}
	return values, nil
}

// assignValues assigns the values that were returned from sql.Rows (after scanning)
// to the ServiceToken fields.
func (st *ServiceToken) assignValues(columns []string, values []interface{}) error {
	if m, n := len(values), len(columns); m < n {
		return fmt.Errorf("mismatch number of scan values: %d != %d", m, n)
	}
	for i := range columns {
		switch columns[i] {
		case servicetoken.FieldID:
			if value, ok := values[i].(*uuid.UUID); !ok {
				return fmt.Errorf("unexpected type %T for field id", values[i])
			} else if value != nil {
				st.ID = *value
			}
		case servicetoken.FieldToken:
			if value, ok := values[i].(*sql.NullString); !ok {
				return fmt.Errorf("unexpected type %T for field token", values[i])
			} else if value.Valid {
				st.Token = value.String
			}
		case servicetoken.FieldRefreshToken:
			if value, ok := values[i].(*uuid.UUID); !ok {
				return fmt.Errorf("unexpected type %T for field refresh_token", values[i])
			} else if value != nil {
				st.RefreshToken = *value
			}
		case servicetoken.FieldExpireAt:
			if value, ok := values[i].(*sql.NullInt64); !ok {
				return fmt.Errorf("unexpected type %T for field expire_at", values[i])
			} else if value.Valid {
				st.ExpireAt = value.Int64
			}
		case servicetoken.ForeignKeys[0]:
			if value, ok := values[i].(*sql.NullScanner); !ok {
				return fmt.Errorf("unexpected type %T for field service_account_service_account_to_token", values[i])
			} else if value.Valid {
				st.service_account_service_account_to_token = new(uuid.UUID)
				*st.service_account_service_account_to_token = *value.S.(*uuid.UUID)
			}
		}
	}
	return nil
}

// QueryTokenToServiceAccount queries the "TokenToServiceAccount" edge of the ServiceToken entity.
func (st *ServiceToken) QueryTokenToServiceAccount() *ServiceAccountQuery {
	return (&ServiceTokenClient{config: st.config}).QueryTokenToServiceAccount(st)
}

// Update returns a builder for updating this ServiceToken.
// Note that you need to call ServiceToken.Unwrap() before calling this method if this ServiceToken
// was returned from a transaction, and the transaction was committed or rolled back.
func (st *ServiceToken) Update() *ServiceTokenUpdateOne {
	return (&ServiceTokenClient{config: st.config}).UpdateOne(st)
}

// Unwrap unwraps the ServiceToken entity that was returned from a transaction after it was closed,
// so that all future queries will be executed through the driver which created the transaction.
func (st *ServiceToken) Unwrap() *ServiceToken {
	tx, ok := st.config.driver.(*txDriver)
	if !ok {
		panic("ent: ServiceToken is not a transactional entity")
	}
	st.config.driver = tx.drv
	return st
}

// String implements the fmt.Stringer.
func (st *ServiceToken) String() string {
	var builder strings.Builder
	builder.WriteString("ServiceToken(")
	builder.WriteString(fmt.Sprintf("id=%v", st.ID))
	builder.WriteString(", token=")
	builder.WriteString(st.Token)
	builder.WriteString(", refresh_token=")
	builder.WriteString(fmt.Sprintf("%v", st.RefreshToken))
	builder.WriteString(", expire_at=")
	builder.WriteString(fmt.Sprintf("%v", st.ExpireAt))
	builder.WriteByte(')')
	return builder.String()
}

// ServiceTokens is a parsable slice of ServiceToken.
type ServiceTokens []*ServiceToken

func (st ServiceTokens) config(cfg config) {
	for _i := range st {
		st[_i].config = cfg
	}
}
