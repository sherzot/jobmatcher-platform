package main

import (
	"log"
	"net/http"

	"github.com/go-chi/chi/v5"
	"github.com/go-chi/cors"
	"github.com/sherzot/jobmatcher-platform/backend/admin-service/internal/config"
	"github.com/sherzot/jobmatcher-platform/backend/admin-service/internal/db"
	"github.com/sherzot/jobmatcher-platform/backend/admin-service/internal/handlers"
	"github.com/sherzot/jobmatcher-platform/backend/admin-service/internal/middleware"
	"github.com/sherzot/jobmatcher-platform/backend/admin-service/internal/models"
)

func main() {
	cfg := config.Load()
	d := db.Connect(cfg.MysqlDSN)

	// Auto-migrate
	if err := d.AutoMigrate(&models.Admin{}); err != nil {
		log.Fatalf("migrate error: %v", err)
	}

	h := &handlers.AdminHandler{DB: d, JWTSecret: cfg.JWTSecret}
	r := chi.NewRouter()

	// CORS (frontend: 5173, 4173, 4000)
	r.Use(cors.Handler(cors.Options{
		AllowedOrigins:   []string{"http://localhost:5173", "http://127.0.0.1:5173", "http://localhost:4173", "http://127.0.0.1:4173", "http://localhost:4000", "http://127.0.0.1:4000"},
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
	r.Route("/api/v1/admin", func(r chi.Router) {
		r.Post("/login", h.Login)
		// protected:
		r.Group(func(r chi.Router) {
			r.Use(middleware.AdminAuth(cfg.JWTSecret))
			r.Get("/me", func(w http.ResponseWriter, r *http.Request) {
				if adminCode, ok := middleware.AdminCode(r); ok {
					h.Me(w, r, adminCode)
					return
				}
				http.Error(w, "unauthorized", http.StatusUnauthorized)
			})
			r.Get("/users", h.GetUsers)
			r.Get("/agents", h.GetAgents)
			r.Get("/companies", h.GetCompanies)
			r.Get("/jobs", h.GetJobs)
		})
	})

	log.Printf("admin-service listening on :%s", cfg.Port)
	log.Fatal(http.ListenAndServe(":"+cfg.Port, r))
}
