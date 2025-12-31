package controllers

import (
	"net/http"

	"github.com/anbioc/url-shortener/url-shortener-backend-go/config"
	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

type UrlController struct {
	Env *config.Env
	DB  *gorm.DB
}

func (uc *UrlController) CreateUrl(ctx *gin.Context) {
	ctx.JSON(http.StatusOK, gin.H{"token": "token"})
}

func (uc *UrlController) GetUrlByID(ctx *gin.Context) {}

func (uc *UrlController) GetUrlList(ctx *gin.Context) {}

func (uc *UrlController) IncreaseUrlCount(ctx *gin.Context) {

}

func (uc *UrlController) GetClickAnalytics(ctx *gin.Context) {}

func (uc *UrlController) GetAnalytics(ctx *gin.Context) {}
