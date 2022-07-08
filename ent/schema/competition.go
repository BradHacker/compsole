package schema

import (
	"entgo.io/ent"
	"entgo.io/ent/dialect/entsql"
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
		field.String("name").Unique().Comment("[REQUIRED] The unique name (aka. slug) for the competition."),
		field.String("provider_type").Comment("[REQUIRED] This is the ID of the competition provider."),
		field.String("provider_config_file").Comment("[REQUIRED] This is the absolute path to the config file used to connect to the competition provider."),
	}
}

// Edges of the Competition.
func (Competition) Edges() []ent.Edge {
	return []ent.Edge{
		edge.From("CompetitionToTeams", Team.Type).Ref("TeamToCompetition").
			Annotations(entsql.Annotation{
				OnDelete: entsql.Cascade,
			}),
	}
}
