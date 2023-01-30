package auth

import (
	"fmt"
	"net/http"
	"os"
	"strconv"
	"time"

	"github.com/BradHacker/compsole/ent"
	"github.com/BradHacker/compsole/ent/action"
	"github.com/BradHacker/compsole/ent/serviceaccount"
	"github.com/dgrijalva/jwt-go"
	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
	"github.com/sirupsen/logrus"
)

type ServiceLoginVals struct {
	ApiKey    string `form:"api_key" json:"api_key" binding:"required"`
	ApiSecret string `form:"api_secret" json:"api_secret" binding:"required"`
}

type ServiceLoginResult struct {
	SessionToken string `json:"session_token"`
	RefreshToken string `json:"refresh_token"`
	ExpiresAt    int64  `json:"expires_at"`
}

type ServiceLoginError struct {
	Error string `json:"error"`
}

// ServiceLogin godoc
// @Summary Login with a service account
// @Schemes http https
// @Description Login with a service account
// @Tags auth
// @Accept json,mpfd
// @Param login body ServiceLoginVals true "Service account details"
// @Produce json
// @Success 200 {object} ServiceLoginResult
// @Failure 401 {object} ServiceLoginError
// @Failure 500
// @Router /auth/service/login [post]
// ServiceLogin handles login of service accounts and packs the session into context
func ServiceLogin(client *ent.Client) gin.HandlerFunc {
	return func(ctx *gin.Context) {
		session_timeout := 60
		if env_value, exists := os.LookupEnv("COOKIE_TIMEOUT"); exists {
			if atio_value, err := strconv.Atoi(env_value); err == nil {
				session_timeout = atio_value
			}
		}

		jwtKey, exists := os.LookupEnv("JWT_SECRET")
		if !exists {
			// Kill the request if we don't have a valid JWT_SECRET
			logrus.Error("env variable JWT_SECRET not set")
			ctx.AbortWithStatus(http.StatusInternalServerError)
			return
		}

		var loginVals ServiceLoginVals

		if err := ctx.ShouldBind(&loginVals); err != nil {
			ctx.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": err})
			return
		}

		// Get the client's IP address
		clientIp, err := ForContextIp(ctx)
		if err != nil {
			logrus.Warnf("failed to get IP from gin context: %v", err)
		}

		apiKey, err := uuid.Parse(loginVals.ApiKey)
		if err != nil {
			ctx.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": err})
			return
		}
		apiSecret, err := uuid.Parse(loginVals.ApiSecret)
		if err != nil {
			ctx.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": err})
			return
		}

		entServiceAccount, err := client.ServiceAccount.Query().Where(
			serviceaccount.And(
				serviceaccount.APIKeyEQ(apiKey),
				serviceaccount.APISecretEQ(apiSecret),
			),
		).Only(ctx)
		if ent.IsNotFound(err) {
			err = client.Action.Create().
				SetIPAddress(clientIp).
				SetType(action.TypeFAILED_SIGN_IN).
				SetMessage(fmt.Sprintf("service account failed login for api_key: \"%s\"", apiKey)).
				Exec(ctx)
			if err != nil {
				logrus.Warn("failed to create FAILED_SIGN_IN action: %v", err)
			}
		}
		if err != nil {
			ctx.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "api_key or api_secret invalid"})
			return
		}

		expiresAt := time.Now().Add(time.Minute * time.Duration(session_timeout)).Unix()

		claims := &CompsoleJWTClaims{
			IssuedAt: time.Now().Unix(),
			StandardClaims: jwt.StandardClaims{
				ExpiresAt: expiresAt,
				Subject:   apiKey.String(), // Set subject to the api_key being used
			},
		}

		token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
		tokenString, err := token.SignedString(jwtKey)
		if err != nil {
			ctx.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "Error signing token"})
			return
		}

		refreshToken := uuid.New()
		_, err = client.ServiceToken.Create().
			SetTokenToServiceAccount(entServiceAccount).
			SetExpireAt(expiresAt).
			SetToken(tokenString).
			SetRefreshToken(refreshToken).
			Save(ctx)
		if err != nil {
			ctx.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "Error updating token"})
			return
		}

		// Successful sign-in
		err = client.Action.Create().
			SetIPAddress(clientIp).
			SetType(action.TypeSIGN_IN).
			SetMessage(fmt.Sprintf("service account \"%s\" has created a session", entServiceAccount.DisplayName)).
			SetActionToServiceAccount(entServiceAccount).
			Exec(ctx)
		if err != nil {
			logrus.Warn("failed to create SIGN_IN action: %v", err)
		}

		ctx.JSON(http.StatusOK, ServiceLoginResult{
			SessionToken: tokenString,
			RefreshToken: refreshToken.String(),
			ExpiresAt:    expiresAt,
		})
	}
}
