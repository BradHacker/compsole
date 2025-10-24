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
	"github.com/BradHacker/compsole/ent/servicetoken"
	"github.com/dgrijalva/jwt-go"
	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
	"github.com/sirupsen/logrus"
)

const REFRESH_TOKEN_COOKIE = "refresh-token"
const REFRESH_TOKEN_PATH = "/api/rest/token/refresh"

type ServiceLoginVals struct {
	ApiKey    string `form:"api_key" json:"api_key" binding:"required"`
	ApiSecret string `form:"api_secret" json:"api_secret" binding:"required"`
}

type ServiceLoginResult struct {
	Token     string `json:"token"`
	ExpiresAt int64  `json:"token_expires_at"`
}

func generateAndReturnServiceToken(c *gin.Context, client *ent.Client, entServiceAccount *ent.ServiceAccount, existingRefreshToken *string) {
	hostname, ok := os.LookupEnv("GRAPHQL_HOSTNAME")
	if !ok {
		hostname = "localhost"
	}
	sessionTimeout := 60
	if envValue, exists := os.LookupEnv("COOKIE_TIMEOUT"); exists {
		if atioValue, err := strconv.Atoi(envValue); err == nil {
			sessionTimeout = atioValue
		}
	}
	refreshWindow := 60
	if envValue, exists := os.LookupEnv("REFRESH_WINDOW"); exists {
		if atioValue, err := strconv.Atoi(envValue); err == nil {
			refreshWindow = atioValue
		}
	}
	secureCookie := false
	if envValue, exists := os.LookupEnv("HTTPS_ENABLED"); exists {
		if envValue == "true" {
			secureCookie = true
		}
	}

	jwtKey, exists := os.LookupEnv("JWT_SECRET")
	if !exists {
		// Kill the request if we don't have a valid JWT_SECRET
		logrus.Error("env variable JWT_SECRET not set")
		api.ReturnError(c, http.StatusInternalServerError, "check logs for details", fmt.Errorf("check logs for details"))
		return
	}

	issuedAt := time.Now()

	tokenExpiresAt := issuedAt.Add(time.Minute * time.Duration(sessionTimeout)).Unix()
	tokenClaims := &api.CompsoleJWTClaims{
		ApiKey:   entServiceAccount.APIKey.String(),
		IssuedAt: issuedAt.Unix(),
		StandardClaims: jwt.StandardClaims{
			ExpiresAt: tokenExpiresAt,
		},
	}
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, tokenClaims)
	tokenString, err := token.SignedString([]byte(jwtKey))
	if err != nil {
		api.ReturnError(c, http.StatusUnauthorized, "failed to sign api token", err)
		return
	}

	refreshTokenString := ""
	if existingRefreshToken == nil {
		// We don't already have a refresh token, generate one
		refreshExpiresAt := issuedAt.Add(time.Hour * time.Duration(refreshWindow)).Unix()
		refreshTokenClaims := &api.CompsoleJWTClaims{
			ApiKey:   entServiceAccount.APIKey.String(),
			IssuedAt: issuedAt.Unix(),
			StandardClaims: jwt.StandardClaims{
				ExpiresAt: refreshExpiresAt,
			},
		}
		refreshToken := jwt.NewWithClaims(jwt.SigningMethodHS256, refreshTokenClaims)
		refreshTokenString, err = refreshToken.SignedString([]byte(jwtKey))
		if err != nil {
			api.ReturnError(c, http.StatusUnauthorized, "failed to sign api refresh token", err)
			return
		}
	} else {
		// We already have a refresh token, wait for that to expire before regenerating it
		refreshTokenString = *existingRefreshToken
	}

	_, err = client.ServiceToken.Create().
		SetTokenToServiceAccount(entServiceAccount).
		SetIssuedAt(issuedAt.Unix()).
		SetToken(tokenString).
		SetRefreshToken(refreshTokenString).
		Save(c)
	if err != nil {
		api.ReturnError(c, http.StatusUnauthorized, "failed to update token", err)
		return
	}

	// Get the client's IP address
	clientIp, err := api.ForContextIp(c)
	if err != nil {
		logrus.Warnf("failed to get IP from gin context: %v", err)
	}

	// Successful sign-in
	err = client.Action.Create().
		SetIPAddress(clientIp).
		SetType(action.TypeSIGN_IN).
		SetMessage(fmt.Sprintf("service account \"%s\" has created a session", entServiceAccount.DisplayName)).
		SetActionToServiceAccount(entServiceAccount).
		Exec(c)
	if err != nil {
		logrus.Warnf("failed to create SIGN_IN action: %v", err)
	}

	if secureCookie {
		c.SetCookie(REFRESH_TOKEN_COOKIE, refreshTokenString, int(time.Duration(time.Hour*time.Duration(refreshWindow)).Seconds()), REFRESH_TOKEN_PATH, hostname, true, true)
	} else {
		c.SetCookie(REFRESH_TOKEN_COOKIE, refreshTokenString, int(time.Duration(time.Hour*time.Duration(refreshWindow)).Seconds()), REFRESH_TOKEN_PATH, hostname, false, false)
	}

	c.JSON(http.StatusOK, ServiceLoginResult{
		Token:     tokenString,
		ExpiresAt: tokenExpiresAt,
	})
}

