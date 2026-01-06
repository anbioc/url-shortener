package service

import (
	"os"

	"github.com/anbioc/url-shortener/url-shortener-backend-go/config"
	applogger "github.com/anbioc/url-shortener/url-shortener-backend-go/logger"
	"github.com/anbioc/url-shortener/url-shortener-backend-go/model"
	"github.com/anbioc/url-shortener/url-shortener-backend-go/utils"
	"gorm.io/gorm"
)

type UrlService struct {
	env    *config.Env
	db     *gorm.DB
	logger *applogger.Logger
}

type AnalyticsDTO struct {
	To   string `json:"to"`
	From string `json:"from"`
}

func NewService(env *config.Env, db *gorm.DB, logger *applogger.Logger) *UrlService {
	return &UrlService{
		env:    env,
		db:     db,
		logger: logger,
	}
}

func (service *UrlService) GetUrlList(userId uint) ([]model.Url, error) {
	var urls []model.Url
	var user model.User

	err := service.db.Preload("Urls").Where("id = ?", userId).First(&user).Error
	urls = user.Urls

	// for _, n := range urls {
	// 	log.Printf("url userid: %d and url: %v", n.UserId, n.Url)
	// }

	return urls, err
}

func (service *UrlService) CreateUrl(url string, userId uint) (model.Url, error) {
	var urlEntity model.Url

	urlEntity.Url = url
	urlEntity.Short, _ = utils.CreateShort()
	urlEntity.UserId = userId
	urlEntity.Clicks = 0

	if os.Getenv("ENV") == "production" {
		if err := service.db.AutoMigrate(&urlEntity); err != nil {

			return urlEntity, err
		}
	}

	if err := service.db.Create(&urlEntity).Error; err != nil {
		return urlEntity, err
	}

	return urlEntity, nil

}

func (service *UrlService) GetUrlByShort(short string) (model.Url, error) {
	var url model.Url

	err := service.db.Preload("User").Where("Short = ?", short).First(&url).Error

	return url, err
}

func (service *UrlService) IncreaseCount(short string) (model.Url, error) {
	var url model.Url

	err := service.db.Model(
		&model.Url{}).Where(
		"Short = ?", short).UpdateColumn(
		"Clicks", gorm.Expr("Clicks + ?", 1)).First(&url).Error

	return url, err
}

func (service *UrlService) GetClickAnalytics(userId uint) (int, int, error) {

	var user model.User

	err := service.db.Preload("Urls").Where("id = ?", userId).First(&user).Error

	if err != nil {
		return 0, 0, err
	}

	if len(user.Urls) == 0 {
		return 0, 0, err
	}

	var clicks = 0
	var urlCount = 0

	for _, item := range user.Urls {
		clicks += int(item.Clicks)
		urlCount++

	}

	return clicks, urlCount, nil

}

func (service *UrlService) GetAnalytics(userId uint, analyticsDTO *AnalyticsDTO) (map[string]int, int, error) {
	// var user model.User
	var urls []model.Url

	err := service.db.Where(`"userId" = ?`, userId).Order(`"createdAt" DESC`).Find(&urls).Error

	if err != nil {
		return map[string]int{}, 0, err
	}

	acc := make(map[string]int)
	total := 0

	for _, url := range urls {
		// dateKey := strings.Split(url.UpdatedAt.Format(time.RFC3339), "T")[0]
		dateKey := url.UpdatedAt.Format("2006-03-02")
		if _, ok := acc[dateKey]; !ok {
			acc[dateKey] = 0
		}

		acc[dateKey] = acc[dateKey] + int(url.Clicks)

		total += int(url.Clicks)

	}

	return acc, total, nil

}
