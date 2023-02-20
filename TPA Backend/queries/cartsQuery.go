package query

import (
	databaseUtil "backend/database"
	"backend/model"
	"encoding/json"
	"fmt"
	"net/http"
	"strconv"
)

func GetCarts(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Access-Control-Allow-Methods", "GET, POST, PATCH, PUT, DELETE, OPTIONS")
	w.Header().Set("Access-Control-Allow-Headers:", "Origin, Content-Type, X-Auth-Token, Authorization")
	w.Header().Set("Content-Type", "application/json")

	id := r.URL.Query().Get("ID")
	fmt.Println(id)
	db := databaseUtil.GetConnection()

	var carts []*model.Cart

	err := db.Model(&carts).Relation("Account").Relation("Product").Where("account_id = ?", id).Select()

	if err != nil {
		fmt.Println(err)
	}

	json.NewEncoder(w).Encode(carts)
	db.Close()
}

func AddToCart(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Access-Control-Allow-Methods", "GET, POST, PATCH, PUT, DELETE, OPTIONS")
	w.Header().Set("Access-Control-Allow-Headers:", "Origin, Content-Type, X-Auth-Token, Authorization")
	w.Header().Set("Content-Type", "application/json")

	accountID, err := strconv.Atoi(r.URL.Query().Get("accountID"))
	productID, err := strconv.Atoi(r.URL.Query().Get("productID"))
	quantity, err := strconv.Atoi(r.URL.Query().Get("quantity"))
	fmt.Println(accountID)
	fmt.Println(productID)
	fmt.Println(quantity)
	if err != nil {
		fmt.Println(err)
	}

	db := databaseUtil.GetConnection()
	cart := &model.Cart{
		AccountID: accountID,
		ProductID: productID,
		Quantity:  quantity,
	}
	var _, error = db.Model(cart).Insert()
	if error != nil {
		fmt.Println(error)
	}
	db.Close()
}
