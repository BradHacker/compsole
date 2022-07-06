package schema

import (
	"entgo.io/ent"
	"entgo.io/ent/schema/edge"
	"entgo.io/ent/schema/field"
	"github.com/google/uuid"
)

// VmObject holds the schema definition for the VmObject entity.
type VmObject struct {
	ent.Schema
}

// Fields of the VmObject.
func (VmObject) Fields() []ent.Field {
	return []ent.Field{
		field.UUID("id", uuid.UUID{}).
			Default(uuid.New).
			StorageKey("oid"),
		field.String("name").Comment("[Required] A user-friendly name for the VM. This will be provider-specific."),
		field.String("identifier").Comment("[Required] The identifier of the VM. This will be provider-specific."),
		field.Strings("ip_addresses").Optional().Comment("[Optional] IP addresses of the VM. This will be displayed to the user."),
	}
}

// Edges of the VmObject.
func (VmObject) Edges() []ent.Edge {
	return []ent.Edge{
		edge.To("ToTeam", Team.Type),
	}
}
