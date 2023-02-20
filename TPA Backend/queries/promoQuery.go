package query

import (
	databaseUtil "backend/database"
	"backend/model"
	"encoding/json"
	"fmt"
	"net/http"
	"strconv"
	"time"

	"github.com/gorilla/mux"
)

func CreatePromo(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Access-Control-Allow-Methods", "GET, POST, PATCH, PUT, DELETE, OPTIONS")
	w.Header().Set("Access-Control-Allow-Headers:", "Origin, Content-Type, X-Auth-Token, Authorization")
	w.Header().Set("Content-Type", "application/json")

	var db = databaseUtil.GetConnection()
	layout := "2006-01-02"
	params := mux.Vars(r)
	name := r.URL.Query().Get("name")
	code := r.URL.Query().Get("code")
	description := r.URL.Query().Get("description")
	discount, err := strconv.ParseFloat(r.URL.Query().Get("discount"), 64)
	startDate, err := time.Parse(layout, r.URL.Query().Get("startDate"))
	endDate, err := time.Parse(layout, r.URL.Query().Get("endDate"))

	if err != nil {
		fmt.Println(err)
	}
	fmt.Println(params)
	promo := &model.Promo{
		Name:        name,
		Code:        code,
		Description: description,
		Discount:    discount,
		StartDate:   startDate,
		EndDate:     endDate,
	}

	var _, error = db.Model(promo).Insert()
	if error != nil {
		fmt.Println(error)
	}
	db.Close()
}

func GetAllVouchers(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Access-Control-Allow-Methods", "GET, POST, PATCH, PUT, DELETE, OPTIONS")
	w.Header().Set("Access-Control-Allow-Headers:", "Origin, Content-Type, X-Auth-Token, Authorization")
	w.Header().Set("Content-Type", "application/json")

	var db = databaseUtil.GetConnection()

	var vouchers []*model.Promo

	var err = db.Model(&vouchers).Select()

	if err != nil {
		fmt.Println(err)
	}

	json.NewEncoder(w).Encode(vouchers)
	db.Close()
}
