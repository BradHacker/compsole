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
		field.String("name").Comment("[REQUIRED] A user-friendly name for the VM. This will be provider-specific."),
		field.String("identifier").Comment("[REQUIRED] The identifier of the VM. This will be provider-specific."),
		field.Strings("ip_addresses").Optional().Comment("[OPTIONAL] IP addresses of the VM. This will be displayed to the user."),
		field.Bool("locked").Default(false).Comment("[REQUIRED] (default is false) If a vm is locked, standard users will not be able to access this VM."),
	}
}

// Edges of the VmObject.
func (VmObject) Edges() []ent.Edge {
	return []ent.Edge{
		edge.From("VmObjectToTeam", Team.Type).Ref("TeamToVmObjects").Unique(),
	}
}
