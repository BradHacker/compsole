package rest

import (
	"github.com/BradHacker/compsole/ent"
	"github.com/gin-gonic/gin"
)

func RegisterRESTEndpoints(client *ent.Client, r *gin.RouterGroup) {
	// Login
	r.POST("/login", ServiceLogin(client))

	// VM Objects
	r.GET("/vm-object/:identifier", GetVMObject(client))
	r.PUT("/vm-object/:identifier", UpdateVMObject(client))
}
