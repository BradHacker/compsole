package schema

import (
	"entgo.io/ent"
	"entgo.io/ent/dialect/entsql"
	"entgo.io/ent/schema/edge"
	"entgo.io/ent/schema/field"
	"github.com/google/uuid"
)

// Team holds the schema definition for the Team entity.
type Team struct {
	ent.Schema
}

// Fields of the Team.
func (Team) Fields() []ent.Field {
	return []ent.Field{
		field.UUID("id", uuid.UUID{}).
			Default(uuid.New).
			StorageKey("oid"),
		field.Int("team_number").Comment("[REQUIRED] The team number."),
		field.String("name").Optional().Comment("[OPTIONAL] The display name for the team."),
	}
}

// Edges of the Team.
func (Team) Edges() []ent.Edge {
	return []ent.Edge{
		edge.From("TeamToCompetition", Competition.Type).Ref("CompetitionToTeams").Unique().Required(),
		edge.To("TeamToVmObjects", VmObject.Type).
			Annotations(entsql.Annotation{
				OnDelete: entsql.Cascade,
			}),
		edge.To("TeamToUsers", User.Type).Annotations(entsql.Annotation{
			OnDelete: entsql.SetNull,
		}),
	}
}
