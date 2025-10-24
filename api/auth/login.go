package auth

import (
	"fmt"
	"net/http"
	"os"
	"strconv"
	"strings"
	"time"

	"github.com/BradHacker/compsole/api"
	"github.com/BradHacker/compsole/compsole/utils"
	"github.com/BradHacker/compsole/ent"
	"github.com/BradHacker/compsole/ent/action"
	"github.com/BradHacker/compsole/ent/token"
	"github.com/BradHacker/compsole/ent/user"
	"github.com/dgrijalva/jwt-go"
	"github.com/gin-gonic/gin"
	"github.com/sirupsen/logrus"
)

// LocalLogin godoc
//
//	@Summary		Login with a local account
//	@Schemes		http https
//	@Description	Login with a local account
//	@Tags			Auth API
//	@Accept			json,mpfd
//	@Param			login	body	auth.UserLoginVals	true	"User account details"
//	@Produce		json
//	@Success		200	{object}	auth.UserModel
//	@Header			200	{string}	Cookie	"`auth-cookie` contains the session token"
//	@Router			/api/auth/local/login [post]
func LocalLogin(client *ent.Client) gin.HandlerFunc {
	return func(c *gin.Context) {
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
		var loginVals UserLoginVals
		username := ""
		password := ""

		if err := c.ShouldBind(&loginVals); err != nil {
			if secure_cookie {
				c.SetCookie("auth-cookie", "", 0, "/", hostname, true, true)
			} else {
				c.SetCookie("auth-cookie", "", 0, "/", hostname, false, false)
			}
			c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": err})
			return
		} else {
			username = strings.ToLower(loginVals.Username) // Always lowercase username
			password = loginVals.Password
		}

		// Get the client's IP address
		clientIp, err := api.ForContextIp(c)
		if err != nil {
			logrus.Warnf("failed to get IP from gin context: %v", err)
		}

		entUser, err := client.User.Query().Where(
			user.And(
				user.UsernameEQ(username),
				user.ProviderEQ(user.ProviderLOCAL),
			),
		).
			WithUserToTeam().
			Only(c)
		if err != nil {
			if ent.IsNotFound(err) {
				err = client.Action.Create().
					SetIPAddress(clientIp).
					SetType(action.TypeFAILED_SIGN_IN).
					SetMessage(fmt.Sprintf("user \"%s\" does not exists", username)).
					Exec(c)
				if err != nil {
					logrus.Warnf("failed to create FAILED_SIGN_IN action: %v", err)
				}
			}
			if secure_cookie {
				c.SetCookie("auth-cookie", "", 0, "/", hostname, true, true)
			} else {
				c.SetCookie("auth-cookie", "", 0, "/", hostname, false, false)
			}
			c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "User not found"})
			return
		}
		// Compare the stored hashed password, with the hashed version of the password that was received
		if err = utils.CheckPassword(password, entUser.Password); err != nil {
			err = client.Action.Create().
				SetIPAddress(clientIp).
				SetType(action.TypeFAILED_SIGN_IN).
				SetMessage(fmt.Sprintf("wrong password for user \"%s\"", username)).
				SetActionToUser(entUser).
				Exec(c)
			if err != nil {
				logrus.Warnf("failed to create FAILED_SIGN_IN action: %v", err)
			}
			if secure_cookie {
				c.SetCookie("auth-cookie", "", 0, "/", hostname, true, true)
			} else {
				c.SetCookie("auth-cookie", "", 0, "/", hostname, false, false)
			}
			c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "User not found"})
			return
		}

		expiresAt := time.Now().Add(time.Minute * time.Duration(cookie_timeout)).Unix()

		claims := &api.CompsoleJWTClaims{
			IssuedAt: time.Now().Unix(),
			StandardClaims: jwt.StandardClaims{
				ExpiresAt: expiresAt,
			},
		}

		token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)

		jwtKey, exists := os.LookupEnv("JWT_SECRET")
		if !exists {
			if secure_cookie {
				c.SetCookie("auth-cookie", "", 0, "/", hostname, true, true)
			} else {
				c.SetCookie("auth-cookie", "", 0, "/", hostname, false, false)
			}
			logrus.Warn("env var JWT_SECRET is not set")
			c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "Error signing token"})
			return
		}

		tokenString, err := token.SignedString([]byte(jwtKey))
		if err != nil {
			if secure_cookie {
				c.SetCookie("auth-cookie", "", 0, "/", hostname, true, true)
			} else {
				c.SetCookie("auth-cookie", "", 0, "/", hostname, false, false)
			}
			logrus.Errorf("error signing token: %v", err)
			c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "Error signing token"})
			return
		}

		_, err = client.Token.Create().SetTokenToUser(entUser).SetExpireAt(expiresAt).SetToken(tokenString).Save(c)
		if err != nil {
			if secure_cookie {
				c.SetCookie("auth-cookie", "", 0, "/", hostname, true, true)
			} else {
				c.SetCookie("auth-cookie", "", 0, "/", hostname, false, false)
			}
			c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "Error updating token"})
			return
		}

		if secure_cookie {
			c.SetCookie("auth-cookie", tokenString, cookie_timeout*60, "/", hostname, true, true)
		} else {
			c.SetCookie("auth-cookie", tokenString, cookie_timeout*60, "/", hostname, false, false)
		}

		// Successful sign-in
		err = client.Action.Create().
			SetIPAddress(clientIp).
			SetType(action.TypeSIGN_IN).
			SetMessage(fmt.Sprintf("user \"%s\" has signed in successfully", username)).
			SetActionToUser(entUser).
			Exec(c)
		if err != nil {
			logrus.Warnf("failed to create SIGN_IN action: %v", err)
		}

		entUser.Password = ""
		c.JSON(200, UserEntToModel(entUser))

		c.Next()
	}
}

