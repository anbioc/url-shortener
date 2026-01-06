package model

import "time"

type Url struct {
	// gorm.Model
	ID        uint      `gorm:"primarykey" json:"id"`
	CreatedAt time.Time `gorm:"column:createdAt;autoCreateTime" json:"createdAt"`
	UpdatedAt time.Time `gorm:"column:updatedAt;autoCreateTime" json:"UpdatedAt"`
	Url       string    `gorm:"size:255;not null"  json:"url"`
	Short     string    `gorm:"size:255;not null" json:"short"`
	Clicks    uint      `gorm:"default:0" json:"clicks"`
	User      User
	UserId    uint `gorm:"column:userId;index" json:"userId"`
}

func (Url) TableName() string {
	return "url"
}
