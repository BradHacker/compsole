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
	"github.com/BradHacker/compsole/ent/competition"
	"github.com/BradHacker/compsole/ent/provider"
	"github.com/BradHacker/compsole/ent/team"
	"github.com/BradHacker/compsole/ent/user"
	"github.com/BradHacker/compsole/ent/vmobject"
	"github.com/BradHacker/compsole/graph/generated"
	"github.com/BradHacker/compsole/graph/model"
	"github.com/google/uuid"
	"golang.org/x/crypto/bcrypt"
)

// ID is the resolver for the ID field.
func (r *competitionResolver) ID(ctx context.Context, obj *ent.Competition) (string, error) {
	return obj.ID.String(), nil
}

// Reboot is the resolver for the reboot field.
func (r *mutationResolver) Reboot(ctx context.Context, vmObjectID string, rebootType model.RebootType) (bool, error) {
	entUser, err := auth.ForContext(ctx)
	if err != nil {
		return false, fmt.Errorf("failed to get user from context: %v", err)
	}
	// Get VM DB object
	vmObjectUuid, err := uuid.Parse(vmObjectID)
	if err != nil {
		return false, fmt.Errorf("failed to parse valid uuid from input vmObjectId: %v", err)
	}
	entVmObject, err := r.client.VmObject.Get(ctx, vmObjectUuid)
	if err != nil {
		return false, fmt.Errorf("failed to query vm object: %v", err)
	}
	// Check if user has access to VM
	canAccessVm, err := utils.UserCanAccessVM(ctx, entVmObject, entUser)
	if err != nil {
		return false, fmt.Errorf("failed to check access to vm: %v", err)
	}
	if !canAccessVm {
		return false, fmt.Errorf("user does not have permission to access this vm")
	}
	// Get DB objects
	entCompetition, err := entVmObject.QueryVmObjectToTeam().QueryTeamToCompetition().Only(ctx)
	if err != nil {
		return false, fmt.Errorf("failed to query competition from vm object: %v", err)
	}
	entProvider, err := entCompetition.QueryCompetitionToProvider().Only(ctx)
	if err != nil {
		return false, fmt.Errorf("failed to query provider from competition: %v", err)
	}
	// Generate the provider
	provider, err := providers.NewProvider(entProvider.Type, entProvider.Config)
	if err != nil {
		return false, fmt.Errorf("failed to create provider from config: %v", err)
	}
	// Reboot the VM
	return true, provider.RestartVM(entVmObject, utils.RebootType(rebootType))
}

// PowerOn is the resolver for the powerOn field.
func (r *mutationResolver) PowerOn(ctx context.Context, vmObjectID string) (bool, error) {
	entUser, err := auth.ForContext(ctx)
	if err != nil {
		return false, fmt.Errorf("failed to get user from context: %v", err)
	}
	vmObjectUuid, err := uuid.Parse(vmObjectID)
	if err != nil {
		return false, fmt.Errorf("failed to parse valid uuid from input vmObjectId: %v", err)
	}
	// Get VM DB object
	entVmObject, err := r.client.VmObject.Get(ctx, vmObjectUuid)
	if err != nil {
		return false, fmt.Errorf("failed to query vm object: %v", err)
	}
	// Check if user has access to VM
	canAccessVm, err := utils.UserCanAccessVM(ctx, entVmObject, entUser)
	if err != nil {
		return false, fmt.Errorf("failed to check access to vm: %v", err)
	}
	if !canAccessVm {
		return false, fmt.Errorf("user does not have permission to access this vm")
	}
	// Get DB objects
	entCompetition, err := entVmObject.QueryVmObjectToTeam().QueryTeamToCompetition().Only(ctx)
	if err != nil {
		return false, fmt.Errorf("failed to query competition from vm object: %v", err)
	}
	entProvider, err := entCompetition.QueryCompetitionToProvider().Only(ctx)
	if err != nil {
		return false, fmt.Errorf("failed to query provider from competition: %v", err)
	}
	// Generate the provider
	provider, err := providers.NewProvider(entProvider.Type, entProvider.Config)
	if err != nil {
		return false, fmt.Errorf("failed to create provider from config: %v", err)
	}
	// Power on the VM
	return true, provider.PowerOnVM(entVmObject)
}

