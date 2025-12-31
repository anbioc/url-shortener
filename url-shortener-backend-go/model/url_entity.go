package model

import "time"

type Url struct {
	// gorm.Model
	ID        uint `gorm:"primarykey"`
	CreatedAt time.Time
	UpdatedAt time.Time
	url       string `gorm:"size:255;not null"`
	short     string `gorm:"size:255;not null"`
	clicks    uint   `gorm:"-;default:0"`
	User      User
	UserId    uint
}
