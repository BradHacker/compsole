package schema

import (
	"entgo.io/ent"
	"entgo.io/ent/dialect/entsql"
	"entgo.io/ent/schema/edge"
	"entgo.io/ent/schema/field"
	"github.com/google/uuid"
)

// User holds the schema definition for the User entity.
type User struct {
	ent.Schema
}

// Fields of the User.
func (User) Fields() []ent.Field {
	return []ent.Field{
		field.UUID("id", uuid.UUID{}).
			Default(uuid.New).
			StorageKey("oid"),
		field.String("username"),
		field.String("password").Sensitive(),
		field.String("first_name").Default(""),
		field.String("last_name").Default(""),
		field.Enum("role").Values("USER", "ADMIN"),
		field.Enum("provider").Values("LOCAL", "GITLAB"),
	}
}

// Edges of the User.
func (User) Edges() []ent.Edge {
	return []ent.Edge{
		edge.To("UserToTeam", Team.Type).Unique(),
		edge.To("UserToToken", Token.Type).
			Annotations(entsql.Annotation{
				OnDelete: entsql.Cascade,
			}),
	}
}
