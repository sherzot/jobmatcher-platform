package models

import (
	"time"

	"gorm.io/gorm"
)

type Company struct {
	CompanyCode string         `json:"company_code" gorm:"column:CompanyCode;primaryKey;size:10;not null"`
	Name        string         `json:"name" gorm:"size:255;not null"`
	Email       string         `json:"email" gorm:"size:255;uniqueIndex;not null"`
	Phone       string         `json:"phone" gorm:"size:20"`
	Address     string         `json:"address" gorm:"size:500"`
	Website     string         `json:"website" gorm:"size:255"`
	AgentCode   string         `json:"agent_code" gorm:"size:10;index"`
	CreatedAt   time.Time      `json:"created_at"`
	UpdatedAt   time.Time      `json:"updated_at"`
	DeletedAt   gorm.DeletedAt `json:"-" gorm:"index"`
}

// TableName specifies the table name for Company
func (Company) TableName() string {
	return "companies"
}
