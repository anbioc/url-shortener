package controllers

import (
	"log"
	"net/http"
	"os"

	"github.com/anbioc/url-shortener/url-shortener-backend-go/config"
	"github.com/anbioc/url-shortener/url-shortener-backend-go/model"
	"github.com/anbioc/url-shortener/url-shortener-backend-go/utils"
	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

type AuthController struct {
	Env *config.Env
	DB  *gorm.DB
}

func (ac *AuthController) Register(ctx *gin.Context) {
	var user model.User
	log.Println(ctx.Request.URL.RawQuery)
	if err := ctx.ShouldBindJSON(&user); err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"data": nil,
			"error":   err.Error(),
			"message": "Error binding json to user model"})
		return
	}

	hassPassword, err := utils.HashPassword(user.Password)

	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{
			"data":    nil,
			"error":   err.Error(),
			"message": "Can't has the password",
		})
		return
	}

	user.Password = hassPassword
	token, refreshToken, err := utils.GenerateTokens(ac.Env, user.Email, user.ID, user.Role.String())

	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{
			"data":    nil,
			"error":   err.Error(),
			"message": "Can't generate jwt token",
		})
		return
	}

	if os.Getenv("ENV") == "production" {
		if err := ac.DB.AutoMigrate(&user); err != nil {
			ctx.JSON(http.StatusInternalServerError, gin.H{
				"data":    nil,
				"error":   err.Error(),
				"message": "Can't automigrate user schema",
			})
			return
		}
	}
	if err := ac.DB.Create(&user).Error; err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{
			"data":    nil,
			"error":   err.Error(),
			"message": "Can't create user column",
		})
		return
	}

	ctx.JSON(http.StatusOK, gin.H{
		"data": gin.H{
			"user":         user,
			"accessToken":  token,
			"refreshToken": refreshToken,
		},
		"error":   nil,
		"message": "User registered",
	})

}

func (ac *AuthController) Login(ctx *gin.Context) {

	var input struct {
		Email    string `json:"email"`
		Password string `json:"password"`
	}

	if err := ctx.ShouldBindJSON(&input); err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{
			"data":    nil,
			"error":   err.Error(),
			"message": "Request missing a something!",
		})
		return
	}

	var user model.User
	if err := ac.DB.Where(`email = ?`, input.Email).First(&user).Error; err != nil {
		ctx.JSON(http.StatusUnauthorized, gin.H{
			"data":    nil,
			"error":   err.Error(),
			"message": "User not found!, did you already register?",
		})
		return
	}

	if !utils.CheckPassword(input.Password, user.Password) {
		ctx.JSON(http.StatusUnauthorized, gin.H{
			"data":    nil,
			"error":   "Password is incorrect!",
			"message": "Wrong credentials",
		})
		return
	}

	token, refreshToken, err := utils.GenerateTokens(ac.Env, user.Email, user.ID, user.Role.String())

	// save refresh token
	if err := ac.DB.Model(&user).Update("refreshToken", refreshToken).Error; err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{
			"data":    nil,
			"error":   err.Error(),
			"message": "Can't update user model, adding refresh token",
		})
		return
	}

	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{
			"data":    nil,
			"error":   err.Error(),
			"message": "Can't create jwt token",
		})
		return
	}

	ctx.JSON(http.StatusOK, gin.H{
		"data": gin.H{
			"accessToken":  token,
			"refreshToken": refreshToken,
			"user":         user,
		},
		"error":   nil,
		"message": "Login successful",
	})

}

func (ac *AuthController) RefreshToken(ctx *gin.Context) {
	// find user with refresh token
	var refresh struct {
		RefreshToken string `json:"refreshtoken"`
	}

	if err := ctx.ShouldBindJSON(&refresh); err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{
			"data":    nil,
			"error":   err.Error(),
			"message": "Bad request sent to the server",
		})
		return
	}

	userId, err := utils.VerifyRefreshToken(ac.Env, refresh.RefreshToken)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{
			"data":    nil,
			"error":   err.Error(),
			"message": "Can't verify refresh token",
		})
		return
	}

	var user model.User

	if err := ac.DB.Where("id = ?", userId).First(&user).Error; err != nil {
		ctx.JSON(http.StatusNotFound, gin.H{
			"data":    nil,
			"error":   err.Error(),
			"message": "Can't find the user",
		})
		return
	}

	if user.RefreshToken != refresh.RefreshToken {
		ctx.JSON(http.StatusBadRequest, gin.H{
			"data":    nil,
			"error":   "Wrong or corrupt refresh token",
			"message": "Wrong or corrupt refresh token user: " + user.RefreshToken + " token: " + refresh.RefreshToken,
		})
		return
	}

	token, refreshToken, err := utils.GenerateTokens(ac.Env, user.Email, user.ID, user.Role.String())

	ctx.JSON(http.StatusOK, gin.H{
		"data": gin.H{
			"accessToken":  token,
			"refreshToken": refreshToken,
			"user":         user,
		},
		"error":   nil,
		"message": "Login successful",
	})
}

func (ac *AuthController) Signout(ctx *gin.Context) {
	// delete user
	userId, exists := ctx.Get("user_id")
	if !exists {
		ctx.JSON(http.StatusInternalServerError, gin.H{
			"data":    nil,
			"error":   "No userid found inside server",
			"message": "No user id found inside server",
		})
		return
	}

	var user model.User
	if err := ac.DB.Model(&user).Where("id = ?", userId).Update("refreshToken", "").Error; err != nil {
		ctx.JSON(http.StatusNotFound, gin.H{
			"data":    nil,
			"error":   err.Error(),
			"message": "Can't update refresh token",
		})
		return
	}

	ctx.JSON(http.StatusOK, gin.H{
		"data":    user,
		"error":   nil,
		"message": "signOut successful successful",
	})

}
