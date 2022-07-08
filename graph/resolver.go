package graph

import (
	"context"

	"github.com/99designs/gqlgen/graphql"
	"github.com/BradHacker/compsole/auth"
	"github.com/BradHacker/compsole/ent"
	"github.com/BradHacker/compsole/graph/generated"
	"github.com/BradHacker/compsole/graph/model"
	"github.com/vektah/gqlparser/v2/gqlerror"
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
	GQLConfig.Directives.HasRole = func(ctx context.Context, obj interface{}, next graphql.Resolver, roles []model.Role) (res interface{}, err error) {
		currentUser, err := auth.ForContext(ctx)
		if err != nil {
			return nil, err
		}
		for _, role := range roles {
			if role.String() == string(currentUser.Role) {
				return next(ctx)
			}
		}
		return nil, &gqlerror.Error{
			Message: "User is not authorized to perform this action",
			Extensions: map[string]interface{}{
				"code": "401",
			},
		}
	}
	return generated.NewExecutableSchema(GQLConfig)
}