// PowerOff is the resolver for the powerOff field.
func (r *mutationResolver) PowerOff(ctx context.Context, vmObjectID string) (bool, error) {
	entUser, err := auth.ForContext(ctx)
	if err != nil {
		return false, fmt.Errorf("failed to get user from context: %v", err)
	}
	vmObjectUuid, err := uuid.Parse(vmObjectID)
	if err != nil {
		return false, fmt.Errorf("failed to parse valid uuid from input vmObjectId: %v", err)
	}
	// Get VM DB object
	entVmObject, err := r.client.VmObject.Get(ctx, vmObjectUuid)
	if err != nil {
		return false, fmt.Errorf("failed to query vm object: %v", err)
	}
	// Check if user has access to VM
	canAccessVm, err := utils.UserCanAccessVM(ctx, entVmObject, entUser)
	if err != nil {
		return false, fmt.Errorf("failed to check access to vm: %v", err)
	}
	if !canAccessVm {
		return false, fmt.Errorf("user does not have permission to access this vm")
	}
	// Get DB objects
	entCompetition, err := entVmObject.QueryVmObjectToTeam().QueryTeamToCompetition().Only(ctx)
	if err != nil {
		return false, fmt.Errorf("failed to query competition from vm object: %v", err)
	}
	entProvider, err := entCompetition.QueryCompetitionToProvider().Only(ctx)
	if err != nil {
		return false, fmt.Errorf("failed to query provider from competition: %v", err)
	}
	// Generate the provider
	provider, err := providers.NewProvider(entProvider.Type, entProvider.Config)
	if err != nil {
		return false, fmt.Errorf("failed to create provider from config: %v", err)
	}
	// Power on the VM
	return true, provider.PowerOffVM(entVmObject)
}

// CreateUser is the resolver for the createUser field.
func (r *mutationResolver) CreateUser(ctx context.Context, input model.UserInput) (*ent.User, error) {
	usernameExists, err := r.client.User.Query().Where(user.UsernameEQ(input.Username)).Exist(ctx)
	if err != nil {
		return nil, fmt.Errorf("failed to query if username is already in use: %v", err)
	}
	if usernameExists {
		return nil, fmt.Errorf("failed to create user: username already in use")
	}

	var entTeam *ent.Team = nil
	if input.UserToTeam != nil {
		teamUuid, err := uuid.Parse(*input.UserToTeam)
		if err != nil {
			return nil, fmt.Errorf("failed to parse UserToTeam UUID: %v", err)
		}
		entTeam, err = r.client.Team.Query().Where(team.IDEQ(teamUuid)).Only(ctx)
		if err != nil {
			return nil, fmt.Errorf("failed to query team: %v", err)
		}
	}
	entUser, err := r.client.User.Create().SetUsername(input.Username).SetPassword("").SetFirstName(input.FirstName).SetLastName(input.LastName).SetRole(user.Role(input.Role)).SetProvider(user.Provider(input.Provider)).SetUserToTeam(entTeam).Save(ctx)
	if err != nil {
		return nil, fmt.Errorf("failed to create user: %v", err)
	}
	return entUser, nil
}

