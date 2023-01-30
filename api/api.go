package api

import (
	"context"
	"errors"
	"fmt"
	"net/http"
	"os"
	"strings"
	"time"

	"github.com/BradHacker/compsole/ent"
	"github.com/BradHacker/compsole/ent/serviceaccount"
	"github.com/BradHacker/compsole/ent/servicetoken"
	"github.com/BradHacker/compsole/ent/token"
	"github.com/dgrijalva/jwt-go"
	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
)

//go:generate swag fmt -g ../server.go
//go:generate swag i -g ../server.go --o ../docs --pd --md ../docs

type APIError struct {
	Message string `json:"message"`
	Error   error  `json:"error"`
}

// A private key for context that only this package can access. This is important
// to prevent collisions between different context uses
var userCtxKey = &contextKey{"user"}
var ipCtxKey = &contextKey{"ip"}

type contextKey struct {
	name string
}

// CompsoleJWTClaims Create a struct that will be encoded to a JWT.
type CompsoleJWTClaims struct {
	IssuedAt int64
	jwt.StandardClaims
}

type ServiceAccountHeader struct {
	Authorization *string `header:"Authorization" binding:"required"`
}

func UnauthenticatedMiddleware() gin.HandlerFunc {
	return func(ctx *gin.Context) {
		clientIpValues, exists := ctx.Request.Header["X-Forwarded-For"]
		clientIp := ""
		if exists {
			clientIp = clientIpValues[0]
		} else {
			clientIp = ctx.RemoteIP()
		}
		// put it in context
		c := context.WithValue(ctx, ipCtxKey, clientIp)
		ctx.Request = ctx.Request.WithContext(c)

		ctx.Next()
	}
}

// Middleware decodes the share session cookie and packs the session into context
func Middleware(client *ent.Client) gin.HandlerFunc {
	return func(ctx *gin.Context) {
		hostname, ok := os.LookupEnv("GRAPHQL_HOSTNAME")
		if !ok {
			hostname = "localhost"
		}
		secure_cookie := false
		if env_value, exists := os.LookupEnv("HTTPS_ENABLED"); exists {
			if env_value == "true" {
				secure_cookie = true
			}
		}

		authCookie, err := ctx.Cookie("auth-cookie")
		if err != nil || authCookie == "" {
			if secure_cookie {
				ctx.SetCookie("auth-cookie", "", 0, "/", hostname, true, true)
			} else {
				ctx.SetCookie("auth-cookie", "", 0, "/", hostname, false, false)
			}
			return
		}

		// Get the JWT string from the cookie
		tknStr := authCookie

		// Initialize a new instance of `Claims`
		claims := &CompsoleJWTClaims{}

		jwtKey, exists := os.LookupEnv("JWT_SECRET")
		if !exists {
			if secure_cookie {
				ctx.SetCookie("auth-cookie", "", 0, "/", hostname, true, true)
			} else {
				ctx.SetCookie("auth-cookie", "", 0, "/", hostname, false, false)
			}
			ctx.AbortWithStatus(http.StatusUnauthorized)
			return
		}

		// Parse the JWT string and store the result in `claims`.
		// Note that we are passing the key in this method as well. This method will return an error
		// if the token is invalid (if it has expired according to the expiry time we set on sign in),
		// or if the signature does not match
		tkn, err := jwt.ParseWithClaims(tknStr, claims, func(token *jwt.Token) (interface{}, error) {
			return []byte(jwtKey), nil
		})

		if err != nil {
			if secure_cookie {
				ctx.SetCookie("auth-cookie", "", 0, "/", hostname, true, true)
			} else {
				ctx.SetCookie("auth-cookie", "", 0, "/", hostname, false, false)
			}
			if err == jwt.ErrSignatureInvalid {
				ctx.AbortWithStatus(http.StatusUnauthorized)
				return
			}
			ctx.AbortWithStatus(http.StatusBadRequest)
			return
		}
		if !tkn.Valid {
			if secure_cookie {
				ctx.SetCookie("auth-cookie", "", 0, "/", hostname, true, true)
			} else {
				ctx.SetCookie("auth-cookie", "", 0, "/", hostname, false, false)
			}
			ctx.AbortWithStatus(http.StatusUnauthorized)
			return
		}

		entToken, err := client.Token.Query().Where(token.TokenEQ(authCookie)).Only(ctx)
		if err != nil {
			if secure_cookie {
				ctx.SetCookie("auth-cookie", "", 0, "/", hostname, true, true)
			} else {
				ctx.SetCookie("auth-cookie", "", 0, "/", hostname, false, false)
			}
			ctx.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": err})
			return
		}

		entUser, err := entToken.QueryTokenToUser().Only(ctx)
		if err != nil {
			if secure_cookie {
				ctx.SetCookie("auth-cookie", "", 0, "/", hostname, true, true)
			} else {
				ctx.SetCookie("auth-cookie", "", 0, "/", hostname, false, false)
			}
			ctx.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": err})
			return
		}
		// put it in context
		c := context.WithValue(ctx.Request.Context(), userCtxKey, entUser)

		clientIpValues, exists := ctx.Request.Header["X-Forwarded-For"]
		clientIp := ""
		if exists {
			clientIp = clientIpValues[0]
		} else {
			clientIp = ctx.RemoteIP()
		}
		// put it in context
		c = context.WithValue(c, ipCtxKey, clientIp)
		ctx.Request = ctx.Request.WithContext(c)

		ctx.Next()
	}
}

