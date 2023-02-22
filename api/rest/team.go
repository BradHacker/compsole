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
	return func(c *gin.Context) {
		entTeams, err := client.Team.Query().WithTeamToCompetition().WithTeamToVmObjects().WithTeamToUsers().All(c)
		if err != nil {
			api.ReturnError(c, http.StatusInternalServerError, "failed to query for teams", err)
			return
		}

		teamModels := make([]TeamModel, len(entTeams))
		for i, entTeam := range entTeams {
			teamModels[i] = TeamEntToModel(entTeam)
		}

		c.JSON(http.StatusOK, teamModels)
		c.Next()
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
	return func(c *gin.Context) {
		teamID := c.Param("id")
		teamUuid, err := uuid.Parse(teamID)
		if err != nil {
			api.ReturnError(c, http.StatusUnprocessableEntity, "failed to parse team uuid", err)
			return
		}

		entTeam, err := client.Team.Query().
			Where(
				team.IDEQ(teamUuid),
			).
			WithTeamToCompetition().
			WithTeamToVmObjects().
			WithTeamToUsers().
			Only(c)
		if ent.IsNotFound(err) {
			api.ReturnError(c, http.StatusNotFound, "team not found", err)
			return
		}
		if err != nil {
			api.ReturnError(c, http.StatusInternalServerError, "failed to query for team", err)
			return
		}

		c.JSON(http.StatusOK, TeamEntToModel(entTeam))
		c.Next()
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
	return func(c *gin.Context) {
		var newTeam TeamInput
		if err := c.ShouldBind(&newTeam); err != nil {
			api.ReturnError(c, http.StatusUnprocessableEntity, "failed to bind to team data", err)
			return
		}

		competitionUuid, err := uuid.Parse(newTeam.TeamToCompetition)
		if err != nil {
			api.ReturnError(c, http.StatusUnprocessableEntity, "failed to parse competition uuid", err)
			return
		}
		entCompetition, err := client.Competition.Query().
			Where(
				competition.IDEQ(competitionUuid),
			).Only(c)
		if ent.IsNotFound(err) {
			api.ReturnError(c, http.StatusNotFound, "competition not found", err)
			return
		}
		if err != nil {
			api.ReturnError(c, http.StatusInternalServerError, "failed to query for competition", err)
			return
		}

		entTeam, err := client.Team.Create().
			SetName(newTeam.Name).
			SetTeamNumber(newTeam.TeamNumber).
			SetTeamToCompetition(entCompetition).
			Save(c)
		if err != nil {
			api.ReturnError(c, http.StatusInternalServerError, "failed to create team", err)
			return
		}

		entTeam, err = client.Team.Query().Where(team.IDEQ(entTeam.ID)).WithTeamToCompetition().WithTeamToVmObjects().WithTeamToUsers().Only(c)
		if err != nil {
			api.ReturnError(c, http.StatusInternalServerError, "failed to query new team", err)
			return
		}

		c.JSON(http.StatusCreated, TeamEntToModel(entTeam))
		c.Next()
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
	return func(c *gin.Context) {
		teamID := c.Param("id")
		teamUuid, err := uuid.Parse(teamID)
		if err != nil {
			api.ReturnError(c, http.StatusUnprocessableEntity, "failed to parse team uuid", err)
			return
		}

		entTeam, err := client.Team.Query().
			Where(
				team.IDEQ(teamUuid),
			).Only(c)
		if ent.IsNotFound(err) {
			api.ReturnError(c, http.StatusNotFound, "team not found", err)
			return
		}
		if err != nil {
			api.ReturnError(c, http.StatusInternalServerError, "failed to query for team", err)
			return
		}

		var updatedTeam TeamInput
		if err := c.ShouldBind(&updatedTeam); err != nil {
			api.ReturnError(c, http.StatusUnprocessableEntity, "failed to bind to team data", err)
			return
		}

		competitionUuid, err := uuid.Parse(updatedTeam.TeamToCompetition)
		if err != nil {
			api.ReturnError(c, http.StatusUnprocessableEntity, "failed to parse competition uuid", err)
			return
		}
		entCompetition, err := client.Competition.Query().
			Where(
				competition.IDEQ(competitionUuid),
			).Only(c)
		if ent.IsNotFound(err) {
			api.ReturnError(c, http.StatusNotFound, "competition not found", err)
			return
		}
		if err != nil {
			api.ReturnError(c, http.StatusInternalServerError, "failed to query for competition", err)
			return
		}

		entUpdatedTeam, err := entTeam.Update().
			SetName(updatedTeam.Name).
			SetTeamNumber(updatedTeam.TeamNumber).
			SetTeamToCompetition(entCompetition).
			Save(c)
		if err != nil {
			api.ReturnError(c, http.StatusInternalServerError, "failed to update team", err)
			return
		}

		entUpdatedTeam, err = client.Team.Query().Where(team.IDEQ(entUpdatedTeam.ID)).WithTeamToCompetition().WithTeamToVmObjects().WithTeamToUsers().Only(c)
		if err != nil {
			api.ReturnError(c, http.StatusInternalServerError, "failed to query new team", err)
			return
		}

		c.JSON(http.StatusCreated, TeamEntToModel(entUpdatedTeam))
		c.Next()
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
	return func(c *gin.Context) {
		teamID := c.Param("id")
		teamUuid, err := uuid.Parse(teamID)
		if err != nil {
			api.ReturnError(c, http.StatusUnprocessableEntity, "failed to parse team uuid", err)
			return
		}

		err = client.Team.DeleteOneID(teamUuid).Exec(c)
		if ent.IsNotFound(err) {
			api.ReturnError(c, http.StatusNotFound, "team not found", err)
			return
		}
		if err != nil {
			api.ReturnError(c, http.StatusInternalServerError, "failed to delete team", err)
			return
		}

		c.Status(http.StatusNoContent)
		c.Next()
	}
}
