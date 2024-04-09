package graph

import (
	"context"
	"fmt"

	"github.com/99designs/gqlgen/graphql"
	"github.com/BradHacker/compsole/api"
	"github.com/BradHacker/compsole/compsole/providers"
	"github.com/BradHacker/compsole/ent"
	"github.com/BradHacker/compsole/graph/generated"
	"github.com/BradHacker/compsole/graph/model"
	"github.com/gin-gonic/gin"
	"github.com/go-redis/redis/v8"
	"github.com/sirupsen/logrus"
	"github.com/vektah/gqlparser/v2/gqlerror"
)

// This file will not be regenerated automatically.
//
// It serves as dependency injection for your app, add any dependencies you require here.

//go:generate go run github.com/99designs/gqlgen generate

type Resolver struct {
	client    *ent.Client
	rdb       *redis.Client
	providers providers.ProviderMap
}

type ContextKey string

const (
	CONTEXT_KEY_Gin ContextKey = "gin"
)

// NewSchema creates a graphql executable schema.
func NewSchema(ctx context.Context, client *ent.Client, rdb *redis.Client) graphql.ExecutableSchema {
	// Inject providers
	compsoleProviders := providers.ProviderMap{}
	entProviders, err := client.Provider.Query().All(ctx)
	if err != nil {
		logrus.Fatalf("failed to startup graphql resolver: failed to query providers")
	}
	for _, entProvider := range entProviders {
		// Generate the provider
		provider, err := providers.NewProvider(entProvider.Type, entProvider.Config)
		if err != nil {
			logrus.Errorf("failed to create provider from config: %v", err)
		} else {
			compsoleProviders.Set(entProvider.ID, provider)
		}
	}

	GQLConfig := generated.Config{
		Resolvers: &Resolver{
			client:    client,
			rdb:       rdb,
			providers: compsoleProviders,
		},
	}
	GQLConfig.Directives.HasRole = func(ctx context.Context, obj interface{}, next graphql.Resolver, roles []model.Role) (res interface{}, err error) {
		currentUser, err := api.ForContext(ctx)
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

func GinContextToContextMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		ctx := context.WithValue(c.Request.Context(), CONTEXT_KEY_Gin, c)
		c.Request = c.Request.WithContext(ctx)
		c.Next()
	}
}

func GinContextFromContext(ctx context.Context) (*gin.Context, error) {
	ginContext := ctx.Value(CONTEXT_KEY_Gin)
	if ginContext == nil {
		return nil, fmt.Errorf("could not retrieve gin.Context")
	}

	gc, ok := ginContext.(*gin.Context)
	if !ok {
		return nil, fmt.Errorf("gin.Context has wrong type")
	}
	return gc, nil
}