func ServiceMiddleware(client *ent.Client) gin.HandlerFunc {
	return func(ctx *gin.Context) {
		headers := &ServiceAccountHeader{}

		if err := ctx.ShouldBindHeader(headers); err != nil {
			ctx.AbortWithStatusJSON(400, gin.H{"error": err})
			return
		}

		jwtKey, exists := os.LookupEnv("JWT_SECRET")
		if !exists {
			ctx.AbortWithStatus(http.StatusInternalServerError)
			return
		}

		authorizationParts := strings.Split(*headers.Authorization, "Bearer ")
		if len(authorizationParts) < 2 {
			ctx.AbortWithStatusJSON(http.StatusBadRequest, gin.H{"error": "Must provide authorization token"})
			return
		}
		jwtToken := authorizationParts[1]

		authToken, err := jwt.ParseWithClaims(jwtToken, &CompsoleJWTClaims{}, func(token *jwt.Token) (interface{}, error) {
			return []byte(jwtKey), nil
		})
		if err != nil || !authToken.Valid {
			ctx.AbortWithStatus(http.StatusUnauthorized)
			return
		}

		claims, ok := authToken.Claims.(*CompsoleJWTClaims)
		if !ok {
			ctx.AbortWithStatus(http.StatusUnauthorized)
			return
		}

		apiKey := claims.StandardClaims.Subject
		apiKeyUUID, err := uuid.Parse(apiKey)
		if err != nil {
			ctx.AbortWithStatus(http.StatusInternalServerError)
			return
		}

		entServiceToken, err := client.ServiceToken.Query().Where(
			servicetoken.And(
				servicetoken.HasTokenToServiceAccountWith(serviceaccount.APIKeyEQ(apiKeyUUID)),
				servicetoken.TokenEQ(jwtToken),
			),
		).Only(ctx)
		if ent.IsNotFound(err) {
			ctx.AbortWithStatus(http.StatusUnauthorized)
			return
		} else if err != nil {
			ctx.AbortWithStatusJSON(http.StatusInternalServerError, gin.H{"error": err})
			return
		}

		entServiceAccount, err := entServiceToken.TokenToServiceAccount(ctx)
		if err != nil {
			ctx.AbortWithStatusJSON(http.StatusInternalServerError, gin.H{"error": err})
			return
		}

		// put it in context
		c := context.WithValue(ctx.Request.Context(), userCtxKey, entServiceAccount)

		clientIpValues, exists := ctx.Request.Header["X-Forwarded-For"]
		clientIp := ""
		if exists {
			clientIp = clientIpValues[0]
		} else {
			clientIp = ctx.RemoteIP()
		}
		// put it in context
		c = context.WithValue(c, ipCtxKey, clientIp)
		ctx.Request = ctx.Request.WithContext(c)

		ctx.Next()
	}
}

// ForContext finds the user from the context. REQUIRES Middleware to have run.
func ForContext(ctx context.Context) (*ent.User, error) {
	raw, ok := ctx.Value(userCtxKey).(*ent.User)
	if ok {
		return raw, nil
	}
	return nil, errors.New("unable to get user from context")
}

func ForContextIp(ctx *gin.Context) (string, error) {
	if ip, ok := ctx.Request.Context().Value(ipCtxKey).(string); ok {
		return ip, nil
	}
	return "", fmt.Errorf("unable to get ip from context")
}

// ClearTokens Clears Old tokens from DB
func ClearTokens(client *ent.Client, ctx context.Context) {
	client.Token.Delete().Where(token.ExpireAtLT(time.Now().Unix())).Exec(ctx)
}

func ReturnError(ctx *gin.Context, code int, message string, err error) {
	ctx.AbortWithStatusJSON(code, APIError{
		Message: message,
		Error:   err,
	})
}
