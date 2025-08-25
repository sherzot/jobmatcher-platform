package middleware

import (
	"context"
	"net/http"
	"strings"

	"github.com/sherzot/jobmatcher-platform/backend/auth-service/internal/jwtutil"
)

type ctxKey string

const CtxUserStaffCode ctxKey = "staff_code"

func Auth(secret string) func(http.Handler) http.Handler {
	return func(next http.Handler) http.Handler {
		return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			h := r.Header.Get("Authorization")
			if h == "" || !strings.HasPrefix(h, "Bearer ") {
				http.Error(w, "missing bearer token", http.StatusUnauthorized)
				return
			}
			token := strings.TrimPrefix(h, "Bearer ")
			claims, err := jwtutil.Parse(token, secret)
			if err != nil {
				http.Error(w, "invalid token", http.StatusUnauthorized)
				return
			}
			ctx := context.WithValue(r.Context(), CtxUserStaffCode, claims.UserStaffCode)
			next.ServeHTTP(w, r.WithContext(ctx))
		})
	}
}

func UserStaffCode(r *http.Request) (string, bool) {
	v := r.Context().Value(CtxUserStaffCode)
	if v == nil {
		return "", false
	}
	staffCode, _ := v.(string)
	return staffCode, true
}
