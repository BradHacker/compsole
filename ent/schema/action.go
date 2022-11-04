package schema

import (
	"time"

	"entgo.io/ent"
	"entgo.io/ent/schema/edge"
	"entgo.io/ent/schema/field"
	"github.com/google/uuid"
)

// Action holds the schema definition for the Action entity.
type Action struct {
	ent.Schema
}

// Fields of the Action.
func (Action) Fields() []ent.Field {
	return []ent.Field{
		field.UUID("id", uuid.UUID{}).
			Default(uuid.New).
			StorageKey("oid"),
		field.String("ip_address").Default(""),
		field.Enum("type").Values("SIGN_IN", "FAILED_SIGN_IN", "SIGN_OUT", "API_CALL", "CONSOLE_ACCESS", "CREATE_OBJECT", "UPDATE_OBJECT", "DELETE_OBJECT"),
		field.String("message"),
		field.Time("performed_at").Default(time.Now),
	}
}

// Edges of the Action.
func (Action) Edges() []ent.Edge {
	return []ent.Edge{
		edge.To("ActionToUser", User.Type).Unique(),
	}
}
