package main

import (
	"log"
	"net/http"

	"github.com/go-chi/chi/v5"
	"github.com/go-chi/cors"
)

func main() {
	r := chi.NewRouter()

	// CORS (frontend: 4001, 4002, 4003)
	r.Use(cors.Handler(cors.Options{
		AllowedOrigins:   []string{"http://localhost:4001", "http://127.0.0.1:4001", "http://localhost:4002", "http://127.0.0.1:4002", "http://localhost:4003", "http://127.0.0.1:4003"},
		AllowedMethods:   []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowedHeaders:   []string{"Accept", "Authorization", "Content-Type", "X-CSRF-Token"},
		ExposedHeaders:   []string{"Link"},
		AllowCredentials: true,
		MaxAge:           300,
	}))

	// Health check
	r.Get("/healthz", func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-Type", "application/json")
		w.Write([]byte(`{"status":"ok","service":"admin-service"}`))
	})

	// Ping
	r.Get("/ping", func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-Type", "text/plain")
		w.Write([]byte("pong"))
	})

	log.Println("admin-service listening on :8084")
	log.Fatal(http.ListenAndServe(":8084", r))
}
