package auth

import (
	"github.com/BradHacker/compsole/api/rest"
	"github.com/BradHacker/compsole/ent"
	"github.com/BradHacker/compsole/ent/user"
	"github.com/google/uuid"
)

// UserLoginVals model info
//
//	@Description	Used as an input to the login input
type UserLoginVals struct {
	Username string `form:"username" json:"username" binding:"required" example:"admin"`
	Password string `form:"password" json:"password" binding:"required" example:"password123"`
}

// UserModel model info
//
//	@Description	Used for User login
type UserModel struct {
	// Fields
	ID        uuid.UUID `json:"id" example:"xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"` // Compsole ID
	Username  string    `json:"username" example:"compsole"`                       // [REQUIRED] The username for the user.
	FirstName string    `json:"first_name" example:"Default"`                      // [OPTIONAL] The display first name for the user.
	LastName  string    `json:"last_name" example:"User"`                          // [OPTIONAL] The display last name for the user.
	Role      user.Role `json:"role" example:"USER"`                               // [REQUIRED] The role of the user. Admins have full access.
	// Edges
	UserToTeam *rest.TeamEdge `json:"user_to_team"`
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
		userModel.UserToTeam = &rest.TeamEdge{
			ID:         entUser.Edges.UserToTeam.ID,
			TeamNumber: entUser.Edges.UserToTeam.TeamNumber,
			Name:       entUser.Edges.UserToTeam.Name,
		}
	}
	return userModel
}
