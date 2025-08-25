package models

import (
	"time"

	"gorm.io/gorm"
)

type Job struct {
	OrderCode   string         `json:"order_code" gorm:"column:OrderCode;primaryKey;size:10;not null"`
	Title       string         `json:"title" gorm:"size:255;not null"`
	Description string         `json:"description" gorm:"type:text"`
	Requirements string        `json:"requirements" gorm:"type:text"`
	Salary      string         `json:"salary" gorm:"size:100"`
	Location    string         `json:"location" gorm:"size:255"`
	Type        string         `json:"type" gorm:"size:50"` // full-time, part-time, contract
	Status      string         `json:"status" gorm:"size:20;default:'active'"` // active, closed, draft
	CompanyCode string         `json:"company_code" gorm:"size:10;index"`
	AgentCode   string         `json:"agent_code" gorm:"size:10;index"`
	CreatedAt   time.Time      `json:"created_at"`
	UpdatedAt   time.Time      `json:"updated_at"`
	DeletedAt   gorm.DeletedAt `json:"-" gorm:"index"`
}

// TableName specifies the table name for Job
func (Job) TableName() string {
	return "jobs"
}
