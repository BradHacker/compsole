package schema

import (
	"entgo.io/ent"
	"entgo.io/ent/schema/edge"
	"entgo.io/ent/schema/field"
	"github.com/google/uuid"
)

// Token holds the schema definition for the Token entity.
type Token struct {
	ent.Schema
}

// Fields of the Token.
func (Token) Fields() []ent.Field {
	return []ent.Field{
		field.UUID("id", uuid.UUID{}).
			Default(uuid.New),
		field.String("token").Comment("[REQUIRED] The auth-token cookie value for the user session."),
		field.Int64("expire_at").Comment("[REQUIRED] The time the token should expire."),
	}
}

// Edges of the Token.
func (Token) Edges() []ent.Edge {
	return []ent.Edge{
		edge.From("TokenToUser", User.Type).
			Ref("UserToToken").
			Unique().
			Required(),
	}
}