// UpdateUser is the resolver for the updateUser field.
func (r *mutationResolver) UpdateUser(ctx context.Context, input model.UserInput) (*ent.User, error) {
	if input.ID == nil {
		return nil, fmt.Errorf("failed to query user: ID must not be nil")
	}
	userUuid, err := uuid.Parse(*input.ID)
	if err != nil {
		return nil, fmt.Errorf("failed to parse user UUID: %v", err)
	}
	entUser, err := r.client.User.Query().Where(user.IDEQ(userUuid)).Only(ctx)
	if err != nil {
		return nil, fmt.Errorf("failed to query user: %v", err)
	}
	var entTeam *ent.Team = nil
	if input.UserToTeam != nil {
		teamUuid, err := uuid.Parse(*input.UserToTeam)
		if err != nil {
			return nil, fmt.Errorf("failed to parse team UUID: %v", err)
		}
		entTeam, err = r.client.Team.Query().Where(team.IDEQ(teamUuid)).Only(ctx)
		if err != nil {
			return nil, fmt.Errorf("failed to query team: %v", err)
		}
	}
	entUserUpdate := entUser.Update().
		SetFirstName(input.FirstName).
		SetLastName(input.LastName).
		SetRole(user.Role(input.Role)).
		SetProvider(user.Provider(input.Provider))
	if entTeam != nil {
		entUserUpdate = entUserUpdate.
			SetUserToTeam(entTeam)
	} else {
		entUserUpdate = entUserUpdate.ClearUserToTeam()
	}
	entUser, err = entUserUpdate.
		Save(ctx)
	if err != nil {
		return nil, fmt.Errorf("failed to update user: %v", err)
	}
	return entUser, nil
}

// DeleteUser is the resolver for the deleteUser field.
func (r *mutationResolver) DeleteUser(ctx context.Context, id string) (bool, error) {
	userUuid, err := uuid.Parse(id)
	if err != nil {
		return false, fmt.Errorf("failed to parse UUID: %v", err)
	}
	_, err = r.client.User.Delete().Where(user.IDEQ(userUuid)).Exec(ctx)
	if err != nil {
		return false, fmt.Errorf("failed to delete user: %v", err)
	}
	return true, nil
}

// ChangePassword is the resolver for the changePassword field.
func (r *mutationResolver) ChangePassword(ctx context.Context, id string, password string) (bool, error) {
	userUuid, err := uuid.Parse(id)
	if err != nil {
		return false, fmt.Errorf("failed to parse UUID: %v", err)
	}
	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(password), 8)
	if err != nil {
		return false, fmt.Errorf("failed to hash default admin password")
	}
	newPassword := string(hashedPassword[:])

	entUser, err := r.client.User.Query().Where(user.IDEQ(userUuid)).Only(ctx)
	if err != nil {
		return false, fmt.Errorf("failed to query user: %v", err)
	}
	err = entUser.Update().SetPassword(newPassword).Exec(ctx)
	if err != nil {
		return false, fmt.Errorf("failed to update password: %v", err)
	}
	return true, nil
}

// CreateTeam is the resolver for the createTeam field.
func (r *mutationResolver) CreateTeam(ctx context.Context, input model.TeamInput) (*ent.Team, error) {
	competitionUuid, err := uuid.Parse(input.TeamToCompetition)
	if err != nil {
		return nil, fmt.Errorf("failed to parse competition UUID: %v", err)
	}
	teamExists, err := r.client.Team.Query().Where(team.And(team.TeamNumberEQ(input.TeamNumber), team.HasTeamToCompetitionWith(competition.IDEQ(competitionUuid)))).Exist(ctx)
	if err != nil {
		return nil, fmt.Errorf("failed to query if team already exists: %v", err)
	}
	if teamExists {
		return nil, fmt.Errorf("failed to create team: team already exists")
	}

	entCompetition, err := r.client.Competition.Query().Where(competition.IDEQ(competitionUuid)).Only(ctx)
	if err != nil {
		return nil, fmt.Errorf("failed to query competition: %v", err)
	}
	entTeam, err := r.client.Team.Create().SetTeamNumber(input.TeamNumber).SetName(*input.Name).SetTeamToCompetition(entCompetition).Save(ctx)
	if err != nil {
		return nil, fmt.Errorf("failed to create user: %v", err)
	}
	return entTeam, nil
}

