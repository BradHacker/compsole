package graph

// This file will be automatically regenerated based on the schema, any resolver implementations
// will be copied through when generating and any unknown code will be moved to the end.

import (
	"context"
	"fmt"

	"github.com/BradHacker/compsole/auth"
	"github.com/BradHacker/compsole/ent"
	"github.com/BradHacker/compsole/graph/generated"
	"github.com/BradHacker/compsole/graph/model"
)

// ID is the resolver for the ID field.
func (r *competitionResolver) ID(ctx context.Context, obj *ent.Competition) (string, error) {
	return obj.ID.String(), nil
}

// VMObjects is the resolver for the vmObjects field.
func (r *queryResolver) VMObjects(ctx context.Context) ([]*ent.VmObject, error) {
	entUser, err := auth.ForContext(ctx)
	if err != nil {
		return nil, fmt.Errorf("failed to get user from context: %v", err)
	}

	vmObjects, err := entUser.QueryUserToTeam().QueryTeamToVmObjects().All(ctx)
	if err != nil {
		return nil, fmt.Errorf("failed to query vm objects from user: %v", err)
	}
	return vmObjects, nil
}

// ID is the resolver for the ID field.
func (r *teamResolver) ID(ctx context.Context, obj *ent.Team) (string, error) {
	return obj.ID.String(), nil
}

// ID is the resolver for the ID field.
func (r *userResolver) ID(ctx context.Context, obj *ent.User) (string, error) {
	return obj.ID.String(), nil
}

// Role is the resolver for the Role field.
func (r *userResolver) Role(ctx context.Context, obj *ent.User) (model.Role, error) {
	return model.Role(obj.Role), nil
}

// Provider is the resolver for the Provider field.
func (r *userResolver) Provider(ctx context.Context, obj *ent.User) (model.Provider, error) {
	return model.Provider(obj.Provider), nil
}

// ID is the resolver for the ID field.
func (r *vmObjectResolver) ID(ctx context.Context, obj *ent.VmObject) (string, error) {
	return obj.ID.String(), nil
}

// Competition returns generated.CompetitionResolver implementation.
func (r *Resolver) Competition() generated.CompetitionResolver { return &competitionResolver{r} }

// Query returns generated.QueryResolver implementation.
func (r *Resolver) Query() generated.QueryResolver { return &queryResolver{r} }

// Team returns generated.TeamResolver implementation.
func (r *Resolver) Team() generated.TeamResolver { return &teamResolver{r} }

// User returns generated.UserResolver implementation.
func (r *Resolver) User() generated.UserResolver { return &userResolver{r} }

// VmObject returns generated.VmObjectResolver implementation.
func (r *Resolver) VmObject() generated.VmObjectResolver { return &vmObjectResolver{r} }

type competitionResolver struct{ *Resolver }
type queryResolver struct{ *Resolver }
type teamResolver struct{ *Resolver }
type userResolver struct{ *Resolver }
type vmObjectResolver struct{ *Resolver }
