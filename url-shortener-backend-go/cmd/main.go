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
	"github.com/anbioc/url-shortener/url-shortener-backend-go/router"
)

func main() {
	env := config.NewEnv()
	db := database.InitDB(env)
	// init redis later

	routes := router.SetupRouter(db, env)

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
			log.Fatalf("listen: %s\n", err)

		}
	}()

	quit := make(chan os.Signal, 1)
	signal.Notify(quit, os.Interrupt)
	<-quit
	log.Println("Shutdown Server ...")
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()
	if err := srv.Shutdown(ctx); err != nil {
		log.Fatal("Server Shutdown:", err)

	}
	log.Println("Server exiting")

}
