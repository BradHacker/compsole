package main

import (
	"context"
	"net/http"
	"os"
	"strings"
	"time"

	"github.com/99designs/gqlgen/graphql/handler"
	"github.com/99designs/gqlgen/graphql/handler/extension"
	"github.com/99designs/gqlgen/graphql/handler/lru"
	"github.com/99designs/gqlgen/graphql/handler/transport"
	"github.com/99designs/gqlgen/graphql/playground"
	"github.com/BradHacker/compsole/auth"
	"github.com/BradHacker/compsole/compsole/utils"
	"github.com/BradHacker/compsole/ent"
	"github.com/BradHacker/compsole/ent/user"
	"github.com/BradHacker/compsole/graph"
	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"github.com/go-redis/redis/v8"
	"github.com/gorilla/websocket"
	"github.com/sirupsen/logrus"
	"golang.org/x/crypto/bcrypt"
)

const defaultPort = "8080"

// Defining the Playground handler
func playgroundHandler() gin.HandlerFunc {
	h := playground.Handler("GraphQL", "/api/query")

	return func(c *gin.Context) {
		h.ServeHTTP(c.Writer, c.Request)
	}
}

// Defining the Graphql handler
func graphqlHandler(client *ent.Client, rdb *redis.Client) gin.HandlerFunc {
	// NewExecutableSchema and Config are in the generated.go file
	// Resolver is in the resolver.go file
	h := handler.New(graph.NewSchema(client, rdb))

	h.AddTransport(&transport.Websocket{
		Upgrader: websocket.Upgrader{
			HandshakeTimeout: 30 * time.Second,
			ReadBufferSize:   1024,
			WriteBufferSize:  1024,
			WriteBufferPool:  nil,
			CheckOrigin: func(r *http.Request) bool {
				return true
			},
			EnableCompression: false,
		},
		KeepAlivePingInterval: 1 * time.Second,
	})
	h.AddTransport(transport.GET{})
	h.AddTransport(transport.POST{})
	h.AddTransport(transport.MultipartForm{})

	h.SetQueryCache(lru.New(1000))

	h.Use(extension.Introspection{})
	h.Use(extension.AutomaticPersistedQuery{
		Cache: lru.New(100),
	})

	return func(c *gin.Context) {
		h.ServeHTTP(c.Writer, c.Request)
	}
}

func main() {
	// Print the banner
	utils.PrintBanner()

	// Create the ent client
	pgHost, ok := os.LookupEnv("PG_URI")
	var client *ent.Client = nil

	if !ok {
		logrus.Fatalf("no value set for PG_URI env variable. please set the postgres connection uri")
	} else {
		client = ent.PGOpen(pgHost)
	}

	ctx := context.Background()
	defer ctx.Done()
	defer client.Close()

	// Run the auto migration tool.
	if err := client.Schema.Create(ctx); err != nil {
		logrus.Fatalf("failed creating schema resources: %v", err)
	}

	// Create the default admin if no admin user exists
	logrus.Info("Checking if an admin account exists")
	entAdminUser, err := client.User.Query().Where(user.RoleEQ(user.RoleADMIN)).First(ctx)
	if ent.IsNotFound(err) {
		logrus.Warn("No admin account found, creating default admin...")
		defaultUsername := os.Getenv("DEFAULT_ADMIN_USERNAME")
		defaultPassword := os.Getenv("DEFAULT_ADMIN_PASSWORD")
		hashedPassword, err := bcrypt.GenerateFromPassword([]byte(defaultPassword), 8)
		if err != nil {
			logrus.Errorf("failed to hash default admin password")
			return
		}
		password := string(hashedPassword[:])

		err = client.User.Create().
			SetFirstName("Default").
			SetLastName("Admin").
			SetUsername(defaultUsername).
			SetPassword(password).
			SetRole(user.RoleADMIN).
			SetProvider(user.ProviderLOCAL).
			Exec(ctx)
		if err != nil {
			logrus.Errorf("failed to create default admin: %v", err)
		} else {
			logrus.Info("Successfully created default admin account")
		}
	} else if err != nil {
		logrus.Errorf("failed to query ent for admin user: %v", err)
		return
	} else {
		logrus.WithFields(logrus.Fields{
			"username": entAdminUser.Username,
		}).Infof("Found admin user")
	}

	redisUri := os.Getenv("REDIS_URI")
	redisPassword := os.Getenv("REDIS_PASSWORD")
	var rdb *redis.Client
	if redisUri != "" && redisPassword != "" {
		rdb = redis.NewClient(&redis.Options{
			Addr:     redisUri,
			Password: redisPassword,
			DB:       0, // use default DB
		})
	} else if redisUri != "" {
		rdb = redis.NewClient(&redis.Options{
			Addr:     redisUri,
			Password: "",
			DB:       0, // use default DB
		})
	} else {
		logrus.Fatalf("No REDIS_URI has been set")
	}

	go func() {
		sub := rdb.Subscribe(ctx, "lockout")
		_, err = sub.Receive(ctx)
		if err != nil {
			logrus.Errorf("error receiving from subscription: %v", err)
			return
		}
		ch := sub.Channel()
		for {
			select {
			case message := <-ch:
				logrus.Debugf("Message %s received from %s", message.Payload, message.Channel)
			// close when context done
			case <-ctx.Done():
				logrus.Infof("Main Channel CTX Closing, Closing Sub Channel")
				sub.Close()
				return
			}
		}
	}()

	auth.InitGoth()

	router := gin.Default()

	cors_urls := []string{"http://localhost", "http://localhost:3000"}
	if env_value, exists := os.LookupEnv("CORS_ALLOWED_ORIGINS"); exists {
		cors_urls = strings.Split(env_value, ",")
	}

	// Add CORS middleware around every request
	// See https://github.com/rs/cors for full option listing
	router.Use(cors.New(cors.Config{
		AllowOrigins:     cors_urls,
		AllowMethods:     []string{"GET", "PUT", "PATCH"},
		AllowHeaders:     []string{"Content-Type", "Content-Length", "Accept-Encoding", "X-CSRF-Token", "Authorization", "accept", "origin", "Cache-Control", "X-Requested-With"},
		AllowCredentials: true,
	}))

	port, ok := os.LookupEnv("PORT")

	if !ok {
		port = defaultPort
	}

	gqlHandler := graphqlHandler(client, rdb)

	authGroup := router.Group("/auth")
	authGroup.GET("/login", func(c *gin.Context) {
		c.Redirect(301, "/ui/")
	})
	authGroup.POST("/local/login", auth.LocalLogin(client))
	authGroup.GET("/:provider/login", auth.GothicBeginAuth())
	authGroup.GET("/:provider/callback", auth.GothicCallbackHandler(client))
	authGroup.GET("/logout", auth.Logout(client))

	api := router.Group("/api")
	api.Use(auth.Middleware(client))

	api.POST("/query", gqlHandler)
	api.GET("/query", gqlHandler)
	api.GET("/playground", playgroundHandler())

	logrus.Infof("Starting Compsole Server on port " + port)

	if err := router.Run(port); err != nil {
		logrus.Errorf("failed to start gin router")
	}
}
