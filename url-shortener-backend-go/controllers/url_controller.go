package controllers

import (
	"fmt"
	"log"
	"math/rand/v2"
	"net/http"

	applogger "github.com/anbioc/url-shortener/url-shortener-backend-go/logger"
	"github.com/anbioc/url-shortener/url-shortener-backend-go/service"
	"github.com/anbioc/url-shortener/url-shortener-backend-go/utils"
	"github.com/gin-gonic/gin"
)

type UrlController struct {
	Service *service.UrlService
	Logger  *applogger.Logger
}

func (uc *UrlController) CreateUrl(ctx *gin.Context) {
	var input struct {
		Url string `json:"url"`
	}

	if err := ctx.ShouldBindBodyWithJSON(&input); err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{
			"success": false,
			"data":    nil,
			"error":   err.Error(),
			"message": "Request missing a something!",
		})
		return
	}

	uid, _ := ctx.Get("user_id")
	userId, _ := utils.ConvertStringToUint(fmt.Sprintf("%v", uid))

	// insert url into db

	urlEntity, err := uc.Service.CreateUrl(input.Url, userId)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{
			"success": false,
			"data":    nil,
			"error":   err.Error(),
			"message": "Error saving url object into db",
		})
		return
	}

	ctx.JSON(http.StatusOK, gin.H{
		"success": true,
		"data":    urlEntity,
		"error":   nil,
		"message": "Url created",
	})

}

func (uc *UrlController) GetUrlList(ctx *gin.Context) {
	userId := utils.ExtractUserIdFromContext(ctx)

	urls, err := uc.Service.GetUrlList(userId)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{
			"success": false,
			"data":    nil,
			"error":   err.Error(),
			"message": "can't query url objects from db",
		})
		return
	}

	log.Printf("url lists: %s", urls[0].Url)

	ctx.JSON(http.StatusOK, gin.H{
		"success": true,
		"data":    urls,
		"error":   nil,
		"message": "Url created",
	})

}

func (uc *UrlController) GetUrlByID(ctx *gin.Context) {
	// 	type ListUsersQuery struct {
	//     Page    int    `form:"page"    binding:"omitempty,min=1"`           // optional, ≥1
	//     Limit   int    `form:"limit"   binding:"omitempty,min=1,max=100"`   // 1–100
	//     Sort    string `form:"sort"    binding:"omitempty,oneof=asc desc"`  // only asc or desc
	//     Search  string `form:"search"`                                         // no validation
	// }
	// var q ListUsersQuery

	// validate json

	short := ctx.Param("short")
	if short == "" {
		ctx.JSON(http.StatusBadRequest, gin.H{
			"success": false,
			"data":    nil,
			"error":   "Please provide short id",
			"message": "bad request",
		})
	}

	url, err := uc.Service.GetUrlByShort(short)

	log.Println("url: " + url.Url)

	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{
			"success": false,
			"data":    nil,
			"error":   err.Error(),
			"message": "Can't find the url with provided short: " + short,
		})
		return
	}

	ctx.JSON(http.StatusOK, gin.H{
		"success": true,
		"data":    url,
		"error":   nil,
		"message": "Url by short id: " + short,
	})
}

func (uc *UrlController) IncreaseUrlCount(ctx *gin.Context) {
	short := ctx.Param("short")

	if short == "" {
		ctx.JSON(http.StatusInternalServerError, gin.H{
			"success": false,
			"data":    nil,
			"error":   "Provide the short id",
			"message": "Bad request, please provide the short id ",
		})
		return
	}

	url, err := uc.Service.IncreaseCount(short)

	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{
			"success": false,
			"data":    nil,
			"error":   err.Error(),
			"message": "Can't increment url short",
		})
		return
	}

	ctx.JSON(http.StatusOK, gin.H{
		"success": true,
		"data":    url,
		"error":   nil,
		"message": "Url count updated",
	})

}

func (uc *UrlController) GetClickAnalytics(ctx *gin.Context) {
	userId := utils.ExtractUserIdFromContext(ctx)

	clicks, urlCount, err := uc.Service.GetClickAnalytics(userId)

	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{
			"success": false,
			"data":    nil,
			"error":   err.Error(),
			"message": "Can't increment url short",
		})
		return
	}

	ctx.JSON(http.StatusOK, gin.H{
		"success": true,
		"data": gin.H{
			"clicks": clicks,
			"urls":   urlCount,
			"sales":  0,
			"leads":  0,
		},
		"error":   nil,
		"message": "Url count updated",
	})

}

func (uc *UrlController) GetAnalytics(ctx *gin.Context) {

	var dto service.AnalyticsDTO

	userId := utils.ExtractUserIdFromContext(ctx)

	if err := ctx.ShouldBindJSON(&dto); err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{
			"success": false,
			"data":    nil,
			"err":     err.Error(),
			"message": "Please send a correct form of analytics DTO",
		})
		return
	}

	stats, total, err := uc.Service.GetAnalytics(userId, &dto)

	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{
			"success": false,
			"data":    nil,
			"error":   err.Error(),
			"message": "Can't process the analytics",
		})
		return
	}

	ctx.JSON(http.StatusOK, gin.H{
		"success": true,
		"data": gin.H{
			"stats":        stats,
			"total_clicks": total,
			"leads":        rand.IntN(300),
			"sales":        rand.IntN(300),
		},
		"error":   nil,
		"message": "Clicks per day",
	})

}
