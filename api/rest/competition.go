package rest

import (
	"net/http"
	"strings"

	"github.com/BradHacker/compsole/api"
	"github.com/BradHacker/compsole/ent"
	"github.com/BradHacker/compsole/ent/competition"
	"github.com/BradHacker/compsole/ent/provider"
	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
)

// ListCompetitions godoc
//
//	@Security		ServiceAuth
//	@Summary		List all Competitions
//	@Schemes		http https
//	@Description	List all Competitions
//	@Tags			Service API
//	@Param			field	query	string	false	"Field to search by (optional)"	Enums(name)	validate(optional)
//	@Param			q		query	string	false	"Search text (optional)"		validate(optional)
//	@Produce		json
//	@Success		200	{array}		rest.CompetitionModel
//	@Failure		500	{object}	api.APIError
//	@Router			/rest/competition [get]
func ListCompetitions(client *ent.Client) gin.HandlerFunc {
	return func(c *gin.Context) {
		queryField := c.Query("field")
		if queryField == "" {
			queryField = "name"
		}

		entCompetitionQuery := client.Competition.Query().WithCompetitionToTeams().WithCompetitionToProvider()

		queryText := c.Query("q")
		if queryText != "" {
			queryText = strings.Trim(queryText, " ")
			switch strings.Trim(queryField, " ") {
			case "name":
				entCompetitionQuery = entCompetitionQuery.Where(competition.NameContains(queryText))
			}
		}

		entCompetitions, err := entCompetitionQuery.All(c)
		if err != nil {
			api.ReturnError(c, http.StatusInternalServerError, "failed to query for competitions", err)
			return
		}

		competitionModels := make([]CompetitionModel, len(entCompetitions))
		for i, entCompetition := range entCompetitions {
			competitionModels[i] = CompetitionEntToModel(entCompetition)
		}

		c.JSON(http.StatusOK, competitionModels)
		c.Next()
	}
}

// GetCompetition godoc
//
//	@Security		ServiceAuth
//	@Summary		Get a Competition
//	@Schemes		http https
//	@Description	Get a Competition
//	@Tags			Service API
//	@Param			id	path	string	true	"The id of the competition"	format(uuid)	example(xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx)
//	@Produce		json
//	@Success		200	{object}	rest.CompetitionModel
//	@Failure		422	{object}	api.APIError
//	@Failure		404	{object}	api.APIError
//	@Failure		500	{object}	api.APIError
//	@Router			/rest/competition/{id} [get]
func GetCompetition(client *ent.Client) gin.HandlerFunc {
	return func(c *gin.Context) {
		competitionID := c.Param("id")
		competitionUuid, err := uuid.Parse(competitionID)
		if err != nil {
			api.ReturnError(c, http.StatusUnprocessableEntity, "failed to parse competition uuid", err)
			return
		}

		entCompetition, err := client.Competition.Query().
			Where(
				competition.IDEQ(competitionUuid),
			).
			WithCompetitionToTeams().
			WithCompetitionToProvider().
			Only(c)
		if ent.IsNotFound(err) {
			api.ReturnError(c, http.StatusNotFound, "competition not found", err)
			return
		}
		if err != nil {
			api.ReturnError(c, http.StatusInternalServerError, "failed to query for competition", err)
			return
		}

		c.JSON(http.StatusOK, CompetitionEntToModel(entCompetition))
		c.Next()
	}
}

// CreateCompetition godoc
//
//	@Security		ServiceAuth
//	@Summary		Create a Competition
//	@Schemes		http https
//	@Description	Create a Competition
//	@Tags			Service API
//	@Param			competition	body	rest.CompetitionInput	true	"The competition to create"
//	@Produce		json
//	@Success		201	{object}	rest.CompetitionModel
//	@Failure		422	{object}	api.APIError
//	@Failure		404	{object}	api.APIError
//	@Failure		500	{object}	api.APIError
//	@Router			/rest/competition [post]
func CreateCompetition(client *ent.Client) gin.HandlerFunc {
	return func(c *gin.Context) {
		var newCompetition CompetitionInput
		if err := c.ShouldBind(&newCompetition); err != nil {
			api.ReturnError(c, http.StatusUnprocessableEntity, "failed to bind to competition data", err)
			return
		}

		providerUuid, err := uuid.Parse(newCompetition.CompetitionToProvider)
		if err != nil {
			api.ReturnError(c, http.StatusUnprocessableEntity, "failed to parse provider uuid", err)
			return
		}
		entProvider, err := client.Provider.Query().
			Where(
				provider.IDEQ(providerUuid),
			).Only(c)
		if ent.IsNotFound(err) {
			api.ReturnError(c, http.StatusNotFound, "provider not found", err)
			return
		}
		if err != nil {
			api.ReturnError(c, http.StatusInternalServerError, "failed to query for provider", err)
			return
		}

		entCompetition, err := client.Competition.Create().
			SetName(newCompetition.Name).
			SetCompetitionToProvider(entProvider).
			Save(c)
		if err != nil {
			api.ReturnError(c, http.StatusInternalServerError, "failed to create competition", err)
			return
		}

		entCompetition, err = client.Competition.Query().Where(competition.IDEQ(entCompetition.ID)).WithCompetitionToTeams().WithCompetitionToProvider().Only(c)
		if err != nil {
			api.ReturnError(c, http.StatusInternalServerError, "failed to query new competition", err)
			return
		}

		c.JSON(http.StatusCreated, CompetitionEntToModel(entCompetition))
		c.Next()
	}
}

