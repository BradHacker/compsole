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
		edge.To("TeamToCompetition", Competition.Type).Unique().Required(),
		edge.From("TeamToVmObjects", VmObject.Type).Ref("VmObjectToTeam").
			Annotations(entsql.Annotation{
				OnDelete: entsql.Cascade,
			}),
		edge.From("TeamToUsers", User.Type).Ref("UserToTeam"),
	}
}
