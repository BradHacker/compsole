package rest

import (
	"github.com/BradHacker/compsole/ent"
	"github.com/BradHacker/compsole/ent/user"
	"github.com/google/uuid"
)

// VmObjectInput model info
//
//	@Description	Used as an input model for creating/updating VM Objects
type VmObjectInput struct {
	Name           string   `json:"name" form:"name" binding:"required" example:"team01.dc.comp.co"`
	Identifier     string   `json:"identifier" form:"identifier" binding:"required" example:"xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"`
	IpAddresses    []string `json:"ip_addresses" form:"ip_addresses" binding:"required" example:"10.0.0.1,100.64.0.1"`
	VmObjectToTeam string   `json:"vm_object_to_team" form:"vm_object_to_team" binding:"required" example:"xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"`
}

// VmObjectModel model info
//
//	@Description	Used for VM Object endpoints
type VmObjectModel struct {
	//Fields
	ID          uuid.UUID `json:"id" example:"xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"`         // Compsole ID
	Name        string    `json:"name" example:"team01.dc.comp.co"`                          // [REQUIRED] A user-friendly name for the VM. This will be provider-specific.
	Identifier  string    `json:"identifier" example:"xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"` // [REQUIRED] The identifier of the VM. This will be provider-specific.
	IpAddresses []string  `json:"ip_addresses" example:"10.0.0.1,100.64.0.1"`                // [OPTIONAL] IP addresses of the VM. This will be displayed to the user.
	Locked      bool      `json:"locked" example:"false"`                                    // [REQUIRED] (default is false) If a vm is locked, standard users will not be able to access this VM.
	// Edges
	VmObjectToTeam *TeamEdge `json:"vm_object_to_team"`
}

// VmObjectModel model info
//
//	@Description	Used for VM Object in edges
type VmObjectEdge struct {
	//Fields
	ID          uuid.UUID `json:"id" example:"xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"`         // Compsole ID
	Name        string    `json:"name" example:"team01.dc.comp.co"`                          // [REQUIRED] A user-friendly name for the VM. This will be provider-specific.
	Identifier  string    `json:"identifier" example:"xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"` // [REQUIRED] The identifier of the VM. This will be provider-specific.
	IpAddresses []string  `json:"ip_addresses" example:"10.0.0.1,100.64.0.1"`                // [OPTIONAL] IP addresses of the VM. This will be displayed to the user.
	Locked      bool      `json:"locked" example:"false"`                                    // [REQUIRED] (default is false) If a vm is locked, standard users will not be able to access this VM.
}

// CompetitionModel model info
//
//	@Description	Used for Competition endpoints
type CompetitionModel struct {
	// Fields
	ID   uuid.UUID `json:"id" example:"xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"` // Compsole ID
	Name string    `json:"name" example:"Test Competition"`                   // [REQUIRED] The unique name (aka. slug) for the competition.
	// Edges
	CompetitionToTeams    []*TeamEdge  `json:"competition_to_teams"`
	CompetitionToProvider ProviderEdge `json:"competition_to_provider"`
}

// CompetitionEdge model info
//
//	@Description	Used for Competition in edges
type CompetitionEdge struct {
	// Fields
	ID   uuid.UUID `json:"id" example:"xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"` // Compsole ID
	Name string    `json:"name" example:"Test Competition"`                   // [REQUIRED] The unique name (aka. slug) for the competition.
}

// ProviderInput model info
//
//	@Description	Used as an input model for creating/updating Providers
type ProviderInput struct {
	Name   string `json:"name" form:"name" binding:"required" example:"RITSEC Openstack"`
	Type   string `json:"type" form:"type" binding:"required" example:"OPENSTACK" enums:"OPENSTACK"`
	Config string `json:"config" form:"config" binding:"required" example:"See https://github.com/BradHacker/compsole/tree/main/configs for examples"` // See https://github.com/BradHacker/compsole/tree/main/configs for examples
}

// ProviderModel model info
//
//	@Description	Used for Provider endpoints
type ProviderModel struct {
	// Fields
	ID     uuid.UUID `json:"id" example:"xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"` // Compsole ID
	Name   string    `json:"name" example:"Local Openstack"`                    // [REQUIRED] The unique name (aka. slug) for the provider.
	Type   string    `json:"type" example:"OPENSTACK"`                          // [REQUIRED] The type of provider this is (must match a registered one in https://github.com/BradHacker/compsole/tree/main/compsole/providers)
	Config string    `json:"config" example:"{...}"`                            // [REQUIRED] This is the JSON configuration for the provider.
	// Edges
	ProviderToCompetitions []CompetitionEdge `json:"provider_to_competitions"`
}

