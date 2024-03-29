package schema

import (
	"entgo.io/ent"
	"entgo.io/ent/schema/edge"
	"entgo.io/ent/schema/field"
	"github.com/google/uuid"
)

// ServiceToken holds the schema definition for the ServiceToken entity.
type ServiceToken struct {
	ent.Schema
}

// Fields of the ServiceToken.
func (ServiceToken) Fields() []ent.Field {
	return []ent.Field{
		field.UUID("id", uuid.UUID{}).
			Default(uuid.New),
		field.String("token").Comment("[REQUIRED] The API token for a service account session."),
		field.String("refresh_token").Comment("[REQUIRED] The refresh token used to renew an expired service account session. These are valid for `REFRESH_WINDOW` hours."),
		field.Int64("issued_at").Comment("[REQUIRED] The time the token was issued"),
	}
}

// Edges of the ServiceToken.
func (ServiceToken) Edges() []ent.Edge {
	return []ent.Edge{
		edge.From("TokenToServiceAccount", ServiceAccount.Type).
			Ref("ServiceAccountToToken").
			Unique().
			Required(),
	}
}
