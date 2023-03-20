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

	err := db.Model(&carts).Relation("Account").Relation("Product").Relation("Shop").Where("account_id = ?", id).DistinctOn("shop_id").Select()

	if err != nil {
		fmt.Println(err)
	}

	json.NewEncoder(w).Encode(carts)
	db.Close()
}

func GetCartProducts(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Access-Control-Allow-Methods", "GET, POST, PATCH, PUT, DELETE, OPTIONS")
	w.Header().Set("Access-Control-Allow-Headers:", "Origin, Content-Type, X-Auth-Token, Authorization")
	w.Header().Set("Content-Type", "application/json")

	accountID, err := strconv.Atoi(r.URL.Query().Get("accountID"))
	shopID, err := strconv.Atoi(r.URL.Query().Get("shopID"))

	if err != nil {
		fmt.Println(err)
		json.NewEncoder(w).Encode("error")
	}

	db := databaseUtil.GetConnection()

	var carts []*model.Cart

	error := db.Model(&carts).Relation("Account").Relation("Product").Relation("Shop").Where("account_id = ?", accountID).Where("cart.shop_id = ?", shopID).Select()
	if error != nil {
		fmt.Println(error)
		json.NewEncoder(w).Encode("error")
		db.Close()
		return
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
	shopID, err := strconv.Atoi(r.URL.Query().Get("shopID"))
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
		ShopID:    shopID,
	}
	var _, error = db.Model(cart).Insert()
	if error != nil {
		fmt.Println(error)
	}
	db.Close()
}

func GetOrderDetailShop(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Access-Control-Allow-Methods", "GET, POST, PATCH, PUT, DELETE, OPTIONS")
	w.Header().Set("Access-Control-Allow-Headers:", "Origin, Content-Type, X-Auth-Token, Authorization")
	w.Header().Set("Content-Type", "application/json")

	shopID, err := strconv.Atoi(r.URL.Query().Get("shopID"))
	filter := r.URL.Query().Get("filterBy")
	db := databaseUtil.GetConnection()

	if err != nil {
		fmt.Println(err)
	}

	var orderDetail []*model.OrderHeader

	if filter == "" {
		var error = db.Model(&orderDetail).Where("shop_id = ?", shopID).Relation("Shop").Relation("Account").Select()
		if error != nil {
			fmt.Println(error)
		}
	} else if filter == "Cancel" {
		var error = db.Model(&orderDetail).Where("shop_id = ?", shopID).Where("order_header.status = ?", "Cancelled").Relation("Shop").Relation("Account").Select()
		if error != nil {
			fmt.Println(error)
		}
	} else {
		var error = db.Model(&orderDetail).Where("shop_id = ?", shopID).Where("order_header.status != ?", "Cancelled").Relation("Shop").Relation("Account").Select()
		if error != nil {
			fmt.Println(error)
		}
	}

	json.NewEncoder(w).Encode(orderDetail)

	db.Close()
}

func GetOrderDetail(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Access-Control-Allow-Methods", "GET, POST, PATCH, PUT, DELETE, OPTIONS")
	w.Header().Set("Access-Control-Allow-Headers:", "Origin, Content-Type, X-Auth-Token, Authorization")
	w.Header().Set("Content-Type", "application/json")

	orderHeaderID, err := strconv.Atoi(r.URL.Query().Get("orderHeaderID"))
	db := databaseUtil.GetConnection()

	if err != nil {
		fmt.Println(err)
	}

	var orderDetail []*model.OrderDetail

	var error = db.Model(&orderDetail).Where("order_header_id = ?", orderHeaderID).Relation("Account").Relation("OrderHeader").Relation("Product").Select()
	if error != nil {
		fmt.Println(error)
	}
	json.NewEncoder(w).Encode(orderDetail)

	db.Close()
}

func UpdateCart(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Access-Control-Allow-Methods", "GET, POST, PATCH, PUT, DELETE, OPTIONS")
	w.Header().Set("Access-Control-Allow-Headers:", "Origin, Content-Type, X-Auth-Token, Authorization")
	w.Header().Set("Content-Type", "application/json")

	cartID, err := strconv.Atoi(r.URL.Query().Get("cartID"))
	quantity, err := strconv.Atoi(r.URL.Query().Get("quantity"))
	db := databaseUtil.GetConnection()

	if err != nil {
		fmt.Println("errpr while parsing in update cart")
		fmt.Println(err)
		json.NewEncoder(w).Encode("Error")
		db.Close()
		return
	}

	var cart model.Cart

	var _, error = db.Model(&cart).Where("id = ?", cartID).Set("quantity = ?", quantity).Update()
	if error != nil {
		fmt.Println("error while update cart")
		fmt.Println(error)
		json.NewEncoder(w).Encode("Error")
		db.Close()
	}
	json.NewEncoder(w).Encode("Success")

	db.Close()
}

func DeleteCart(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Access-Control-Allow-Methods", "GET, POST, PATCH, PUT, DELETE, OPTIONS")
	w.Header().Set("Access-Control-Allow-Headers:", "Origin, Content-Type, X-Auth-Token, Authorization")
	w.Header().Set("Content-Type", "application/json")

	cartID, err := strconv.Atoi(r.URL.Query().Get("cartID"))
	db := databaseUtil.GetConnection()

	if err != nil {
		fmt.Println("errpr while parsing in delte cart")
		fmt.Println(err)
		json.NewEncoder(w).Encode("Error")
		db.Close()
		return
	}

	var cart model.Cart

	var _, error = db.Model(&cart).Where("id = ?", cartID).Delete()
	if error != nil {
		fmt.Println("error while update cart")
		fmt.Println(error)
		json.NewEncoder(w).Encode("Error")
		db.Close()
		return
	}
	json.NewEncoder(w).Encode("Success")

	db.Close()
}
