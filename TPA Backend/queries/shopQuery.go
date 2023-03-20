package query

import (
	databaseUtil "backend/database"
	"backend/model"
	"encoding/json"
	"fmt"
	"net/http"
	"strconv"

	"github.com/gorilla/mux"
	"golang.org/x/crypto/bcrypt"
)

func GetAllShops(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Access-Control-Allow-Methods", "GET, POST, PATCH, PUT, DELETE, OPTIONS")
	w.Header().Set("Access-Control-Allow-Headers:", "Origin, Content-Type, X-Auth-Token, Authorization")
	w.Header().Set("Content-Type", "application/json")

	var shops []model.Shop
	db := databaseUtil.GetConnection()
	filterBy := r.URL.Query().Get("filterBy")

	if filterBy == "" {
		var err = db.Model(&shops).Select()
		// fmt.Println(product.Brand.BrandName)
		if err != nil {
			fmt.Println("error while select shops")
			fmt.Println(err)
			db.Close()
			return
		}
	} else if filterBy == "Banned" {
		var err = db.Model(&shops).Where("status = ?", "Banned").Select()
		// fmt.Println(product.Brand.BrandName)
		if err != nil {
			fmt.Println("error while select shops")
			fmt.Println(err)
			db.Close()
			return
		}
	} else if filterBy == "Active" {
		var err = db.Model(&shops).Where("status = ?", "Active").Select()
		// fmt.Println(product.Brand.BrandName)
		if err != nil {
			fmt.Println("error while select shops")
			fmt.Println(err)
			db.Close()
			return
		}
	}

	json.NewEncoder(w).Encode(&shops)
	db.Close()

}

func GetAllShopsPaginated(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Access-Control-Allow-Methods", "GET, POST, PATCH, PUT, DELETE, OPTIONS")
	w.Header().Set("Access-Control-Allow-Headers:", "Origin, Content-Type, X-Auth-Token, Authorization")
	w.Header().Set("Content-Type", "application/json")

	var shops []model.Shop
	db := databaseUtil.GetConnection()
	filterBy := r.URL.Query().Get("filterBy")
	limit, err := strconv.Atoi(r.URL.Query().Get("limit"))
	page, err := strconv.Atoi(r.URL.Query().Get("page"))
	offset := (page - 1) * limit

	if err != nil {
		fmt.Println("error while parsing")
		fmt.Println(err)
		json.NewEncoder(w).Encode("Error")
		db.Close()
		return
	}

	if filterBy == "" {
		var err = db.Model(&shops).Limit(limit).Offset(offset).Select()
		// fmt.Println(product.Brand.BrandName)
		if err != nil {
			fmt.Println("error while select shops")
			fmt.Println(err)
			db.Close()
			return
		}
	} else if filterBy == "Banned" {
		var err = db.Model(&shops).Where("status = ?", "Banned").Limit(limit).Offset(offset).Select()
		// fmt.Println(product.Brand.BrandName)
		if err != nil {
			fmt.Println("error while select shops")
			fmt.Println(err)
			db.Close()
			return
		}
	} else if filterBy == "Active" {
		var err = db.Model(&shops).Where("status = ?", "Active").Limit(limit).Offset(offset).Select()
		// fmt.Println(product.Brand.BrandName)
		if err != nil {
			fmt.Println("error while select shops")
			fmt.Println(err)
			db.Close()
			return
		}
	}

	json.NewEncoder(w).Encode(&shops)
	db.Close()

}

func GetAShop(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Access-Control-Allow-Methods", "GET, POST, PATCH, PUT, DELETE, OPTIONS")
	w.Header().Set("Access-Control-Allow-Headers:", "Origin, Content-Type, X-Auth-Token, Authorization")
	w.Header().Set("Content-Type", "application/json")
	vars := mux.Vars(r)
	var db = databaseUtil.GetConnection()
	id := vars["id"]
	var shop = new(model.Shop)
	fmt.Println(id)
	var err = db.Model(shop).Where("id = ?", id).First()
	// fmt.Println(product.Brand.BrandName)
	if err != nil {
		fmt.Println(err)
	} else {
		json.NewEncoder(w).Encode(&shop)
	}

	db.Close()
}