// UpdateTeam is the resolver for the updateTeam field.
func (r *mutationResolver) UpdateTeam(ctx context.Context, input model.TeamInput) (*ent.Team, error) {
	if input.ID == nil {
		return nil, fmt.Errorf("failed to query team: ID must not be nil")
	}
	teamUuid, err := uuid.Parse(*input.ID)
	if err != nil {
		return nil, fmt.Errorf("failed to parse team UUID: %v", err)
	}
	entTeam, err := r.client.Team.Query().Where(team.IDEQ(teamUuid)).Only(ctx)
	if err != nil {
		return nil, fmt.Errorf("failed to query team: %v", err)
	}
	competitionUuid, err := uuid.Parse(input.TeamToCompetition)
	if err != nil {
		return nil, fmt.Errorf("failed to parse competition UUID: %v", err)
	}
	entCompetition, err := r.client.Competition.Query().Where(competition.IDEQ(competitionUuid)).Only(ctx)
	if err != nil {
		return nil, fmt.Errorf("failed to query competition: %v", err)
	}
	entTeam, err = entTeam.Update().SetName(*input.Name).SetTeamToCompetition(entCompetition).Save(ctx)
	if err != nil {
		return nil, fmt.Errorf("failed to update team: %v", err)
	}
	return entTeam, nil
}

// DeleteTeam is the resolver for the deleteTeam field.
func (r *mutationResolver) DeleteTeam(ctx context.Context, id string) (bool, error) {
	teamUuid, err := uuid.Parse(id)
	if err != nil {
		return false, fmt.Errorf("failed to parse UUID: %v", err)
	}
	_, err = r.client.Team.Delete().Where(team.IDEQ(teamUuid)).Exec(ctx)
	if err != nil {
		return false, fmt.Errorf("failed to delete team: %v", err)
	}
	return true, nil
}

// CreateCompetition is the resolver for the createCompetition field.
func (r *mutationResolver) CreateCompetition(ctx context.Context, input model.CompetitionInput) (*ent.Competition, error) {
	providerUuid, err := uuid.Parse(input.CompetitionToProvider)
	if err != nil {
		return nil, fmt.Errorf("failed to parse provider UUID: %v", err)
	}
	entProvider, err := r.client.Provider.Query().Where(provider.IDEQ(providerUuid)).Only(ctx)
	if err != nil {
		return nil, fmt.Errorf("failed to query provider: %v", err)
	}
	entCompetition, err := r.client.Competition.Create().SetName(input.Name).SetCompetitionToProvider(entProvider).Save(ctx)
	if err != nil {
		return nil, fmt.Errorf("failed to create competition: %v", err)
	}
	return entCompetition, nil
}

// UpdateCompetition is the resolver for the updateCompetition field.
func (r *mutationResolver) UpdateCompetition(ctx context.Context, input model.CompetitionInput) (*ent.Competition, error) {
	if input.ID == nil {
		return nil, fmt.Errorf("failed to query competition: ID must not be nil")
	}
	competitionUuid, err := uuid.Parse(*input.ID)
	if err != nil {
		return nil, fmt.Errorf("failed to parse competition UUID: %v", err)
	}
	entCompetition, err := r.client.Competition.Query().Where(competition.IDEQ(competitionUuid)).Only(ctx)
	if err != nil {
		return nil, fmt.Errorf("failed to query competition: %v", err)
	}
	providerUuid, err := uuid.Parse(input.CompetitionToProvider)
	if err != nil {
		return nil, fmt.Errorf("failed to parse provider UUID: %v", err)
	}
	entProvider, err := r.client.Provider.Query().Where(provider.IDEQ(providerUuid)).Only(ctx)
	if err != nil {
		return nil, fmt.Errorf("failed to query provider: %v", err)
	}
	entCompetition, err = entCompetition.Update().SetName(input.Name).SetCompetitionToProvider(entProvider).Save(ctx)
	if err != nil {
		return nil, fmt.Errorf("failed to update team: %v", err)
	}
	return entCompetition, nil
}

