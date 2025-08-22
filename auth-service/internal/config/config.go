package config

import (
	"os"
)

type Config struct {
	Port      string
	MysqlDSN  string
	JWTSecret string
}

func Load() *Config {
	return &Config{
		Port:      getEnv("PORT", "8080"),
		MysqlDSN:  getEnv("MYSQL_DSN", "jm:jm_password@tcp(localhost:3306)/jobmatcher?parseTime=true&charset=utf8mb4&loc=Local"),
		JWTSecret: getEnv("JWT_SECRET", "local-super-secret"),
	}
}

func getEnv(key, defaultValue string) string {
	if value := os.Getenv(key); value != "" {
		return value
	}
	return defaultValue
}
