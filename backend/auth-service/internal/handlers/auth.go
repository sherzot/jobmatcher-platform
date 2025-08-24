package handlers

import (
	"encoding/json"
	"net/http"
	"strings"
	"time"

	"github.com/sherzot/jobmatcher-platform/auth-service/internal/jwtutil"
	"github.com/sherzot/jobmatcher-platform/auth-service/internal/models"
	"golang.org/x/crypto/bcrypt"
	"gorm.io/gorm"
)

type AuthHandler struct {
	DB        *gorm.DB
	JWTSecret string
}

func (h *AuthHandler) Healthz(w http.ResponseWriter, r *http.Request) {
	w.Write([]byte("ok"))
}

type registerReq struct {
	Name     string `json:"name"`
	Email    string `json:"email"`
	Password string `json:"password"`
}

func (h *AuthHandler) Register(w http.ResponseWriter, r *http.Request) {
	var in registerReq
	if err := json.NewDecoder(r.Body).Decode(&in); err != nil {
		http.Error(w, "bad request", http.StatusBadRequest); return
	}
	in.Email = strings.ToLower(strings.TrimSpace(in.Email))
	if in.Name == "" || in.Email == "" || len(in.Password) < 6 {
		http.Error(w, "invalid payload", http.StatusBadRequest); return
	}
	var exists int64
	h.DB.Model(&models.User{}).Where("email = ?", in.Email).Count(&exists)
	if exists > 0 {
		http.Error(w, "email already registered", http.StatusConflict); return
	}
	hash, _ := bcrypt.GenerateFromPassword([]byte(in.Password), bcrypt.DefaultCost)
	u := models.User{Name: in.Name, Email: in.Email, PasswordHash: string(hash)}
	if err := h.DB.Create(&u).Error; err != nil {
		http.Error(w, "db error", http.StatusInternalServerError); return
	}
	// auto login response (optional)
	token, exp, _ := jwtutil.Sign(u.ID, u.Email, h.JWTSecret, 24*time.Hour)
	writeJSON(w, http.StatusCreated, map[string]any{
		"access_token": token,
		"token_type":   "Bearer",
		"expires_at":   exp.UTC(),
		"user":         map[string]any{"id": u.ID, "name": u.Name, "email": u.Email},
	})
}

type loginReq struct {
	Email    string `json:"email"`
	Password string `json:"password"`
}

func (h *AuthHandler) Login(w http.ResponseWriter, r *http.Request) {
	var in loginReq
	if err := json.NewDecoder(r.Body).Decode(&in); err != nil {
		http.Error(w, "bad request", http.StatusBadRequest); return
	}
	in.Email = strings.ToLower(strings.TrimSpace(in.Email))
	var u models.User
	if err := h.DB.Where("email = ?", in.Email).First(&u).Error; err != nil {
		http.Error(w, "invalid credentials", http.StatusUnauthorized); return
	}
	if err := bcrypt.CompareHashAndPassword([]byte(u.PasswordHash), []byte(in.Password)); err != nil {
		http.Error(w, "invalid credentials", http.StatusUnauthorized); return
	}
	token, exp, _ := jwtutil.Sign(u.ID, u.Email, h.JWTSecret, 24*time.Hour)
	writeJSON(w, http.StatusOK, map[string]any{
		"access_token": token,
		"token_type":   "Bearer",
		"expires_at":   exp.UTC(),
		"user":         map[string]any{"id": u.ID, "name": u.Name, "email": u.Email},
	})
}

func (h *AuthHandler) Me(w http.ResponseWriter, r *http.Request, userID uint) {
	var u models.User
	if err := h.DB.First(&u, userID).Error; err != nil {
		http.Error(w, "not found", http.StatusNotFound); return
	}
	writeJSON(w, http.StatusOK, map[string]any{"id": u.ID, "name": u.Name, "email": u.Email})
}

func writeJSON(w http.ResponseWriter, code int, v any) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(code)
	_ = json.NewEncoder(w).Encode(v)
}

