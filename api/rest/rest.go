package rest

import (
	"github.com/BradHacker/compsole/api"
	"github.com/BradHacker/compsole/ent"
	"github.com/gin-gonic/gin"
)

func RegisterRESTEndpoints(client *ent.Client, r *gin.RouterGroup) {
	// Login
	r.POST("/token", ServiceLogin(client))
	r.POST("/token/refresh", ServiceTokenRefresh(client))

	r.Use(api.ServiceMiddleware(client))
	// VM Objects
	r.GET("/vm-object", ListVmObjects(client))
	r.POST("/vm-object", CreateVMObject(client))
	r.GET("/vm-object/:id", GetVMObject(client))
	r.PUT("/vm-object/:id", UpdateVMObject(client))
	r.DELETE("/vm-object/:id", DeleteVMObject(client))
	// Competitions
	r.GET("/competition", ListCompetitions(client))
	r.POST("/competition", CreateCompetition(client))
	r.GET("/competition/:id", GetCompetition(client))
	r.PUT("/competition/:id", UpdateCompetition(client))
	r.DELETE("/competition/:id", DeleteCompetition(client))
	// Providers
	r.GET("/provider", ListProviders(client))
	r.POST("/provider", CreateProvider(client))
	r.GET("/provider/:id", GetProvider(client))
	r.PUT("/provider/:id", UpdateProvider(client))
	r.DELETE("/provider/:id", DeleteProvider(client))
	// Teams
	r.GET("/team", ListTeams(client))
	r.POST("/team", CreateTeam(client))
	r.GET("/team/:id", GetTeam(client))
	r.PUT("/team/:id", UpdateTeam(client))
	r.DELETE("/team/:id", DeleteTeam(client))
	// Users
	r.GET("/user", ListUsers(client))
	r.POST("/user", CreateUser(client))
	r.GET("/user/:id", GetUser(client))
	r.PUT("/user/:id", UpdateUser(client))
	r.DELETE("/user/:id", DeleteUser(client))
}
