package models

import (
	"time"

	"gorm.io/gorm"
)

type User struct {
	StaffCode    string         `json:"staff_code" gorm:"column:StaffCode;primaryKey;size:10;not null"`
	Name         string         `json:"name" gorm:"size:255;not null"`
	Email        string         `json:"email" gorm:"size:255;uniqueIndex;not null"`
	PasswordHash string         `json:"-" gorm:"size:255;not null"`
	CreatedAt    time.Time      `json:"created_at"`
	UpdatedAt    time.Time      `json:"updated_at"`
	DeletedAt    gorm.DeletedAt `json:"-" gorm:"index"`
}

// TableName specifies the table name for User
func (User) TableName() string {
	return "users"
}
