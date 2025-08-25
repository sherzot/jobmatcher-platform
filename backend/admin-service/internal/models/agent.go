package models

import (
	"time"

	"gorm.io/gorm"
)

type Agent struct {
	AgentCode    string         `json:"agent_code" gorm:"column:AgentCode;primaryKey;size:10;not null"`
	Name         string         `json:"name" gorm:"size:255;not null"`
	Email        string         `json:"email" gorm:"size:255;uniqueIndex;not null"`
	PasswordHash string         `json:"-" gorm:"size:255;not null"`
	Phone        string         `json:"phone" gorm:"size:20"`
	CompanyCode  string         `json:"company_code" gorm:"size:10;index"`
	CreatedAt    time.Time      `json:"created_at"`
	UpdatedAt    time.Time      `json:"updated_at"`
	DeletedAt    gorm.DeletedAt `json:"-" gorm:"index"`
}

// TableName specifies the table name for Agent
func (Agent) TableName() string {
	return "agents"
}
