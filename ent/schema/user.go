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
		field.String("username").Comment("[REQUIRED] The username for the user."),
		field.String("password").Sensitive().Comment("[REQUIRED] The hashed password for the user."),
		field.String("first_name").Default("").Comment("[OPTIONAL] The display first name for the user."),
		field.String("last_name").Default("").Comment("[OPTIONAL] The display last name for the user"),
		field.Enum("role").Values("USER", "ADMIN").Comment("[REQUIRED] The role of the user. Admins have full access."),
		field.Enum("provider").Values("LOCAL", "GITLAB").Comment("[REQUIRED] The type of login the user will be using."),
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
