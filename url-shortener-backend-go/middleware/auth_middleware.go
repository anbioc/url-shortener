package middleware

import (
	"net/http"

	"github.com/anbioc/url-shortener/url-shortener-backend-go/config"
	"github.com/anbioc/url-shortener/url-shortener-backend-go/utils"
	"github.com/gin-gonic/gin"
)

func AuthMiddleware(env *config.Env) gin.HandlerFunc {

	return func(ctx *gin.Context) {
		token := ctx.GetHeader("Authorization")
		if token == "" {
			ctx.JSON(http.StatusUnauthorized, gin.H{
				"data":    nil,
				"error":   "No authorization token",
				"message": "No authorization token, please login and provide auth token inside header",
			})
			ctx.Abort()
			return
		}

		if len(token) > 7 && token[:7] == "Bearer " {
			token = token[7:]
		}
		id, err := utils.VerifyAccessToken(env, token)

		if err != nil {
			ctx.JSON(http.StatusUnauthorized, gin.H{
				"data":    nil,
				"error":   "Invalid auth token",
				"message": "Invalid auth token, please login and provide auth token inside header",
			})
			ctx.Abort()
			return
		}

		ctx.Set("user_id", id)
		ctx.Next()
	}
}
