package rest

import (
	"fmt"
	"net/http"

	"github.com/BradHacker/compsole/api"
	"github.com/BradHacker/compsole/ent"
	"github.com/BradHacker/compsole/ent/team"
	"github.com/BradHacker/compsole/ent/user"
	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
)

// ListUsers godoc
//
//	@Security		ServiceAuth
//	@Summary		List all Users
//	@Schemes		http https
//	@Description	List all Users
//	@Tags			Service API
//	@Produce		json
//	@Success		200	{array}		rest.UserModel
//	@Failure		500	{object}	api.APIError
//	@Router			/rest/user [get]
func ListUsers(client *ent.Client) gin.HandlerFunc {
	return func(ctx *gin.Context) {
		entUsers, err := client.User.Query().All(ctx)
		if err != nil {
			api.ReturnError(ctx, http.StatusInternalServerError, "failed to query for users", err)
			return
		}

		userModels := make([]UserModel, len(entUsers))
		for i, entUser := range entUsers {
			userModels[i] = UserEntToModel(entUser)
		}

		ctx.JSON(http.StatusOK, userModels)
		ctx.Next()
	}
}

// GetUser godoc
//
//	@Security		ServiceAuth
//	@Summary		Get a User
//	@Schemes		http https
//	@Description	Get a User
//	@Tags			Service API
//	@Param			id	path	string	true	"The id of the user"	format(uuid)	example(xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx)
//	@Produce		json
//	@Success		200	{object}	rest.UserModel
//	@Failure		422	{object}	api.APIError
//	@Failure		404	{object}	api.APIError
//	@Failure		500	{object}	api.APIError
//	@Router			/rest/user/{id} [get]
func GetUser(client *ent.Client) gin.HandlerFunc {
	return func(ctx *gin.Context) {
		userID := ctx.Param("id")
		userUuid, err := uuid.Parse(userID)
		if err != nil {
			api.ReturnError(ctx, http.StatusUnprocessableEntity, "failed to parse user uuid", err)
		}

		entUser, err := client.User.Query().
			Where(
				user.IDEQ(userUuid),
			).
			WithUserToTeam().
			Only(ctx)
		if ent.IsNotFound(err) {
			api.ReturnError(ctx, http.StatusNotFound, "user not found", err)
			return
		}
		if err != nil {
			api.ReturnError(ctx, http.StatusInternalServerError, "failed to query for user", err)
			return
		}

		ctx.JSON(http.StatusOK, UserEntToModel(entUser))
		ctx.Next()
	}
}

// CreateUser godoc
//
//	@Security		ServiceAuth
//	@Summary		Create a User
//	@Schemes		http https
//	@Description	Create a User
//	@Tags			Service API
//	@Param			user	body	rest.UserInput	true	"The user to create"
//	@Produce		json
//	@Success		201	{object}	rest.UserModel
//	@Failure		422	{object}	api.APIError
//	@Failure		404	{object}	api.APIError
//	@Failure		500	{object}	api.APIError
//	@Router			/rest/user [post]
func CreateUser(client *ent.Client) gin.HandlerFunc {
	return func(ctx *gin.Context) {
		var newUser UserInput
		if err := ctx.ShouldBind(&newUser); err != nil {
			api.ReturnError(ctx, http.StatusUnprocessableEntity, "failed to bind to user data", err)
			return
		}

		var entTeam *ent.Team
		if newUser.UserToTeam != nil {
			teamUuid, err := uuid.Parse(*newUser.UserToTeam)
			if err != nil {
				api.ReturnError(ctx, http.StatusUnprocessableEntity, "failed to parse team uuid", err)
				return
			}
			entTeam, err = client.Team.Query().
				Where(
					team.IDEQ(teamUuid),
				).Only(ctx)
			if ent.IsNotFound(err) {
				api.ReturnError(ctx, http.StatusNotFound, "team not found", err)
				return
			}
			if err != nil {
				api.ReturnError(ctx, http.StatusInternalServerError, "failed to query for team", err)
				return
			}
		}

		entUser, err := client.User.Create().
			SetUsername(newUser.Username).
			SetFirstName(newUser.FirstName).
			SetLastName(newUser.LastName).
			SetRole(user.Role(newUser.Role)).
			SetUserToTeam(entTeam).
			Save(ctx)
		if err != nil {
			api.ReturnError(ctx, http.StatusInternalServerError, "failed to create user", err)
			return
		}

		entUser, err = client.User.Query().Where(user.IDEQ(entUser.ID)).WithUserToTeam().Only(ctx)
		if err != nil {
			api.ReturnError(ctx, http.StatusInternalServerError, "failed to query new user", err)
			return
		}

		ctx.JSON(http.StatusCreated, UserEntToModel(entUser))
		ctx.Next()
	}
}

