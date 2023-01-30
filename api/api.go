package api

import (
	"github.com/BradHacker/compsole/ent"
	"github.com/gin-gonic/gin"
)

type APIError struct {
	Message string `json:"message"`
	Error   error  `json:"error"`
}

func RegisterRESTEndpoints(client *ent.Client, r *gin.RouterGroup) {
	// VM Objects
	r.GET("/vm-object/:identifier", GetVMObject(client))
	r.PUT("/vm-object/:identifier", UpdateVMObject(client))
}

func ReturnError(ctx *gin.Context, code int, message string, err error) {
	ctx.AbortWithStatusJSON(code, APIError{
		Message: message,
		Error:   err,
	})
}
