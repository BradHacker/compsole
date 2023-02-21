package rest

import (
	"net/http"

	"github.com/BradHacker/compsole/api"
	"github.com/BradHacker/compsole/ent"
	"github.com/BradHacker/compsole/ent/competition"
	"github.com/BradHacker/compsole/ent/team"
	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
)

// ListTeams godoc
//
//	@Security		ServiceAuth
//	@Summary		List all Teams
//	@Schemes		http https
//	@Description	List all Teams
//	@Tags			Service API
//	@Produce		json
//	@Success		200	{array}		rest.TeamModel
//	@Failure		500	{object}	api.APIError
//	@Router			/rest/team [get]
func ListTeams(client *ent.Client) gin.HandlerFunc {
	return func(ctx *gin.Context) {
		entTeams, err := client.Team.Query().WithTeamToCompetition().WithTeamToVmObjects().WithTeamToUsers().All(ctx)
		if err != nil {
			api.ReturnError(ctx, http.StatusInternalServerError, "failed to query for teams", err)
			return
		}

		teamModels := make([]TeamModel, len(entTeams))
		for i, entTeam := range entTeams {
			teamModels[i] = TeamEntToModel(entTeam)
		}

		ctx.JSON(http.StatusOK, teamModels)
		ctx.Next()
	}
}

// GetTeam godoc
//
//	@Security		ServiceAuth
//	@Summary		Get a Team
//	@Schemes		http https
//	@Description	Get a Team
//	@Tags			Service API
//	@Param			id	path	string	true	"The id of the team"	format(uuid)	example(xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx)
//	@Produce		json
//	@Success		200	{object}	rest.TeamModel
//	@Failure		422	{object}	api.APIError
//	@Failure		404	{object}	api.APIError
//	@Failure		500	{object}	api.APIError
//	@Router			/rest/team/{id} [get]
func GetTeam(client *ent.Client) gin.HandlerFunc {
	return func(ctx *gin.Context) {
		teamID := ctx.Param("id")
		teamUuid, err := uuid.Parse(teamID)
		if err != nil {
			api.ReturnError(ctx, http.StatusUnprocessableEntity, "failed to parse team uuid", err)
			return
		}

		entTeam, err := client.Team.Query().
			Where(
				team.IDEQ(teamUuid),
			).
			WithTeamToCompetition().
			WithTeamToVmObjects().
			WithTeamToUsers().
			Only(ctx)
		if ent.IsNotFound(err) {
			api.ReturnError(ctx, http.StatusNotFound, "team not found", err)
			return
		}
		if err != nil {
			api.ReturnError(ctx, http.StatusInternalServerError, "failed to query for team", err)
			return
		}

		ctx.JSON(http.StatusOK, TeamEntToModel(entTeam))
		ctx.Next()
	}
}

// CreateTeam godoc
//
//	@Security		ServiceAuth
//	@Summary		Create a Team
//	@Schemes		http https
//	@Description	Create a Team
//	@Tags			Service API
//	@Param			team	body	rest.TeamInput	true	"The team to create"
//	@Produce		json
//	@Success		201	{object}	rest.TeamModel
//	@Failure		422	{object}	api.APIError
//	@Failure		404	{object}	api.APIError
//	@Failure		500	{object}	api.APIError
//	@Router			/rest/team [post]
func CreateTeam(client *ent.Client) gin.HandlerFunc {
	return func(ctx *gin.Context) {
		var newTeam TeamInput
		if err := ctx.ShouldBind(&newTeam); err != nil {
			api.ReturnError(ctx, http.StatusUnprocessableEntity, "failed to bind to team data", err)
			return
		}

		competitionUuid, err := uuid.Parse(newTeam.TeamToCompetition)
		if err != nil {
			api.ReturnError(ctx, http.StatusUnprocessableEntity, "failed to parse competition uuid", err)
			return
		}
		entCompetition, err := client.Competition.Query().
			Where(
				competition.IDEQ(competitionUuid),
			).Only(ctx)
		if ent.IsNotFound(err) {
			api.ReturnError(ctx, http.StatusNotFound, "competition not found", err)
			return
		}
		if err != nil {
			api.ReturnError(ctx, http.StatusInternalServerError, "failed to query for competition", err)
			return
		}

		entTeam, err := client.Team.Create().
			SetName(newTeam.Name).
			SetTeamNumber(newTeam.TeamNumber).
			SetTeamToCompetition(entCompetition).
			Save(ctx)
		if err != nil {
			api.ReturnError(ctx, http.StatusInternalServerError, "failed to create team", err)
			return
		}

		entTeam, err = client.Team.Query().Where(team.IDEQ(entTeam.ID)).WithTeamToCompetition().WithTeamToVmObjects().WithTeamToUsers().Only(ctx)
		if err != nil {
			api.ReturnError(ctx, http.StatusInternalServerError, "failed to query new team", err)
			return
		}

		ctx.JSON(http.StatusCreated, TeamEntToModel(entTeam))
		ctx.Next()
	}
}

