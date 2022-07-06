// Code generated by entc, DO NOT EDIT.

package ent

import (
	"encoding/json"
	"fmt"
	"strings"

	"entgo.io/ent/dialect/sql"
	"github.com/BradHacker/compsole/ent/team"
	"github.com/BradHacker/compsole/ent/vmobject"
	"github.com/google/uuid"
)

// VmObject is the model entity for the VmObject schema.
type VmObject struct {
	config `json:"-"`
	// ID of the ent.
	ID uuid.UUID `json:"id,omitempty"`
	// Name holds the value of the "name" field.
	// [Required] A user-friendly name for the VM. This will be provider-specific.
	Name string `json:"name,omitempty"`
	// Identifier holds the value of the "identifier" field.
	// [Required] The identifier of the VM. This will be provider-specific.
	Identifier string `json:"identifier,omitempty"`
	// IPAddresses holds the value of the "ip_addresses" field.
	// [Optional] IP addresses of the VM. This will be displayed to the user.
	IPAddresses []string `json:"ip_addresses,omitempty"`
	// Edges holds the relations/edges for other nodes in the graph.
	// The values are being populated by the VmObjectQuery when eager-loading is set.
	Edges                       VmObjectEdges `json:"edges"`
	vm_object_vm_object_to_team *uuid.UUID
}

// VmObjectEdges holds the relations/edges for other nodes in the graph.
type VmObjectEdges struct {
	// VmObjectToTeam holds the value of the VmObjectToTeam edge.
	VmObjectToTeam *Team `json:"VmObjectToTeam,omitempty"`
	// loadedTypes holds the information for reporting if a
	// type was loaded (or requested) in eager-loading or not.
	loadedTypes [1]bool
}

// VmObjectToTeamOrErr returns the VmObjectToTeam value or an error if the edge
// was not loaded in eager-loading, or loaded but was not found.
func (e VmObjectEdges) VmObjectToTeamOrErr() (*Team, error) {
	if e.loadedTypes[0] {
		if e.VmObjectToTeam == nil {
			// The edge VmObjectToTeam was loaded in eager-loading,
			// but was not found.
			return nil, &NotFoundError{label: team.Label}
		}
		return e.VmObjectToTeam, nil
	}
	return nil, &NotLoadedError{edge: "VmObjectToTeam"}
}

// scanValues returns the types for scanning values from sql.Rows.
func (*VmObject) scanValues(columns []string) ([]interface{}, error) {
	values := make([]interface{}, len(columns))
	for i := range columns {
		switch columns[i] {
		case vmobject.FieldIPAddresses:
			values[i] = new([]byte)
		case vmobject.FieldName, vmobject.FieldIdentifier:
			values[i] = new(sql.NullString)
		case vmobject.FieldID:
			values[i] = new(uuid.UUID)
		case vmobject.ForeignKeys[0]: // vm_object_vm_object_to_team
			values[i] = &sql.NullScanner{S: new(uuid.UUID)}
		default:
			return nil, fmt.Errorf("unexpected column %q for type VmObject", columns[i])
		}
	}
	return values, nil
}

// assignValues assigns the values that were returned from sql.Rows (after scanning)
// to the VmObject fields.
func (vo *VmObject) assignValues(columns []string, values []interface{}) error {
	if m, n := len(values), len(columns); m < n {
		return fmt.Errorf("mismatch number of scan values: %d != %d", m, n)
	}
	for i := range columns {
		switch columns[i] {
		case vmobject.FieldID:
			if value, ok := values[i].(*uuid.UUID); !ok {
				return fmt.Errorf("unexpected type %T for field id", values[i])
			} else if value != nil {
				vo.ID = *value
			}
		case vmobject.FieldName:
			if value, ok := values[i].(*sql.NullString); !ok {
				return fmt.Errorf("unexpected type %T for field name", values[i])
			} else if value.Valid {
				vo.Name = value.String
			}
		case vmobject.FieldIdentifier:
			if value, ok := values[i].(*sql.NullString); !ok {
				return fmt.Errorf("unexpected type %T for field identifier", values[i])
			} else if value.Valid {
				vo.Identifier = value.String
			}
		case vmobject.FieldIPAddresses:
			if value, ok := values[i].(*[]byte); !ok {
				return fmt.Errorf("unexpected type %T for field ip_addresses", values[i])
			} else if value != nil && len(*value) > 0 {
				if err := json.Unmarshal(*value, &vo.IPAddresses); err != nil {
					return fmt.Errorf("unmarshal field ip_addresses: %w", err)
				}
			}
		case vmobject.ForeignKeys[0]:
			if value, ok := values[i].(*sql.NullScanner); !ok {
				return fmt.Errorf("unexpected type %T for field vm_object_vm_object_to_team", values[i])
			} else if value.Valid {
				vo.vm_object_vm_object_to_team = new(uuid.UUID)
				*vo.vm_object_vm_object_to_team = *value.S.(*uuid.UUID)
			}
		}
	}
	return nil
}

// QueryVmObjectToTeam queries the "VmObjectToTeam" edge of the VmObject entity.
func (vo *VmObject) QueryVmObjectToTeam() *TeamQuery {
	return (&VmObjectClient{config: vo.config}).QueryVmObjectToTeam(vo)
}

// Update returns a builder for updating this VmObject.
// Note that you need to call VmObject.Unwrap() before calling this method if this VmObject
// was returned from a transaction, and the transaction was committed or rolled back.
func (vo *VmObject) Update() *VmObjectUpdateOne {
	return (&VmObjectClient{config: vo.config}).UpdateOne(vo)
}

// Unwrap unwraps the VmObject entity that was returned from a transaction after it was closed,
// so that all future queries will be executed through the driver which created the transaction.
func (vo *VmObject) Unwrap() *VmObject {
	tx, ok := vo.config.driver.(*txDriver)
	if !ok {
		panic("ent: VmObject is not a transactional entity")
	}
	vo.config.driver = tx.drv
	return vo
}

// String implements the fmt.Stringer.
func (vo *VmObject) String() string {
	var builder strings.Builder
	builder.WriteString("VmObject(")
	builder.WriteString(fmt.Sprintf("id=%v", vo.ID))
	builder.WriteString(", name=")
	builder.WriteString(vo.Name)
	builder.WriteString(", identifier=")
	builder.WriteString(vo.Identifier)
	builder.WriteString(", ip_addresses=")
	builder.WriteString(fmt.Sprintf("%v", vo.IPAddresses))
	builder.WriteByte(')')
	return builder.String()
}

// VmObjects is a parsable slice of VmObject.
type VmObjects []*VmObject

func (vo VmObjects) config(cfg config) {
	for _i := range vo {
		vo[_i].config = cfg
	}
}
