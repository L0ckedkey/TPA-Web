package databaseUtil

import (
	"backend/model"
	"fmt"

	"github.com/go-pg/pg/v10"
	"github.com/go-pg/pg/v10/orm"
)

func CreateSchema(db *pg.DB) error {
	models := []interface{}{
		(*model.Account)(nil),
		(*model.Brand)(nil),
		(*model.ProductCategory)(nil),
		(*model.Shop)(nil),
		(*model.ProductSubCategory)(nil),
		(*model.ProductSubCategoryDetail)(nil),
		(*model.Product)(nil),
		(*model.Promo)(nil),
		(*model.Cart)(nil),
		(*model.WishlistHeader)(nil),
		(*model.WishlistDetail)(nil),
		(*model.Banner)(nil),
		(*model.AdminBanner)(nil),
		(*model.Chat)(nil),
		(*model.CustomerServiceChat)(nil),
		(*model.OrderHeader)(nil),
		(*model.OrderDetail)(nil),
		(*model.Address)(nil),
		(*model.UsedPromo)(nil),
		(*model.ReviewProduct)(nil),
		(*model.ReviewShop)(nil),
		(*model.FollowedWishlist)(nil),
		(*model.ReviewWishlist)(nil),
		(*model.HelpfullReview)(nil),
		(*model.Message)(nil),
		(*model.SaveForLater)(nil),
		(*model.ChatHeader)(nil),
		(*model.ChatDetail)(nil),
		(*model.CustomerServiceReview)(nil),
		
	}
	fmt.Println("make schema")
	for _, model := range models {
		err := db.Model(model).CreateTable(&orm.CreateTableOptions{
			IfNotExists: true,
		})
		if err != nil {
			return err
		}
	}
	return nil
}

func GetConnection() *pg.DB {
	// dsn := "host=localhost user=postgres password=hans dbname=newEgg port=5432 sslmode=disable TimeZone=Asia/Shanghai"
	// db, err := gorm.Open(postgres.Open(dsn), &gorm.Config{})

	// if err != nil {
	// 	fmt.Println(err)
	// 	panic(fmt.Errorf("Cannot connect to database!"))
	// }

	data := &pg.Options{
		Addr:     ":5432",
		User:     "postgres",
		Password: "hans",
		Database: "newEgg",
	}

	var db *pg.DB = pg.Connect(data)
	if db == nil {
		fmt.Printf("Database connection failed.\n")
	}

	fmt.Printf("Connect successful.\n")

	if err := CreateSchema(db); err != nil {
		fmt.Println(err)
	}

	return db
}
