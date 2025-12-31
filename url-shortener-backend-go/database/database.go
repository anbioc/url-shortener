package database

import (
	"log"

	"github.com/anbioc/url-shortener/url-shortener-backend-go/config"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

func InitDB(env *config.Env) *gorm.DB {
	url := env.DbUrl
	db, err := gorm.Open(postgres.Open(url), &gorm.Config{})

	if err != nil {
		log.Fatalf("Failed to initialize database, got error: %v", err)
	}

	sqlDB, err := db.DB()

	sqlDB.SetMaxIdleConns(40)
	sqlDB.SetMaxOpenConns(30)
	sqlDB.SetConnMaxLifetime(11)

	if err != nil {
		log.Fatalf("Failed to configure database, got error: %v", err)
	}

	return db
}
