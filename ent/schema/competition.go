package schema

import (
	"entgo.io/ent"
	"entgo.io/ent/schema/edge"
	"entgo.io/ent/schema/field"
	"github.com/google/uuid"
)

// Competition holds the schema definition for the Competition entity.
type Competition struct {
	ent.Schema
}

// Fields of the Competition.
func (Competition) Fields() []ent.Field {
	return []ent.Field{
		field.UUID("id", uuid.UUID{}).
			Default(uuid.New).
			StorageKey("oid"),
		field.String("name"),
	}
}

// Edges of the Competition.
func (Competition) Edges() []ent.Edge {
	return []ent.Edge{
		edge.From("ToTeams", Team.Type).Ref("ToCompetition"),
	}
}