func AddShop(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Access-Control-Allow-Methods", "GET, POST, PATCH, PUT, DELETE, OPTIONS")
	w.Header().Set("Access-Control-Allow-Headers:", "Origin, Content-Type, X-Auth-Token, Authorization")
	w.Header().Set("Content-Type", "application/json")

	db := databaseUtil.GetConnection()

	params := mux.Vars(r)
	email := r.URL.Query().Get("email")
	firstName := r.URL.Query().Get("firstName")
	lastName := r.URL.Query().Get("lastName")
	phoneNumber := r.URL.Query().Get("phoneNumber")
	password, _ := bcrypt.GenerateFromPassword([]byte(r.URL.Query().Get("password")), bcrypt.DefaultCost)
	description := r.URL.Query().Get("description")
	delivery := 0.0
	accuracy, err := strconv.ParseFloat(r.URL.Query().Get("accuracy"), 64)
	satisfaction, err := strconv.ParseFloat("0", 64)
	sales, err := strconv.Atoi("0")
	fmt.Print(params)

	accounts := &model.Account{
		FirstName:        firstName,
		LastName:         lastName,
		PhoneNumber:      phoneNumber,
		Email:            email,
		Password:         string(password),
		NewsLetterStatus: "no",
		Role:             "Seller",
		Status:           "Active",
	}

	shop := &model.Shop{
		Name:                firstName + " " + lastName,
		Status:              "Active",
		DeliveryStatistic:   delivery,
		ProductAccuracy:     accuracy,
		ServiceSatisfaction: satisfaction,
		NumberOfSales:       sales,
		Description:         description,
		Email:               email,
	}

	var _, error1 = db.Model(accounts).Insert()

	if error1 != nil {
		fmt.Println(error1)
		db.Close()
		return
	}

	result, err := db.Model(shop).Returning("*").Insert()
	if err != nil {
		fmt.Println(err)
		db.Close()
		return
	}
	fmt.Println(result)
	json.NewEncoder(w).Encode("Success")
	db.Close()
}

func GetBestShop(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Access-Control-Allow-Methods", "GET, POST, PATCH, PUT, DELETE, OPTIONS")
	w.Header().Set("Access-Control-Allow-Headers:", "Origin, Content-Type, X-Auth-Token, Authorization")
	w.Header().Set("Content-Type", "application/json")

	var db = databaseUtil.GetConnection()

	var shops []*model.Shop

	var err = db.Model(&shops).Order("rating_shop DESC").Limit(3).Select()
	// fmt.Println(product.Brand.BrandName)
	if err != nil {
		fmt.Println("error while select best shop")
		fmt.Println(err)
		json.NewEncoder(w).Encode("error")
		db.Close()
	}

	json.NewEncoder(w).Encode(&shops)
	db.Close()
}

func UpdateShop(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Access-Control-Allow-Methods", "GET, POST, PATCH, PUT, DELETE, OPTIONS")
	w.Header().Set("Access-Control-Allow-Headers:", "Origin, Content-Type, X-Auth-Token, Authorization")
	w.Header().Set("Content-Type", "application/json")

	shopID, err := strconv.Atoi(r.URL.Query().Get("shopID"))
	name := r.URL.Query().Get("name")
	description := r.URL.Query().Get("description")
	db := databaseUtil.GetConnection()

	if err != nil {
		fmt.Println("error while parsing update shop")
		fmt.Println(err)
		json.NewEncoder(w).Encode("Error")
		db.Close()
		return
	}

	var shop model.Shop

	if name != "" {
		_, err = db.Model(&shop).Where("id = ?", shopID).Set("name = ?", name).Update()
		if err != nil {
			fmt.Println("error while update name shop")
			fmt.Println(err)
			json.NewEncoder(w).Encode("Error")
			db.Close()
			return
		}
	}

	if description != "" {
		_, err = db.Model(&shop).Where("id = ?", shopID).Set("description = ?", description).Update()
		if err != nil {
			fmt.Println("error while update description shop")
			fmt.Println(err)
			json.NewEncoder(w).Encode("Error")
			db.Close()
			return
		}
	}

	json.NewEncoder(w).Encode("Success")
	db.Close()
}
