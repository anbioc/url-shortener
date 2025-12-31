package utils

import (
	"time"

	"github.com/anbioc/url-shortener/url-shortener-backend-go/config"
	"github.com/golang-jwt/jwt"
	"golang.org/x/crypto/bcrypt"
)

func HashPassword(pass string) (string, error) {
	hash, nil := bcrypt.GenerateFromPassword([]byte(pass), 12)
	return string(hash), nil

}

func GenerateTokens(env *config.Env, email string, id uint, role string) (string, string, error) {

	token, tokenErr := GenerateJWT(env, email, id, role)
	refreshToken, refreshErr := GenerateRefreshJWT(env, email, id, role)
	var err error
	if tokenErr != nil {
		err = tokenErr
	} else {
		err = refreshErr
	}

	return token, refreshToken, err

}
func GenerateJWT(env *config.Env, email string, id uint, role string) (string, error) {
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
		"email": email,
		"sub":   id,
		"role":  role,
		"exp":   time.Now().Add(time.Hour * 1).Unix(),
	})

	signedToken, err := token.SignedString([]byte(env.JwtSecret))
	return signedToken, err

}

func GenerateRefreshJWT(env *config.Env, email string, id uint, role string) (string, error) {
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
		"sub": id,
		"exp": time.Now().Add(time.Hour * 24 * 7).Unix(),
	})

	signedToken, err := token.SignedString([]byte(env.JwtRefreshSecret))
	return signedToken, err

}

func CheckPassword(input string, hash string) bool {
	err := bcrypt.CompareHashAndPassword([]byte(hash), []byte(input))
	return err != nil
}
func VerifyAccessToken(env *config.Env, accessToken string) (uint, error) {
	return 10, nil
}

func VerifyRefreshToken(env *config.Env, refreshToken string) (uint, error) {
	return 10, nil
}
func ptr[T any](v T) *T {
	return &v
}

func firstNonNil[T any](a, b *T) *T {
	if a != nil {
		return a
	}
	return b // might be nil, that's fine
}
