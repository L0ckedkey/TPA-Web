package databaseUtil

import (
	"backend/model"
	"fmt"

	"github.com/go-pg/pg"
	"github.com/go-pg/pg/orm"
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