// DeleteCompetition is the resolver for the deleteCompetition field.
func (r *mutationResolver) DeleteCompetition(ctx context.Context, id string) (bool, error) {
	competitionUuid, err := uuid.Parse(id)
	if err != nil {
		return false, fmt.Errorf("failed to parse UUID: %v", err)
	}
	_, err = r.client.Competition.Delete().Where(competition.IDEQ(competitionUuid)).Exec(ctx)
	if err != nil {
		return false, fmt.Errorf("failed to delete competition: %v", err)
	}
	return true, nil
}

// CreateVMObject is the resolver for the createVmObject field.
func (r *mutationResolver) CreateVMObject(ctx context.Context, input model.VMObjectInput) (*ent.VmObject, error) {
	var entTeam *ent.Team = nil
	if input.VMObjectToTeam != nil {
		teamUuid, err := uuid.Parse(*input.VMObjectToTeam)
		if err != nil {
			return nil, fmt.Errorf("failed to parse team UUID: %v", err)
		}
		entTeam, err = r.client.Team.Query().Where(team.IDEQ(teamUuid)).Only(ctx)
		if err != nil {
			return nil, fmt.Errorf("failed to query team: %v", err)
		}
	}
	entVmObject, err := r.client.VmObject.Create().
		SetName(input.Name).
		SetIdentifier(input.Identifier).
		SetIPAddresses(input.IPAddresses).
		SetVmObjectToTeam(entTeam).
		Save(ctx)
	if err != nil {
		return nil, fmt.Errorf("failed to create vm object: %v", err)
	}
	return entVmObject, nil
}

// UpdateVMObject is the resolver for the updateVmObject field.
func (r *mutationResolver) UpdateVMObject(ctx context.Context, input model.VMObjectInput) (*ent.VmObject, error) {
	if input.ID == nil {
		return nil, fmt.Errorf("failed to query vm object: ID must not be nil")
	}
	vmObjectUuid, err := uuid.Parse(*input.ID)
	if err != nil {
		return nil, fmt.Errorf("failed to parse vm object UUID: %v", err)
	}
	entVmObject, err := r.client.VmObject.Query().Where(vmobject.IDEQ(vmObjectUuid)).Only(ctx)
	if err != nil {
		return nil, fmt.Errorf("failed to query vm object: %v", err)
	}
	teamUuid, err := uuid.Parse(*input.VMObjectToTeam)
	if err != nil {
		return nil, fmt.Errorf("failed to parse team UUID: %v", err)
	}
	entTeam, err := r.client.Team.Query().Where(team.IDEQ(teamUuid)).Only(ctx)
	if err != nil {
		return nil, fmt.Errorf("failed to query team: %v", err)
	}
	entVmObject, err = entVmObject.Update().
		SetName(input.Name).
		SetIdentifier(input.Identifier).
		SetIPAddresses(input.IPAddresses).
		SetVmObjectToTeam(entTeam).
		Save(ctx)
	if err != nil {
		return nil, fmt.Errorf("failed to update vm object: %v", err)
	}
	return entVmObject, nil
}

// DeleteVMObject is the resolver for the deleteVmObject field.
func (r *mutationResolver) DeleteVMObject(ctx context.Context, id string) (bool, error) {
	vmObjectUuid, err := uuid.Parse(id)
	if err != nil {
		return false, fmt.Errorf("failed to parse UUID: %v", err)
	}
	_, err = r.client.VmObject.Delete().Where(vmobject.IDEQ(vmObjectUuid)).Exec(ctx)
	if err != nil {
		return false, fmt.Errorf("failed to delete vm object: %v", err)
	}
	return true, nil
}

