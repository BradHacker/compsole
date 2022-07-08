package auth

import (
	"net/http"
	"os"
	"strconv"
	"time"

	"github.com/BradHacker/compsole/ent"
	"github.com/BradHacker/compsole/ent/user"
	"github.com/dgrijalva/jwt-go"
	"github.com/gin-gonic/gin"
	"golang.org/x/crypto/bcrypt"
)

type login struct {
	Username string `form:"username" json:"username" binding:"required"`
	Password string `form:"password" json:"password" binding:"required"`
}

// LocalLogin decodes the share session cookie and packs the session into context
func LocalLogin(client *ent.Client) gin.HandlerFunc {
	return func(ctx *gin.Context) {
		hostname, ok := os.LookupEnv("GRAPHQL_HOSTNAME")
		if !ok {
			hostname = "localhost"
		}
		cookie_timeout := 60
		if env_value, exists := os.LookupEnv("COOKIE_TIMEOUT"); exists {
			if atio_value, err := strconv.Atoi(env_value); err == nil {
				cookie_timeout = atio_value
			}
		}
		secure_cookie := false
		if env_value, exists := os.LookupEnv("HTTPS_ENABLED"); exists {
			if env_value == "true" {
				secure_cookie = true
			}
		}
		var loginVals login
		username := ""
		password := ""

		if err := ctx.ShouldBind(&loginVals); err != nil {
			if secure_cookie {
				ctx.SetCookie("auth-cookie", "", 0, "/", hostname, true, true)
			} else {
				ctx.SetCookie("auth-cookie", "", 0, "/", hostname, false, false)
			}
			ctx.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": err})
			return
		} else {
			username = loginVals.Username
			password = loginVals.Password
		}

		entUser, err := client.User.Query().Where(
			user.And(
				user.UsernameEQ(username),
				user.ProviderEQ(user.ProviderLOCAL),
			),
		).Only(ctx)

		if err != nil {
			if secure_cookie {
				ctx.SetCookie("auth-cookie", "", 0, "/", hostname, true, true)
			} else {
				ctx.SetCookie("auth-cookie", "", 0, "/", hostname, false, false)
			}
			ctx.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "User not found"})
			return
		}
		// Compare the stored hashed password, with the hashed version of the password that was received
		if err = bcrypt.CompareHashAndPassword([]byte(entUser.Password), []byte(password)); err != nil {
			if secure_cookie {
				ctx.SetCookie("auth-cookie", "", 0, "/", hostname, true, true)
			} else {
				ctx.SetCookie("auth-cookie", "", 0, "/", hostname, false, false)
			}
			ctx.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "User not found"})
			return
		}

		expiresAt := time.Now().Add(time.Minute * time.Duration(cookie_timeout)).Unix()

		claims := &Claims{
			IssuedAt: time.Now().Unix(),
			StandardClaims: jwt.StandardClaims{
				ExpiresAt: expiresAt,
			},
		}

		token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)

		tokenString, err := token.SignedString(jwtKey)
		if err != nil {
			if secure_cookie {
				ctx.SetCookie("auth-cookie", "", 0, "/", hostname, true, true)
			} else {
				ctx.SetCookie("auth-cookie", "", 0, "/", hostname, false, false)
			}
			ctx.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "Error signing token"})
			return
		}

		_, err = client.Token.Create().SetTokenToUser(entUser).SetExpireAt(expiresAt).SetToken(tokenString).Save(ctx)
		if err != nil {
			if secure_cookie {
				ctx.SetCookie("auth-cookie", "", 0, "/", hostname, true, true)
			} else {
				ctx.SetCookie("auth-cookie", "", 0, "/", hostname, false, false)
			}
			ctx.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "Error updating token"})
			return
		}

		if secure_cookie {
			ctx.SetCookie("auth-cookie", tokenString, cookie_timeout*60, "/", hostname, true, true)
		} else {
			ctx.SetCookie("auth-cookie", tokenString, cookie_timeout*60, "/", hostname, false, false)
		}

		entUser.Password = ""
		ctx.JSON(200, entUser)

		ctx.Next()
	}
}