// ServiceLogin godoc
//
//	@Summary		Login with a service account and get a session token
//	@Schemes		http https
//	@Description	Login with a service account and get a session token. The refresh token is set as a cookie in the response and can be used to refresh a session without re-authenticating.
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
	return func(c *gin.Context) {
		var loginVals ServiceLoginVals

		if err := c.ShouldBind(&loginVals); err != nil {
			api.ReturnError(c, http.StatusUnauthorized, "failed to bind to login values", err)
			return
		}

		// Get the client's IP address
		clientIp, err := api.ForContextIp(c)
		if err != nil {
			logrus.Warnf("failed to get IP from gin context: %v", err)
		}

		apiKey, err := uuid.Parse(loginVals.ApiKey)
		if err != nil {
			api.ReturnError(c, http.StatusUnauthorized, "failed to parse api_key", err)
			return
		}
		apiSecret, err := uuid.Parse(loginVals.ApiSecret)
		if err != nil {
			api.ReturnError(c, http.StatusUnauthorized, "failed to parse api_secret", err)
			return
		}

		entServiceAccount, err := client.ServiceAccount.Query().Where(
			serviceaccount.And(
				serviceaccount.APIKeyEQ(apiKey),
				serviceaccount.APISecretEQ(apiSecret),
				serviceaccount.ActiveEQ(true), // only active accounts may authenticate
			),
		).Only(c)
		if ent.IsNotFound(err) {
			err = client.Action.Create().
				SetIPAddress(clientIp).
				SetType(action.TypeFAILED_SIGN_IN).
				SetMessage(fmt.Sprintf("service account failed login for api_key: \"%s\"", apiKey)).
				Exec(c)
			if err != nil {
				logrus.Warnf("failed to create FAILED_SIGN_IN action: %v", err)
			}
		}
		if err != nil {
			api.ReturnError(c, http.StatusUnauthorized, "api_key or api_secret is invalid", err)
			return
		}

		generateAndReturnServiceToken(c, client, entServiceAccount, nil)
	}
}

// ServiceTokenRefresh godoc
//
//	@Summary		Refresh a service account session without re-authenticating
//	@Schemes		http https
//	@Description	Refresh a service account session without re-authenticating
//	@Tags			Auth API
//	@Param			Cookie	header	string	false	"refresh-token"	default(refresh-token=xxx)
//	@Produce		json
//	@Success		200	{object}	ServiceLoginResult
//	@Failure		401	{object}	api.APIError
//	@Failure		500	{object}	api.APIError
//	@Router			/rest/token/refresh [post]
//
// ServiceTokenRefresh handles refreshing sessions automatically
func ServiceTokenRefresh(client *ent.Client) gin.HandlerFunc {
	return func(c *gin.Context) {
		refreshTokenString, err := c.Cookie(REFRESH_TOKEN_COOKIE)
		if err != nil || refreshTokenString == "" {
			api.ReturnError(c, http.StatusBadRequest, fmt.Sprintf("must have `%s` cookie set", REFRESH_TOKEN_COOKIE), fmt.Errorf("must provide refresh token cookie"))
			return
		}

		jwtKey, exists := os.LookupEnv("JWT_SECRET")
		if !exists {
			// Kill the request if we don't have a valid JWT_SECRET
			logrus.Error("env variable JWT_SECRET not set")
			api.ReturnError(c, http.StatusInternalServerError, "check logs for details", fmt.Errorf("check logs for details"))
			return
		}

		refreshToken, err := jwt.ParseWithClaims(refreshTokenString, &api.CompsoleJWTClaims{}, func(token *jwt.Token) (interface{}, error) {
			return []byte(jwtKey), nil
		})
		if err != nil {
			api.ReturnError(c, http.StatusUnauthorized, "invalid or expired token", err)
			return
		}

		claims, ok := refreshToken.Claims.(*api.CompsoleJWTClaims)
		if !ok {
			api.ReturnError(c, http.StatusUnprocessableEntity, "failed to parse JWT claims", err)
			return
		}

		apiKey := claims.ApiKey
		apiKeyUUID, err := uuid.Parse(apiKey)
		if err != nil {
			api.ReturnError(c, http.StatusUnprocessableEntity, "failed to extract JWT claims", err)
			return
		}

		// Get the client's IP address
		clientIp, err := api.ForContextIp(c)
		if err != nil {
			logrus.Warnf("failed to get IP from gin context: %v", err)
		}

		entServiceToken, err := client.ServiceToken.Query().Where(
			servicetoken.HasTokenToServiceAccountWith(
				serviceaccount.APIKeyEQ(apiKeyUUID),
				serviceaccount.ActiveEQ(true),
			),
			servicetoken.RefreshTokenEQ(refreshTokenString),
		).Only(c)
		if ent.IsNotFound(err) {
			err = client.Action.Create().
				SetIPAddress(clientIp).
				SetType(action.TypeFAILED_SIGN_IN).
				SetMessage(fmt.Sprintf("service account failed token refresh for api_key: \"%s\"", apiKey)).
				Exec(c)
			if err != nil {
				logrus.Warnf("failed to create FAILED_SIGN_IN action: %v", err)
			}
		}
		if err != nil {
			api.ReturnError(c, http.StatusUnauthorized, "authorization header or refresh token invalid/expired", err)
			return
		}

		entServiceAccount, err := entServiceToken.QueryTokenToServiceAccount().Only(c)
		if err != nil {
			api.ReturnError(c, http.StatusInternalServerError, "failed to query service account from service token", err)
			return
		}

		generateAndReturnServiceToken(c, client, entServiceAccount, &refreshTokenString)
	}
}
