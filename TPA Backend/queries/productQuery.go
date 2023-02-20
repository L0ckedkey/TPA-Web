package query

import (
	databaseUtil "backend/database"
	"backend/model"
	"encoding/json"
	"fmt"
	"net/http"
	"strconv"

	"github.com/gorilla/mux"
)

func CreateProduct(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Access-Control-Allow-Methods", "GET, POST, PATCH, PUT, DELETE, OPTIONS")
	w.Header().Set("Access-Control-Allow-Headers:", "Origin, Content-Type, X-Auth-Token, Authorization")
	w.Header().Set("Content-Type", "application/json")

	var db = databaseUtil.GetConnection()

	params := mux.Vars(r)
	ProductName := r.URL.Query().Get("name")
	Price, err := strconv.Atoi(r.URL.Query().Get("price"))
	if err != nil {
		fmt.Println(err)
	}

	stock, err := strconv.Atoi(r.URL.Query().Get("stock"))
	if err != nil {
		fmt.Println(err)
	}
	brandID, err := strconv.Atoi(r.URL.Query().Get("brandID"))
	ProductCategoryID, err := strconv.Atoi(r.URL.Query().Get("ProductCategoryID"))
	ProductSubCategoryID, err := strconv.Atoi(r.URL.Query().Get("ProductSubCategoryID"))
	ProductSubCategoryDetailID, err := strconv.Atoi(r.URL.Query().Get("ProductSubCategoryDetailID"))
	shopID, err := strconv.Atoi(r.URL.Query().Get("ShopID"))
	description := r.URL.Query().Get("description")

	fmt.Println(params)
	fmt.Println("heere")
	fmt.Println(Price)
	fmt.Println(stock)
	fmt.Println(stock)

	product := &model.Product{
		ProductName:                ProductName,
		ProductPrice:               Price,
		Stock:                      stock,
		BrandID:                    brandID,
		ProductCategoryID:          ProductCategoryID,
		ProductSubCategoryID:       ProductSubCategoryID,
		ProductSubCategoryDetailID: ProductSubCategoryDetailID,
		ShopID:                     shopID,
		Description:                description,
	}

	var _, error = db.Model(product).Insert()
	if error != nil {
		panic(error)
	}

	db.Close()

}

func GetAllProducts(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Access-Control-Allow-Methods", "GET, POST, PATCH, PUT, DELETE, OPTIONS")
	w.Header().Set("Access-Control-Allow-Headers:", "Origin, Content-Type, X-Auth-Token, Authorization")
	w.Header().Set("Content-Type", "application/json")

	var db = databaseUtil.GetConnection()

	var products []*model.Product

	var err = db.Model(&products).Relation("Brand").Relation("Brand").Relation("ProductCategory").Relation("Shop").Relation("ProductSubCategory").Relation("ProductSubCategoryDetail").Select()
	fmt.Println("products", products)
	if err != nil {
		fmt.Println(err)
	} else {
		json.NewEncoder(w).Encode(&products)
	}

	db.Close()

}

func GetAProduct(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Access-Control-Allow-Methods", "GET, POST, PATCH, PUT, DELETE, OPTIONS")
	w.Header().Set("Access-Control-Allow-Headers:", "Origin, Content-Type, X-Auth-Token, Authorization")
	w.Header().Set("Content-Type", "application/json")
	vars := mux.Vars(r)
	var db = databaseUtil.GetConnection()
	id := vars["id"]
	var product = new(model.Product)
	fmt.Println(id)
	var err = db.Model(product).Where("product.id = ?", id).Column("product.*", "Brand").Relation("Brand").Relation("ProductCategory").Relation("Shop").Relation("ProductSubCategory").Relation("ProductSubCategoryDetail").First()
	// fmt.Println(product.Brand.BrandName)
	if err != nil {
		fmt.Println(err)
	} else {
		json.NewEncoder(w).Encode(&product)
	}

	db.Close()

}

func GetAllProductsFromShop(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Access-Control-Allow-Methods", "GET, POST, PATCH, PUT, DELETE, OPTIONS")
	w.Header().Set("Access-Control-Allow-Headers:", "Origin, Content-Type, X-Auth-Token, Authorization")
	w.Header().Set("Content-Type", "application/json")
	vars := mux.Vars(r)
	var db = databaseUtil.GetConnection()
	id := vars["id"]
	var products []*model.Product

	fmt.Println(id)
	var err = db.Model(&products).Where("shop_id = ?", id).Relation("Brand").Relation("ProductCategory").Relation("Shop").Relation("ProductSubCategory").Relation("ProductSubCategoryDetail").Select()
	// fmt.Println(product.Brand.BrandName)
	if err != nil {
		fmt.Println(err)
	} else {
		json.NewEncoder(w).Encode(&products)
	}

	db.Close()

}