// ProviderEdge model info
//
//	@Description	Used for Provider in edges
type ProviderEdge struct {
	// Fields
	ID     uuid.UUID `json:"id" example:"xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"` // Compsole ID
	Name   string    `json:"name" example:"Local Openstack"`                    // [REQUIRED] The unique name (aka. slug) for the provider.
	Type   string    `json:"type" example:"OPENSTACK"`                          // [REQUIRED] The type of provider this is (must match a registered one in https://github.com/BradHacker/compsole/tree/main/compsole/providers)
	Config string    `json:"config" example:"{...}"`                            // [REQUIRED] This is the JSON configuration for the provider.
}

// TeamInput model info
//
//	@Description	Used as an input model for creating/updating Teams
type TeamInput struct {
	Name              string `json:"name" form:"name" binding:"required" example:"ISTS 'XX"`
	TeamNumber        int    `json:"team_number" form:"team_number" binding:"required" example:"1"`
	TeamToCompetition string `json:"team_to_competition" form:"team_to_competition" binding:"required" example:"xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"`
}

// TeamModel model info
//
//	@Description	Used for Team endpoints
type TeamModel struct {
	// Fields
	ID         uuid.UUID `json:"id" example:"xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"` // Compsole ID
	TeamNumber int       `json:"team_number" example:"1"`                           // [REQUIRED] The team number.
	Name       string    `json:"name" example:"Team 1"`                             // [OPTIONAL] The display name for the team.
	// Edges
	TeamToCompetition CompetitionEdge `json:"team_to_competition"`
	TeamToVmObjects   []VmObjectEdge  `json:"team_to_vm_objects"`
	TeamToUsers       []UserEdge      `json:"team_to_users"`
}

// TeamEdge model info
//
//	@Description	Used for Team in edges
type TeamEdge struct {
	// Fields
	ID         uuid.UUID `json:"id" example:"xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"` // Compsole ID
	TeamNumber int       `json:"team_number" example:"1"`                           // [REQUIRED] The team number.
	Name       string    `json:"name" example:"Team 1"`                             // [OPTIONAL] The display name for the team.
}

// UserInput model info
//
//	@Description	Used as an input model for creating/updating Users
type UserInput struct {
	Username   string  `json:"username" form:"username" binding:"required" example:"compsole"`
	FirstName  string  `json:"first_name" form:"first_name" binding:"required" example:"John"`
	LastName   string  `json:"last_name" form:"last_name" binding:"required" example:"Doe"`
	Role       string  `json:"role" form:"role" binding:"required" example:"USER" enums:"USER,ADMIN"`
	UserToTeam *string `json:"user_to_team,omitempty" form:"user_to_team" example:"xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"`
}

// UserModel model info
//
//	@Description	Used for User endpoints
type UserModel struct {
	// Fields
	ID        uuid.UUID `json:"id" example:"xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"` // Compsole ID
	Username  string    `json:"username" example:"compsole"`                       // [REQUIRED] The username for the user.
	FirstName string    `json:"first_name" example:"Default"`                      // [OPTIONAL] The display first name for the user.
	LastName  string    `json:"last_name" example:"User"`                          // [OPTIONAL] The display last name for the user.
	Role      user.Role `json:"role" example:"USER"`                               // [REQUIRED] The role of the user. Admins have full access.
	// Edges
	UserToTeam *TeamEdge `json:"user_to_team"`
}

// UserEdge model info
//
//	@Description	Used for User in edges
type UserEdge struct {
	// Fields
	ID        uuid.UUID `json:"id" example:"xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"` // Compsole ID
	Username  string    `json:"username" example:"compsole"`                       // [REQUIRED] The username for the user.
	FirstName string    `json:"first_name" example:"Default"`                      // [OPTIONAL] The display first name for the user.
	LastName  string    `json:"last_name" example:"User"`                          // [OPTIONAL] The display last name for the user.
	Role      user.Role `json:"role" example:"USER"`                               // [REQUIRED] The role of the user. Admins have full access.
}

// VmObjectEntToModel converts the result of a VM Object ENT query into a VmObjectModel for API responses
func VmObjectEntToModel(entVmObject *ent.VmObject) VmObjectModel {
	vmObjectModel := VmObjectModel{
		ID:          entVmObject.ID,
		Name:        entVmObject.Name,
		Identifier:  entVmObject.Identifier,
		IpAddresses: entVmObject.IPAddresses,
		Locked:      entVmObject.Locked,
	}
	if entVmObject.Edges.VmObjectToTeam != nil {
		vmObjectModel.VmObjectToTeam = &TeamEdge{
			ID:         entVmObject.Edges.VmObjectToTeam.ID,
			TeamNumber: entVmObject.Edges.VmObjectToTeam.TeamNumber,
			Name:       entVmObject.Edges.VmObjectToTeam.Name,
		}
	}
	return vmObjectModel
}

