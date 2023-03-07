package query

import (
	databaseUtil "backend/database"
	"backend/model"
	"encoding/json"
	"fmt"
	"net/http"
	"strconv"
	"strings"

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
	url := r.URL.Query().Get("Url")

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
		Url:                        url,
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

	var err = db.Model(&products).Where("Shop.status = ?", "Active").Relation("Brand").Relation("Brand").Relation("ProductCategory").Relation("Shop").Relation("ProductSubCategory").Relation("ProductSubCategoryDetail").Select()
	fmt.Println("products", products)
	if err != nil {
		fmt.Println(err)
	} else {
		json.NewEncoder(w).Encode(&products)
	}

	db.Close()

}

func GetAllProductsPrice(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Access-Control-Allow-Methods", "GET, POST, PATCH, PUT, DELETE, OPTIONS")
	w.Header().Set("Access-Control-Allow-Headers:", "Origin, Content-Type, X-Auth-Token, Authorization")
	w.Header().Set("Content-Type", "application/json")

	var db = databaseUtil.GetConnection()
	order := "product_price " + r.URL.Query().Get("order")
	nameSearch := fmt.Sprintf("%%%s%%", strings.ToLower(r.URL.Query().Get("name")))
	// search := r.URL.Query().Get("search")
	var products []*model.Product

	var err = db.Model(&products).Where("LOWER(product_name) LIKE ?", nameSearch).Relation("Brand").Relation("Brand").Relation("ProductCategory").Relation("Shop").Relation("ProductSubCategory").Relation("ProductSubCategoryDetail").Order(order).Select()
	fmt.Println("products", products)
	if err != nil {
		fmt.Println(err)
	} else {
		json.NewEncoder(w).Encode(&products)
	}

	db.Close()

}

func GetAllProductsPriceBrand(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Access-Control-Allow-Methods", "GET, POST, PATCH, PUT, DELETE, OPTIONS")
	w.Header().Set("Access-Control-Allow-Headers:", "Origin, Content-Type, X-Auth-Token, Authorization")
	w.Header().Set("Content-Type", "application/json")

	var db = databaseUtil.GetConnection()
	order := "product_price " + r.URL.Query().Get("order")
	nameSearch := fmt.Sprintf("%%%s%%", strings.ToLower(r.URL.Query().Get("name")))
	// search := r.URL.Query().Get("search")
	var products []*model.Product

	var err = db.Model(&products).Where("LOWER(brand.name) LIKE ?", nameSearch).Relation("Brand").Relation("Brand").Relation("ProductCategory").Relation("Shop").Relation("ProductSubCategory").Relation("ProductSubCategoryDetail").Order(order).Select()
	fmt.Println("products", products)
	if err != nil {
		fmt.Println(err)
	} else {
		json.NewEncoder(w).Encode(&products)
	}

	db.Close()

}

func GetAllProductsName(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Access-Control-Allow-Methods", "GET, POST, PATCH, PUT, DELETE, OPTIONS")
	w.Header().Set("Access-Control-Allow-Headers:", "Origin, Content-Type, X-Auth-Token, Authorization")
	w.Header().Set("Content-Type", "application/json")

	var db = databaseUtil.GetConnection()
	// nameSearch := fmt.Sprintf("%%%s%%", r.URL.Query().Get("order"))
	nameSearch := fmt.Sprintf("%%%s%%", strings.ToLower(r.URL.Query().Get("name")))
	// vars := mux.Vars(r)

	// nameSearch := fmt.Sprintf("%%%s%%", vars["name"])
	// fmt.Println(nameSearch)
	var products []*model.Product
	var err = db.Model(&products).Where("LOWER(product_name) LIKE ?", nameSearch).Relation("Brand").Relation("Brand").Relation("ProductCategory").Relation("Shop").Relation("ProductSubCategory").Relation("ProductSubCategoryDetail").Select()
	fmt.Println("products", products)
	if err != nil {
		fmt.Println(err)
	} else {
		json.NewEncoder(w).Encode(&products)
	}

	db.Close()

}

