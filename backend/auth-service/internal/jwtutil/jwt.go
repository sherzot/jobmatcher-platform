package jwtutil

import (
	"time"

	"github.com/golang-jwt/jwt/v5"
)

type Claims struct {
	UserStaffCode string `json:"staff_code"`
	Email         string `json:"email"`
	jwt.RegisteredClaims
}

func Sign(userStaffCode, email, secret string, ttl time.Duration) (string, time.Time, error) {
	now := time.Now()
	exp := now.Add(ttl)
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, Claims{
		UserStaffCode: userStaffCode,
		Email:         email,
		RegisteredClaims: jwt.RegisteredClaims{
			Subject:   email,
			ExpiresAt: jwt.NewNumericDate(exp),
			IssuedAt:  jwt.NewNumericDate(now),
		},
	})
	s, err := token.SignedString([]byte(secret))
	return s, exp, err
}

func Parse(tokenStr, secret string) (*Claims, error) {
	tok, err := jwt.ParseWithClaims(tokenStr, &Claims{}, func(t *jwt.Token) (interface{}, error) {
		return []byte(secret), nil
	})
	if err != nil {
		return nil, err
	}
	if c, ok := tok.Claims.(*Claims); ok && tok.Valid {
		return c, nil
	}
	return nil, jwt.ErrTokenInvalidClaims
}