// CompetitionEntToModel converts the result of a Competition ENT query into a CompetitionModel for API responses
func CompetitionEntToModel(entCompetition *ent.Competition) CompetitionModel {
	comepetitionModel := CompetitionModel{
		ID:   entCompetition.ID,
		Name: entCompetition.Name,
		CompetitionToProvider: ProviderEdge{
			ID:     entCompetition.Edges.CompetitionToProvider.ID,
			Name:   entCompetition.Edges.CompetitionToProvider.Name,
			Type:   entCompetition.Edges.CompetitionToProvider.Type,
			Config: entCompetition.Edges.CompetitionToProvider.Config,
		},
	}
	if len(entCompetition.Edges.CompetitionToTeams) > 0 {
		comepetitionModel.CompetitionToTeams = make([]*TeamEdge, len(entCompetition.Edges.CompetitionToTeams))
		for i, entTeam := range entCompetition.Edges.CompetitionToTeams {
			comepetitionModel.CompetitionToTeams[i] = &TeamEdge{
				ID:         entTeam.ID,
				TeamNumber: entTeam.TeamNumber,
				Name:       entTeam.Name,
			}
		}
	}
	return comepetitionModel
}

// ProviderEntToModel converts the result of a Provider ENT query into a ProviderModel for API responses
func ProviderEntToModel(entProvider *ent.Provider) ProviderModel {
	providerModel := ProviderModel{
		ID:     entProvider.ID,
		Name:   entProvider.Name,
		Type:   entProvider.Type,
		Config: entProvider.Config,
	}
	if len(entProvider.Edges.ProviderToCompetitions) > 0 {
		providerModel.ProviderToCompetitions = make([]CompetitionEdge, len(entProvider.Edges.ProviderToCompetitions))
		for i, entCompetition := range entProvider.Edges.ProviderToCompetitions {
			providerModel.ProviderToCompetitions[i] = CompetitionEdge{
				ID:   entCompetition.ID,
				Name: entCompetition.Name,
			}
		}
	}
	return providerModel
}

// TeamEntToModel converts the result of a Team ENT query into a TeamModel for API responses
func TeamEntToModel(entTeam *ent.Team) TeamModel {
	teamModel := TeamModel{
		ID:         entTeam.ID,
		TeamNumber: entTeam.TeamNumber,
		Name:       entTeam.Name,
		TeamToCompetition: CompetitionEdge{
			ID:   entTeam.Edges.TeamToCompetition.ID,
			Name: entTeam.Edges.TeamToCompetition.Name,
		},
	}
	if len(entTeam.Edges.TeamToVmObjects) > 0 {
		teamModel.TeamToVmObjects = make([]VmObjectEdge, len(entTeam.Edges.TeamToVmObjects))
		for i, entVmObject := range entTeam.Edges.TeamToVmObjects {
			teamModel.TeamToVmObjects[i] = VmObjectEdge{
				ID:          entVmObject.ID,
				Name:        entVmObject.Name,
				Identifier:  entVmObject.Identifier,
				IpAddresses: entVmObject.IPAddresses,
				Locked:      entVmObject.Locked,
			}
		}
	}
	if len(entTeam.Edges.TeamToUsers) > 0 {
		teamModel.TeamToUsers = make([]UserEdge, len(entTeam.Edges.TeamToUsers))
		for i, entUser := range entTeam.Edges.TeamToUsers {
			teamModel.TeamToUsers[i] = UserEdge{
				ID:        entUser.ID,
				Username:  entUser.Username,
				FirstName: entUser.FirstName,
				LastName:  entUser.LastName,
				Role:      entUser.Role,
			}
		}
	}
	return teamModel
}

// UserEntToModel converts the result of a User ENT query into a UserModel for API responses
func UserEntToModel(entUser *ent.User) UserModel {
	userModel := UserModel{
		ID:        entUser.ID,
		Username:  entUser.Username,
		FirstName: entUser.FirstName,
		LastName:  entUser.LastName,
		Role:      entUser.Role,
	}
	if entUser.Edges.UserToTeam != nil {
		userModel.UserToTeam = &TeamEdge{
			ID:         entUser.Edges.UserToTeam.ID,
			TeamNumber: entUser.Edges.UserToTeam.TeamNumber,
			Name:       entUser.Edges.UserToTeam.Name,
		}
	}
	return userModel
}