func GetSimiliarProduct(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Access-Control-Allow-Methods", "GET, POST, PATCH, PUT, DELETE, OPTIONS")
	w.Header().Set("Access-Control-Allow-Headers:", "Origin, Content-Type, X-Auth-Token, Authorization")
	w.Header().Set("Content-Type", "application/json")

	var db = databaseUtil.GetConnection()
	id, err := strconv.Atoi(r.URL.Query().Get("id"))

	if err != nil {
		fmt.Println("eror while parsing int in get similiar")
		fmt.Println(err)
		json.NewEncoder(w).Encode(err)
		db.Close()
		return
	}

	var products []*model.Product
	err = db.Model(&products).Where("product.id = ?", id).Relation("Brand").Relation("Brand").Relation("ProductCategory").Relation("Shop").Relation("ProductSubCategory").Relation("ProductSubCategoryDetail").Limit(5).Select()

	if err != nil {
		fmt.Println("eror while parsing int in get similiar")
		fmt.Println(err)
		json.NewEncoder(w).Encode(err)
		db.Close()
		return
	}

	substr := strings.Split(products[0].ProductName, " ")[0]
	nameSearch := fmt.Sprintf("%%%s%%", strings.ToLower(substr))

	err = db.Model(&products).Where("LOWER(product_name) LIKE ?", nameSearch).Relation("Brand").Relation("Brand").Relation("ProductCategory").Relation("Shop").Relation("ProductSubCategory").Relation("ProductSubCategoryDetail").Limit(5).Select()

	if err != nil {
		fmt.Println("eror while parsing int in get similiar")
		fmt.Println(err)
		json.NewEncoder(w).Encode(err)
		db.Close()
		return
	}

	json.NewEncoder(w).Encode(&products)

	db.Close()

}

func GetSimiliarProductShop(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Access-Control-Allow-Methods", "GET, POST, PATCH, PUT, DELETE, OPTIONS")
	w.Header().Set("Access-Control-Allow-Headers:", "Origin, Content-Type, X-Auth-Token, Authorization")
	w.Header().Set("Content-Type", "application/json")

	var db = databaseUtil.GetConnection()
	id, err := strconv.Atoi(r.URL.Query().Get("id"))

	if err != nil {
		fmt.Println("eror while parsing int in get similiar")
		fmt.Println(err)
		json.NewEncoder(w).Encode(err)
		db.Close()
		return
	}

	var products []*model.Product
	err = db.Model(&products).Where("product.id = ?", id).Relation("Brand").Relation("Brand").Relation("ProductCategory").Relation("Shop").Relation("ProductSubCategory").Relation("ProductSubCategoryDetail").Limit(5).Select()

	if err != nil {
		fmt.Println("eror while parsing int in get similiar")
		fmt.Println(err)
		json.NewEncoder(w).Encode(err)
		db.Close()
		return
	}

	substr := strings.Split(products[0].ProductName, " ")[0]
	nameSearch := fmt.Sprintf("%%%s%%", strings.ToLower(substr))

	err = db.Model(&products).Where("LOWER(product_name) LIKE ?", nameSearch).Where("product.shop_id != ?", products[0].ShopID).DistinctOn("product.shop_id").Relation("Brand").Relation("Brand").Relation("ProductCategory").Relation("Shop").Relation("ProductSubCategory").Relation("ProductSubCategoryDetail").Limit(5).Select()

	if err != nil {
		fmt.Println("eror while parsing int in get similiar")
		fmt.Println(err)
		json.NewEncoder(w).Encode(err)
		db.Close()
		return
	}

	json.NewEncoder(w).Encode(&products)

	db.Close()

}

func GetAllProductsBrand(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Access-Control-Allow-Methods", "GET, POST, PATCH, PUT, DELETE, OPTIONS")
	w.Header().Set("Access-Control-Allow-Headers:", "Origin, Content-Type, X-Auth-Token, Authorization")
	w.Header().Set("Content-Type", "application/json")

	var db = databaseUtil.GetConnection()
	// nameSearch := fmt.Sprintf("%%%s%%", r.URL.Query().Get("order"))
	nameSearch := fmt.Sprintf("%%%s%%", strings.ToLower(r.URL.Query().Get("name")))
	// vars := mux.Vars(r)

	// nameSearch := fmt.Sprintf("%%%s%%", vars["name"])
	// fmt.Println(nameSearch)
	var products []*model.Product
	var err = db.Model(&products).Where("LOWER(brand.name) LIKE ?", nameSearch).Relation("Brand").Relation("Brand").Relation("ProductCategory").Relation("Shop").Relation("ProductSubCategory").Relation("ProductSubCategoryDetail").Select()
	fmt.Println("products", products)
	if err != nil {
		fmt.Println(err)
	} else {
		json.NewEncoder(w).Encode(&products)
	}

	db.Close()

}