// Logout decodes the share session cookie and packs the session into context
func Logout(client *ent.Client) gin.HandlerFunc {
	return func(c *gin.Context) {
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

		authCookie, err := c.Cookie("auth-cookie")

		// Allow unauthenticated users in
		if err != nil || authCookie == "" {
			if secure_cookie {
				c.SetCookie("auth-cookie", "", 0, "/", hostname, true, true)
			} else {
				c.SetCookie("auth-cookie", "", 0, "/", hostname, false, false)
			}
			return
		}

		// Get the JWT string from the cookie
		tknStr := authCookie

		// Initialize a new instance of `Claims`
		claims := &api.CompsoleJWTClaims{}

		jwtKey, exists := os.LookupEnv("JWT_SECRET")
		if !exists {
			if secure_cookie {
				c.SetCookie("auth-cookie", "", 0, "/", hostname, true, true)
			} else {
				c.SetCookie("auth-cookie", "", 0, "/", hostname, false, false)
			}
			c.AbortWithStatus(http.StatusUnauthorized)
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
				c.SetCookie("auth-cookie", "", 0, "/", hostname, true, true)
			} else {
				c.SetCookie("auth-cookie", "", 0, "/", hostname, false, false)
			}
			if err == jwt.ErrSignatureInvalid {
				c.AbortWithStatus(http.StatusUnauthorized)
				return
			}
			c.AbortWithStatus(http.StatusBadRequest)
			return
		}
		if !tkn.Valid {
			if secure_cookie {
				c.SetCookie("auth-cookie", "", 0, "/", hostname, true, true)
			} else {
				c.SetCookie("auth-cookie", "", 0, "/", hostname, false, false)
			}
			c.AbortWithStatus(http.StatusUnauthorized)
			return
		}

		// Get the user and log a sign out event
		entUser, err := client.User.Query().Where(user.HasUserToTokenWith(token.TokenEQ(authCookie))).Only(c)
		if err != nil {
			if secure_cookie {
				c.SetCookie("auth-cookie", "", 0, "/", hostname, true, true)
			} else {
				c.SetCookie("auth-cookie", "", 0, "/", hostname, false, false)
			}
			c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": err})
			return
		}
		clientIpValues, exists := c.Request.Header["X-Forwarded-For"]
		clientIp := ""
		if exists {
			clientIp = clientIpValues[0]
		} else {
			clientIp = c.RemoteIP()
		}
		err = client.Action.Create().
			SetIPAddress(clientIp).
			SetType(action.TypeSIGN_OUT).
			SetMessage(fmt.Sprintf("user \"%s\" has signed out", entUser.Username)).
			SetActionToUser(entUser).
			Exec(c)
		if err != nil {
			logrus.Warnf("failed to create SIGN_OUT action: %v", err)
		}

		_, err = client.Token.Delete().Where(token.TokenEQ(authCookie)).Exec(c)
		if err != nil {
			if secure_cookie {
				c.SetCookie("auth-cookie", "", 0, "/", hostname, true, true)
			} else {
				c.SetCookie("auth-cookie", "", 0, "/", hostname, false, false)
			}
			c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": err})
			return
		}

		if secure_cookie {
			c.SetCookie("auth-cookie", "", 0, "/", hostname, true, true)
		} else {
			c.SetCookie("auth-cookie", "", 0, "/", hostname, false, false)
		}

		c.Next()
	}
}
