package auth

import (
	"github.com/BradHacker/compsole/ent"
	"github.com/gin-gonic/gin"
)

type APIError struct {
	Message string `json:"message"`
	Error   error  `json:"error"`
}

func RegisterAuthEndpoints(client *ent.Client, r *gin.RouterGroup) {
	r.POST("/local/login", LocalLogin(client))
	r.GET("/logout", Logout(client))
}
