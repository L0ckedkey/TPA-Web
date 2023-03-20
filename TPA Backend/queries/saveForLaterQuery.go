package query

import (
	databaseUtil "backend/database"
	"backend/model"
	"encoding/json"
	"fmt"
	"net/http"
	"strconv"
)

func AddSaveForLater(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Access-Control-Allow-Methods", "GET, POST, PATCH, PUT, DELETE, OPTIONS")
	w.Header().Set("Access-Control-Allow-Headers:", "Origin, Content-Type, X-Auth-Token, Authorization")
	w.Header().Set("Content-Type", "application/json")

	db := databaseUtil.GetConnection()
	accountID, error := strconv.Atoi(r.URL.Query().Get("accountID"))
	productID, error := strconv.Atoi(r.URL.Query().Get("productID"))
	quantity, error := strconv.Atoi(r.URL.Query().Get("quantity"))
	if error != nil {
		fmt.Println(error)
		json.NewEncoder(w).Encode("Error")
		db.Close()
		return
	}

	var saveForLater = model.SaveForLater{
		AccountID: accountID,
		ProductID: productID,
		Quantity:  quantity,
	}

	_, error = db.Model(&saveForLater).Insert()

	if error != nil {
		fmt.Println(error)
		json.NewEncoder(w).Encode("Error")
		db.Close()
		return
	}

	var cart = model.Cart{}
	error = db.Model(&cart).Where("account_id = ?", accountID).Where("product_id = ?", productID).Select()
	if error != nil {
		fmt.Println(error)
		json.NewEncoder(w).Encode("Error")
		db.Close()
		return
	}
	_, error = db.Model(&cart).Where("account_id = ?", accountID).Where("product_id = ?", productID).Delete()

	if error != nil {
		fmt.Println(error)
		json.NewEncoder(w).Encode("Error")
		db.Close()
		return
	}

	json.NewEncoder(w).Encode("Success")

}

func GetSaveForLater(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Access-Control-Allow-Methods", "GET, POST, PATCH, PUT, DELETE, OPTIONS")
	w.Header().Set("Access-Control-Allow-Headers:", "Origin, Content-Type, X-Auth-Token, Authorization")
	w.Header().Set("Content-Type", "application/json")

	db := databaseUtil.GetConnection()
	accountID, error := strconv.Atoi(r.URL.Query().Get("accountID"))

	if error != nil {
		fmt.Println(error)
		json.NewEncoder(w).Encode("Error")
		db.Close()
		return
	}

	var saveForLaters []model.SaveForLater

	error = db.Model(&saveForLaters).Where("account_id = ?", accountID).Relation("Product").Relation("Account").Select()

	if error != nil {
		fmt.Println(error)
		json.NewEncoder(w).Encode("Error")
		db.Close()
		return
	}

	json.NewEncoder(w).Encode(saveForLaters)

}
