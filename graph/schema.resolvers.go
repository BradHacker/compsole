package graph

// This file will be automatically regenerated based on the schema, any resolver implementations
// will be copied through when generating and any unknown code will be moved to the end.

import (
	"context"
	"fmt"

	"github.com/BradHacker/compsole/auth"
	"github.com/BradHacker/compsole/compsole/providers"
	"github.com/BradHacker/compsole/compsole/utils"
	"github.com/BradHacker/compsole/ent"
	"github.com/BradHacker/compsole/ent/user"
	"github.com/BradHacker/compsole/ent/vmobject"
	"github.com/BradHacker/compsole/graph/generated"
	"github.com/BradHacker/compsole/graph/model"
	"github.com/google/uuid"
)

// ID is the resolver for the ID field.
func (r *competitionResolver) ID(ctx context.Context, obj *ent.Competition) (string, error) {
	return obj.ID.String(), nil
}

// Console is the resolver for the console field.
func (r *queryResolver) Console(ctx context.Context, vmObjectID string, consoleType model.ConsoleType) (string, error) {
	entUser, err := auth.ForContext(ctx)
	if err != nil {
		return "", fmt.Errorf("failed to get user from context: %v", err)
	}

	vmObjectUuid, err := uuid.Parse(vmObjectID)
	if err != nil {
		return "", fmt.Errorf("failed to parse valid uuid from input vmObjectId: %v", err)
	}

	if entUser.Role != user.RoleADMIN {
		canAccessVm, err := entUser.QueryUserToTeam().QueryTeamToVmObjects().Where(vmobject.IDEQ(vmObjectUuid)).Exist(ctx)
		if err != nil {
			return "", fmt.Errorf("failed to query vm object from user")
		}
		if !canAccessVm {
			return "", fmt.Errorf("user does not have permission to access this vm")
		}
	}
	entVmObject, err := r.client.VmObject.Get(ctx, vmObjectUuid)
	if err != nil {
		return "", fmt.Errorf("failed to query vm object: %v", err)
	}
	entCompetition, err := entVmObject.QueryVmObjectToTeam().QueryTeamToCompetition().Only(ctx)
	if err != nil {
		return "", fmt.Errorf("failed to query competition from vm object: %v", err)
	}
	provider, err := providers.NewProvider(entCompetition.ProviderType, entCompetition.ProviderConfigFile)
	if err != nil {
		return "", fmt.Errorf("failed to create provider from config: %v", err)
	}
	return provider.GetConsoleUrl(entVmObject.Identifier, utils.ConsoleType(consoleType))
}

// MyVMObjects is the resolver for the myVmObjects field.
func (r *queryResolver) MyVMObjects(ctx context.Context) ([]*ent.VmObject, error) {
	entUser, err := auth.ForContext(ctx)
	if err != nil {
		return nil, fmt.Errorf("failed to get user from context: %v", err)
	}

	entVmObjects, err := entUser.QueryUserToTeam().QueryTeamToVmObjects().All(ctx)
	if err != nil {
		return nil, fmt.Errorf("failed to query vm objects from user: %v", err)
	}
	return entVmObjects, nil
}

// MyTeam is the resolver for the myTeam field.
func (r *queryResolver) MyTeam(ctx context.Context) (*ent.Team, error) {
	entUser, err := auth.ForContext(ctx)
	if err != nil {
		return nil, fmt.Errorf("failed to get user from context: %v", err)
	}

	entTeam, err := entUser.QueryUserToTeam().Only(ctx)
	if err != nil {
		return nil, fmt.Errorf("failed to query team from user: %v", err)
	}
	return entTeam, nil
}

// MyCompetition is the resolver for the myCompetition field.
func (r *queryResolver) MyCompetition(ctx context.Context) (*ent.Competition, error) {
	entUser, err := auth.ForContext(ctx)
	if err != nil {
		return nil, fmt.Errorf("failed to get user from context: %v", err)
	}

	entCompetition, err := entUser.QueryUserToTeam().QueryTeamToCompetition().Only(ctx)
	if err != nil {
		return nil, fmt.Errorf("failed to query competition from user: %v", err)
	}
	return entCompetition, nil
}

// VMObjects is the resolver for the vmObjects field.
func (r *queryResolver) VMObjects(ctx context.Context) ([]*ent.VmObject, error) {
	vmObjects, err := r.client.VmObject.Query().All(ctx)
	if err != nil {
		return nil, fmt.Errorf("failed to query vm objects from user: %v", err)
	}
	return vmObjects, nil
}

// Teams is the resolver for the teams field.
func (r *queryResolver) Teams(ctx context.Context) ([]*ent.Team, error) {
	entTeams, err := r.client.Team.Query().All(ctx)
	if err != nil {
		return nil, fmt.Errorf("failed to query teams: %v", err)
	}
	return entTeams, nil
}

// Competitions is the resolver for the competitions field.
func (r *queryResolver) Competitions(ctx context.Context) ([]*ent.Competition, error) {
	competitions, err := r.client.Competition.Query().All(ctx)
	if err != nil {
		return nil, fmt.Errorf("failed to query competitions: %v", err)
	}
	return competitions, nil
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
