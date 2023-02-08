package rest

import (
	"net/http"

	"github.com/BradHacker/compsole/api"
	"github.com/BradHacker/compsole/ent"
	"github.com/BradHacker/compsole/ent/team"
	"github.com/BradHacker/compsole/ent/vmobject"
	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
)

// ListVmObjects godoc
//
//	@Security		ServiceAuth
//	@Summary		List all VM Objects
//	@Schemes		http https
//	@Description	List all VM Objects
//	@Tags			Service API
//	@Produce		json
//	@Success		200	{array}		ent.VmObject
//	@Failure		500	{object}	api.APIError
//	@Router			/rest/vm-object [get]
func ListVmObjects(client *ent.Client) gin.HandlerFunc {
	return func(ctx *gin.Context) {
		entVmObjects, err := client.VmObject.Query().All(ctx)
		if err != nil {
			api.ReturnError(ctx, http.StatusInternalServerError, "failed to query for vm objects", err)
			return
		}

		ctx.JSON(http.StatusOK, entVmObjects)
		ctx.Next()
	}
}

// GetVMObject godoc
//
//	@Security		ServiceAuth
//	@Summary		Get a VM Object
//	@Schemes		http https
//	@Description	Get a VM Object
//	@Tags			Service API
//	@Param			id	path	string	true	"The id of the vm object"	format(uuid)	example(xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx)
//	@Produce		json
//	@Success		200	{object}	ent.VmObject
//	@Failure		422	{object}	api.APIError
//	@Failure		404	{object}	api.APIError
//	@Failure		500	{object}	api.APIError
//	@Router			/rest/vm-object/{id} [get]
func GetVMObject(client *ent.Client) gin.HandlerFunc {
	return func(ctx *gin.Context) {
		vmObjectID := ctx.Param("id")
		vmObjectUuid, err := uuid.Parse(vmObjectID)
		if err != nil {
			api.ReturnError(ctx, http.StatusUnprocessableEntity, "failed to parse vm object uuid", err)
			return
		}

		entVmObject, err := client.VmObject.Query().
			Where(
				vmobject.IDEQ(vmObjectUuid),
			).Only(ctx)
		if ent.IsNotFound(err) {
			api.ReturnError(ctx, http.StatusNotFound, "vm object not found", err)
			return
		}
		if err != nil {
			api.ReturnError(ctx, http.StatusInternalServerError, "failed to query for vm object", err)
			return
		}

		ctx.JSON(http.StatusOK, entVmObject)
		ctx.Next()
	}
}

// CreatVMObject godoc
//
//	@Security		ServiceAuth
//	@Summary		Create a VM Object
//	@Schemes		http https
//	@Description	Create a VM Object
//	@Tags			Service API
//	@Param			vm_object	body	rest.CreateVMObject.VmObjectInput	true	"The vm object to create"
//	@Produce		json
//	@Success		201	{object}	ent.VmObject
//	@Failure		422	{object}	api.APIError
//	@Failure		404	{object}	api.APIError
//	@Failure		500	{object}	api.APIError
//	@Router			/rest/vm-object [post]
func CreateVMObject(client *ent.Client) gin.HandlerFunc {
	type VmObjectInput struct {
		Name           string   `json:"name" form:"name" binding:"required" example:"team01.dc.comp.co"`
		Identifier     string   `json:"identifier" form:"identifier" binding:"required" example:"xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"`
		IpAddresses    []string `json:"ip_addresses" form:"ip_addresses" binding:"required" example:"10.0.0.1,100.64.0.1"`
		VmObjectToTeam string   `json:"vm_object_to_team" form:"vm_object_to_team" binding:"required" example:"xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"`
	}

	return func(ctx *gin.Context) {
		var newVmObject VmObjectInput
		if err := ctx.ShouldBind(&newVmObject); err != nil {
			api.ReturnError(ctx, http.StatusUnprocessableEntity, "failed to bind to vm_object data", err)
			return
		}

		teamUuid, err := uuid.Parse(newVmObject.VmObjectToTeam)
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

		entVmObject, err := client.VmObject.Create().
			SetName(newVmObject.Name).
			SetIdentifier(newVmObject.Identifier).
			SetIPAddresses(newVmObject.IpAddresses).
			SetVmObjectToTeam(entTeam).
			Save(ctx)
		if err != nil {
			api.ReturnError(ctx, http.StatusInternalServerError, "failed to create vm object", err)
			return
		}

		ctx.JSON(http.StatusCreated, entVmObject)
		ctx.Next()
	}
}

