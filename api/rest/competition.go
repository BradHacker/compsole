package rest

import (
	"net/http"

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
//	@Produce		json
//	@Success		200	{array}		ent.Competition
//	@Failure		500	{object}	api.APIError
//	@Router			/rest/competition [get]
func ListCompetitions(client *ent.Client) gin.HandlerFunc {
	return func(ctx *gin.Context) {
		entCompetitions, err := client.Competition.Query().All(ctx)
		if err != nil {
			api.ReturnError(ctx, http.StatusInternalServerError, "failed to query for competitions", err)
			return
		}

		ctx.JSON(http.StatusOK, entCompetitions)
		ctx.Next()
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
//	@Success		200	{object}	ent.Competition
//	@Failure		422	{object}	api.APIError
//	@Failure		404	{object}	api.APIError
//	@Failure		500	{object}	api.APIError
//	@Router			/rest/competition/{id} [get]
func GetCompetition(client *ent.Client) gin.HandlerFunc {
	return func(ctx *gin.Context) {
		competitionID := ctx.Param("id")
		competitionUuid, err := uuid.Parse(competitionID)
		if err != nil {
			api.ReturnError(ctx, http.StatusUnprocessableEntity, "failed to parse competition uuid", err)
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

		ctx.JSON(http.StatusOK, entCompetition)
		ctx.Next()
	}
}

// CreateCompetition godoc
//
//	@Security		ServiceAuth
//	@Summary		Create a Competition
//	@Schemes		http https
//	@Description	Create a Competition
//	@Tags			Service API
//	@Param			competition	body	rest.CreateCompetition.CompetitionInput	true	"The competition to create"
//	@Produce		json
//	@Success		201	{object}	ent.Competition
//	@Failure		422	{object}	api.APIError
//	@Failure		404	{object}	api.APIError
//	@Failure		500	{object}	api.APIError
//	@Router			/rest/competition [post]
func CreateCompetition(client *ent.Client) gin.HandlerFunc {
	type CompetitionInput struct {
		Name                  string `json:"name" form:"name" binding:"required" example:"ISTS 'XX"`
		CompetitionToProvider string `json:"competition_to_provider" form:"competition_to_provider" binding:"required" example:"xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"`
	}

	return func(ctx *gin.Context) {
		var newCompetition CompetitionInput
		if err := ctx.ShouldBind(&newCompetition); err != nil {
			api.ReturnError(ctx, http.StatusUnprocessableEntity, "failed to bind to competition data", err)
			return
		}

		providerUuid, err := uuid.Parse(newCompetition.CompetitionToProvider)
		if err != nil {
			api.ReturnError(ctx, http.StatusUnprocessableEntity, "failed to parse provider uuid", err)
			return
		}
		entProvider, err := client.Provider.Query().
			Where(
				provider.IDEQ(providerUuid),
			).Only(ctx)
		if ent.IsNotFound(err) {
			api.ReturnError(ctx, http.StatusNotFound, "provider not found", err)
			return
		}
		if err != nil {
			api.ReturnError(ctx, http.StatusInternalServerError, "failed to query for provider", err)
			return
		}

		entCompetition, err := client.Competition.Create().
			SetName(newCompetition.Name).
			SetCompetitionToProvider(entProvider).
			Save(ctx)
		if err != nil {
			api.ReturnError(ctx, http.StatusInternalServerError, "failed to create competition", err)
			return
		}

		ctx.JSON(http.StatusCreated, entCompetition)
		ctx.Next()
	}
}

// UpdateCompetition godoc
//
//	@Security		ServiceAuth
//	@Summary		Update a Competition
//	@Schemes		http https
//	@Description	Update a Competition
//	@Tags			Service API
//	@Param			id			path	string									true	"The id of the competition"	format(uuid)	example(xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx)
//	@Param			competition	body	rest.UpdateCompetition.CompetitionInput	true	"The updated competition"
//	@Produce		json
//	@Success		201	{object}	ent.Competition
//	@Failure		422	{object}	api.APIError
//	@Failure		404	{object}	api.APIError
//	@Failure		500	{object}	api.APIError
//	@Router			/rest/competition/{id} [put]
func UpdateCompetition(client *ent.Client) gin.HandlerFunc {
	type CompetitionInput struct {
		Name                  string `json:"name" form:"name" binding:"required" example:"ISTS 'XX"`
		CompetitionToProvider string `json:"competition_to_provider" form:"competition_to_provider" binding:"required" example:"xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"`
	}

	return func(ctx *gin.Context) {
		competitionID := ctx.Param("id")
		competitionUuid, err := uuid.Parse(competitionID)
		if err != nil {
			api.ReturnError(ctx, http.StatusUnprocessableEntity, "failed to parse competition uuid", err)
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

		var updatedCompetition CompetitionInput
		if err := ctx.ShouldBind(&updatedCompetition); err != nil {
			api.ReturnError(ctx, http.StatusUnprocessableEntity, "failed to bind to competition data", err)
			return
		}

		providerUuid, err := uuid.Parse(updatedCompetition.CompetitionToProvider)
		if err != nil {
			api.ReturnError(ctx, http.StatusUnprocessableEntity, "failed to parse provider uuid", err)
			return
		}
		entProvider, err := client.Provider.Query().
			Where(
				provider.IDEQ(providerUuid),
			).Only(ctx)
		if ent.IsNotFound(err) {
			api.ReturnError(ctx, http.StatusNotFound, "provider not found", err)
			return
		}
		if err != nil {
			api.ReturnError(ctx, http.StatusInternalServerError, "failed to query for provider", err)
			return
		}

		entUpdatedCompetition, err := entCompetition.Update().
			SetName(updatedCompetition.Name).
			SetCompetitionToProvider(entProvider).
			Save(ctx)
		if err != nil {
			api.ReturnError(ctx, http.StatusInternalServerError, "failed to update competition", err)
			return
		}

		ctx.JSON(http.StatusCreated, entUpdatedCompetition)
		ctx.Next()
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
	return func(ctx *gin.Context) {
		competitionID := ctx.Param("id")
		competitionUuid, err := uuid.Parse(competitionID)
		if err != nil {
			api.ReturnError(ctx, http.StatusUnprocessableEntity, "failed to parse competition uuid", err)
		}

		err = client.Competition.DeleteOneID(competitionUuid).Exec(ctx)
		if ent.IsNotFound(err) {
			api.ReturnError(ctx, http.StatusNotFound, "competition not found", err)
			return
		}
		if err != nil {
			api.ReturnError(ctx, http.StatusInternalServerError, "failed to delete competition", err)
			return
		}

		ctx.Status(http.StatusNoContent)
		ctx.Next()
	}
}
