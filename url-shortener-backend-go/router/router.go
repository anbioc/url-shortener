package router

import (
	"github.com/anbioc/url-shortener/url-shortener-backend-go/config"
	"github.com/anbioc/url-shortener/url-shortener-backend-go/controllers"
	"github.com/anbioc/url-shortener/url-shortener-backend-go/middleware"
	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

func SetupRouter(db *gorm.DB, env *config.Env) *gin.Engine {
	r := gin.Default()
	// r.Use(cors.New(cors.Config{
	// 	AllowOrigins:     []string{"http://localhost:5173", "http://localhost:3000"},
	// 	AllowMethods:     []string{"GET", "POST", "OPTIONS"},
	// 	AllowHeaders:     []string{"Origin", "Content-Type", "Authorization"},
	// 	ExposeHeaders:    []string{"Content-Length"},
	// 	AllowCredentials: true,
	// 	MaxAge:           12 * time.Hour,
	// }))

	auth := r.Group("/api/auth")
	{
		AuthController := controllers.AuthController{
			Env: env,
			DB:  db,
		}

		auth.POST("/login", AuthController.Login)
		auth.POST("/register", AuthController.Register)
		auth.POST("/verify-refresh", AuthController.RefreshToken)
		auth.GET("/signout", middleware.AuthMiddleware(env), AuthController.Signout)
	}

	url := r.Group("/api/url")
	url.Use(middleware.AuthMiddleware(env))
	{
		URLController := controllers.UrlController{
			Env: env,
			DB:  db,
		}
		url.POST("/create", URLController.CreateUrl)
		url.POST("/list/:short", URLController.GetUrlByID)
		url.GET("/list", URLController.GetUrlList)
		url.GET("/increase_count", URLController.IncreaseUrlCount)
		url.GET("/analytics/clicks", URLController.GetClickAnalytics)
		url.POST("/analytics/clicstatsks", URLController.GetAnalytics)
	}

	return r
}