// UpdateVMObject godoc
//
//	@Security		ServiceAuth
//	@Summary		Update a VM Object
//	@Schemes		http https
//	@Description	Update a VM Object
//	@Tags			Service API
//	@Param			id			path	string								true	"The id of the vm object"	format(uuid)	example(xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx)
//	@Param			vm_object	body	rest.UpdateVMObject.VmObjectInput	true	"The updated vm object"
//	@Produce		json
//	@Success		201	{object}	ent.VmObject
//	@Failure		422	{object}	api.APIError
//	@Failure		404	{object}	api.APIError
//	@Failure		500	{object}	api.APIError
//	@Router			/rest/vm-object/{id} [put]
func UpdateVMObject(client *ent.Client) gin.HandlerFunc {
	type VmObjectInput struct {
		Name           string   `json:"name" form:"name" binding:"required" example:"team01.dc.comp.co"`
		Identifier     string   `json:"identifier" form:"identifier" binding:"required" example:"xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"`
		IpAddresses    []string `json:"ip_addresses" form:"ip_addresses" binding:"required" example:"10.0.0.1,100.64.0.1"`
		VmObjectToTeam string   `json:"vm_object_to_team" form:"vm_object_to_team" binding:"required" example:"xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"`
	}

	return func(ctx *gin.Context) {
		vmObjectID := ctx.Param("id")
		vmObjectUuid, err := uuid.Parse(vmObjectID)
		if err != nil {
			api.ReturnError(ctx, http.StatusUnprocessableEntity, "failed to parse vm object uuid", err)
			return
		}

		entVmObject, err := client.VmObject.Query().
			Where(
				vmobject.IDEQ(vmObjectUuid),
			).Only(ctx)
		if ent.IsNotFound(err) {
			api.ReturnError(ctx, http.StatusNotFound, "vm object not found", err)
			return
		}
		if err != nil {
			api.ReturnError(ctx, http.StatusInternalServerError, "failed to query for vm object", err)
			return
		}

		var updatedVmObject VmObjectInput
		if err := ctx.ShouldBind(&updatedVmObject); err != nil {
			api.ReturnError(ctx, http.StatusUnprocessableEntity, "failed to bind to vm_object data", err)
			return
		}

		teamUuid, err := uuid.Parse(updatedVmObject.VmObjectToTeam)
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

		entUpdatedVmObject, err := entVmObject.Update().
			SetName(updatedVmObject.Name).
			SetIdentifier(updatedVmObject.Identifier).
			SetIPAddresses(updatedVmObject.IpAddresses).
			SetVmObjectToTeam(entTeam).
			Save(ctx)
		if err != nil {
			api.ReturnError(ctx, http.StatusInternalServerError, "failed to update vm object", err)
			return
		}

		ctx.JSON(http.StatusCreated, entUpdatedVmObject)
		ctx.Next()
	}
}

// DeleteVMObject godoc
//
//	@Security		ServiceAuth
//	@Summary		Delete a VM Object
//	@Schemes		http https
//	@Description	Delete a VM Object
//	@Tags			Service API
//	@Param			id	path	string	true	"The id of the vm object"	format(uuid)	example(xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx)
//	@Produce		json
//	@Success		204
//	@Failure		422	{object}	api.APIError
//	@Failure		404	{object}	api.APIError
//	@Failure		500	{object}	api.APIError
//	@Router			/rest/vm-object/{id} [delete]
func DeleteVMObject(client *ent.Client) gin.HandlerFunc {
	return func(ctx *gin.Context) {
		vmObjectID := ctx.Param("id")
		vmObjectUuid, err := uuid.Parse(vmObjectID)
		if err != nil {
			api.ReturnError(ctx, http.StatusUnprocessableEntity, "failed to parse vm object uuid", err)
			return
		}

		err = client.VmObject.DeleteOneID(vmObjectUuid).Exec(ctx)
		if ent.IsNotFound(err) {
			api.ReturnError(ctx, http.StatusNotFound, "vm object not found", err)
			return
		}
		if err != nil {
			api.ReturnError(ctx, http.StatusInternalServerError, "failed to delete vm object", err)
			return
		}

		ctx.Status(http.StatusNoContent)
		ctx.Next()
	}
}