// Code generated by entc, DO NOT EDIT.

package ent

import (
	"context"

	"github.com/99designs/gqlgen/graphql"
)

// CollectFields tells the query-builder to eagerly load connected nodes by resolver context.
func (c *CompetitionQuery) CollectFields(ctx context.Context, satisfies ...string) *CompetitionQuery {
	if fc := graphql.GetFieldContext(ctx); fc != nil {
		c = c.collectField(graphql.GetOperationContext(ctx), fc.Field, satisfies...)
	}
	return c
}

func (c *CompetitionQuery) collectField(ctx *graphql.OperationContext, field graphql.CollectedField, satisfies ...string) *CompetitionQuery {
	return c
}

// CollectFields tells the query-builder to eagerly load connected nodes by resolver context.
func (pr *ProviderQuery) CollectFields(ctx context.Context, satisfies ...string) *ProviderQuery {
	if fc := graphql.GetFieldContext(ctx); fc != nil {
		pr = pr.collectField(graphql.GetOperationContext(ctx), fc.Field, satisfies...)
	}
	return pr
}

func (pr *ProviderQuery) collectField(ctx *graphql.OperationContext, field graphql.CollectedField, satisfies ...string) *ProviderQuery {
	return pr
}

// CollectFields tells the query-builder to eagerly load connected nodes by resolver context.
func (t *TeamQuery) CollectFields(ctx context.Context, satisfies ...string) *TeamQuery {
	if fc := graphql.GetFieldContext(ctx); fc != nil {
		t = t.collectField(graphql.GetOperationContext(ctx), fc.Field, satisfies...)
	}
	return t
}

func (t *TeamQuery) collectField(ctx *graphql.OperationContext, field graphql.CollectedField, satisfies ...string) *TeamQuery {
	return t
}

// CollectFields tells the query-builder to eagerly load connected nodes by resolver context.
func (t *TokenQuery) CollectFields(ctx context.Context, satisfies ...string) *TokenQuery {
	if fc := graphql.GetFieldContext(ctx); fc != nil {
		t = t.collectField(graphql.GetOperationContext(ctx), fc.Field, satisfies...)
	}
	return t
}

func (t *TokenQuery) collectField(ctx *graphql.OperationContext, field graphql.CollectedField, satisfies ...string) *TokenQuery {
	return t
}

// CollectFields tells the query-builder to eagerly load connected nodes by resolver context.
func (u *UserQuery) CollectFields(ctx context.Context, satisfies ...string) *UserQuery {
	if fc := graphql.GetFieldContext(ctx); fc != nil {
		u = u.collectField(graphql.GetOperationContext(ctx), fc.Field, satisfies...)
	}
	return u
}

func (u *UserQuery) collectField(ctx *graphql.OperationContext, field graphql.CollectedField, satisfies ...string) *UserQuery {
	return u
}

// CollectFields tells the query-builder to eagerly load connected nodes by resolver context.
func (vo *VmObjectQuery) CollectFields(ctx context.Context, satisfies ...string) *VmObjectQuery {
	if fc := graphql.GetFieldContext(ctx); fc != nil {
		vo = vo.collectField(graphql.GetOperationContext(ctx), fc.Field, satisfies...)
	}
	return vo
}

func (vo *VmObjectQuery) collectField(ctx *graphql.OperationContext, field graphql.CollectedField, satisfies ...string) *VmObjectQuery {
	return vo
}
