package api

import (
	"net/http"

	"github.com/BradHacker/compsole/ent"
	"github.com/BradHacker/compsole/ent/vmobject"
	"github.com/gin-gonic/gin"
)

// GetVMObject godoc
// @Summary Get VM Object
// @Schemes http https
// @Description Get VM Object
// @Tags Service API
// @Param identifier path string true "The identifier of the vm object"
// @Produce json
// @Success 200 {object} ent.VmObject
// @Failure 404 {object} APIError
// @Failure 500 {object} APIError
// @Router /api/rest/vm-object/:identifier [get]
func GetVMObject(client *ent.Client) gin.HandlerFunc {
	return func(ctx *gin.Context) {
		vmObjectIdentifier := ctx.Param("identifier")

		entVmObject, err := client.VmObject.Query().
			Where(
				vmobject.IdentifierEQ(vmObjectIdentifier),
			).Only(ctx)
		if ent.IsNotFound(err) {
			ReturnError(ctx, http.StatusNotFound, "VM Object not found", err)
			return
		}
		if err != nil {
			ReturnError(ctx, http.StatusInternalServerError, "Error querying for vm object", err)
			return
		}

		ctx.JSON(http.StatusOK, entVmObject)
		ctx.Next()
	}
}