// UpdateTeam godoc
//
//	@Security		ServiceAuth
//	@Summary		Update a Team
//	@Schemes		http https
//	@Description	Update a Team
//	@Tags			Service API
//	@Param			id		path	string			true	"The id of the team"	format(uuid)	example(xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx)
//	@Param			team	body	rest.TeamInput	true	"The updated team"
//	@Produce		json
//	@Success		201	{object}	rest.TeamModel
//	@Failure		422	{object}	api.APIError
//	@Failure		404	{object}	api.APIError
//	@Failure		500	{object}	api.APIError
//	@Router			/rest/team/{id} [put]
func UpdateTeam(client *ent.Client) gin.HandlerFunc {
	return func(ctx *gin.Context) {
		teamID := ctx.Param("id")
		teamUuid, err := uuid.Parse(teamID)
		if err != nil {
			api.ReturnError(ctx, http.StatusUnprocessableEntity, "failed to parse team uuid", err)
			return
		}

		entTeam, err := client.Team.Query().
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

		var updatedTeam TeamInput
		if err := ctx.ShouldBind(&updatedTeam); err != nil {
			api.ReturnError(ctx, http.StatusUnprocessableEntity, "failed to bind to team data", err)
			return
		}

		competitionUuid, err := uuid.Parse(updatedTeam.TeamToCompetition)
		if err != nil {
			api.ReturnError(ctx, http.StatusUnprocessableEntity, "failed to parse competition uuid", err)
			return
		}
		entCompetition, err := client.Competition.Query().
			Where(
				competition.IDEQ(competitionUuid),
			).Only(ctx)
		if ent.IsNotFound(err) {
			api.ReturnError(ctx, http.StatusNotFound, "competition not found", err)
			return
		}
		if err != nil {
			api.ReturnError(ctx, http.StatusInternalServerError, "failed to query for competition", err)
			return
		}

		entUpdatedTeam, err := entTeam.Update().
			SetName(updatedTeam.Name).
			SetTeamNumber(updatedTeam.TeamNumber).
			SetTeamToCompetition(entCompetition).
			Save(ctx)
		if err != nil {
			api.ReturnError(ctx, http.StatusInternalServerError, "failed to update team", err)
			return
		}

		entUpdatedTeam, err = client.Team.Query().Where(team.IDEQ(entUpdatedTeam.ID)).WithTeamToCompetition().WithTeamToVmObjects().WithTeamToUsers().Only(ctx)
		if err != nil {
			api.ReturnError(ctx, http.StatusInternalServerError, "failed to query new team", err)
			return
		}

		ctx.JSON(http.StatusCreated, TeamEntToModel(entUpdatedTeam))
		ctx.Next()
	}
}

// DeleteTeam godoc
//
//	@Security		ServiceAuth
//	@Summary		Delete a Team
//	@Schemes		http https
//	@Description	Delete a Team
//	@Tags			Service API
//	@Param			id	path	string	true	"The id of the team"	format(uuid)	example(xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx)
//	@Produce		json
//	@Success		204
//	@Failure		422	{object}	api.APIError
//	@Failure		404	{object}	api.APIError
//	@Failure		500	{object}	api.APIError
//	@Router			/rest/team/{id} [delete]
func DeleteTeam(client *ent.Client) gin.HandlerFunc {
	return func(ctx *gin.Context) {
		teamID := ctx.Param("id")
		teamUuid, err := uuid.Parse(teamID)
		if err != nil {
			api.ReturnError(ctx, http.StatusUnprocessableEntity, "failed to parse team uuid", err)
			return
		}

		err = client.Team.DeleteOneID(teamUuid).Exec(ctx)
		if ent.IsNotFound(err) {
			api.ReturnError(ctx, http.StatusNotFound, "team not found", err)
			return
		}
		if err != nil {
			api.ReturnError(ctx, http.StatusInternalServerError, "failed to delete team", err)
			return
		}

		ctx.Status(http.StatusNoContent)
		ctx.Next()
	}
}
