package schema

import (
	"entgo.io/ent"
	"entgo.io/ent/dialect/entsql"
	"entgo.io/ent/schema/edge"
	"entgo.io/ent/schema/field"
	"github.com/google/uuid"
)

// Provider holds the schema definition for the Provider entity.
type Provider struct {
	ent.Schema
}

// Fields of the Provider.
func (Provider) Fields() []ent.Field {
	return []ent.Field{
		field.UUID("id", uuid.UUID{}).
			Default(uuid.New).
			StorageKey("oid"),
		field.String("name").Unique().Comment("[REQUIRED] The unique name (aka. slug) for the provider."),
		field.String("type").Comment("[REQUIRED] The type of provider this is (must match a registered one in https://github.com/BradHacker/compsole/tree/main/compsole/providers)"),
		field.String("config").Comment("[REQUIRED] This is the JSON configuration for the provider."),
	}
}

// Edges of the Provider.
func (Provider) Edges() []ent.Edge {
	return []ent.Edge{
		edge.From("ProviderToCompetitions", Competition.Type).Ref("CompetitionToProvider").
			Annotations(entsql.Annotation{
				OnDelete: entsql.Restrict, // Prevent deleting if competitions are using it
			}),
	}
}
