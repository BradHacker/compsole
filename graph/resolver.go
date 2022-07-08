package graph

import (
	"github.com/99designs/gqlgen/graphql"
	"github.com/BradHacker/compsole/ent"
	"github.com/BradHacker/compsole/graph/generated"
)

// This file will not be regenerated automatically.
//
// It serves as dependency injection for your app, add any dependencies you require here.

//go:generate go run github.com/99designs/gqlgen generate

type Resolver struct {
	client *ent.Client
}

// NewSchema creates a graphql executable schema.
func NewSchema(client *ent.Client) graphql.ExecutableSchema {
	GQLConfig := generated.Config{
		Resolvers: &Resolver{
			client: client,
		},
	}
	return generated.NewExecutableSchema(GQLConfig)
}