// CreateProvider is the resolver for the createProvider field.
func (r *mutationResolver) CreateProvider(ctx context.Context, input model.ProviderInput) (*ent.Provider, error) {
	entProvider, err := r.client.Provider.Create().SetName(input.Name).SetType(input.Type).SetConfig(input.Config).Save(ctx)
	if err != nil {
		return nil, fmt.Errorf("failed to create provider: %v", err)
	}
	return entProvider, nil
}

// UpdateProvider is the resolver for the updateProvider field.
func (r *mutationResolver) UpdateProvider(ctx context.Context, input model.ProviderInput) (*ent.Provider, error) {
	if input.ID == nil {
		return nil, fmt.Errorf("failed to query provider: ID must not be nil")
	}
	providerUuid, err := uuid.Parse(*input.ID)
	if err != nil {
		return nil, fmt.Errorf("failed to parse provider UUID: %v", err)
	}
	entProvider, err := r.client.Provider.Query().Where(provider.IDEQ(providerUuid)).Only(ctx)
	if err != nil {
		return nil, fmt.Errorf("failed to query provider: %v", err)
	}
	entProvider, err = entProvider.Update().
		SetName(input.Name).
		SetType(input.Type).
		SetConfig(input.Config).
		Save(ctx)
	if err != nil {
		return nil, fmt.Errorf("failed to update provider: %v", err)
	}
	return entProvider, nil
}

// DeleteProvider is the resolver for the deleteProvider field.
func (r *mutationResolver) DeleteProvider(ctx context.Context, id string) (bool, error) {
	providerUuid, err := uuid.Parse(id)
	if err != nil {
		return false, fmt.Errorf("failed to parse UUID: %v", err)
	}
	_, err = r.client.Provider.Delete().Where(provider.IDEQ(providerUuid)).Exec(ctx)
	if err != nil {
		return false, fmt.Errorf("failed to delete provider: %v", err)
	}
	return true, nil
}

// ID is the resolver for the ID field.
func (r *providerResolver) ID(ctx context.Context, obj *ent.Provider) (string, error) {
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

	// Get VM DB object
	entVmObject, err := r.client.VmObject.Get(ctx, vmObjectUuid)
	if err != nil {
		return "", fmt.Errorf("failed to query vm object: %v", err)
	}
	// Check if user has access to VM
	canAccessVm, err := utils.UserCanAccessVM(ctx, entVmObject, entUser)
	if err != nil {
		return "", fmt.Errorf("failed to check access to vm: %v", err)
	}
	if !canAccessVm {
		return "", fmt.Errorf("user does not have permission to access this vm")
	}
	// Get DB objects
	entCompetition, err := entVmObject.QueryVmObjectToTeam().QueryTeamToCompetition().Only(ctx)
	if err != nil {
		return "", fmt.Errorf("failed to query competition from vm object: %v", err)
	}
	entProvider, err := entCompetition.QueryCompetitionToProvider().Only(ctx)
	if err != nil {
		return "", fmt.Errorf("failed to query provider from competition: %v", err)
	}
	// Generate the provider
	provider, err := providers.NewProvider(entProvider.Type, entProvider.Config)
	if err != nil {
		return "", fmt.Errorf("failed to create provider from config: %v", err)
	}
	return provider.GetConsoleUrl(entVmObject, utils.ConsoleType(consoleType))
}

// Me is the resolver for the me field.
func (r *queryResolver) Me(ctx context.Context) (*ent.User, error) {
	entUser, err := auth.ForContext(ctx)
	if err != nil {
		return nil, fmt.Errorf("failed to get user from context: %v", err)
	}
	return entUser, nil
}

