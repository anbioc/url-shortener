package model

import (
	"database/sql/driver"
	"errors"
	"fmt"
	"time"
)

type UserRole string

const (
	USER  UserRole = "user"
	ADMIN UserRole = "admin"
)

func (u UserRole) String() string {
	return string(u)
}

func (u UserRole) IsValid() bool {
	switch u {
	case USER, ADMIN:
		return true
	}
	return false
}

// Value — sql/driver.Valuer interface (writes to DB)
func (u UserRole) Value() (driver.Value, error) {
	return string(u), nil
}

// Scan — sql.Scanner interface (reads from DB)
func (s *UserRole) Scan(value interface{}) error {
	if value == nil {
		*s = "" // or your default value
		return nil
	}

	str, ok := value.(string)
	if !ok {
		// PostgreSQL + GORM sometimes gives []byte
		bytes, ok2 := value.([]byte)
		if !ok2 {
			return errors.New("invalid type for OrderStatus")
		}
		str = string(bytes)
	}

	*s = UserRole(str)
	if !s.IsValid() {
		return fmt.Errorf("invalid OrderStatus value: %s", str)
	}
	return nil
}

type User struct {
	ID           uint      `gorm:"primarykey"`
	CreatedAt    time.Time `gorm:"column:createdAt;autoCreateTime"`
	UpdatedAt    time.Time `gorm:"column:updatedAt;autoCreateTime"`
	Email        string    `gorm:"size:255;uniqueIndex;not null" json:"email"`
	Fullname     string    `gorm:"size:255;" json:"fullname"`
	Password     string    `gorm:"size:255;not null" json:"-"`
	Role         UserRole  `gorm:"type:varchar(20);not null;default:'user';index"`
	RefreshToken string    `gorm:"column:refreshToken;size:255;" json:"-"`
	Urls         []Url

	// ... fields
}

func (User) TableName() string {
	return "user"
}
