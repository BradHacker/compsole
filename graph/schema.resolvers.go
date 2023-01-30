package graph

// This file will be automatically regenerated based on the schema, any resolver implementations
// will be copied through when generating and any unknown code will be moved to the end.

import (
	"context"
	"fmt"
	"math"
	"strconv"

	"github.com/BradHacker/compsole/api"
	"github.com/BradHacker/compsole/compsole/providers"
	"github.com/BradHacker/compsole/compsole/utils"
	"github.com/BradHacker/compsole/ent"
	"github.com/BradHacker/compsole/ent/action"
	"github.com/BradHacker/compsole/ent/competition"
	"github.com/BradHacker/compsole/ent/provider"
	"github.com/BradHacker/compsole/ent/serviceaccount"
	"github.com/BradHacker/compsole/ent/team"
	"github.com/BradHacker/compsole/ent/user"
	"github.com/BradHacker/compsole/ent/vmobject"
	"github.com/BradHacker/compsole/graph/generated"
	"github.com/BradHacker/compsole/graph/model"
	"github.com/google/uuid"
	"github.com/iancoleman/strcase"
	"github.com/sirupsen/logrus"
	"golang.org/x/crypto/bcrypt"
)

// ID is the resolver for the ID field.
func (r *actionResolver) ID(ctx context.Context, obj *ent.Action) (string, error) {
	return obj.ID.String(), nil
}

// Type is the resolver for the Type field.
func (r *actionResolver) Type(ctx context.Context, obj *ent.Action) (model.ActionType, error) {
	return model.ActionType(obj.Type), nil
}

// ID is the resolver for the ID field.
func (r *competitionResolver) ID(ctx context.Context, obj *ent.Competition) (string, error) {
	return obj.ID.String(), nil
}

