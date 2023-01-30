package rest

import (
	"net/http"

	"github.com/BradHacker/compsole/api"
	"github.com/BradHacker/compsole/ent"
	"github.com/BradHacker/compsole/ent/vmobject"
	"github.com/gin-gonic/gin"
)

// GetVMObject godoc
//
//	@Security					ServiceAuth
//	@securitydefinitions.apikey	ApiKeyAuth
//	@Summary					Get VM Object
//	@Schemes					http https
//	@Description				Get VM Object
//	@Tags						Service API
//	@Param						identifier	path	string	true	"The identifier of the vm object"
//	@Produce					json
//	@Success					200	{object}	ent.VmObject
//	@Failure					404	{object}	api.APIError
//	@Failure					500	{object}	api.APIError
//	@Router						/rest/vm-object/{identifier} [get]
func GetVMObject(client *ent.Client) gin.HandlerFunc {
	return func(ctx *gin.Context) {
		vmObjectIdentifier := ctx.Param("identifier")

		entVmObject, err := client.VmObject.Query().
			Where(
				vmobject.IdentifierEQ(vmObjectIdentifier),
			).Only(ctx)
		if ent.IsNotFound(err) {
			api.ReturnError(ctx, http.StatusNotFound, "VM Object not found", err)
			return
		}
		if err != nil {
			api.ReturnError(ctx, http.StatusInternalServerError, "Error querying for vm object", err)
			return
		}

		ctx.JSON(http.StatusOK, entVmObject)
		ctx.Next()
	}
}

// UpdateVMObject godoc
//
//	@Security		ServiceAuth
//	@Summary		Update VM Object
//	@Schemes		http https
//	@Description	Update VM Object.
//	@Tags			Service API
//	@Param			identifier	path	string	true	"The identifier of the vm object (if modifying the VM Object identifier, this must be the old identifier)"
//	@Produce		json
//	@Success		200	{object}	ent.VmObject
//	@Failure		404	{object}	api.APIError
//	@Failure		500	{object}	api.APIError
//	@Router			/rest/vm-object/{identifier} [put]
func UpdateVMObject(client *ent.Client) gin.HandlerFunc {
	return func(ctx *gin.Context) {

	}
}
