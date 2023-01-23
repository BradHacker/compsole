package schema

import (
	"entgo.io/ent"
	"entgo.io/ent/dialect/entsql"
	"entgo.io/ent/schema/edge"
	"entgo.io/ent/schema/field"
	"github.com/google/uuid"
)

// ServiceAccount holds the schema definition for the ServiceAccount entity.
type ServiceAccount struct {
	ent.Schema
}

// Fields of the ServiceAccount.
func (ServiceAccount) Fields() []ent.Field {
	return []ent.Field{
		field.UUID("id", uuid.UUID{}).
			Default(uuid.New).
			StorageKey("oid"),
		field.String("display_name").Comment("[REQUIRED] The display/common name for the service account."),
		field.UUID("api_key", uuid.UUID{}).Comment("[REQUIRED] The API key for the service account. Equivalent to a username."),
		field.UUID("api_secret", uuid.UUID{}).Comment("[REQUIRED] The API secret for the service account. This value MUST be protected."),
		field.Enum("active").Values("enabled", "disabled").Comment("Determines whether or not the service account is active or not"),
	}
}

// Edges of the ServiceAccount.
func (ServiceAccount) Edges() []ent.Edge {
	return []ent.Edge{
		edge.To("ServiceAccountToActions", Action.Type).
			Annotations(entsql.Annotation{
				OnDelete: entsql.Restrict,
			}),
	}
}
