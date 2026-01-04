package utils

import (
	gonanoid "github.com/matoous/go-nanoid/v2"
)

func CreateShort() (string, error) {
	idCustom, err := gonanoid.Generate("abcdefghijklmnopqrstuvwxyz0123456789", 10)
	return idCustom, err
}
