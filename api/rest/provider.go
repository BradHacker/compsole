package rest

import (
	"net/http"
	"strings"

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
//	@Param			field	query	string	false	"Field to search by (optional)"	Enums(name)	validate(optional)
//	@Param			q		query	string	false	"Search text (optional)"		validate(optional)
//	@Produce		json
//	@Success		200	{array}		rest.ProviderModel
//	@Failure		500	{object}	api.APIError
//	@Router			/rest/provider [get]
func ListProviders(client *ent.Client) gin.HandlerFunc {
	return func(c *gin.Context) {
		queryField := c.Query("field")
		if queryField == "" {
			queryField = "name"
		}

		entProviderQuery := client.Provider.Query().WithProviderToCompetitions()

		queryText := c.Query("q")
		if queryText != "" {
			queryText = strings.Trim(queryText, " ")
			switch strings.Trim(queryField, " ") {
			case "name":
				entProviderQuery = entProviderQuery.Where(provider.NameContains(queryText))
			}
		}

		entProviders, err := entProviderQuery.All(c)
		if err != nil {
			api.ReturnError(c, http.StatusInternalServerError, "failed to query for providers", err)
			return
		}

		providerModels := make([]ProviderModel, len(entProviders))
		for i, entProvider := range entProviders {
			providerModels[i] = ProviderEntToModel(entProvider)
		}

		c.JSON(http.StatusOK, providerModels)
		c.Next()
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
//	@Success		200	{object}	rest.ProviderModel
//	@Failure		422	{object}	api.APIError
//	@Failure		404	{object}	api.APIError
//	@Failure		500	{object}	api.APIError
//	@Router			/rest/provider/{id} [get]
func GetProvider(client *ent.Client) gin.HandlerFunc {
	return func(c *gin.Context) {
		providerID := c.Param("id")
		providerUuid, err := uuid.Parse(providerID)
		if err != nil {
			api.ReturnError(c, http.StatusUnprocessableEntity, "failed to parse provider uuid", err)
			return
		}

		entProvider, err := client.Provider.Query().
			Where(
				provider.IDEQ(providerUuid),
			).
			WithProviderToCompetitions().
			Only(c)
		if ent.IsNotFound(err) {
			api.ReturnError(c, http.StatusNotFound, "provider not found", err)
			return
		}
		if err != nil {
			api.ReturnError(c, http.StatusInternalServerError, "failed to query for provider", err)
			return
		}

		c.JSON(http.StatusOK, ProviderEntToModel(entProvider))
		c.Next()
	}
}

// CreateProvider godoc
//
//	@Security		ServiceAuth
//	@Summary		Create a Provider
//	@Schemes		http https
//	@Description	Create a Provider
//	@Tags			Service API
//	@Param			provider	body	rest.ProviderInput	true	"The provider to create"
//	@Produce		json
//	@Success		201	{object}	rest.ProviderModel
//	@Failure		422	{object}	api.APIError
//	@Failure		404	{object}	api.APIError
//	@Failure		500	{object}	api.APIError
//	@Router			/rest/provider [post]
func CreateProvider(client *ent.Client) gin.HandlerFunc {
	return func(c *gin.Context) {
		var newProvider ProviderInput
		if err := c.ShouldBind(&newProvider); err != nil {
			api.ReturnError(c, http.StatusUnprocessableEntity, "failed to bind to provider data", err)
			return
		}

		// Validate provider configuration
		err := providers.ValidateConfig(newProvider.Type, newProvider.Config)
		if err != nil {
			api.ReturnError(c, http.StatusUnprocessableEntity, "provider config is invalid", err)
			return
		}

		entProvider, err := client.Provider.Create().
			SetName(newProvider.Name).
			SetType(newProvider.Type).
			SetConfig(newProvider.Config).
			Save(c)
		if err != nil {
			api.ReturnError(c, http.StatusInternalServerError, "failed to create provider", err)
			return
		}

		entProvider, err = client.Provider.Query().Where(provider.IDEQ(entProvider.ID)).WithProviderToCompetitions().Only(c)
		if err != nil {
			api.ReturnError(c, http.StatusInternalServerError, "failed to query new provider", err)
			return
		}

		c.JSON(http.StatusCreated, ProviderEntToModel(entProvider))
		c.Next()
	}
}

// UpdateProvider godoc
//
//	@Security		ServiceAuth
//	@Summary		Update a Provider
//	@Schemes		http https
//	@Description	Update a Provider
//	@Tags			Service API
//	@Param			id			path	string				true	"The id of the provider"	format(uuid)	example(xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx)
//	@Param			provider	body	rest.ProviderInput	true	"The updated provider"
//	@Produce		json
//	@Success		201	{object}	rest.ProviderModel
//	@Failure		422	{object}	api.APIError
//	@Failure		404	{object}	api.APIError
//	@Failure		500	{object}	api.APIError
//	@Router			/rest/provider/{id} [put]
func UpdateProvider(client *ent.Client) gin.HandlerFunc {
	return func(c *gin.Context) {
		providerID := c.Param("id")
		providerUuid, err := uuid.Parse(providerID)
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

		var updatedProvider ProviderInput
		if err := c.ShouldBind(&updatedProvider); err != nil {
			api.ReturnError(c, http.StatusUnprocessableEntity, "failed to bind to provider data", err)
			return
		}

		// Validate provider configuration
		err = providers.ValidateConfig(updatedProvider.Type, updatedProvider.Config)
		if err != nil {
			api.ReturnError(c, http.StatusUnprocessableEntity, "provider config is invalid", err)
			return
		}

		entUpdatedProvider, err := entProvider.Update().
			SetName(updatedProvider.Name).
			SetType(updatedProvider.Type).
			SetConfig(updatedProvider.Config).
			Save(c)
		if err != nil {
			api.ReturnError(c, http.StatusInternalServerError, "failed to update provider", err)
			return
		}

		entUpdatedProvider, err = client.Provider.Query().Where(provider.IDEQ(entUpdatedProvider.ID)).WithProviderToCompetitions().Only(c)
		if err != nil {
			api.ReturnError(c, http.StatusInternalServerError, "failed to query updated provider", err)
			return
		}

		c.JSON(http.StatusCreated, ProviderEntToModel(entUpdatedProvider))
		c.Next()
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
	return func(c *gin.Context) {
		providerID := c.Param("id")
		providerUuid, err := uuid.Parse(providerID)
		if err != nil {
			api.ReturnError(c, http.StatusUnprocessableEntity, "failed to parse provider uuid", err)
			return
		}

		err = client.Provider.DeleteOneID(providerUuid).Exec(c)
		if ent.IsNotFound(err) {
			api.ReturnError(c, http.StatusNotFound, "provider not found", err)
			return
		}
		if err != nil {
			api.ReturnError(c, http.StatusInternalServerError, "failed to delete provider", err)
			return
		}

		c.Status(http.StatusNoContent)
		c.Next()
	}
}
