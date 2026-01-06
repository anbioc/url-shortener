package main

import (
	"context"
	"log"
	"net/http"
	"os"
	"os/signal"
	"time"

	"github.com/anbioc/url-shortener/url-shortener-backend-go/config"
	"github.com/anbioc/url-shortener/url-shortener-backend-go/database"
	applogger "github.com/anbioc/url-shortener/url-shortener-backend-go/logger"
	"github.com/anbioc/url-shortener/url-shortener-backend-go/router"
)

func main() {
	env := config.NewEnv()
	db := database.InitDB(env)
	logger := applogger.New(env.LogLevel)
	// init redis later

	ctx := context.Background()
	ctx = context.WithValue(ctx, "serviceName", "url shortener service")
	ctx = context.WithValue(ctx, "version", env.Version)

	routes := router.SetupRouter(db, env, logger)

	port := env.Port
	if port == "" {
		port = ":8888"
	}
	srv := &http.Server{
		Addr:    port,
		Handler: routes,
	}

	go func() {
		if err := srv.ListenAndServe(); err != nil && err != http.ErrServerClosed {
			logger.Fatal("listen: %s\n", err)

		}
	}()

	quit := make(chan os.Signal, 1)
	signal.Notify(quit, os.Interrupt)
	<-quit
	log.Println("Shutdown Server ...")
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()
	if err := srv.Shutdown(ctx); err != nil {
		logger.Fatal("Server Shutdown:", err)

	}
	logger.Info("Server exiting")

}
