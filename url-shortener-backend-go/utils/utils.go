package utils

import (
	"fmt"
	"math"
	"strconv"

	"github.com/gin-gonic/gin"
)

func ConvertStringToUint(str string) (uint, error) {
	u64, err := strconv.ParseUint(str, 10, 64)

	return uint(u64), err
}

func ConvertFloat64ToUint(f float64) uint {
	return uint(math.Trunc(f))
}

func ExtractUserIdFromContext(ctx *gin.Context) uint {
	uid, _ := ctx.Get("user_id")
	userId, _ := ConvertStringToUint(fmt.Sprintf("%v", uid))

	return userId
}

func reduce[T, R any](slice []T, initial R, fn func(accumulator R, item T) R) R {
	result := initial
	for _, v := range slice {
		result = fn(result, v)
	}
	return result
}
