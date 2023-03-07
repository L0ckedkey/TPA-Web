package query

import (
	databaseUtil "backend/database"
	"backend/model"
	"encoding/json"
	"fmt"
	"net/http"
	"strconv"
)

func AddAddress(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Access-Control-Allow-Methods", "GET, POST, PATCH, PUT, DELETE, OPTIONS")
	w.Header().Set("Content-Type", "application/json")
	w.Header().Set("Access-Control-Allow-Credentials", "true")

	db := databaseUtil.GetConnection()
	accountID, err := strconv.Atoi(r.URL.Query().Get("accountID"))
	location := r.URL.Query().Get("location")

	if err != nil {
		fmt.Println(err)
		json.NewEncoder(w).Encode("error")
		db.Close()
		return
	}

	locationModel := &model.Address{
		AccountID: accountID,
		Location:  location,
	}

	_, err = db.Model(locationModel).Insert()

	if err != nil {
		fmt.Println(err)
		json.NewEncoder(w).Encode("error")
		db.Close()
		return
	}

	json.NewEncoder(w).Encode("Success")
	db.Close()
	return

}

func GetAccountAddress(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Access-Control-Allow-Methods", "GET, POST, PATCH, PUT, DELETE, OPTIONS")
	w.Header().Set("Content-Type", "application/json")
	w.Header().Set("Access-Control-Allow-Credentials", "true")

	db := databaseUtil.GetConnection()
	accountID, err := strconv.Atoi(r.URL.Query().Get("accountID"))

	var location  []*model.Address

	err = db.Model(&location).Where("account_id = ?", accountID).Relation("Account").Select()

	if err != nil {
		fmt.Println(err)
		json.NewEncoder(w).Encode("error")
		db.Close()
		return
	}

	json.NewEncoder(w).Encode(location)
	db.Close()
	return
}

func GetAddressbyID(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Access-Control-Allow-Methods", "GET, POST, PATCH, PUT, DELETE, OPTIONS")
	w.Header().Set("Content-Type", "application/json")
	w.Header().Set("Access-Control-Allow-Credentials", "true")

	db := databaseUtil.GetConnection()
	ID, err := strconv.Atoi(r.URL.Query().Get("addressID"))

	location := &model.Address{}

	err = db.Model(location).Where("id = ?", ID).Relation("Account").Select()

	if err != nil {
		fmt.Println(err)
		json.NewEncoder(w).Encode("error")
		db.Close()
		return
	}

	json.NewEncoder(w).Encode("Success")
	db.Close()
	return
}