package models

import (
	"time"

	"gorm.io/gorm"
)

type User struct {
	StaffCode    string         `json:"staff_code" gorm:"column:StaffCode;primaryKey;size:10;not null"`
	Name         string         `json:"name" gorm:"column:name;size:255;not null"`
	Email        string         `json:"email" gorm:"column:email;size:255;uniqueIndex;not null"`
	PasswordHash string         `json:"-" gorm:"column:password_hash;size:255;not null"`
	CreatedAt    time.Time      `json:"created_at" gorm:"column:created_at"`
	UpdatedAt    time.Time      `json:"updated_at" gorm:"column:updated_at"`
	DeletedAt    gorm.DeletedAt `json:"-" gorm:"column:deleted_at;index"`
}