// VMObject is the resolver for the vmObject field.
func (r *queryResolver) VMObject(ctx context.Context, vmObjectID string) (*ent.VmObject, error) {
	entUser, err := auth.ForContext(ctx)
	if err != nil {
		return nil, fmt.Errorf("failed to get user from context: %v", err)
	}
	// Get VM DB object
	vmObjectUuid, err := uuid.Parse(vmObjectID)
	if err != nil {
		return nil, fmt.Errorf("failed to parse valid uuid from input vmObjectId: %v", err)
	}
	entVmObject, err := r.client.VmObject.Get(ctx, vmObjectUuid)
	if err != nil {
		return nil, fmt.Errorf("failed to query vm object: %v", err)
	}
	// Check if user has access to VM
	canAccessVm, err := utils.UserCanAccessVM(ctx, entVmObject, entUser)
	if err != nil {
		return nil, fmt.Errorf("failed to check access to vm: %v", err)
	}
	if !canAccessVm {
		return nil, fmt.Errorf("user does not have permission to access this vm")
	}
	return entVmObject, nil
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

// Users is the resolver for the users field.
func (r *queryResolver) Users(ctx context.Context) ([]*ent.User, error) {
	entUsers, err := r.client.User.Query().All(ctx)
	if err != nil {
		return nil, fmt.Errorf("failed to query users: %v", err)
	}
	return entUsers, nil
}

// GetUser is the resolver for the getUser field.
func (r *queryResolver) GetUser(ctx context.Context, id string) (*ent.User, error) {
	userUuid, err := uuid.Parse(id)
	if err != nil {
		return nil, fmt.Errorf("failed to parse UUID: %v", err)
	}
	entUser, err := r.client.User.Query().Where(user.IDEQ(userUuid)).Only(ctx)
	if err != nil {
		return nil, fmt.Errorf("failed to query user: %v", err)
	}
	return entUser, nil
}

// VMObjects is the resolver for the vmObjects field.
func (r *queryResolver) VMObjects(ctx context.Context) ([]*ent.VmObject, error) {
	entVmObjects, err := r.client.VmObject.Query().All(ctx)
	if err != nil {
		return nil, fmt.Errorf("failed to query vm objects: %v", err)
	}
	return entVmObjects, nil
}

// GetVMObject is the resolver for the getVmObject field.
func (r *queryResolver) GetVMObject(ctx context.Context, id string) (*ent.VmObject, error) {
	vmObjectUuid, err := uuid.Parse(id)
	if err != nil {
		return nil, fmt.Errorf("failed to parse UUID: %v", err)
	}
	entVmObject, err := r.client.VmObject.Query().Where(vmobject.IDEQ(vmObjectUuid)).Only(ctx)
	if err != nil {
		return nil, fmt.Errorf("failed to query vm object: %v", err)
	}
	return entVmObject, nil
}

// Teams is the resolver for the teams field.
func (r *queryResolver) Teams(ctx context.Context) ([]*ent.Team, error) {
	entTeams, err := r.client.Team.Query().All(ctx)
	if err != nil {
		return nil, fmt.Errorf("failed to query teams: %v", err)
	}
	return entTeams, nil
}

// GetTeam is the resolver for the getTeam field.
func (r *queryResolver) GetTeam(ctx context.Context, id string) (*ent.Team, error) {
	teamUuid, err := uuid.Parse(id)
	if err != nil {
		return nil, fmt.Errorf("failed to parse UUID: %v", err)
	}
	entTeam, err := r.client.Team.Query().Where(team.IDEQ(teamUuid)).Only(ctx)
	if err != nil {
		return nil, fmt.Errorf("failed to query team: %v", err)
	}
	return entTeam, nil
}

// Competitions is the resolver for the competitions field.
func (r *queryResolver) Competitions(ctx context.Context) ([]*ent.Competition, error) {
	entCompetitions, err := r.client.Competition.Query().All(ctx)
	if err != nil {
		return nil, fmt.Errorf("failed to query competitions: %v", err)
	}
	return entCompetitions, nil
}

// GetCompetition is the resolver for the getCompetition field.
func (r *queryResolver) GetCompetition(ctx context.Context, id string) (*ent.Competition, error) {
	competitionUuid, err := uuid.Parse(id)
	if err != nil {
		return nil, fmt.Errorf("failed to parse UUID: %v", err)
	}
	entCompetition, err := r.client.Competition.Query().Where(competition.IDEQ(competitionUuid)).Only(ctx)
	if err != nil {
		return nil, fmt.Errorf("failed to query competition: %v", err)
	}
	return entCompetition, nil
}

// Providers is the resolver for the providers field.
func (r *queryResolver) Providers(ctx context.Context) ([]*ent.Provider, error) {
	entProviders, err := r.client.Provider.Query().All(ctx)
	if err != nil {
		return nil, fmt.Errorf("failed to query providers: %v", err)
	}
	return entProviders, nil
}

// GetProvider is the resolver for the getProvider field.
func (r *queryResolver) GetProvider(ctx context.Context, id string) (*ent.Provider, error) {
	providerUuid, err := uuid.Parse(id)
	if err != nil {
		return nil, fmt.Errorf("failed to parse UUID: %v", err)
	}
	entProvider, err := r.client.Provider.Query().Where(provider.IDEQ(providerUuid)).Only(ctx)
	if err != nil {
		return nil, fmt.Errorf("failed to query provider: %v", err)
	}
	return entProvider, nil
}

// ValidateConfig is the resolver for the validateConfig field.
func (r *queryResolver) ValidateConfig(ctx context.Context, typeArg string, config string) (bool, error) {
	err := providers.ValidateConfig(typeArg, config)
	if err != nil {
		return false, fmt.Errorf("failed to parse config: %v", err)
	}
	return true, nil
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
func (r *userResolver) Provider(ctx context.Context, obj *ent.User) (model.AuthProvider, error) {
	return model.AuthProvider(obj.Provider), nil
}

// ID is the resolver for the ID field.
func (r *vmObjectResolver) ID(ctx context.Context, obj *ent.VmObject) (string, error) {
	return obj.ID.String(), nil
}

// Competition returns generated.CompetitionResolver implementation.
func (r *Resolver) Competition() generated.CompetitionResolver { return &competitionResolver{r} }

// Mutation returns generated.MutationResolver implementation.
func (r *Resolver) Mutation() generated.MutationResolver { return &mutationResolver{r} }

// Provider returns generated.ProviderResolver implementation.
func (r *Resolver) Provider() generated.ProviderResolver { return &providerResolver{r} }

// Query returns generated.QueryResolver implementation.
func (r *Resolver) Query() generated.QueryResolver { return &queryResolver{r} }

// Team returns generated.TeamResolver implementation.
func (r *Resolver) Team() generated.TeamResolver { return &teamResolver{r} }

// User returns generated.UserResolver implementation.
func (r *Resolver) User() generated.UserResolver { return &userResolver{r} }

// VmObject returns generated.VmObjectResolver implementation.
func (r *Resolver) VmObject() generated.VmObjectResolver { return &vmObjectResolver{r} }

type competitionResolver struct{ *Resolver }
type mutationResolver struct{ *Resolver }
type providerResolver struct{ *Resolver }
type queryResolver struct{ *Resolver }
type teamResolver struct{ *Resolver }
type userResolver struct{ *Resolver }
type vmObjectResolver struct{ *Resolver }

// !!! WARNING !!!
// The code below was going to be deleted when updating resolvers. It has been copied here so you have
// one last chance to move it out of harms way if you want. There are two reasons this happens:
//  - When renaming or deleting a resolver the old code will be put in here. You can safely delete
//    it when you're done.
//  - You have helper methods in this file. Move them out to keep these resolver files clean.
func (r *competitionResolver) CompetitionToProvider(ctx context.Context, obj *ent.Competition) (*ent.Provider, error) {
	panic(fmt.Errorf("not implemented"))
}
