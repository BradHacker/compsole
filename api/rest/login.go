package rest

import (
	"fmt"
	"net/http"
	"os"
	"strconv"
	"time"

	"github.com/BradHacker/compsole/api"
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

// ServiceLogin godoc
//
//	@Security		ServiceAuth
//	@Summary		Login with a service account
//	@Schemes		http https
//	@Description	Login with a service account
//	@Tags			Auth API
//	@Accept			json,mpfd
//	@Param			login	body	ServiceLoginVals	true	"Service account details"
//	@Produce		json
//	@Success		200	{object}	ServiceLoginResult
//	@Failure		401	{object}	api.APIError
//	@Failure		500
//	@Router			/rest/login [post]
//
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
			api.ReturnError(ctx, http.StatusInternalServerError, "check logs for details", fmt.Errorf("check logs for details"))
			return
		}

		var loginVals ServiceLoginVals

		if err := ctx.ShouldBind(&loginVals); err != nil {
			api.ReturnError(ctx, http.StatusUnauthorized, "failed to bind to login values", err)
			return
		}

		// Get the client's IP address
		clientIp, err := api.ForContextIp(ctx)
		if err != nil {
			logrus.Warnf("failed to get IP from gin context: %v", err)
		}

		apiKey, err := uuid.Parse(loginVals.ApiKey)
		if err != nil {
			api.ReturnError(ctx, http.StatusUnauthorized, "failed to parse api_key", err)
			return
		}
		apiSecret, err := uuid.Parse(loginVals.ApiSecret)
		if err != nil {
			api.ReturnError(ctx, http.StatusUnauthorized, "failed to parse api_secret", err)
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
			api.ReturnError(ctx, http.StatusUnauthorized, "api_key or api_secret is invalid", err)
			return
		}

		expiresAt := time.Now().Add(time.Minute * time.Duration(session_timeout)).Unix()

		claims := &api.CompsoleJWTClaims{
			IssuedAt: time.Now().Unix(),
			StandardClaims: jwt.StandardClaims{
				ExpiresAt: expiresAt,
				Subject:   apiKey.String(), // Set subject to the api_key being used
			},
		}

		token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
		tokenString, err := token.SignedString([]byte(jwtKey))
		if err != nil {
			api.ReturnError(ctx, http.StatusUnauthorized, "failed to sign api token", err)
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
			api.ReturnError(ctx, http.StatusUnauthorized, "failed to update token", err)
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
