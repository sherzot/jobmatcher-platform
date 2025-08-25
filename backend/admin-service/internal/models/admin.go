package models

import (
	"time"

	"gorm.io/gorm"
)

type Admin struct {
	AdminCode    string         `json:"admin_code" gorm:"column:AdminCode;primaryKey;size:10;not null"`
	Name         string         `json:"name" gorm:"size:255;not null"`
	Email        string         `json:"email" gorm:"size:255;uniqueIndex;not null"`
	PasswordHash string         `json:"-" gorm:"size:255;not null"`
	CreatedAt    time.Time      `json:"created_at"`
	UpdatedAt    time.Time      `json:"updated_at"`
	DeletedAt    gorm.DeletedAt `json:"-" gorm:"index"`
}