// UpdateUser godoc
//
//	@Security		ServiceAuth
//	@Summary		Update a User
//	@Schemes		http https
//	@Description	Update a User
//	@Tags			Service API
//	@Param			id		path	string			true	"The id of the user"	format(uuid)	example(xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx)
//	@Param			user	body	rest.UserInput	true	"The updated user"
//	@Produce		json
//	@Success		201	{object}	rest.UserModel
//	@Failure		422	{object}	api.APIError
//	@Failure		404	{object}	api.APIError
//	@Failure		500	{object}	api.APIError
//	@Router			/rest/user/{id} [put]
func UpdateUser(client *ent.Client) gin.HandlerFunc {
	return func(ctx *gin.Context) {
		userID := ctx.Param("id")
		userUuid, err := uuid.Parse(userID)
		if err != nil {
			api.ReturnError(ctx, http.StatusUnprocessableEntity, "failed to parse user uuid", err)
		}

		entUser, err := client.User.Query().
			Where(
				user.IDEQ(userUuid),
			).Only(ctx)
		if ent.IsNotFound(err) {
			api.ReturnError(ctx, http.StatusNotFound, "user not found", err)
			return
		}
		if err != nil {
			api.ReturnError(ctx, http.StatusInternalServerError, "failed to query for user", err)
			return
		}

		var updatedUser UserInput
		if err := ctx.ShouldBind(&updatedUser); err != nil {
			api.ReturnError(ctx, http.StatusUnprocessableEntity, "failed to bind to user data", err)
			return
		}

		var entTeam *ent.Team
		if updatedUser.UserToTeam != nil {
			teamUuid, err := uuid.Parse(*updatedUser.UserToTeam)
			if err != nil {
				api.ReturnError(ctx, http.StatusUnprocessableEntity, "failed to parse team uuid", err)
				return
			}
			entTeam, err = client.Team.Query().
				Where(
					team.IDEQ(teamUuid),
				).Only(ctx)
			if ent.IsNotFound(err) {
				api.ReturnError(ctx, http.StatusNotFound, "team not found", err)
				return
			}
			if err != nil {
				api.ReturnError(ctx, http.StatusInternalServerError, "failed to query for team", err)
				return
			}
		}

		entUpdatedUser, err := entUser.Update().
			SetUsername(updatedUser.Username).
			SetFirstName(updatedUser.FirstName).
			SetLastName(updatedUser.LastName).
			SetRole(user.Role(updatedUser.Role)).
			SetUserToTeam(entTeam).
			Save(ctx)
		if err != nil {
			api.ReturnError(ctx, http.StatusInternalServerError, "failed to update user", err)
			return
		}

		entUpdatedUser, err = client.User.Query().Where(user.IDEQ(entUpdatedUser.ID)).WithUserToTeam().Only(ctx)
		if err != nil {
			api.ReturnError(ctx, http.StatusInternalServerError, "failed to query new user", err)
			return
		}

		ctx.JSON(http.StatusCreated, UserEntToModel(entUpdatedUser))
		ctx.Next()
	}
}

// DeleteUser godoc
//
//	@Security		ServiceAuth
//	@Summary		Delete a User
//	@Schemes		http https
//	@Description	Delete a User
//	@Tags			Service API
//	@Param			id	path	string	true	"The id of the user"	format(uuid)	example(xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx)
//	@Produce		json
//	@Success		204
//	@Failure		422	{object}	api.APIError
//	@Failure		404	{object}	api.APIError
//	@Failure		500	{object}	api.APIError
//	@Router			/rest/user/{id} [delete]
func DeleteUser(client *ent.Client) gin.HandlerFunc {
	return func(ctx *gin.Context) {
		userID := ctx.Param("id")
		userUuid, err := uuid.Parse(userID)
		if err != nil {
			api.ReturnError(ctx, http.StatusUnprocessableEntity, "failed to parse user uuid", err)
			return
		}

		// Must maintain at least one admin user in the database (count all admin users who's ID's don't match the one we're deleting)
		if userCount, err := client.User.Query().Where(
			user.And(
				user.IDNEQ(userUuid),
				user.RoleEQ(user.RoleADMIN),
			),
		).Count(ctx); err != nil {
			api.ReturnError(ctx, http.StatusInternalServerError, "failed to count users", err)
			return
		} else if userCount <= 0 {
			api.ReturnError(ctx, http.StatusUnprocessableEntity, "cannot delete user. at least one admin must exist", fmt.Errorf("cannot delete user. at least one admin must exist"))
			return
		}

		err = client.User.DeleteOneID(userUuid).Exec(ctx)
		if ent.IsNotFound(err) {
			api.ReturnError(ctx, http.StatusNotFound, "user not found", err)
			return
		}
		if err != nil {
			api.ReturnError(ctx, http.StatusInternalServerError, "failed to delete user", err)
			return
		}

		ctx.Status(http.StatusNoContent)
		ctx.Next()
	}
}
