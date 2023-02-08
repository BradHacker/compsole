package rest

import (
	"net/http"

	"github.com/BradHacker/compsole/api"
	"github.com/BradHacker/compsole/compsole/providers"
	"github.com/BradHacker/compsole/ent"
	"github.com/BradHacker/compsole/ent/provider"
	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
)

// ListProviders godoc
//
//	@Security		ServiceAuth
//	@Summary		List all Providers
//	@Schemes		http https
//	@Description	List all Providers
//	@Tags			Service API
//	@Produce		json
//	@Success		200	{array}		ent.Provider
//	@Failure		500	{object}	api.APIError
//	@Router			/rest/provider [get]
func ListProviders(client *ent.Client) gin.HandlerFunc {
	return func(ctx *gin.Context) {
		entProviders, err := client.Provider.Query().All(ctx)
		if err != nil {
			api.ReturnError(ctx, http.StatusInternalServerError, "failed to query for providers", err)
			return
		}

		ctx.JSON(http.StatusOK, entProviders)
		ctx.Next()
	}
}

// GetProvider godoc
//
//	@Security		ServiceAuth
//	@Summary		Get a provider
//	@Schemes		http https
//	@Description	Get a provider
//	@Tags			Service API
//	@Param			id	path	string	true	"The id of the provider"	format(uuid)	example(xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx)
//	@Produce		json
//	@Success		200	{object}	ent.Provider
//	@Failure		422	{object}	api.APIError
//	@Failure		404	{object}	api.APIError
//	@Failure		500	{object}	api.APIError
//	@Router			/rest/provider/{id} [get]
func GetProvider(client *ent.Client) gin.HandlerFunc {
	return func(ctx *gin.Context) {
		providerID := ctx.Param("id")
		providerUuid, err := uuid.Parse(providerID)
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

		ctx.JSON(http.StatusOK, entProvider)
		ctx.Next()
	}
}

// CreateProvider godoc
//
//	@Security		ServiceAuth
//	@Summary		Create a Provider
//	@Schemes		http https
//	@Description	Create a Provider
//	@Tags			Service API
//	@Param			provider	body	rest.CreateProvider.ProviderInput	true	"The provider to create"
//	@Produce		json
//	@Success		201	{object}	ent.Provider
//	@Failure		422	{object}	api.APIError
//	@Failure		404	{object}	api.APIError
//	@Failure		500	{object}	api.APIError
//	@Router			/rest/provider [post]
func CreateProvider(client *ent.Client) gin.HandlerFunc {
	type ProviderInput struct {
		Name   string `json:"name" form:"name" binding:"required" example:"RITSEC Openstack"`
		Type   string `json:"type" form:"type" binding:"required" example:"OPENSTACK" enums:"OPENSTACK"`
		Config string `json:"config" form:"config" binding:"required" example:"See https://github.com/BradHacker/compsole/tree/main/configs for examples"` // See https://github.com/BradHacker/compsole/tree/main/configs for examples
	}

	return func(ctx *gin.Context) {
		var newProvider ProviderInput
		if err := ctx.ShouldBind(&newProvider); err != nil {
			api.ReturnError(ctx, http.StatusUnprocessableEntity, "failed to bind to provider data", err)
			return
		}

		// Validate provider configuration
		err := providers.ValidateConfig(newProvider.Type, newProvider.Config)
		if err != nil {
			api.ReturnError(ctx, http.StatusUnprocessableEntity, "provider config is invalid", err)
			return
		}

		entProvider, err := client.Provider.Create().
			SetName(newProvider.Name).
			SetType(newProvider.Type).
			SetConfig(newProvider.Config).
			Save(ctx)
		if err != nil {
			api.ReturnError(ctx, http.StatusInternalServerError, "failed to create provider", err)
			return
		}

		ctx.JSON(http.StatusCreated, entProvider)
		ctx.Next()
	}
}

// UpdateProvider godoc
//
//	@Security		ServiceAuth
//	@Summary		Update a Provider
//	@Schemes		http https
//	@Description	Update a Provider
//	@Tags			Service API
//	@Param			id			path	string								true	"The id of the provider"	format(uuid)	example(xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx)
//	@Param			provider	body	rest.UpdateProvider.ProviderInput	true	"The updated provider"
//	@Produce		json
//	@Success		201	{object}	ent.Provider
//	@Failure		422	{object}	api.APIError
//	@Failure		404	{object}	api.APIError
//	@Failure		500	{object}	api.APIError
//	@Router			/rest/provider/{id} [put]
func UpdateProvider(client *ent.Client) gin.HandlerFunc {
	type ProviderInput struct {
		Name   string `json:"name" form:"name" binding:"required" example:"RITSEC Openstack"`
		Type   string `json:"type" form:"type" binding:"required" enums:"OPENSTACK"`
		Config string `json:"config" form:"config" binding:"required"` // See https://github.com/BradHacker/compsole/tree/main/configs for examples
	}

	return func(ctx *gin.Context) {
		providerID := ctx.Param("id")
		providerUuid, err := uuid.Parse(providerID)
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

		var updatedProvider ProviderInput
		if err := ctx.ShouldBind(&updatedProvider); err != nil {
			api.ReturnError(ctx, http.StatusUnprocessableEntity, "failed to bind to provider data", err)
			return
		}

		// Validate provider configuration
		err = providers.ValidateConfig(updatedProvider.Type, updatedProvider.Config)
		if err != nil {
			api.ReturnError(ctx, http.StatusUnprocessableEntity, "provider config is invalid", err)
			return
		}

		entUpdatedProvider, err := entProvider.Update().
			SetName(updatedProvider.Name).
			SetType(updatedProvider.Type).
			SetConfig(updatedProvider.Config).
			Save(ctx)
		if err != nil {
			api.ReturnError(ctx, http.StatusInternalServerError, "failed to update provider", err)
			return
		}

		ctx.JSON(http.StatusCreated, entUpdatedProvider)
		ctx.Next()
	}
}

// DeleteProvider godoc
//
//	@Security		ServiceAuth
//	@Summary		Delete a Provider
//	@Schemes		http https
//	@Description	Delete a Provider
//	@Tags			Service API
//	@Param			id	path	string	true	"The id of the provider"	format(uuid)	example(xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx)
//	@Produce		json
//	@Success		204
//	@Failure		422	{object}	api.APIError
//	@Failure		404	{object}	api.APIError
//	@Failure		500	{object}	api.APIError
//	@Router			/rest/provider/{id} [delete]
func DeleteProvider(client *ent.Client) gin.HandlerFunc {
	return func(ctx *gin.Context) {
		providerID := ctx.Param("id")
		providerUuid, err := uuid.Parse(providerID)
		if err != nil {
			api.ReturnError(ctx, http.StatusUnprocessableEntity, "failed to parse provider uuid", err)
			return
		}

		err = client.Provider.DeleteOneID(providerUuid).Exec(ctx)
		if ent.IsNotFound(err) {
			api.ReturnError(ctx, http.StatusNotFound, "provider not found", err)
			return
		}
		if err != nil {
			api.ReturnError(ctx, http.StatusInternalServerError, "failed to delete provider", err)
			return
		}

		ctx.Status(http.StatusNoContent)
		ctx.Next()
	}
}
