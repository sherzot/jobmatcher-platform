package main

import (
	"log"
	"net/http"

	"github.com/go-chi/chi/v5"
	"github.com/go-chi/cors"
	"github.com/sherzot/jobmatcher-platform/backend/auth-service/internal/config"
	"github.com/sherzot/jobmatcher-platform/backend/auth-service/internal/db"
	"github.com/sherzot/jobmatcher-platform/backend/auth-service/internal/handlers"
	"github.com/sherzot/jobmatcher-platform/backend/auth-service/internal/middleware"
)

func main() {
	cfg := config.Load()
	d := db.Connect(cfg.MysqlDSN)

	// Manual migration - GORM AutoMigrate o'rniga
	// users jadvali allaqachon mavjud va StaffCode primary key
	log.Println("Database connected successfully - skipping AutoMigrate")

	h := &handlers.AuthHandler{DB: d, JWTSecret: cfg.JWTSecret}
	r := chi.NewRouter()

	// CORS (frontend: 5173, 4173, 4000, 4001, 4002, 4003, 3001)
	r.Use(cors.Handler(cors.Options{
		AllowedOrigins:   []string{"http://localhost:5173", "http://127.0.0.1:5173", "http://localhost:4173", "http://127.0.0.1:4173", "http://localhost:4000", "http://127.0.0.1:4000", "http://localhost:3001", "http://127.0.0.1:3001", "http://localhost:4002", "http://127.0.0.1:4002", "http://localhost:4003", "http://127.0.0.1:4003"},
		AllowedMethods:   []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowedHeaders:   []string{"Accept", "Authorization", "Content-Type", "X-CSRF-Token"},
		ExposedHeaders:   []string{"Link"},
		AllowCredentials: true,
		MaxAge:           300,
	}))

	r.Get("/healthz", h.Healthz)
	r.Get("/ping", func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-Type", "text/plain; charset=utf-8")
		w.Write([]byte("pong"))
	})

	// API v1
	r.Route("/api/v1/auth", func(r chi.Router) {
		r.Post("/register", h.Register)
		r.Post("/login", h.Login)
		// protected:
		r.Group(func(r chi.Router) {
			r.Use(middleware.Auth(cfg.JWTSecret))
			r.Get("/me", func(w http.ResponseWriter, r *http.Request) {
				if staffCode, ok := middleware.UserStaffCode(r); ok {
					h.Me(w, r, staffCode)
					return
				}
				http.Error(w, "unauthorized", http.StatusUnauthorized)
			})
		})
	})

	log.Printf("auth-service listening on :%s", cfg.Port)
	log.Fatal(http.ListenAndServe(":"+cfg.Port, r))
}
