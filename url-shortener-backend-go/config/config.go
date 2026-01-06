package config

import (
	"log"

	"github.com/spf13/viper"
)

type Env struct {
	AppEnv           string `mapstructure:"APP_ENV"`
	LogLevel         string `mapstructure:"LOG_LEVEL"`
	Port             string `mapstructure:"PORT"`
	JwtSecret        string `mapstructure:"JWT_SECRET"`
	JwtRefreshSecret string `mapstructure:"JWT_REFRESH_SECRET"`
	DbUrl            string `mapstructure:"DATABASE_URL"`
	Version          string `mapstructure:"VERSION"`
}

func NewEnv() *Env {
	env := Env{}
	viper.SetConfigFile(".env")
	err := viper.ReadInConfig()
	if err != nil {
		log.Fatal("Can't find the file .env : ", err)

	}

	err = viper.Unmarshal(&env)
	if err != nil {
		log.Fatal("Environment can't be loaded: ", err)

	}

	if env.AppEnv == "development" {
		log.Println("The App is running in development env")

	}

	return &env
}
