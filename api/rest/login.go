package rest

import (
	"fmt"
	"net/http"
	"os"
	"strconv"
	"strings"
	"time"

	"github.com/BradHacker/compsole/api"
	"github.com/BradHacker/compsole/ent"
	"github.com/BradHacker/compsole/ent/action"
	"github.com/BradHacker/compsole/ent/serviceaccount"
	"github.com/BradHacker/compsole/ent/servicetoken"
	"github.com/dgrijalva/jwt-go"
	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
	"github.com/sirupsen/logrus"
)

type ServiceLoginVals struct {
	ApiKey    string `form:"api_key" json:"api_key" binding:"required"`
	ApiSecret string `form:"api_secret" json:"api_secret" binding:"required"`
}

type ServiceRefreshVals struct {
	RefreshToken string `form:"refresh_token" json:"refresh_token" binding:"required"`
}

type ServiceLoginResult struct {
	SessionToken string `json:"session_token"`
	RefreshToken string `json:"refresh_token"`
	ExpiresAt    int64  `json:"expires_at"`
}

func generateAndReturnServiceToken(ctx *gin.Context, client *ent.Client, entServiceAccount *ent.ServiceAccount) {
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

	issuedAt := time.Now()
	expiresAt := issuedAt.Add(time.Minute * time.Duration(session_timeout)).Unix()

	claims := &api.CompsoleJWTClaims{
		IssuedAt: issuedAt.Unix(),
		StandardClaims: jwt.StandardClaims{
			ExpiresAt: expiresAt,
			Subject:   entServiceAccount.APIKey.String(), // Set subject to the api_key being used
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
		SetIssuedAt(issuedAt.Unix()).
		SetToken(tokenString).
		SetRefreshToken(refreshToken).
		Save(ctx)
	if err != nil {
		api.ReturnError(ctx, http.StatusUnauthorized, "failed to update token", err)
		return
	}

	// Get the client's IP address
	clientIp, err := api.ForContextIp(ctx)
	if err != nil {
		logrus.Warnf("failed to get IP from gin context: %v", err)
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

// ServiceLogin godoc
//
//	@Summary		Login with a service account and get a session token
//	@Schemes		http https
//	@Description	Login with a service account and get a session token
//	@Tags			Auth API
//	@Accept			json,mpfd
//	@Param			login	body	ServiceLoginVals	true	"Service account details"
//	@Produce		json
//	@Success		200	{object}	ServiceLoginResult
//	@Failure		401	{object}	api.APIError
//	@Failure		500	{object}	api.APIError
//	@Router			/rest/token [post]
//
// ServiceLogin handles login of service accounts and packs the session into context
func ServiceLogin(client *ent.Client) gin.HandlerFunc {
	return func(ctx *gin.Context) {
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
				serviceaccount.ActiveEQ(true), // only active accounts may authenticate
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

		generateAndReturnServiceToken(ctx, client, entServiceAccount)
	}
}

// ServiceLogin godoc
//
//	@Security		ServiceAuth
//	@Summary		Refresh a service account session without re-authenticating
//	@Schemes		http https
//	@Description	Refresh a service account session without re-authenticating
//	@Tags			Auth API
//	@Accept			json,mpfd
//	@Param			login	body	ServiceRefreshVals	true	"Service account refresh token"
//	@Produce		json
//	@Success		200	{object}	ServiceLoginResult
//	@Failure		401	{object}	api.APIError
//	@Failure		500	{object}	api.APIError
//	@Router			/rest/token/refresh [post]
//
// ServiceLogin handles login of service accounts and packs the session into context
func ServiceTokenRefresh(client *ent.Client) gin.HandlerFunc {
	return func(ctx *gin.Context) {
		headers := &api.ServiceAccountHeader{}
		if err := ctx.ShouldBindHeader(headers); err != nil {
			api.ReturnError(ctx, http.StatusUnprocessableEntity, "failed to bind to request headers", err)
			return
		}

		refresh_window := 60
		if env_value, exists := os.LookupEnv("REFRESH_WINDOW"); exists {
			if atio_value, err := strconv.Atoi(env_value); err == nil {
				refresh_window = atio_value
			}
		}

		jwtKey, exists := os.LookupEnv("JWT_SECRET")
		if !exists {
			// Kill the request if we don't have a valid JWT_SECRET
			logrus.Error("env variable JWT_SECRET not set")
			api.ReturnError(ctx, http.StatusInternalServerError, "check logs for details", fmt.Errorf("check logs for details"))
			return
		}

		authorizationParts := strings.Split(*headers.Authorization, "Bearer ")
		if len(authorizationParts) < 2 {
			api.ReturnError(ctx, http.StatusBadRequest, "must provide authorization token", fmt.Errorf("must provide authorization token"))
			return
		}
		jwtToken := authorizationParts[1]

		authToken, err := jwt.ParseWithClaims(jwtToken, &api.CompsoleJWTClaims{}, func(token *jwt.Token) (interface{}, error) {
			return []byte(jwtKey), nil
		})
		v, _ := err.(*jwt.ValidationError)
		// We care about validity, but we can ignore the expiration validation errors (we know it's expired)
		if err != nil && v.Errors != jwt.ValidationErrorExpired {
			api.ReturnError(ctx, http.StatusUnauthorized, "invalid token", err)
			return
		}

		claims, ok := authToken.Claims.(*api.CompsoleJWTClaims)
		if !ok {
			api.ReturnError(ctx, http.StatusUnprocessableEntity, "failed to parse JWT claims", err)
			return
		}

		apiKey := claims.StandardClaims.Subject
		apiKeyUUID, err := uuid.Parse(apiKey)
		if err != nil {
			api.ReturnError(ctx, http.StatusUnprocessableEntity, "failed to bind to refresh values", err)
			return
		}

		var refreshVals ServiceRefreshVals
		if err := ctx.ShouldBind(&refreshVals); err != nil {
			api.ReturnError(ctx, http.StatusUnprocessableEntity, "failed to bind to refresh values", err)
			return
		}

		// Get the client's IP address
		clientIp, err := api.ForContextIp(ctx)
		if err != nil {
			logrus.Warnf("failed to get IP from gin context: %v", err)
		}

		refreshTokenUuid, err := uuid.Parse(refreshVals.RefreshToken)
		if err != nil {
			api.ReturnError(ctx, http.StatusUnauthorized, "failed to parse refresh_token", err)
			return
		}

		entServiceToken, err := client.ServiceToken.Query().Where(
			servicetoken.HasTokenToServiceAccountWith(
				serviceaccount.APIKeyEQ(apiKeyUUID),
				serviceaccount.ActiveEQ(true),
			),
			servicetoken.RefreshTokenEQ(refreshTokenUuid),
			servicetoken.IssuedAtGTE(
				time.Now().Add(-time.Minute*time.Duration(refresh_window)).Unix(), // Subtract the refresh_window from current time
			), // If the session started less than [refresh_window] minutes ago
		).Only(ctx)
		if ent.IsNotFound(err) {
			err = client.Action.Create().
				SetIPAddress(clientIp).
				SetType(action.TypeFAILED_SIGN_IN).
				SetMessage(fmt.Sprintf("service account failed token refresh for api_key: \"%s\"", apiKey)).
				Exec(ctx)
			if err != nil {
				logrus.Warn("failed to create FAILED_SIGN_IN action: %v", err)
			}
		}
		if err != nil {
			api.ReturnError(ctx, http.StatusUnauthorized, "authorization header or refresh token invalid/expired", err)
			return
		}

		entServiceAccount, err := entServiceToken.QueryTokenToServiceAccount().Only(ctx)
		if err != nil {
			api.ReturnError(ctx, http.StatusInternalServerError, "failed to query service account from service token", err)
			return
		}

		generateAndReturnServiceToken(ctx, client, entServiceAccount)
	}
}