// UpdateCompetition godoc
//
//	@Security		ServiceAuth
//	@Summary		Update a Competition
//	@Schemes		http https
//	@Description	Update a Competition
//	@Tags			Service API
//	@Param			id			path	string					true	"The id of the competition"	format(uuid)	example(xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx)
//	@Param			competition	body	rest.CompetitionInput	true	"The updated competition"
//	@Produce		json
//	@Success		201	{object}	rest.CompetitionModel
//	@Failure		422	{object}	api.APIError
//	@Failure		404	{object}	api.APIError
//	@Failure		500	{object}	api.APIError
//	@Router			/rest/competition/{id} [put]
func UpdateCompetition(client *ent.Client) gin.HandlerFunc {
	return func(c *gin.Context) {
		competitionID := c.Param("id")
		competitionUuid, err := uuid.Parse(competitionID)
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

		var updatedCompetition CompetitionInput
		if err := c.ShouldBind(&updatedCompetition); err != nil {
			api.ReturnError(c, http.StatusUnprocessableEntity, "failed to bind to competition data", err)
			return
		}

		providerUuid, err := uuid.Parse(updatedCompetition.CompetitionToProvider)
		if err != nil {
			api.ReturnError(c, http.StatusUnprocessableEntity, "failed to parse provider uuid", err)
			return
		}
		entProvider, err := client.Provider.Query().
			Where(
				provider.IDEQ(providerUuid),
			).Only(c)
		if ent.IsNotFound(err) {
			api.ReturnError(c, http.StatusNotFound, "provider not found", err)
			return
		}
		if err != nil {
			api.ReturnError(c, http.StatusInternalServerError, "failed to query for provider", err)
			return
		}

		entUpdatedCompetition, err := entCompetition.Update().
			SetName(updatedCompetition.Name).
			SetCompetitionToProvider(entProvider).
			Save(c)
		if err != nil {
			api.ReturnError(c, http.StatusInternalServerError, "failed to update competition", err)
			return
		}

		entUpdatedCompetition, err = client.Competition.Query().Where(competition.IDEQ(entUpdatedCompetition.ID)).WithCompetitionToTeams().WithCompetitionToProvider().Only(c)
		if err != nil {
			api.ReturnError(c, http.StatusInternalServerError, "failed to query updated competition", err)
			return
		}

		c.JSON(http.StatusCreated, CompetitionEntToModel(entUpdatedCompetition))
		c.Next()
	}
}

// DeleteCompetition godoc
//
//	@Security		ServiceAuth
//	@Summary		Delete a Competition
//	@Schemes		http https
//	@Description	Delete a Competition
//	@Tags			Service API
//	@Param			id	path	string	true	"The id of the competition"	format(uuid)	example(xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx)
//	@Produce		json
//	@Success		204
//	@Failure		422	{object}	api.APIError
//	@Failure		404	{object}	api.APIError
//	@Failure		500	{object}	api.APIError
//	@Router			/rest/competition/{id} [delete]
func DeleteCompetition(client *ent.Client) gin.HandlerFunc {
	return func(c *gin.Context) {
		competitionID := c.Param("id")
		competitionUuid, err := uuid.Parse(competitionID)
		if err != nil {
			api.ReturnError(c, http.StatusUnprocessableEntity, "failed to parse competition uuid", err)
			return
		}

		err = client.Competition.DeleteOneID(competitionUuid).Exec(c)
		if ent.IsNotFound(err) {
			api.ReturnError(c, http.StatusNotFound, "competition not found", err)
			return
		}
		if err != nil {
			api.ReturnError(c, http.StatusInternalServerError, "failed to delete competition", err)
			return
		}

		c.Status(http.StatusNoContent)
		c.Next()
	}
}