// Reboot is the resolver for the reboot field.
func (r *mutationResolver) Reboot(ctx context.Context, vmObjectID string, rebootType model.RebootType) (bool, error) {
	entUser, err := api.ForContext(ctx)
	if err != nil {
		return false, fmt.Errorf("failed to get user from context: %v", err)
	}
	gCtx, err := GinContextFromContext(ctx)
	if err != nil {
		return false, fmt.Errorf("failed to get gin context from resolver context")
	}
	clientIp, err := api.ForContextIp(gCtx)
	if err != nil {
		logrus.Warnf("unable to get ip from context: %v", err)
	}
	err = r.client.Action.Create().
		SetIPAddress(clientIp).
		SetType(action.TypeAPI_CALL).
		SetMessage("called \"Reboot\" endpoint").
		SetActionToUser(entUser).
		Exec(ctx)
	if err != nil {
		logrus.Warnf("failed to log API_CALL: %v", err)
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
	if entUser.Role != user.RoleADMIN && entVmObject.Locked {
		return false, fmt.Errorf("VM is currently locked out")
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
	err = r.client.Action.Create().
		SetIPAddress(clientIp).
		SetType(action.TypeREBOOT).
		SetMessage(fmt.Sprintf("rebooted vm %s", entVmObject.Name)).
		SetActionToUser(entUser).
		Exec(ctx)
	if err != nil {
		logrus.Warnf("failed to log REBOOT: %v", err)
	}
	// Reboot the VM
	return true, provider.RestartVM(entVmObject, utils.RebootType(rebootType))
}

// PowerOn is the resolver for the powerOn field.
func (r *mutationResolver) PowerOn(ctx context.Context, vmObjectID string) (bool, error) {
	entUser, err := api.ForContext(ctx)
	if err != nil {
		return false, fmt.Errorf("failed to get user from context: %v", err)
	}
	gCtx, err := GinContextFromContext(ctx)
	if err != nil {
		return false, fmt.Errorf("failed to get gin context from resolver context")
	}
	clientIp, err := api.ForContextIp(gCtx)
	if err != nil {
		logrus.Warnf("unable to get ip from context: %v", err)
	}
	err = r.client.Action.Create().
		SetIPAddress(clientIp).
		SetType(action.TypeAPI_CALL).
		SetMessage("called \"PowerOn\" endpoint").
		SetActionToUser(entUser).
		Exec(ctx)
	if err != nil {
		logrus.Warnf("failed to log API_CALL: %v", err)
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
	if entUser.Role != user.RoleADMIN && entVmObject.Locked {
		return false, fmt.Errorf("VM is currently locked out")
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
	err = r.client.Action.Create().
		SetIPAddress(clientIp).
		SetType(action.TypePOWER_ON).
		SetMessage(fmt.Sprintf("powered on vm %s", entVmObject.Name)).
		SetActionToUser(entUser).
		Exec(ctx)
	if err != nil {
		logrus.Warnf("failed to log POWER_ON: %v", err)
	}
	// Power on the VM
	return true, provider.PowerOnVM(entVmObject)
}

// PowerOff is the resolver for the powerOff field.
func (r *mutationResolver) PowerOff(ctx context.Context, vmObjectID string) (bool, error) {
	entUser, err := api.ForContext(ctx)
	if err != nil {
		return false, fmt.Errorf("failed to get user from context: %v", err)
	}
	gCtx, err := GinContextFromContext(ctx)
	if err != nil {
		return false, fmt.Errorf("failed to get gin context from resolver context")
	}
	clientIp, err := api.ForContextIp(gCtx)
	if err != nil {
		logrus.Warnf("unable to get ip from context: %v", err)
	}
	err = r.client.Action.Create().
		SetIPAddress(clientIp).
		SetType(action.TypeAPI_CALL).
		SetMessage("called \"PowerOff\" endpoint").
		SetActionToUser(entUser).
		Exec(ctx)
	if err != nil {
		logrus.Warnf("failed to log API_CALL: %v", err)
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
	if entUser.Role != user.RoleADMIN && entVmObject.Locked {
		return false, fmt.Errorf("VM is currently locked out")
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
	err = r.client.Action.Create().
		SetIPAddress(clientIp).
		SetType(action.TypePOWER_OFF).
		SetMessage(fmt.Sprintf("powered off vm %s", entVmObject.Name)).
		SetActionToUser(entUser).
		Exec(ctx)
	if err != nil {
		logrus.Warnf("failed to log POWER_OFF: %v", err)
	}
	// Power on the VM
	return true, provider.PowerOffVM(entVmObject)
}

// UpdateAccount is the resolver for the updateAccount field.
func (r *mutationResolver) UpdateAccount(ctx context.Context, input model.AccountInput) (*ent.User, error) {
	entUser, err := api.ForContext(ctx)
	if err != nil {
		return nil, fmt.Errorf("failed to get user from context: %v", err)
	}
	gCtx, err := GinContextFromContext(ctx)
	if err != nil {
		return nil, fmt.Errorf("failed to get gin context from resolver context")
	}
	clientIp, err := api.ForContextIp(gCtx)
	if err != nil {
		logrus.Warnf("unable to get ip from context: %v", err)
	}
	err = r.client.Action.Create().
		SetIPAddress(clientIp).
		SetType(action.TypeAPI_CALL).
		SetMessage("called \"UpdateAccount\" endpoint").
		SetActionToUser(entUser).
		Exec(ctx)
	if err != nil {
		logrus.Warnf("failed to log API_CALL: %v", err)
	}
	entUser, err = entUser.Update().SetFirstName(input.FirstName).SetLastName(input.LastName).Save(ctx)
	if err != nil {
		return nil, fmt.Errorf("failed to update account information: %v", err)
	}
	err = r.client.Action.Create().
		SetIPAddress(clientIp).
		SetType(action.TypeUPDATE_OBJECT).
		SetMessage(fmt.Sprintf("updated account %s", entUser.Username)).
		SetActionToUser(entUser).
		Exec(ctx)
	if err != nil {
		logrus.Warnf("failed to log UPDATE_OBJECT: %v", err)
	}
	return entUser, nil
}

// ChangeSelfPassword is the resolver for the changeSelfPassword field.
func (r *mutationResolver) ChangeSelfPassword(ctx context.Context, password string) (bool, error) {
	entUser, err := api.ForContext(ctx)
	if err != nil {
		return false, fmt.Errorf("failed to get user from context: %v", err)
	}
	gCtx, err := GinContextFromContext(ctx)
	if err != nil {
		return false, fmt.Errorf("failed to get gin context from resolver context")
	}
	clientIp, err := api.ForContextIp(gCtx)
	if err != nil {
		logrus.Warnf("unable to get ip from context: %v", err)
	}
	err = r.client.Action.Create().
		SetIPAddress(clientIp).
		SetType(action.TypeAPI_CALL).
		SetMessage("called \"ChangeSelfPassword\" endpoint").
		SetActionToUser(entUser).
		Exec(ctx)
	if err != nil {
		logrus.Warnf("failed to log API_CALL: %v", err)
	}
	err = entUser.Update().SetPassword(password).Exec(ctx)
	if err != nil {
		return false, fmt.Errorf("failed to update self password: %v", err)
	}
	err = r.client.Action.Create().
		SetIPAddress(clientIp).
		SetType(action.TypeCHANGE_SELF_PASSWORD).
		SetMessage(fmt.Sprintf("changed self password for %s", entUser.Username)).
		SetActionToUser(entUser).
		Exec(ctx)
	if err != nil {
		logrus.Warnf("failed to log CHANGE_SELF_PASSWORD: %v", err)
	}
	return true, nil
}

// CreateUser is the resolver for the createUser field.
func (r *mutationResolver) CreateUser(ctx context.Context, input model.UserInput) (*ent.User, error) {
	authUser, err := api.ForContext(ctx)
	if err != nil {
		return nil, fmt.Errorf("failed to get user from context: %v", err)
	}
	gCtx, err := GinContextFromContext(ctx)
	if err != nil {
		return nil, fmt.Errorf("failed to get gin context from resolver context")
	}
	clientIp, err := api.ForContextIp(gCtx)
	if err != nil {
		logrus.Warnf("unable to get ip from context: %v", err)
	}
	err = r.client.Action.Create().
		SetIPAddress(clientIp).
		SetType(action.TypeAPI_CALL).
		SetMessage("called \"CreateUser\" endpoint").
		SetActionToUser(authUser).
		Exec(ctx)
	if err != nil {
		logrus.Warnf("failed to log API_CALL: %v", err)
	}
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
	entUserCreate := r.client.User.Create().
		SetUsername(input.Username).
		SetPassword("").
		SetFirstName(input.FirstName).
		SetLastName(input.LastName).
		SetRole(user.Role(input.Role)).
		SetProvider(user.Provider(input.Provider))
	if entTeam != nil {
		entUserCreate = entUserCreate.SetUserToTeam(entTeam)
	}
	entUser, err := entUserCreate.Save(ctx)
	if err != nil {
		return nil, fmt.Errorf("failed to create user: %v", err)
	}
	err = r.client.Action.Create().
		SetIPAddress(clientIp).
		SetType(action.TypeCREATE_OBJECT).
		SetMessage(fmt.Sprintf("created user %s", entUser.Username)).
		SetActionToUser(entUser).
		Exec(ctx)
	if err != nil {
		logrus.Warnf("failed to log CREATE_OBJECT: %v", err)
	}
	return entUser, nil
}

// UpdateUser is the resolver for the updateUser field.
func (r *mutationResolver) UpdateUser(ctx context.Context, input model.UserInput) (*ent.User, error) {
	authUser, err := api.ForContext(ctx)
	if err != nil {
		return nil, fmt.Errorf("failed to get user from context: %v", err)
	}
	gCtx, err := GinContextFromContext(ctx)
	if err != nil {
		return nil, fmt.Errorf("failed to get gin context from resolver context")
	}
	clientIp, err := api.ForContextIp(gCtx)
	if err != nil {
		logrus.Warnf("unable to get ip from context: %v", err)
	}
	err = r.client.Action.Create().
		SetIPAddress(clientIp).
		SetType(action.TypeAPI_CALL).
		SetMessage("called \"UpdateUser\" endpoint").
		SetActionToUser(authUser).
		Exec(ctx)
	if err != nil {
		logrus.Warnf("failed to log API_CALL: %v", err)
	}
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
	err = r.client.Action.Create().
		SetIPAddress(clientIp).
		SetType(action.TypeUPDATE_OBJECT).
		SetMessage(fmt.Sprintf("updated user %s", entUser.Username)).
		SetActionToUser(entUser).
		Exec(ctx)
	if err != nil {
		logrus.Warnf("failed to log UPDATE_OBJECT: %v", err)
	}
	return entUser, nil
}

// DeleteUser is the resolver for the deleteUser field.
func (r *mutationResolver) DeleteUser(ctx context.Context, id string) (bool, error) {
	authUser, err := api.ForContext(ctx)
	if err != nil {
		return false, fmt.Errorf("failed to get user from context: %v", err)
	}
	gCtx, err := GinContextFromContext(ctx)
	if err != nil {
		return false, fmt.Errorf("failed to get gin context from resolver context")
	}
	clientIp, err := api.ForContextIp(gCtx)
	if err != nil {
		logrus.Warnf("unable to get ip from context: %v", err)
	}
	err = r.client.Action.Create().
		SetIPAddress(clientIp).
		SetType(action.TypeAPI_CALL).
		SetMessage("called \"DeleteUser\" endpoint").
		SetActionToUser(authUser).
		Exec(ctx)
	if err != nil {
		logrus.Warnf("failed to log API_CALL: %v", err)
	}
	userUuid, err := uuid.Parse(id)
	if err != nil {
		return false, fmt.Errorf("failed to parse UUID: %v", err)
	}
	// Must maintain at least one admin user in the database
	if userCount, err := r.client.User.Query().Where(user.RoleEQ(user.RoleADMIN)).Count(ctx); err != nil {
		return false, fmt.Errorf("failed to count users: %v", err)
	} else if userCount <= 1 {
		return false, fmt.Errorf("at least one admin user must exist")
	}
	_, err = r.client.User.Delete().Where(user.IDEQ(userUuid)).Exec(ctx)
	if err != nil {
		return false, fmt.Errorf("failed to delete user: %v", err)
	}
	err = r.client.Action.Create().
		SetIPAddress(clientIp).
		SetType(action.TypeDELETE_OBJECT).
		SetMessage(fmt.Sprintf("deleted user %s", id)).
		SetActionToUser(authUser).
		Exec(ctx)
	if err != nil {
		logrus.Warnf("failed to log DELETE_OBJECT: %v", err)
	}
	return true, nil
}

// ChangePassword is the resolver for the changePassword field.
func (r *mutationResolver) ChangePassword(ctx context.Context, id string, password string) (bool, error) {
	authUser, err := api.ForContext(ctx)
	if err != nil {
		return false, fmt.Errorf("failed to get user from context: %v", err)
	}
	gCtx, err := GinContextFromContext(ctx)
	if err != nil {
		return false, fmt.Errorf("failed to get gin context from resolver context")
	}
	clientIp, err := api.ForContextIp(gCtx)
	if err != nil {
		logrus.Warnf("unable to get ip from context: %v", err)
	}
	err = r.client.Action.Create().
		SetIPAddress(clientIp).
		SetType(action.TypeAPI_CALL).
		SetMessage("called \"ChangePassword\" endpoint").
		SetActionToUser(authUser).
		Exec(ctx)
	if err != nil {
		logrus.Warnf("failed to log API_CALL: %v", err)
	}
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
	err = r.client.Action.Create().
		SetIPAddress(clientIp).
		SetType(action.TypeCHANGE_PASSWORD).
		SetMessage(fmt.Sprintf("changed password for user %s", entUser.Username)).
		SetActionToUser(authUser).
		Exec(ctx)
	if err != nil {
		logrus.Warnf("failed to log CHANGE_PASSWORD: %v", err)
	}
	return true, nil
}

// GenerateCompetitionUsers is the resolver for the generateCompetitionUsers field.
func (r *mutationResolver) GenerateCompetitionUsers(ctx context.Context, competitionID string, usersPerTeam int) ([]*model.CompetitionUser, error) {
	authUser, err := api.ForContext(ctx)
	if err != nil {
		return nil, fmt.Errorf("failed to get user from context: %v", err)
	}
	gCtx, err := GinContextFromContext(ctx)
	if err != nil {
		return nil, fmt.Errorf("failed to get gin context from resolver context")
	}
	clientIp, err := api.ForContextIp(gCtx)
	if err != nil {
		logrus.Warnf("unable to get ip from context: %v", err)
	}
	err = r.client.Action.Create().
		SetIPAddress(clientIp).
		SetType(action.TypeAPI_CALL).
		SetMessage("called \"CreateTeam\" endpoint").
		SetActionToUser(authUser).
		Exec(ctx)
	if err != nil {
		logrus.Warnf("failed to log API_CALL: %v", err)
	}
	competitionUuid, err := uuid.Parse(competitionID)
	if err != nil {
		return nil, fmt.Errorf("failed to parse competition UUID: %v", err)
	}
	entCompetition, err := r.client.Competition.Query().Where(competition.IDEQ(competitionUuid)).Only(ctx)
	if err != nil {
		return nil, fmt.Errorf("failed to query competition: %v", err)
	}
	entTeams, err := r.client.Team.Query().Where(team.HasTeamToCompetitionWith(competition.IDEQ(competitionUuid))).All(ctx)
	if err != nil {
		return nil, fmt.Errorf("failed to query teams for competition: %v", err)
	}
	competitionUsers := make([]*model.CompetitionUser, 0)
	for _, entTeam := range entTeams {
		for i := 0; i < usersPerTeam; i++ {
			// user details:
			// username = [comp_name][team_num][user_letter]
			//   ex. comp01a
			// password = randomly generated (noun + num + adj + num + noun)
			entUser, err := r.client.User.Create().
				SetFirstName("Team").
				SetLastName(strconv.Itoa(entTeam.TeamNumber)).
				SetUsername(
					fmt.Sprintf(
						"%s%02d%c",
						strcase.ToCamel(entCompetition.Name),
						entTeam.TeamNumber, rune('a'+i),
					),
				).
				SetPassword(utils.NewPassword()).
				SetProvider(user.ProviderLOCAL).
				SetRole(user.RoleUSER).
				SetUserToTeam(entTeam).
				Save(ctx)
			if err != nil {
				// log failed users and keep trying to make them
				logrus.Errorf("failed to create user: %v", err)
				continue
			}
			competitionUsers = append(competitionUsers, &model.CompetitionUser{
				ID:         entUser.ID.String(),
				Username:   entUser.Username,
				Password:   entUser.Password,
				UserToTeam: entTeam,
			})
		}
	}
	return competitionUsers, nil
}

// CreateTeam is the resolver for the createTeam field.
func (r *mutationResolver) CreateTeam(ctx context.Context, input model.TeamInput) (*ent.Team, error) {
	authUser, err := api.ForContext(ctx)
	if err != nil {
		return nil, fmt.Errorf("failed to get user from context: %v", err)
	}
	gCtx, err := GinContextFromContext(ctx)
	if err != nil {
		return nil, fmt.Errorf("failed to get gin context from resolver context")
	}
	clientIp, err := api.ForContextIp(gCtx)
	if err != nil {
		logrus.Warnf("unable to get ip from context: %v", err)
	}
	err = r.client.Action.Create().
		SetIPAddress(clientIp).
		SetType(action.TypeAPI_CALL).
		SetMessage("called \"CreateTeam\" endpoint").
		SetActionToUser(authUser).
		Exec(ctx)
	if err != nil {
		logrus.Warnf("failed to log API_CALL: %v", err)
	}
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
	err = r.client.Action.Create().
		SetIPAddress(clientIp).
		SetType(action.TypeCREATE_OBJECT).
		SetMessage(fmt.Sprintf("created team %s", entTeam.Name)).
		SetActionToUser(authUser).
		Exec(ctx)
	if err != nil {
		logrus.Warnf("failed to log CREATE_OBJECT: %v", err)
	}
	return entTeam, nil
}

// BatchCreateTeams is the resolver for the batchCreateTeams field.
func (r *mutationResolver) BatchCreateTeams(ctx context.Context, input []*model.TeamInput) ([]*ent.Team, error) {
	authUser, err := api.ForContext(ctx)
	if err != nil {
		return nil, fmt.Errorf("failed to get user from context: %v", err)
	}
	gCtx, err := GinContextFromContext(ctx)
	if err != nil {
		return nil, fmt.Errorf("failed to get gin context from resolver context")
	}
	clientIp, err := api.ForContextIp(gCtx)
	if err != nil {
		logrus.Warnf("unable to get ip from context: %v", err)
	}
	err = r.client.Action.Create().
		SetIPAddress(clientIp).
		SetType(action.TypeAPI_CALL).
		SetMessage("called \"BatchCreateTeams\" endpoint").
		SetActionToUser(authUser).
		Exec(ctx)
	if err != nil {
		logrus.Warnf("failed to log API_CALL: %v", err)
	}
	entTeams := make([]*ent.TeamCreate, len(input))
	tx, err := r.client.Tx(ctx)
	if err != nil {
		return nil, fmt.Errorf("failed to create ent transactional client: %v", err)
	}
	for i, inputTeam := range input {
		competitionUuid, err := uuid.Parse(inputTeam.TeamToCompetition)
		if err != nil {
			return nil, fmt.Errorf("failed to parse competition UUID: %v", err)
		}
		teamExists, err := tx.Team.Query().Where(team.And(team.TeamNumberEQ(inputTeam.TeamNumber), team.HasTeamToCompetitionWith(competition.IDEQ(competitionUuid)))).Exist(ctx)
		if err != nil {
			return nil, fmt.Errorf("failed to query if team already exists: %v", err)
		}
		if teamExists {
			return nil, fmt.Errorf("failed to create team: team already exists")
		}
		entCompetition, err := tx.Competition.Query().Where(competition.IDEQ(competitionUuid)).Only(ctx)
		if err != nil {
			return nil, fmt.Errorf("failed to query competition: %v", err)
		}
		entTeam := tx.Team.Create().SetTeamNumber(inputTeam.TeamNumber).SetName(*inputTeam.Name).SetTeamToCompetition(entCompetition)
		entTeams[i] = entTeam
	}
	newEntTeams, err := tx.Team.CreateBulk(entTeams...).Save(ctx)
	if err != nil {
		if rerr := tx.Rollback(); rerr != nil {
			err = fmt.Errorf("%w: rolling back transaction: failed to bulk create teams: %v", err, rerr)
		}
		return nil, err
	}
	err = tx.Commit()
	if err != nil {
		return nil, fmt.Errorf("failed to commit transation. rolled back database: %v", err)
	}
	unwrappedTeams := make([]*ent.Team, len(newEntTeams))
	for i, entTeam := range newEntTeams {
		unwrappedTeams[i] = entTeam.Unwrap()
	}
	err = r.client.Action.Create().
		SetIPAddress(clientIp).
		SetType(action.TypeCREATE_OBJECT).
		SetMessage(fmt.Sprintf("batch created %d teams", len(unwrappedTeams))).
		SetActionToUser(authUser).
		Exec(ctx)
	if err != nil {
		logrus.Warnf("failed to log CREATE_OBJECT: %v", err)
	}
	return unwrappedTeams, nil
}

// UpdateTeam is the resolver for the updateTeam field.
func (r *mutationResolver) UpdateTeam(ctx context.Context, input model.TeamInput) (*ent.Team, error) {
	authUser, err := api.ForContext(ctx)
	if err != nil {
		return nil, fmt.Errorf("failed to get user from context: %v", err)
	}
	gCtx, err := GinContextFromContext(ctx)
	if err != nil {
		return nil, fmt.Errorf("failed to get gin context from resolver context")
	}
	clientIp, err := api.ForContextIp(gCtx)
	if err != nil {
		logrus.Warnf("unable to get ip from context: %v", err)
	}
	err = r.client.Action.Create().
		SetIPAddress(clientIp).
		SetType(action.TypeAPI_CALL).
		SetMessage("called \"UpdateTeam\" endpoint").
		SetActionToUser(authUser).
		Exec(ctx)
	if err != nil {
		logrus.Warnf("failed to log API_CALL: %v", err)
	}
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
	err = r.client.Action.Create().
		SetIPAddress(clientIp).
		SetType(action.TypeUPDATE_OBJECT).
		SetMessage(fmt.Sprintf("updated team %s", entTeam.Name)).
		SetActionToUser(authUser).
		Exec(ctx)
	if err != nil {
		logrus.Warnf("failed to log UPDATE_OBJECT: %v", err)
	}
	return entTeam, nil
}

// DeleteTeam is the resolver for the deleteTeam field.
func (r *mutationResolver) DeleteTeam(ctx context.Context, id string) (bool, error) {
	authUser, err := api.ForContext(ctx)
	if err != nil {
		return false, fmt.Errorf("failed to get user from context: %v", err)
	}
	gCtx, err := GinContextFromContext(ctx)
	if err != nil {
		return false, fmt.Errorf("failed to get gin context from resolver context")
	}
	clientIp, err := api.ForContextIp(gCtx)
	if err != nil {
		logrus.Warnf("unable to get ip from context: %v", err)
	}
	err = r.client.Action.Create().
		SetIPAddress(clientIp).
		SetType(action.TypeAPI_CALL).
		SetMessage("called \"DeleteTeam\" endpoint").
		SetActionToUser(authUser).
		Exec(ctx)
	if err != nil {
		logrus.Warnf("failed to log API_CALL: %v", err)
	}
	teamUuid, err := uuid.Parse(id)
	if err != nil {
		return false, fmt.Errorf("failed to parse UUID: %v", err)
	}
	_, err = r.client.Team.Delete().Where(team.IDEQ(teamUuid)).Exec(ctx)
	if err != nil {
		return false, fmt.Errorf("failed to delete team: %v", err)
	}
	err = r.client.Action.Create().
		SetIPAddress(clientIp).
		SetType(action.TypeDELETE_OBJECT).
		SetMessage(fmt.Sprintf("deleted team %s", id)).
		SetActionToUser(authUser).
		Exec(ctx)
	if err != nil {
		logrus.Warnf("failed to log DELETED_OBJECT: %v", err)
	}
	return true, nil
}

// CreateCompetition is the resolver for the createCompetition field.
func (r *mutationResolver) CreateCompetition(ctx context.Context, input model.CompetitionInput) (*ent.Competition, error) {
	authUser, err := api.ForContext(ctx)
	if err != nil {
		return nil, fmt.Errorf("failed to get user from context: %v", err)
	}
	gCtx, err := GinContextFromContext(ctx)
	if err != nil {
		return nil, fmt.Errorf("failed to get gin context from resolver context")
	}
	clientIp, err := api.ForContextIp(gCtx)
	if err != nil {
		logrus.Warnf("unable to get ip from context: %v", err)
	}
	err = r.client.Action.Create().
		SetIPAddress(clientIp).
		SetType(action.TypeAPI_CALL).
		SetMessage("called \"CreateCompetition\" endpoint").
		SetActionToUser(authUser).
		Exec(ctx)
	if err != nil {
		logrus.Warnf("failed to log API_CALL: %v", err)
	}
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
	err = r.client.Action.Create().
		SetIPAddress(clientIp).
		SetType(action.TypeCREATE_OBJECT).
		SetMessage(fmt.Sprintf("created competition %s", entCompetition.Name)).
		SetActionToUser(authUser).
		Exec(ctx)
	if err != nil {
		logrus.Warnf("failed to log CREATE_OBJECT: %v", err)
	}
	return entCompetition, nil
}

// UpdateCompetition is the resolver for the updateCompetition field.
func (r *mutationResolver) UpdateCompetition(ctx context.Context, input model.CompetitionInput) (*ent.Competition, error) {
	authUser, err := api.ForContext(ctx)
	if err != nil {
		return nil, fmt.Errorf("failed to get user from context: %v", err)
	}
	gCtx, err := GinContextFromContext(ctx)
	if err != nil {
		return nil, fmt.Errorf("failed to get gin context from resolver context")
	}
	clientIp, err := api.ForContextIp(gCtx)
	if err != nil {
		logrus.Warnf("unable to get ip from context: %v", err)
	}
	err = r.client.Action.Create().
		SetIPAddress(clientIp).
		SetType(action.TypeAPI_CALL).
		SetMessage("called \"UpdateCompetition\" endpoint").
		SetActionToUser(authUser).
		Exec(ctx)
	if err != nil {
		logrus.Warnf("failed to log API_CALL: %v", err)
	}
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
	err = r.client.Action.Create().
		SetIPAddress(clientIp).
		SetType(action.TypeUPDATE_OBJECT).
		SetMessage(fmt.Sprintf("updated competition %s", entCompetition.Name)).
		SetActionToUser(authUser).
		Exec(ctx)
	if err != nil {
		logrus.Warnf("failed to log UPDATE_OBJECT: %v", err)
	}
	return entCompetition, nil
}

// DeleteCompetition is the resolver for the deleteCompetition field.
func (r *mutationResolver) DeleteCompetition(ctx context.Context, id string) (bool, error) {
	authUser, err := api.ForContext(ctx)
	if err != nil {
		return false, fmt.Errorf("failed to get user from context: %v", err)
	}
	gCtx, err := GinContextFromContext(ctx)
	if err != nil {
		return false, fmt.Errorf("failed to get gin context from resolver context")
	}
	clientIp, err := api.ForContextIp(gCtx)
	if err != nil {
		logrus.Warnf("unable to get ip from context: %v", err)
	}
	err = r.client.Action.Create().
		SetIPAddress(clientIp).
		SetType(action.TypeAPI_CALL).
		SetMessage("called \"DeleteCompetition\" endpoint").
		SetActionToUser(authUser).
		Exec(ctx)
	if err != nil {
		logrus.Warnf("failed to log API_CALL: %v", err)
	}
	competitionUuid, err := uuid.Parse(id)
	if err != nil {
		return false, fmt.Errorf("failed to parse UUID: %v", err)
	}
	_, err = r.client.Competition.Delete().Where(competition.IDEQ(competitionUuid)).Exec(ctx)
	if err != nil {
		return false, fmt.Errorf("failed to delete competition: %v", err)
	}
	err = r.client.Action.Create().
		SetIPAddress(clientIp).
		SetType(action.TypeDELETE_OBJECT).
		SetMessage(fmt.Sprintf("deleted competition %s", id)).
		SetActionToUser(authUser).
		Exec(ctx)
	if err != nil {
		logrus.Warnf("failed to log DELETE_OBJECT: %v", err)
	}
	return true, nil
}

// CreateVMObject is the resolver for the createVmObject field.
func (r *mutationResolver) CreateVMObject(ctx context.Context, input model.VMObjectInput) (*ent.VmObject, error) {
	authUser, err := api.ForContext(ctx)
	if err != nil {
		return nil, fmt.Errorf("failed to get user from context: %v", err)
	}
	gCtx, err := GinContextFromContext(ctx)
	if err != nil {
		return nil, fmt.Errorf("failed to get gin context from resolver context")
	}
	clientIp, err := api.ForContextIp(gCtx)
	if err != nil {
		logrus.Warnf("unable to get ip from context: %v", err)
	}
	err = r.client.Action.Create().
		SetIPAddress(clientIp).
		SetType(action.TypeAPI_CALL).
		SetMessage("called \"CreateVMObject\" endpoint").
		SetActionToUser(authUser).
		Exec(ctx)
	if err != nil {
		logrus.Warnf("failed to log API_CALL: %v", err)
	}
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
	err = r.client.Action.Create().
		SetIPAddress(clientIp).
		SetType(action.TypeCREATE_OBJECT).
		SetMessage(fmt.Sprintf("created vm object %s", entVmObject.Name)).
		SetActionToUser(authUser).
		Exec(ctx)
	if err != nil {
		logrus.Warnf("failed to log CREATE_OBJECT: %v", err)
	}
	return entVmObject, nil
}

// BatchCreateVMObjects is the resolver for the batchCreateVmObjects field.
func (r *mutationResolver) BatchCreateVMObjects(ctx context.Context, input []*model.VMObjectInput) ([]*ent.VmObject, error) {
	authUser, err := api.ForContext(ctx)
	if err != nil {
		return nil, fmt.Errorf("failed to get user from context: %v", err)
	}
	gCtx, err := GinContextFromContext(ctx)
	if err != nil {
		return nil, fmt.Errorf("failed to get gin context from resolver context")
	}
	clientIp, err := api.ForContextIp(gCtx)
	if err != nil {
		logrus.Warnf("unable to get ip from context: %v", err)
	}
	err = r.client.Action.Create().
		SetIPAddress(clientIp).
		SetType(action.TypeAPI_CALL).
		SetMessage("called \"BatchCreateVMObjects\" endpoint").
		SetActionToUser(authUser).
		Exec(ctx)
	if err != nil {
		logrus.Warnf("failed to log API_CALL: %v", err)
	}
	entVmObjects := make([]*ent.VmObjectCreate, len(input))
	tx, err := r.client.Tx(ctx)
	if err != nil {
		return nil, fmt.Errorf("failed to create ent transactional client: %v", err)
	}
	for i, inputVmObject := range input {
		var entTeam *ent.Team = nil
		if inputVmObject.VMObjectToTeam != nil {
			teamUuid, err := uuid.Parse(*inputVmObject.VMObjectToTeam)
			if err != nil {
				return nil, fmt.Errorf("failed to parse team UUID: %v", err)
			}
			entTeam, err = tx.Team.Query().Where(team.IDEQ(teamUuid)).Only(ctx)
			if err != nil {
				return nil, fmt.Errorf("failed to query team: %v", err)
			}
		}
		entVmObject := tx.VmObject.Create().
			SetName(inputVmObject.Name).
			SetIdentifier(inputVmObject.Identifier).
			SetIPAddresses(inputVmObject.IPAddresses).
			SetVmObjectToTeam(entTeam)
		entVmObjects[i] = entVmObject
	}
	newEntVmObjects, err := tx.VmObject.CreateBulk(entVmObjects...).Save(ctx)
	if err != nil {
		if rerr := tx.Rollback(); rerr != nil {
			err = fmt.Errorf("%w: rolling back transaction: failed to bulk create vm objects: %v", err, rerr)
		}
		return nil, err
	}
	err = tx.Commit()
	if err != nil {
		return nil, fmt.Errorf("failed to commit transation. rolled back database: %v", err)
	}
	unwrappedVmObjects := make([]*ent.VmObject, len(newEntVmObjects))
	for i, entVmObject := range newEntVmObjects {
		unwrappedVmObjects[i] = entVmObject.Unwrap()
	}
	err = r.client.Action.Create().
		SetIPAddress(clientIp).
		SetType(action.TypeCREATE_OBJECT).
		SetMessage(fmt.Sprintf("created %d vm objects", len(unwrappedVmObjects))).
		SetActionToUser(authUser).
		Exec(ctx)
	if err != nil {
		logrus.Warnf("failed to log CREATE_OBJECT: %v", err)
	}
	return unwrappedVmObjects, nil
}

// UpdateVMObject is the resolver for the updateVmObject field.
func (r *mutationResolver) UpdateVMObject(ctx context.Context, input model.VMObjectInput) (*ent.VmObject, error) {
	authUser, err := api.ForContext(ctx)
	if err != nil {
		return nil, fmt.Errorf("failed to get user from context: %v", err)
	}
	gCtx, err := GinContextFromContext(ctx)
	if err != nil {
		return nil, fmt.Errorf("failed to get gin context from resolver context")
	}
	clientIp, err := api.ForContextIp(gCtx)
	if err != nil {
		logrus.Warnf("unable to get ip from context: %v", err)
	}
	err = r.client.Action.Create().
		SetIPAddress(clientIp).
		SetType(action.TypeAPI_CALL).
		SetMessage("called \"UpdateVMObjects\" endpoint").
		SetActionToUser(authUser).
		Exec(ctx)
	if err != nil {
		logrus.Warnf("failed to log API_CALL: %v", err)
	}
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
	err = r.client.Action.Create().
		SetIPAddress(clientIp).
		SetType(action.TypeUPDATE_OBJECT).
		SetMessage(fmt.Sprintf("updated vm object %s", entVmObject.Name)).
		SetActionToUser(authUser).
		Exec(ctx)
	if err != nil {
		logrus.Warnf("failed to log UPDATE_OBJECT: %v", err)
	}
	return entVmObject, nil
}

// DeleteVMObject is the resolver for the deleteVmObject field.
func (r *mutationResolver) DeleteVMObject(ctx context.Context, id string) (bool, error) {
	authUser, err := api.ForContext(ctx)
	if err != nil {
		return false, fmt.Errorf("failed to get user from context: %v", err)
	}
	gCtx, err := GinContextFromContext(ctx)
	if err != nil {
		return false, fmt.Errorf("failed to get gin context from resolver context")
	}
	clientIp, err := api.ForContextIp(gCtx)
	if err != nil {
		logrus.Warnf("unable to get ip from context: %v", err)
	}
	err = r.client.Action.Create().
		SetIPAddress(clientIp).
		SetType(action.TypeAPI_CALL).
		SetMessage("called \"DeleteVMObject\" endpoint").
		SetActionToUser(authUser).
		Exec(ctx)
	if err != nil {
		logrus.Warnf("failed to log API_CALL: %v", err)
	}
	vmObjectUuid, err := uuid.Parse(id)
	if err != nil {
		return false, fmt.Errorf("failed to parse UUID: %v", err)
	}
	_, err = r.client.VmObject.Delete().Where(vmobject.IDEQ(vmObjectUuid)).Exec(ctx)
	if err != nil {
		return false, fmt.Errorf("failed to delete vm object: %v", err)
	}
	err = r.client.Action.Create().
		SetIPAddress(clientIp).
		SetType(action.TypeDELETE_OBJECT).
		SetMessage(fmt.Sprintf("deleted vm object %s", id)).
		SetActionToUser(authUser).
		Exec(ctx)
	if err != nil {
		logrus.Warnf("failed to log DELETE_OBJECT: %v", err)
	}
	return true, nil
}

// CreateProvider is the resolver for the createProvider field.
func (r *mutationResolver) CreateProvider(ctx context.Context, input model.ProviderInput) (*ent.Provider, error) {
	authUser, err := api.ForContext(ctx)
	if err != nil {
		return nil, fmt.Errorf("failed to get user from context: %v", err)
	}
	gCtx, err := GinContextFromContext(ctx)
	if err != nil {
		return nil, fmt.Errorf("failed to get gin context from resolver context")
	}
	clientIp, err := api.ForContextIp(gCtx)
	if err != nil {
		logrus.Warnf("unable to get ip from context: %v", err)
	}
	err = r.client.Action.Create().
		SetIPAddress(clientIp).
		SetType(action.TypeAPI_CALL).
		SetMessage("called \"CreateProvider\" endpoint").
		SetActionToUser(authUser).
		Exec(ctx)
	if err != nil {
		logrus.Warnf("failed to log API_CALL: %v", err)
	}
	entProvider, err := r.client.Provider.Create().SetName(input.Name).SetType(input.Type).SetConfig(input.Config).Save(ctx)
	if err != nil {
		return nil, fmt.Errorf("failed to create provider: %v", err)
	}
	err = r.client.Action.Create().
		SetIPAddress(clientIp).
		SetType(action.TypeCREATE_OBJECT).
		SetMessage(fmt.Sprintf("created provider %s", entProvider.Name)).
		SetActionToUser(authUser).
		Exec(ctx)
	if err != nil {
		logrus.Warnf("failed to log CREATE_OBJECT: %v", err)
	}
	return entProvider, nil
}

// UpdateProvider is the resolver for the updateProvider field.
func (r *mutationResolver) UpdateProvider(ctx context.Context, input model.ProviderInput) (*ent.Provider, error) {
	authUser, err := api.ForContext(ctx)
	if err != nil {
		return nil, fmt.Errorf("failed to get user from context: %v", err)
	}
	gCtx, err := GinContextFromContext(ctx)
	if err != nil {
		return nil, fmt.Errorf("failed to get gin context from resolver context")
	}
	clientIp, err := api.ForContextIp(gCtx)
	if err != nil {
		logrus.Warnf("unable to get ip from context: %v", err)
	}
	err = r.client.Action.Create().
		SetIPAddress(clientIp).
		SetType(action.TypeAPI_CALL).
		SetMessage("called \"UpdateProvider\" endpoint").
		SetActionToUser(authUser).
		Exec(ctx)
	if err != nil {
		logrus.Warnf("failed to log API_CALL: %v", err)
	}
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
	err = r.client.Action.Create().
		SetIPAddress(clientIp).
		SetType(action.TypeUPDATE_OBJECT).
		SetMessage(fmt.Sprintf("updated provider %s", entProvider.Name)).
		SetActionToUser(authUser).
		Exec(ctx)
	if err != nil {
		logrus.Warnf("failed to log UPDATE_OBJECT: %v", err)
	}
	return entProvider, nil
}

// DeleteProvider is the resolver for the deleteProvider field.
func (r *mutationResolver) DeleteProvider(ctx context.Context, id string) (bool, error) {
	authUser, err := api.ForContext(ctx)
	if err != nil {
		return false, fmt.Errorf("failed to get user from context: %v", err)
	}
	gCtx, err := GinContextFromContext(ctx)
	if err != nil {
		return false, fmt.Errorf("failed to get gin context from resolver context")
	}
	clientIp, err := api.ForContextIp(gCtx)
	if err != nil {
		logrus.Warnf("unable to get ip from context: %v", err)
	}
	err = r.client.Action.Create().
		SetIPAddress(clientIp).
		SetType(action.TypeAPI_CALL).
		SetMessage("called \"DeleteProvider\" endpoint").
		SetActionToUser(authUser).
		Exec(ctx)
	if err != nil {
		logrus.Warnf("failed to log API_CALL: %v", err)
	}
	providerUuid, err := uuid.Parse(id)
	if err != nil {
		return false, fmt.Errorf("failed to parse UUID: %v", err)
	}
	if competitionCount, err := r.client.Provider.Query().Where(provider.IDEQ(providerUuid)).QueryProviderToCompetition().Count(ctx); err != nil {
		return false, fmt.Errorf("failed to query competitions from provider")
	} else if competitionCount > 0 {
		return false, fmt.Errorf("cannot delete provider while competitions actively reference it")
	}
	_, err = r.client.Provider.Delete().Where(provider.IDEQ(providerUuid)).Exec(ctx)
	if err != nil {
		return false, fmt.Errorf("failed to delete provider: %v", err)
	}
	err = r.client.Action.Create().
		SetIPAddress(clientIp).
		SetType(action.TypeDELETE_OBJECT).
		SetMessage(fmt.Sprintf("deleted provider %s", id)).
		SetActionToUser(authUser).
		Exec(ctx)
	if err != nil {
		logrus.Warnf("failed to log DELETE_OBJECT: %v", err)
	}
	return true, nil
}

// CreateServiceAccount is the resolver for the createServiceAccount field.
func (r *mutationResolver) CreateServiceAccount(ctx context.Context, input model.ServiceAccountInput) (*ent.ServiceAccount, error) {
	authUser, err := api.ForContext(ctx)
	if err != nil {
		return nil, fmt.Errorf("failed to get user from context: %v", err)
	}
	gCtx, err := GinContextFromContext(ctx)
	if err != nil {
		return nil, fmt.Errorf("failed to get gin context from resolver context")
	}
	clientIp, err := api.ForContextIp(gCtx)
	if err != nil {
		logrus.Warnf("unable to get ip from context: %v", err)
	}
	err = r.client.Action.Create().
		SetIPAddress(clientIp).
		SetType(action.TypeAPI_CALL).
		SetMessage("called \"CreateServiceAccount\" endpoint").
		SetActionToUser(authUser).
		Exec(ctx)
	if err != nil {
		logrus.Warnf("failed to log API_CALL: %v", err)
	}
	entServiceAccount, err := r.client.ServiceAccount.Create().
		SetDisplayName(input.DisplayName).
		SetActive(input.Active).
		Save(ctx)
	if err != nil {
		return nil, fmt.Errorf("failed to create service account: %v", err)
	}
	err = r.client.Action.Create().
		SetIPAddress(clientIp).
		SetType(action.TypeCREATE_OBJECT).
		SetMessage(fmt.Sprintf("created service account %s", entServiceAccount.DisplayName)).
		SetActionToUser(authUser).
		Exec(ctx)
	if err != nil {
		logrus.Warnf("failed to log CREATE_OBJECT: %v", err)
	}
	return entServiceAccount, nil
}

// UpdateServiceAccount is the resolver for the updateServiceAccount field.
func (r *mutationResolver) UpdateServiceAccount(ctx context.Context, input model.ServiceAccountInput) (*ent.ServiceAccount, error) {
	authUser, err := api.ForContext(ctx)
	if err != nil {
		return nil, fmt.Errorf("failed to get user from context: %v", err)
	}
	gCtx, err := GinContextFromContext(ctx)
	if err != nil {
		return nil, fmt.Errorf("failed to get gin context from resolver context")
	}
	clientIp, err := api.ForContextIp(gCtx)
	if err != nil {
		logrus.Warnf("unable to get ip from context: %v", err)
	}
	err = r.client.Action.Create().
		SetIPAddress(clientIp).
		SetType(action.TypeAPI_CALL).
		SetMessage("called \"UpdateServiceAccount\" endpoint").
		SetActionToUser(authUser).
		Exec(ctx)
	if err != nil {
		logrus.Warnf("failed to log API_CALL: %v", err)
	}
	if input.ID == nil {
		return nil, fmt.Errorf("failed to query service account: ID must not be nil")
	}
	serviceAccountUuid, err := uuid.Parse(*input.ID)
	if err != nil {
		return nil, fmt.Errorf("failed to parse service account UUID: %v", err)
	}
	entServiceAccount, err := r.client.ServiceAccount.Query().
		Where(
			serviceaccount.IDEQ(serviceAccountUuid),
		).Only(ctx)
	if err != nil {
		return nil, fmt.Errorf("failed to query service account: %v", err)
	}
	entServiceAccount, err = entServiceAccount.Update().
		SetDisplayName(input.DisplayName).
		SetActive(input.Active).
		Save(ctx)
	if err != nil {
		return nil, fmt.Errorf("failed to update service account: %v", err)
	}
	err = r.client.Action.Create().
		SetIPAddress(clientIp).
		SetType(action.TypeUPDATE_OBJECT).
		SetMessage(fmt.Sprintf("updated service account %s", entServiceAccount.DisplayName)).
		SetActionToUser(authUser).
		Exec(ctx)
	if err != nil {
		logrus.Warnf("failed to log UPDATE_OBJECT: %v", err)
	}
	return entServiceAccount, nil
}

// DeleteServiceAccount is the resolver for the deleteServiceAccount field.
func (r *mutationResolver) DeleteServiceAccount(ctx context.Context, id string) (bool, error) {
	authUser, err := api.ForContext(ctx)
	if err != nil {
		return false, fmt.Errorf("failed to get user from context: %v", err)
	}
	gCtx, err := GinContextFromContext(ctx)
	if err != nil {
		return false, fmt.Errorf("failed to get gin context from resolver context")
	}
	clientIp, err := api.ForContextIp(gCtx)
	if err != nil {
		logrus.Warnf("unable to get ip from context: %v", err)
	}
	err = r.client.Action.Create().
		SetIPAddress(clientIp).
		SetType(action.TypeAPI_CALL).
		SetMessage("called \"DeleteServiceAccount\" endpoint").
		SetActionToUser(authUser).
		Exec(ctx)
	if err != nil {
		logrus.Warnf("failed to log API_CALL: %v", err)
	}
	serviceAccountUuid, err := uuid.Parse(id)
	if err != nil {
		return false, fmt.Errorf("failed to parse UUID: %v", err)
	}
	_, err = r.client.ServiceAccount.Delete().
		Where(
			serviceaccount.IDEQ(serviceAccountUuid),
		).Exec(ctx)
	if err != nil {
		return false, fmt.Errorf("failed to delete service account: %v", err)
	}
	err = r.client.Action.Create().
		SetIPAddress(clientIp).
		SetType(action.TypeDELETE_OBJECT).
		SetMessage(fmt.Sprintf("deleted service account %s", id)).
		SetActionToUser(authUser).
		Exec(ctx)
	if err != nil {
		logrus.Warnf("failed to log DELETE_OBJECT: %v", err)
	}
	return true, nil
}

// LockoutVM is the resolver for the lockoutVm field.
func (r *mutationResolver) LockoutVM(ctx context.Context, id string, locked bool) (bool, error) {
	authUser, err := api.ForContext(ctx)
	if err != nil {
		return false, fmt.Errorf("failed to get user from context: %v", err)
	}
	gCtx, err := GinContextFromContext(ctx)
	if err != nil {
		return false, fmt.Errorf("failed to get gin context from resolver context")
	}
	clientIp, err := api.ForContextIp(gCtx)
	if err != nil {
		logrus.Warnf("unable to get ip from context: %v", err)
	}
	err = r.client.Action.Create().
		SetIPAddress(clientIp).
		SetType(action.TypeAPI_CALL).
		SetMessage("called \"LockoutVM\" endpoint").
		SetActionToUser(authUser).
		Exec(ctx)
	if err != nil {
		logrus.Warnf("failed to log API_CALL: %v", err)
	}
	vmObjectUuid, err := uuid.Parse(id)
	if err != nil {
		return false, fmt.Errorf("failed to parse UUID: %v", err)
	}
	err = r.client.VmObject.Update().Where(vmobject.IDEQ(vmObjectUuid)).SetLocked(locked).Exec(ctx)
	if err != nil {
		return false, fmt.Errorf("failed to set vm object lock state: %v", err)
	}
	err = r.client.Action.Create().
		SetIPAddress(clientIp).
		SetType(action.TypeUPDATE_LOCKOUT).
		SetMessage(fmt.Sprintf("set lockout to %t for vm %s", locked, id)).
		SetActionToUser(authUser).
		Exec(ctx)
	if err != nil {
		logrus.Warnf("failed to log UPDATE_LOCKOUT: %v", err)
	}
	r.rdb.Publish(ctx, "lockout", vmObjectUuid.String())
	return true, nil
}

// BatchLockout is the resolver for the batchLockout field.
func (r *mutationResolver) BatchLockout(ctx context.Context, vmObjects []string, locked bool) (bool, error) {
	authUser, err := api.ForContext(ctx)
	if err != nil {
		return false, fmt.Errorf("failed to get user from context: %v", err)
	}
	gCtx, err := GinContextFromContext(ctx)
	if err != nil {
		return false, fmt.Errorf("failed to get gin context from resolver context")
	}
	clientIp, err := api.ForContextIp(gCtx)
	if err != nil {
		logrus.Warnf("unable to get ip from context: %v", err)
	}
	err = r.client.Action.Create().
		SetIPAddress(clientIp).
		SetType(action.TypeAPI_CALL).
		SetMessage("called \"BatchLockout\" endpoint").
		SetActionToUser(authUser).
		Exec(ctx)
	if err != nil {
		logrus.Warnf("failed to log API_CALL: %v", err)
	}
	for _, id := range vmObjects {
		vmObjectUuid, err := uuid.Parse(id)
		if err != nil {
			logrus.Errorf("failed to parse UUID: %v", err)
			continue
		}
		err = r.client.VmObject.Update().Where(vmobject.IDEQ(vmObjectUuid)).SetLocked(locked).Exec(ctx)
		if err != nil {
			logrus.Errorf("failed to set vm object lock state: %v", err)
			continue
		}
		err = r.client.Action.Create().
			SetIPAddress(clientIp).
			SetType(action.TypeUPDATE_LOCKOUT).
			SetMessage(fmt.Sprintf("set lockout to %t for vm %s", locked, id)).
			SetActionToUser(authUser).
			Exec(ctx)
		if err != nil {
			logrus.Warnf("failed to log UPDATE_LOCKOUT: %v", err)
			continue
		}
		r.rdb.Publish(ctx, "lockout", vmObjectUuid.String())
	}
	return true, nil
}

// LockoutCompetition is the resolver for the lockoutCompetition field.
func (r *mutationResolver) LockoutCompetition(ctx context.Context, id string, locked bool) (bool, error) {
	authUser, err := api.ForContext(ctx)
	if err != nil {
		return false, fmt.Errorf("failed to get user from context: %v", err)
	}
	gCtx, err := GinContextFromContext(ctx)
	if err != nil {
		return false, fmt.Errorf("failed to get gin context from resolver context")
	}
	clientIp, err := api.ForContextIp(gCtx)
	if err != nil {
		logrus.Warnf("unable to get ip from context: %v", err)
	}
	err = r.client.Action.Create().
		SetIPAddress(clientIp).
		SetType(action.TypeAPI_CALL).
		SetMessage("called \"LockoutCompetitions\" endpoint").
		SetActionToUser(authUser).
		Exec(ctx)
	if err != nil {
		logrus.Warnf("failed to log API_CALL: %v", err)
	}
	competitionUuid, err := uuid.Parse(id)
	if err != nil {
		return false, fmt.Errorf("failed to parse UUID: %v", err)
	}
	err = r.client.VmObject.Update().
		Where(
			vmobject.HasVmObjectToTeamWith(
				team.HasTeamToCompetitionWith(
					competition.IDEQ(competitionUuid),
				),
			),
		).SetLocked(locked).Exec(ctx)
	if err != nil {
		return false, fmt.Errorf("failed to set competition vm objects lock state: %v", err)
	}
	updatedVmUuids, err := r.client.VmObject.Query().
		Where(
			vmobject.HasVmObjectToTeamWith(
				team.HasTeamToCompetitionWith(
					competition.IDEQ(competitionUuid),
				),
			),
		).IDs(ctx)
	if err != nil {
		return false, fmt.Errorf("failed to query updated vm objects: %v", err)
	}
	for _, vmUuid := range updatedVmUuids {
		r.rdb.Publish(ctx, "lockout", vmUuid.String())
	}
	err = r.client.Action.Create().
		SetIPAddress(clientIp).
		SetType(action.TypeUPDATE_LOCKOUT).
		SetMessage(fmt.Sprintf("set lockout to %t for competition %s", locked, id)).
		SetActionToUser(authUser).
		Exec(ctx)
	if err != nil {
		logrus.Warnf("failed to log UPDATE_LOCKOUT: %v", err)
	}
	return true, nil
}

// ID is the resolver for the ID field.
func (r *providerResolver) ID(ctx context.Context, obj *ent.Provider) (string, error) {
	return obj.ID.String(), nil
}

// Console is the resolver for the console field.
func (r *queryResolver) Console(ctx context.Context, vmObjectID string, consoleType model.ConsoleType) (string, error) {
	entUser, err := api.ForContext(ctx)
	if err != nil {
		return "", fmt.Errorf("failed to get user from context: %v", err)
	}
	gCtx, err := GinContextFromContext(ctx)
	if err != nil {
		return "", fmt.Errorf("failed to get gin context from resolver context")
	}
	clientIp, err := api.ForContextIp(gCtx)
	if err != nil {
		logrus.Warnf("unable to get ip from context: %v", err)
	}
	err = r.client.Action.Create().
		SetIPAddress(clientIp).
		SetType(action.TypeAPI_CALL).
		SetMessage("called \"Console\" endpoint").
		SetActionToUser(entUser).
		Exec(ctx)
	if err != nil {
		logrus.Warnf("failed to log API_CALL: %v", err)
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
	if entUser.Role != user.RoleADMIN && entVmObject.Locked {
		return "", fmt.Errorf("VM is currently locked out")
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
	err = r.client.Action.Create().
		SetIPAddress(clientIp).
		SetType(action.TypeCONSOLE_ACCESS).
		SetMessage(fmt.Sprintf("access console for vm %s", entVmObject.Name)).
		SetActionToUser(entUser).
		Exec(ctx)
	if err != nil {
		logrus.Warnf("failed to log UPDATE_LOCKOUT: %v", err)
	}
	return provider.GetConsoleUrl(entVmObject, utils.ConsoleType(consoleType))
}

// Me is the resolver for the me field.
func (r *queryResolver) Me(ctx context.Context) (*ent.User, error) {
	entUser, err := api.ForContext(ctx)
	if err != nil {
		return nil, fmt.Errorf("failed to get user from context: %v", err)
	}
	gCtx, err := GinContextFromContext(ctx)
	if err != nil {
		return nil, fmt.Errorf("failed to get gin context from resolver context")
	}
	clientIp, err := api.ForContextIp(gCtx)
	if err != nil {
		logrus.Warnf("unable to get ip from context: %v", err)
	}
	err = r.client.Action.Create().
		SetIPAddress(clientIp).
		SetType(action.TypeAPI_CALL).
		SetMessage("called \"Me\" endpoint").
		SetActionToUser(entUser).
		Exec(ctx)
	if err != nil {
		logrus.Warnf("failed to log API_CALL: %v", err)
	}
	return entUser, nil
}

// VMObject is the resolver for the vmObject field.
func (r *queryResolver) VMObject(ctx context.Context, vmObjectID string) (*ent.VmObject, error) {
	entUser, err := api.ForContext(ctx)
	if err != nil {
		return nil, fmt.Errorf("failed to get user from context: %v", err)
	}
	gCtx, err := GinContextFromContext(ctx)
	if err != nil {
		return nil, fmt.Errorf("failed to get gin context from resolver context")
	}
	clientIp, err := api.ForContextIp(gCtx)
	if err != nil {
		logrus.Warnf("unable to get ip from context: %v", err)
	}
	err = r.client.Action.Create().
		SetIPAddress(clientIp).
		SetType(action.TypeAPI_CALL).
		SetMessage("called \"VMObject\" endpoint").
		SetActionToUser(entUser).
		Exec(ctx)
	if err != nil {
		logrus.Warnf("failed to log API_CALL: %v", err)
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
	entUser, err := api.ForContext(ctx)
	if err != nil {
		return nil, fmt.Errorf("failed to get user from context: %v", err)
	}
	gCtx, err := GinContextFromContext(ctx)
	if err != nil {
		return nil, fmt.Errorf("failed to get gin context from resolver context")
	}
	clientIp, err := api.ForContextIp(gCtx)
	if err != nil {
		logrus.Warnf("unable to get ip from context: %v", err)
	}
	err = r.client.Action.Create().
		SetIPAddress(clientIp).
		SetType(action.TypeAPI_CALL).
		SetMessage("called \"MyVMObjects\" endpoint").
		SetActionToUser(entUser).
		Exec(ctx)
	if err != nil {
		logrus.Warnf("failed to log API_CALL: %v", err)
	}
	entVmObjects, err := entUser.QueryUserToTeam().QueryTeamToVmObjects().All(ctx)
	if err != nil {
		return nil, fmt.Errorf("failed to query vm objects from user: %v", err)
	}
	return entVmObjects, nil
}

// MyTeam is the resolver for the myTeam field.
func (r *queryResolver) MyTeam(ctx context.Context) (*ent.Team, error) {
	entUser, err := api.ForContext(ctx)
	if err != nil {
		return nil, fmt.Errorf("failed to get user from context: %v", err)
	}
	gCtx, err := GinContextFromContext(ctx)
	if err != nil {
		return nil, fmt.Errorf("failed to get gin context from resolver context")
	}
	clientIp, err := api.ForContextIp(gCtx)
	if err != nil {
		logrus.Warnf("unable to get ip from context: %v", err)
	}
	err = r.client.Action.Create().
		SetIPAddress(clientIp).
		SetType(action.TypeAPI_CALL).
		SetMessage("called \"MyTeam\" endpoint").
		SetActionToUser(entUser).
		Exec(ctx)
	if err != nil {
		logrus.Warnf("failed to log API_CALL: %v", err)
	}
	entTeam, err := entUser.QueryUserToTeam().Only(ctx)
	if err != nil {
		return nil, fmt.Errorf("failed to query team from user: %v", err)
	}
	return entTeam, nil
}

// MyCompetition is the resolver for the myCompetition field.
func (r *queryResolver) MyCompetition(ctx context.Context) (*ent.Competition, error) {
	entUser, err := api.ForContext(ctx)
	if err != nil {
		return nil, fmt.Errorf("failed to get user from context: %v", err)
	}
	gCtx, err := GinContextFromContext(ctx)
	if err != nil {
		return nil, fmt.Errorf("failed to get gin context from resolver context")
	}
	clientIp, err := api.ForContextIp(gCtx)
	if err != nil {
		logrus.Warnf("unable to get ip from context: %v", err)
	}
	err = r.client.Action.Create().
		SetIPAddress(clientIp).
		SetType(action.TypeAPI_CALL).
		SetMessage("called \"MyCompetition\" endpoint").
		SetActionToUser(entUser).
		Exec(ctx)
	if err != nil {
		logrus.Warnf("failed to log API_CALL: %v", err)
	}
	entCompetition, err := entUser.QueryUserToTeam().QueryTeamToCompetition().Only(ctx)
	if err != nil {
		return nil, fmt.Errorf("failed to query competition from user: %v", err)
	}
	return entCompetition, nil
}

// Users is the resolver for the users field.
func (r *queryResolver) Users(ctx context.Context) ([]*ent.User, error) {
	authUser, err := api.ForContext(ctx)
	if err != nil {
		return nil, fmt.Errorf("failed to get user from context: %v", err)
	}
	gCtx, err := GinContextFromContext(ctx)
	if err != nil {
		return nil, fmt.Errorf("failed to get gin context from resolver context")
	}
	clientIp, err := api.ForContextIp(gCtx)
	if err != nil {
		logrus.Warnf("unable to get ip from context: %v", err)
	}
	err = r.client.Action.Create().
		SetIPAddress(clientIp).
		SetType(action.TypeAPI_CALL).
		SetMessage("called \"Users\" endpoint").
		SetActionToUser(authUser).
		Exec(ctx)
	if err != nil {
		logrus.Warnf("failed to log API_CALL: %v", err)
	}
	entUsers, err := r.client.User.Query().All(ctx)
	if err != nil {
		return nil, fmt.Errorf("failed to query users: %v", err)
	}
	return entUsers, nil
}

// GetUser is the resolver for the getUser field.
func (r *queryResolver) GetUser(ctx context.Context, id string) (*ent.User, error) {
	authUser, err := api.ForContext(ctx)
	if err != nil {
		return nil, fmt.Errorf("failed to get user from context: %v", err)
	}
	gCtx, err := GinContextFromContext(ctx)
	if err != nil {
		return nil, fmt.Errorf("failed to get gin context from resolver context")
	}
	clientIp, err := api.ForContextIp(gCtx)
	if err != nil {
		logrus.Warnf("unable to get ip from context: %v", err)
	}
	err = r.client.Action.Create().
		SetIPAddress(clientIp).
		SetType(action.TypeAPI_CALL).
		SetMessage("called \"GetUser\" endpoint").
		SetActionToUser(authUser).
		Exec(ctx)
	if err != nil {
		logrus.Warnf("failed to log API_CALL: %v", err)
	}
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
	authUser, err := api.ForContext(ctx)
	if err != nil {
		return nil, fmt.Errorf("failed to get user from context: %v", err)
	}
	gCtx, err := GinContextFromContext(ctx)
	if err != nil {
		return nil, fmt.Errorf("failed to get gin context from resolver context")
	}
	clientIp, err := api.ForContextIp(gCtx)
	if err != nil {
		logrus.Warnf("unable to get ip from context: %v", err)
	}
	err = r.client.Action.Create().
		SetIPAddress(clientIp).
		SetType(action.TypeAPI_CALL).
		SetMessage("called \"VmObjects\" endpoint").
		SetActionToUser(authUser).
		Exec(ctx)
	if err != nil {
		logrus.Warnf("failed to log API_CALL: %v", err)
	}
	entVmObjects, err := r.client.VmObject.Query().Order(ent.Asc(vmobject.FieldID)).All(ctx)
	if err != nil {
		return nil, fmt.Errorf("failed to query vm objects: %v", err)
	}
	return entVmObjects, nil
}

// GetVMObject is the resolver for the getVmObject field.
func (r *queryResolver) GetVMObject(ctx context.Context, id string) (*ent.VmObject, error) {
	authUser, err := api.ForContext(ctx)
	if err != nil {
		return nil, fmt.Errorf("failed to get user from context: %v", err)
	}
	gCtx, err := GinContextFromContext(ctx)
	if err != nil {
		return nil, fmt.Errorf("failed to get gin context from resolver context")
	}
	clientIp, err := api.ForContextIp(gCtx)
	if err != nil {
		logrus.Warnf("unable to get ip from context: %v", err)
	}
	err = r.client.Action.Create().
		SetIPAddress(clientIp).
		SetType(action.TypeAPI_CALL).
		SetMessage("called \"GetVmObject\" endpoint").
		SetActionToUser(authUser).
		Exec(ctx)
	if err != nil {
		logrus.Warnf("failed to log API_CALL: %v", err)
	}
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
	authUser, err := api.ForContext(ctx)
	if err != nil {
		return nil, fmt.Errorf("failed to get user from context: %v", err)
	}
	gCtx, err := GinContextFromContext(ctx)
	if err != nil {
		return nil, fmt.Errorf("failed to get gin context from resolver context")
	}
	clientIp, err := api.ForContextIp(gCtx)
	if err != nil {
		logrus.Warnf("unable to get ip from context: %v", err)
	}
	err = r.client.Action.Create().
		SetIPAddress(clientIp).
		SetType(action.TypeAPI_CALL).
		SetMessage("called \"Teams\" endpoint").
		SetActionToUser(authUser).
		Exec(ctx)
	if err != nil {
		logrus.Warnf("failed to log API_CALL: %v", err)
	}
	entTeams, err := r.client.Team.Query().All(ctx)
	if err != nil {
		return nil, fmt.Errorf("failed to query teams: %v", err)
	}
	return entTeams, nil
}

// GetTeam is the resolver for the getTeam field.
func (r *queryResolver) GetTeam(ctx context.Context, id string) (*ent.Team, error) {
	authUser, err := api.ForContext(ctx)
	if err != nil {
		return nil, fmt.Errorf("failed to get user from context: %v", err)
	}
	gCtx, err := GinContextFromContext(ctx)
	if err != nil {
		return nil, fmt.Errorf("failed to get gin context from resolver context")
	}
	clientIp, err := api.ForContextIp(gCtx)
	if err != nil {
		logrus.Warnf("unable to get ip from context: %v", err)
	}
	err = r.client.Action.Create().
		SetIPAddress(clientIp).
		SetType(action.TypeAPI_CALL).
		SetMessage("called \"GetTeam\" endpoint").
		SetActionToUser(authUser).
		Exec(ctx)
	if err != nil {
		logrus.Warnf("failed to log API_CALL: %v", err)
	}
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
	authUser, err := api.ForContext(ctx)
	if err != nil {
		return nil, fmt.Errorf("failed to get user from context: %v", err)
	}
	gCtx, err := GinContextFromContext(ctx)
	if err != nil {
		return nil, fmt.Errorf("failed to get gin context from resolver context")
	}
	clientIp, err := api.ForContextIp(gCtx)
	if err != nil {
		logrus.Warnf("unable to get ip from context: %v", err)
	}
	err = r.client.Action.Create().
		SetIPAddress(clientIp).
		SetType(action.TypeAPI_CALL).
		SetMessage("called \"Competitions\" endpoint").
		SetActionToUser(authUser).
		Exec(ctx)
	if err != nil {
		logrus.Warnf("failed to log API_CALL: %v", err)
	}
	entCompetitions, err := r.client.Competition.Query().All(ctx)
	if err != nil {
		return nil, fmt.Errorf("failed to query competitions: %v", err)
	}
	return entCompetitions, nil
}

// GetCompetition is the resolver for the getCompetition field.
func (r *queryResolver) GetCompetition(ctx context.Context, id string) (*ent.Competition, error) {
	authUser, err := api.ForContext(ctx)
	if err != nil {
		return nil, fmt.Errorf("failed to get user from context: %v", err)
	}
	gCtx, err := GinContextFromContext(ctx)
	if err != nil {
		return nil, fmt.Errorf("failed to get gin context from resolver context")
	}
	clientIp, err := api.ForContextIp(gCtx)
	if err != nil {
		logrus.Warnf("unable to get ip from context: %v", err)
	}
	err = r.client.Action.Create().
		SetIPAddress(clientIp).
		SetType(action.TypeAPI_CALL).
		SetMessage("called \"GetCompetition\" endpoint").
		SetActionToUser(authUser).
		Exec(ctx)
	if err != nil {
		logrus.Warnf("failed to log API_CALL: %v", err)
	}
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
	authUser, err := api.ForContext(ctx)
	if err != nil {
		return nil, fmt.Errorf("failed to get user from context: %v", err)
	}
	gCtx, err := GinContextFromContext(ctx)
	if err != nil {
		return nil, fmt.Errorf("failed to get gin context from resolver context")
	}
	clientIp, err := api.ForContextIp(gCtx)
	if err != nil {
		logrus.Warnf("unable to get ip from context: %v", err)
	}
	err = r.client.Action.Create().
		SetIPAddress(clientIp).
		SetType(action.TypeAPI_CALL).
		SetMessage("called \"Providers\" endpoint").
		SetActionToUser(authUser).
		Exec(ctx)
	if err != nil {
		logrus.Warnf("failed to log API_CALL: %v", err)
	}
	entProviders, err := r.client.Provider.Query().All(ctx)
	if err != nil {
		return nil, fmt.Errorf("failed to query providers: %v", err)
	}
	return entProviders, nil
}

// GetProvider is the resolver for the getProvider field.
func (r *queryResolver) GetProvider(ctx context.Context, id string) (*ent.Provider, error) {
	authUser, err := api.ForContext(ctx)
	if err != nil {
		return nil, fmt.Errorf("failed to get user from context: %v", err)
	}
	gCtx, err := GinContextFromContext(ctx)
	if err != nil {
		return nil, fmt.Errorf("failed to get gin context from resolver context")
	}
	clientIp, err := api.ForContextIp(gCtx)
	if err != nil {
		logrus.Warnf("unable to get ip from context: %v", err)
	}
	err = r.client.Action.Create().
		SetIPAddress(clientIp).
		SetType(action.TypeAPI_CALL).
		SetMessage("called \"GetProvider\" endpoint").
		SetActionToUser(authUser).
		Exec(ctx)
	if err != nil {
		logrus.Warnf("failed to log API_CALL: %v", err)
	}
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
	authUser, err := api.ForContext(ctx)
	if err != nil {
		return false, fmt.Errorf("failed to get user from context: %v", err)
	}
	gCtx, err := GinContextFromContext(ctx)
	if err != nil {
		return false, fmt.Errorf("failed to get gin context from resolver context")
	}
	clientIp, err := api.ForContextIp(gCtx)
	if err != nil {
		logrus.Warnf("unable to get ip from context: %v", err)
	}
	err = r.client.Action.Create().
		SetIPAddress(clientIp).
		SetType(action.TypeAPI_CALL).
		SetMessage("called \"ValidateConfig\" endpoint").
		SetActionToUser(authUser).
		Exec(ctx)
	if err != nil {
		logrus.Warnf("failed to log API_CALL: %v", err)
	}
	err = providers.ValidateConfig(typeArg, config)
	if err != nil {
		return false, fmt.Errorf("failed to parse config: %v", err)
	}
	return true, nil
}

// ListProviderVms is the resolver for the listProviderVms field.
func (r *queryResolver) ListProviderVms(ctx context.Context, id string) ([]*model.SkeletonVMObject, error) {
	authUser, err := api.ForContext(ctx)
	if err != nil {
		return nil, fmt.Errorf("failed to get user from context: %v", err)
	}
	gCtx, err := GinContextFromContext(ctx)
	if err != nil {
		return nil, fmt.Errorf("failed to get gin context from resolver context")
	}
	clientIp, err := api.ForContextIp(gCtx)
	if err != nil {
		logrus.Warnf("unable to get ip from context: %v", err)
	}
	err = r.client.Action.Create().
		SetIPAddress(clientIp).
		SetType(action.TypeAPI_CALL).
		SetMessage("called \"ListProviderVms\" endpoint").
		SetActionToUser(authUser).
		Exec(ctx)
	if err != nil {
		logrus.Warnf("failed to log API_CALL: %v", err)
	}
	providerUuid, err := uuid.Parse(id)
	if err != nil {
		return nil, fmt.Errorf("failed to parse provider UUID: %v", err)
	}
	entProvider, err := r.client.Provider.Query().Where(provider.IDEQ(providerUuid)).Only(ctx)
	if err != nil {
		return nil, fmt.Errorf("failed to query provider: %v", err)
	}
	prov, err := providers.NewProvider(entProvider.Type, entProvider.Config)
	if err != nil {
		return nil, fmt.Errorf("failed to instantiate provider: %v", err)
	}
	vmObjects, err := prov.ListVMs()
	if err != nil {
		return nil, fmt.Errorf("failed to list vms from provider: %v", err)
	}
	skeletonVmObjects := make([]*model.SkeletonVMObject, len(vmObjects))
	for i, vmObject := range vmObjects {
		skeletonVmObjects[i] = &model.SkeletonVMObject{
			Name:        vmObject.Name,
			Identifier:  vmObject.Identifier,
			IPAddresses: vmObject.IPAddresses,
		}
	}
	return skeletonVmObjects, nil
}

// ServiceAccounts is the resolver for the serviceAccounts field.
func (r *queryResolver) ServiceAccounts(ctx context.Context) ([]*ent.ServiceAccount, error) {
	authUser, err := api.ForContext(ctx)
	if err != nil {
		return nil, fmt.Errorf("failed to get user from context: %v", err)
	}
	gCtx, err := GinContextFromContext(ctx)
	if err != nil {
		return nil, fmt.Errorf("failed to get gin context from resolver context")
	}
	clientIp, err := api.ForContextIp(gCtx)
	if err != nil {
		logrus.Warnf("unable to get ip from context: %v", err)
	}
	err = r.client.Action.Create().
		SetIPAddress(clientIp).
		SetType(action.TypeAPI_CALL).
		SetMessage("called \"ServiceAccounts\" endpoint").
		SetActionToUser(authUser).
		Exec(ctx)
	if err != nil {
		logrus.Warnf("failed to log API_CALL: %v", err)
	}

	entServiceAccounts, err := r.client.ServiceAccount.Query().All(ctx)
	if err != nil {
		return nil, fmt.Errorf("failed to query service accounts: %v", err)
	}
	return entServiceAccounts, nil
}

// GetServiceAccount is the resolver for the getServiceAccount field.
func (r *queryResolver) GetServiceAccount(ctx context.Context, id string) (*ent.ServiceAccount, error) {
	authUser, err := api.ForContext(ctx)
	if err != nil {
		return nil, fmt.Errorf("failed to get user from context: %v", err)
	}
	gCtx, err := GinContextFromContext(ctx)
	if err != nil {
		return nil, fmt.Errorf("failed to get gin context from resolver context")
	}
	clientIp, err := api.ForContextIp(gCtx)
	if err != nil {
		logrus.Warnf("unable to get ip from context: %v", err)
	}
	err = r.client.Action.Create().
		SetIPAddress(clientIp).
		SetType(action.TypeAPI_CALL).
		SetMessage("called \"GetServiceAccount\" endpoint").
		SetActionToUser(authUser).
		Exec(ctx)
	if err != nil {
		logrus.Warnf("failed to log API_CALL: %v", err)
	}

	serviceAccountUuid, err := uuid.Parse(id)
	if err != nil {
		return nil, fmt.Errorf("failed to parse service account UUID: %v", err)
	}
	entServiceAccounts, err := r.client.ServiceAccount.Query().
		Where(
			serviceaccount.IDEQ(serviceAccountUuid),
		).Only(ctx)
	if err != nil {
		return nil, fmt.Errorf("failed to query service account: %v", err)
	}
	return entServiceAccounts, nil
}

// Actions is the resolver for the actions field.
func (r *queryResolver) Actions(ctx context.Context, offset int, limit int, types []model.ActionType) (*model.ActionsResult, error) {
	authUser, err := api.ForContext(ctx)
	if err != nil {
		return nil, fmt.Errorf("failed to get user from context: %v", err)
	}
	gCtx, err := GinContextFromContext(ctx)
	if err != nil {
		return nil, fmt.Errorf("failed to get gin context from resolver context")
	}
	clientIp, err := api.ForContextIp(gCtx)
	if err != nil {
		logrus.Warnf("unable to get ip from context: %v", err)
	}
	err = r.client.Action.Create().
		SetIPAddress(clientIp).
		SetType(action.TypeAPI_CALL).
		SetMessage("called \"Actions\" endpoint").
		SetActionToUser(authUser).
		Exec(ctx)
	if err != nil {
		logrus.Warnf("failed to log API_CALL: %v", err)
	}
	entTypes := make([]action.Type, 0)
	for _, t := range types {
		entTypes = append(entTypes, action.Type(t))
	}
	entActions, err := r.client.Action.Query().
		Where(action.TypeIn(entTypes...)).
		Order(ent.Desc(action.FieldPerformedAt)).
		Offset(offset).
		Limit(limit).
		All(ctx)
	if err != nil {
		return nil, fmt.Errorf("failed to list actions: %v", err)
	}
	totalActions, err := r.client.Action.Query().Where(action.TypeIn(entTypes...)).Count(ctx)
	if err != nil {
		return nil, fmt.Errorf("failed to query actions for count: %v", err)
	}
	return &model.ActionsResult{
		Results:      entActions,
		Offset:       offset,
		Limit:        limit,
		Page:         offset / limit,
		TotalPages:   int(math.Ceil(float64(totalActions) / float64(limit))),
		TotalResults: totalActions,
		Types:        types,
	}, nil
}

// ID is the resolver for the ID field.
func (r *serviceAccountResolver) ID(ctx context.Context, obj *ent.ServiceAccount) (string, error) {
	return obj.ID.String(), nil
}

// APIKey is the resolver for the ApiKey field.
func (r *serviceAccountResolver) APIKey(ctx context.Context, obj *ent.ServiceAccount) (string, error) {
	return obj.APIKey.String(), nil
}

// Lockout is the resolver for the lockout field.
func (r *subscriptionResolver) Lockout(ctx context.Context, id string) (<-chan *ent.VmObject, error) {
	vmObjectLockout := make(chan *ent.VmObject, 1)
	go func() {
		sub := r.rdb.Subscribe(ctx, "lockout")
		_, err := sub.Receive(ctx)
		if err != nil {
			return
		}
		ch := sub.Channel()
		for {
			select {
			case message := <-ch:
				// Ignore VM's we aren't subscribed to
				if message.Payload != id {
					break
				}
				uuid, err := uuid.Parse(message.Payload)
				if err != nil {
					sub.Close()
					return
				}
				entVmObject, err := r.client.VmObject.Get(ctx, uuid)
				if err != nil {
					sub.Close()
					return
				}
				vmObjectLockout <- entVmObject
			// close when context done
			case <-ctx.Done():
				sub.Close()
				return
			}
		}
	}()
	return vmObjectLockout, nil
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

// Action returns generated.ActionResolver implementation.
func (r *Resolver) Action() generated.ActionResolver { return &actionResolver{r} }

// Competition returns generated.CompetitionResolver implementation.
func (r *Resolver) Competition() generated.CompetitionResolver { return &competitionResolver{r} }

// Mutation returns generated.MutationResolver implementation.
func (r *Resolver) Mutation() generated.MutationResolver { return &mutationResolver{r} }

// Provider returns generated.ProviderResolver implementation.
func (r *Resolver) Provider() generated.ProviderResolver { return &providerResolver{r} }

// Query returns generated.QueryResolver implementation.
func (r *Resolver) Query() generated.QueryResolver { return &queryResolver{r} }

// ServiceAccount returns generated.ServiceAccountResolver implementation.
func (r *Resolver) ServiceAccount() generated.ServiceAccountResolver {
	return &serviceAccountResolver{r}
}

// Subscription returns generated.SubscriptionResolver implementation.
func (r *Resolver) Subscription() generated.SubscriptionResolver { return &subscriptionResolver{r} }

// Team returns generated.TeamResolver implementation.
func (r *Resolver) Team() generated.TeamResolver { return &teamResolver{r} }

// User returns generated.UserResolver implementation.
func (r *Resolver) User() generated.UserResolver { return &userResolver{r} }

// VmObject returns generated.VmObjectResolver implementation.
func (r *Resolver) VmObject() generated.VmObjectResolver { return &vmObjectResolver{r} }

type actionResolver struct{ *Resolver }
type competitionResolver struct{ *Resolver }
type mutationResolver struct{ *Resolver }
type providerResolver struct{ *Resolver }
type queryResolver struct{ *Resolver }
type serviceAccountResolver struct{ *Resolver }
type subscriptionResolver struct{ *Resolver }
type teamResolver struct{ *Resolver }
type userResolver struct{ *Resolver }
type vmObjectResolver struct{ *Resolver }