func GetAllProductsNameDistinct(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Access-Control-Allow-Methods", "GET, POST, PATCH, PUT, DELETE, OPTIONS")
	w.Header().Set("Access-Control-Allow-Headers:", "Origin, Content-Type, X-Auth-Token, Authorization")
	w.Header().Set("Content-Type", "application/json")

	var db = databaseUtil.GetConnection()
	// nameSearch := fmt.Sprintf("%%%s%%", r.URL.Query().Get("order"))
	nameSearch := fmt.Sprintf("%%%s%%", r.URL.Query().Get("name"))
	// vars := mux.Vars(r)

	// nameSearch := fmt.Sprintf("%%%s%%", vars["name"])
	// fmt.Println(nameSearch)
	var products []*model.Product
	var err = db.Model(&products).Where("LOWER(product_name) LIKE ?", nameSearch).
		Relation("Brand").Relation("ProductCategory").
		Relation("Shop").Relation("ProductSubCategory").
		Relation("ProductSubCategoryDetail").DistinctOn("product_name").Select()
	fmt.Println("products", products)
	if err != nil {
		fmt.Println(err)
	} else {
		json.NewEncoder(w).Encode(&products)
	}

	db.Close()

}

func GetAllProductsBrandDistinct(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Access-Control-Allow-Methods", "GET, POST, PATCH, PUT, DELETE, OPTIONS")
	w.Header().Set("Access-Control-Allow-Headers:", "Origin, Content-Type, X-Auth-Token, Authorization")
	w.Header().Set("Content-Type", "application/json")

	var db = databaseUtil.GetConnection()
	// nameSearch := fmt.Sprintf("%%%s%%", r.URL.Query().Get("order"))
	nameSearch := fmt.Sprintf("%%%s%%", r.URL.Query().Get("name"))
	// vars := mux.Vars(r)

	// nameSearch := fmt.Sprintf("%%%s%%", vars["name"])
	// fmt.Println(nameSearch)
	var products []*model.Product
	var err = db.Model(&products).Where("LOWER(product_name) LIKE ?", nameSearch).Relation("Brand").Relation("ProductCategory").Relation("Shop").Relation("ProductSubCategory").Relation("ProductSubCategoryDetail").DistinctOn("brand.name").Select()
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
	var err = db.Model(product).Where("product.id = ?", id).Relation("Brand").Relation("ProductCategory").Relation("Shop").Relation("ProductSubCategory").Relation("ProductSubCategoryDetail").First()
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

func GetAllProductsFromShopPaginated(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Access-Control-Allow-Methods", "GET, POST, PATCH, PUT, DELETE, OPTIONS")
	w.Header().Set("Access-Control-Allow-Headers:", "Origin, Content-Type, X-Auth-Token, Authorization")
	w.Header().Set("Content-Type", "application/json")

	var db = databaseUtil.GetConnection()

	limit, err := strconv.Atoi(r.URL.Query().Get("limit"))
	page, err := strconv.Atoi(r.URL.Query().Get("page"))
	shopID, err := strconv.Atoi(r.URL.Query().Get("shopID"))
	offset := (page - 1) * limit

	var products []*model.Product

	if err != nil {
		fmt.Println(err)
		json.NewEncoder(w).Encode("error")
		db.Close()
		return
	}

	err = db.Model(&products).Where("shop_id = ?", shopID).Limit(limit).Offset(offset).Relation("Brand").Relation("ProductCategory").Relation("Shop").Relation("ProductSubCategory").Relation("ProductSubCategoryDetail").Select()
	// fmt.Println(product.Brand.BrandName)
	if err != nil {
		fmt.Println(err)
	} else {
		json.NewEncoder(w).Encode(&products)
	}

	db.Close()

}

func GetAllProduct(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Access-Control-Allow-Methods", "GET, POST, PATCH, PUT, DELETE, OPTIONS")
	w.Header().Set("Access-Control-Allow-Headers:", "Origin, Content-Type, X-Auth-Token, Authorization")
	w.Header().Set("Content-Type", "application/json")
	var db = databaseUtil.GetConnection()
	var products []*model.Product

	var err = db.Model(&products).Relation("Brand").Relation("ProductCategory").Relation("Shop").Relation("ProductSubCategory").Relation("ProductSubCategoryDetail").Select()
	// fmt.Println(product.Brand.BrandName)
	if err != nil {
		fmt.Println(err)
	} else {
		json.NewEncoder(w).Encode(&products)
	}

	db.Close()

}

func GetAllProductCategoriesFromShop(w http.ResponseWriter, r *http.Request) {
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
	var err = db.Model(&products).Where("shop_id = ?", id).Relation("Brand").Relation("ProductCategory").Relation("Shop").Relation("ProductSubCategory").Relation("ProductSubCategoryDetail").DistinctOn("product_category.category_name").Select()
	// fmt.Println(product.Brand.BrandName)
	if err != nil {
		fmt.Println(err)
	} else {
		json.NewEncoder(w).Encode(&products)
	}

	db.Close()

}

func GetAllProductsFromCategoryPaginated(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Access-Control-Allow-Methods", "GET, POST, PATCH, PUT, DELETE, OPTIONS")
	w.Header().Set("Access-Control-Allow-Headers:", "Origin, Content-Type, X-Auth-Token, Authorization")
	w.Header().Set("Content-Type", "application/json")

	db := databaseUtil.GetConnection()
	category := r.URL.Query().Get("category")
	limit, err := strconv.Atoi(r.URL.Query().Get("limit"))
	page, err := strconv.Atoi(r.URL.Query().Get("page"))
	sort := r.URL.Query().Get("sort")
	offset := (page - 1) * limit

	if err != nil {
		fmt.Println(err)
		json.NewEncoder(w).Encode("error")
		db.Close()
		return
	}

	var products []*model.Product

	if sort == "" {
		err := db.Model(&products).Where("product_category.category_name = ?", category).Limit(limit).Offset(offset).Relation("Brand").Relation("ProductCategory").Relation("Shop").Relation("ProductSubCategory").Relation("ProductSubCategoryDetail").Select()
		if err != nil {
			fmt.Println("Error in sort nil")
			fmt.Println(err)
			json.NewEncoder(w).Encode(&products)
			db.Close()
			return
		}
	} else if sort == "Price ASC" {
		err := db.Model(&products).Where("product_category.category_name = ?", category).Limit(limit).Offset(offset).Order("product_price ASC").Relation("Brand").Relation("ProductCategory").Relation("Shop").Relation("ProductSubCategory").Relation("ProductSubCategoryDetail").Select()
		if err != nil {
			fmt.Println("Error in sort price ASC")
			fmt.Println(err)
			json.NewEncoder(w).Encode(&products)
			db.Close()
			return
		}
	} else if sort == "Price DESC" {
		err := db.Model(&products).Where("product_category.category_name = ?", category).Limit(limit).Offset(offset).Order("product_price DESC").Relation("Brand").Relation("ProductCategory").Relation("Shop").Relation("ProductSubCategory").Relation("ProductSubCategoryDetail").Select()
		if err != nil {
			fmt.Println("Error in sort price DESC")
			fmt.Println(err)
			json.NewEncoder(w).Encode(&products)
			db.Close()
			return
		}
	} else if sort == "Rating ASC" {
		err := db.Model(&products).Where("product_category.category_name = ?", category).Limit(limit).Offset(offset).Order("rating ASC").Relation("Brand").Relation("ProductCategory").Relation("Shop").Relation("ProductSubCategory").Relation("ProductSubCategoryDetail").Select()
		if err != nil {
			fmt.Println("Error in sort rating ASC")
			fmt.Println(err)
			json.NewEncoder(w).Encode(&products)
			db.Close()
			return
		}
	} else if sort == "Rating DESC" {
		err := db.Model(&products).Where("product_category.category_name = ?", category).Limit(limit).Offset(offset).Order("rating DESC").Relation("Brand").Relation("ProductCategory").Relation("Shop").Relation("ProductSubCategory").Relation("ProductSubCategoryDetail").Select()
		if err != nil {
			fmt.Println("Error in sort rating DESC")
			fmt.Println(err)
			json.NewEncoder(w).Encode(&products)
			db.Close()
			return
		}
	} else if sort == "Reviews ASC" {
		err := db.Model(&products).Where("product_category.category_name = ?", category).Limit(limit).Offset(offset).Order("reviewed ASC").Relation("Brand").Relation("ProductCategory").Relation("Shop").Relation("ProductSubCategory").Relation("ProductSubCategoryDetail").Select()
		if err != nil {
			fmt.Println("Error in sort review ASC")
			fmt.Println(err)
			json.NewEncoder(w).Encode(&products)
			db.Close()
			return
		}
	} else if sort == "Reviews DESC" {
		err := db.Model(&products).Where("product_category.category_name = ?", category).Limit(limit).Offset(offset).Order("reviewed DESC").Relation("Brand").Relation("ProductCategory").Relation("Shop").Relation("ProductSubCategory").Relation("ProductSubCategoryDetail").Select()
		if err != nil {
			fmt.Println("Error in sort review DESC")
			fmt.Println(err)
			json.NewEncoder(w).Encode(&products)
			db.Close()
			return
		}
	} else if sort == "Sold ASC" {
		err := db.Model(&products).Where("product_category.category_name = ?", category).Limit(limit).Offset(offset).Order("sold ASC").Relation("Brand").Relation("ProductCategory").Relation("Shop").Relation("ProductSubCategory").Relation("ProductSubCategoryDetail").Select()
		if err != nil {
			fmt.Println("Error in sort sold ASC")
			fmt.Println(err)
			json.NewEncoder(w).Encode(&products)
			db.Close()
			return
		}
	} else if sort == "Sold DESC" {
		err := db.Model(&products).Where("product_category.category_name = ?", category).Limit(limit).Offset(offset).Order("sold DESC").Relation("Brand").Relation("ProductCategory").Relation("Shop").Relation("ProductSubCategory").Relation("ProductSubCategoryDetail").Select()
		if err != nil {
			fmt.Println("Error in sort sold DESC")
			fmt.Println(err)
			json.NewEncoder(w).Encode(&products)
			db.Close()
			return
		}
	}
	// fmt.Println(product.Brand.BrandName)

	json.NewEncoder(w).Encode(&products)

	db.Close()

}

func GetAllProductsFromCategory(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Access-Control-Allow-Methods", "GET, POST, PATCH, PUT, DELETE, OPTIONS")
	w.Header().Set("Access-Control-Allow-Headers:", "Origin, Content-Type, X-Auth-Token, Authorization")
	w.Header().Set("Content-Type", "application/json")

	db := databaseUtil.GetConnection()
	category := r.URL.Query().Get("category")
	sort := r.URL.Query().Get("sort")

	var products []*model.Product

	if sort == "" {
		err := db.Model(&products).Where("product_category.category_name = ?", category).Relation("Brand").Relation("ProductCategory").Relation("Shop").Relation("ProductSubCategory").Relation("ProductSubCategoryDetail").Select()
		if err != nil {
			fmt.Println("Error in sort nil")
			fmt.Println(err)
			json.NewEncoder(w).Encode(&products)
			db.Close()
			return
		}
	} else if sort == "Price ASC" {
		err := db.Model(&products).Where("product_category.category_name = ?", category).Order("product_price ASC").Relation("Brand").Relation("ProductCategory").Relation("Shop").Relation("ProductSubCategory").Relation("ProductSubCategoryDetail").Select()
		if err != nil {
			fmt.Println("Error in sort price ASC")
			fmt.Println(err)
			json.NewEncoder(w).Encode(&products)
			db.Close()
			return
		}
	} else if sort == "Price DESC" {
		err := db.Model(&products).Where("product_category.category_name = ?", category).Order("product_price DESC").Relation("Brand").Relation("ProductCategory").Relation("Shop").Relation("ProductSubCategory").Relation("ProductSubCategoryDetail").Select()
		if err != nil {
			fmt.Println("Error in sort price DESC")
			fmt.Println(err)
			json.NewEncoder(w).Encode(&products)
			db.Close()
			return
		}
	} else if sort == "Rating ASC" {
		err := db.Model(&products).Where("product_category.category_name = ?", category).Order("rating ASC").Relation("Brand").Relation("ProductCategory").Relation("Shop").Relation("ProductSubCategory").Relation("ProductSubCategoryDetail").Select()
		if err != nil {
			fmt.Println("Error in sort rating ASC")
			fmt.Println(err)
			json.NewEncoder(w).Encode(&products)
			db.Close()
			return
		}
	} else if sort == "Rating DESC" {
		err := db.Model(&products).Where("product_category.category_name = ?", category).Order("rating DESC").Relation("Brand").Relation("ProductCategory").Relation("Shop").Relation("ProductSubCategory").Relation("ProductSubCategoryDetail").Select()
		if err != nil {
			fmt.Println("Error in sort rating DESC")
			fmt.Println(err)
			json.NewEncoder(w).Encode(&products)
			db.Close()
			return
		}
	} else if sort == "Reviews ASC" {
		err := db.Model(&products).Where("product_category.category_name = ?", category).Order("reviewed ASC").Relation("Brand").Relation("ProductCategory").Relation("Shop").Relation("ProductSubCategory").Relation("ProductSubCategoryDetail").Select()
		if err != nil {
			fmt.Println("Error in sort review ASC")
			fmt.Println(err)
			json.NewEncoder(w).Encode(&products)
			db.Close()
			return
		}
	} else if sort == "Reviews DESC" {
		err := db.Model(&products).Where("product_category.category_name = ?", category).Order("reviewed DESC").Relation("Brand").Relation("ProductCategory").Relation("Shop").Relation("ProductSubCategory").Relation("ProductSubCategoryDetail").Select()
		if err != nil {
			fmt.Println("Error in sort review DESC")
			fmt.Println(err)
			json.NewEncoder(w).Encode(&products)
			db.Close()
			return
		}
	} else if sort == "Sold ASC" {
		err := db.Model(&products).Where("product_category.category_name = ?", category).Order("sold ASC").Relation("Brand").Relation("ProductCategory").Relation("Shop").Relation("ProductSubCategory").Relation("ProductSubCategoryDetail").Select()
		if err != nil {
			fmt.Println("Error in sort sold ASC")
			fmt.Println(err)
			json.NewEncoder(w).Encode(&products)
			db.Close()
			return
		}
	} else if sort == "Sold DESC" {
		err := db.Model(&products).Where("product_category.category_name = ?", category).Order("sold DESC").Relation("Brand").Relation("ProductCategory").Relation("Shop").Relation("ProductSubCategory").Relation("ProductSubCategoryDetail").Select()
		if err != nil {
			fmt.Println("Error in sort sold DESC")
			fmt.Println(err)
			json.NewEncoder(w).Encode(&products)
			db.Close()
			return
		}
	}

	json.NewEncoder(w).Encode(&products)
	db.Close()

}

func AddHelpfull(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Access-Control-Allow-Methods", "GET, POST, PATCH, PUT, DELETE, OPTIONS")
	w.Header().Set("Access-Control-Allow-Headers:", "Origin, Content-Type, X-Auth-Token, Authorization")
	w.Header().Set("Content-Type", "application/json")

	accountID, err := strconv.Atoi(r.URL.Query().Get("accountID"))
	reviewShopID, err := strconv.Atoi(r.URL.Query().Get("reviewShopID"))
	db := databaseUtil.GetConnection()

	if err != nil {
		fmt.Println("error while parsing add helpful")
		fmt.Println(err)
		json.NewEncoder(w).Encode("Error")
		db.Close()
		return
	}

	var helpfullReview = model.HelpfullReview{
		AccountID:    accountID,
		ReviewShopID: reviewShopID,
	}

	_, err = db.Model(&helpfullReview).Insert()

	if err != nil {
		fmt.Println("error while add helpful")
		fmt.Println(err)
		json.NewEncoder(w).Encode("Error")
		db.Close()
		return
	}

	json.NewEncoder(w).Encode("Success")
	db.Close()
}

func RemoveHelpfull(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Access-Control-Allow-Methods", "GET, POST, PATCH, PUT, DELETE, OPTIONS")
	w.Header().Set("Access-Control-Allow-Headers:", "Origin, Content-Type, X-Auth-Token, Authorization")
	w.Header().Set("Content-Type", "application/json")

	accountID, err := strconv.Atoi(r.URL.Query().Get("accountID"))
	reviewShopID, err := strconv.Atoi(r.URL.Query().Get("reviewShopID"))
	db := databaseUtil.GetConnection()

	if err != nil {
		fmt.Println("error while parsing delete helpful")
		fmt.Println(err)
		json.NewEncoder(w).Encode("Error")
		db.Close()
		return
	}

	var helpfullReview model.HelpfullReview

	_, err = db.Model(&helpfullReview).Where("account_id = ?", accountID).Where("review_shop_id = ?", reviewShopID).Delete()

	if err != nil {
		fmt.Println("error while delete helpful")
		fmt.Println(err)
		json.NewEncoder(w).Encode("Error")
		db.Close()
		return
	}

	json.NewEncoder(w).Encode("Success")
	db.Close()
}

func IsHelpfull(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Access-Control-Allow-Methods", "GET, POST, PATCH, PUT, DELETE, OPTIONS")
	w.Header().Set("Access-Control-Allow-Headers:", "Origin, Content-Type, X-Auth-Token, Authorization")
	w.Header().Set("Content-Type", "application/json")

	accountID, err := strconv.Atoi(r.URL.Query().Get("accountID"))
	reviewShopID, err := strconv.Atoi(r.URL.Query().Get("reviewShopID"))
	db := databaseUtil.GetConnection()

	if err != nil {
		fmt.Println("error while parsing delete helpful")
		fmt.Println(err)
		json.NewEncoder(w).Encode("Error")
		db.Close()
		return
	}

	var helpfullReview model.HelpfullReview

	err = db.Model(&helpfullReview).Where("account_id = ?", accountID).Where("review_shop_id = ?", reviewShopID).Select()

	if err != nil {
		fmt.Println("error while delete helpful")
		fmt.Println(err)
		json.NewEncoder(w).Encode("Error")
		db.Close()
		return
	}

	json.NewEncoder(w).Encode("Success")
	db.Close()
}

func UpdateProduct(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Access-Control-Allow-Methods", "GET, POST, PATCH, PUT, DELETE, OPTIONS")
	w.Header().Set("Access-Control-Allow-Headers:", "Origin, Content-Type, X-Auth-Token, Authorization")
	w.Header().Set("Content-Type", "application/json")

	productID, err := strconv.Atoi(r.URL.Query().Get("productID"))
	quantity, err := strconv.Atoi(r.URL.Query().Get("quantity"))
	name := r.URL.Query().Get("name")
	price, err := strconv.Atoi(r.URL.Query().Get("price"))
	description := r.URL.Query().Get("description")
	db := databaseUtil.GetConnection()

	if err != nil {
		fmt.Println("error while parsing update product")
		fmt.Println(err)
		json.NewEncoder(w).Encode("Error")
		db.Close()
		return
	}

	var product model.Product
	err = db.Model(&product).Where("id = ?", productID).Select()

	if err != nil {
		fmt.Println("error while select productg")
		fmt.Println(err)
		json.NewEncoder(w).Encode("Error")
		db.Close()
		return
	}
	if name != "" {
		_, err = db.Model(&product).Where("id = ?", productID).Set("product_name = ?", name).Update()

		if err != nil {
			fmt.Println("error while update name")
			fmt.Println(err)
			json.NewEncoder(w).Encode("Error")
			db.Close()
			return
		}
	}

	if description != "" {
		_, err = db.Model(&product).Where("id = ?", productID).Set("description = ?", description).Update()

		if err != nil {
			fmt.Println("error while update description")
			fmt.Println(err)
			json.NewEncoder(w).Encode("Error")
			db.Close()
			return
		}
	}

	if quantity != 0 {
		_, err = db.Model(&product).Where("id = ?", productID).Set("stock = ?", quantity).Update()

		if err != nil {
			fmt.Println("error while update quantity")
			fmt.Println(err)
			json.NewEncoder(w).Encode("Error")
			db.Close()
			return
		}
	}

	if price != 0 {
		_, err = db.Model(&product).Where("id = ?", productID).Set("product_price = ?", price).Update()

		if err != nil {
			fmt.Println("error while update quantity")
			fmt.Println(err)
			json.NewEncoder(w).Encode("Error")
			db.Close()
			return
		}
	}

	json.NewEncoder(w).Encode("Success")

	db.Close()

}
