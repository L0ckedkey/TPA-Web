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
	discount, err := strconv.Atoi(r.URL.Query().Get("discount"))
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

func UseVouchers(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Access-Control-Allow-Methods", "GET, POST, PATCH, PUT, DELETE, OPTIONS")
	w.Header().Set("Access-Control-Allow-Headers:", "Origin, Content-Type, X-Auth-Token, Authorization")
	w.Header().Set("Content-Type", "application/json")

	var db = databaseUtil.GetConnection()
	accountID, err := strconv.Atoi(r.URL.Query().Get("accountID"))
	couponCode := r.URL.Query().Get("couponCode")

	var voucher = model.Promo{}

	err = db.Model(&voucher).Where("code = ?", couponCode).Select()
	fmt.Println("this")
	if err != nil {
		if err.Error() == "pg: no rows in result set" {
			json.NewEncoder(w).Encode("No Such Coupon")
			db.Close()
			return
		} else {
			json.NewEncoder(w).Encode("Error")
			db.Close()
			return
		}
	}

	var usedVoucher = model.UsedPromo{}

	error := db.Model(&usedVoucher).Where("promo_id = ?", voucher.ID).Where("account_id = ?", accountID).Select()
	fmt.Println("this")
	if error != nil {
		if error.Error() == "pg: no rows in result set" {
			if voucher.EndDate.Before(time.Now()) {
				json.NewEncoder(w).Encode("Coupon Expired")
				db.Close()
				return
			} else {

				usedVoucher = model.UsedPromo{
					AccountID: accountID,
					PromoID:   voucher.ID,
				}

				_, err = db.Model(&usedVoucher).Insert()
				fmt.Println("this")
				if err != nil {
					fmt.Println(err)
					json.NewEncoder(w).Encode("Error")
					db.Close()
					return
				}

				var account = model.Account{}

				err = db.Model(&account).Where("id = ?", accountID).Select()
				fmt.Println("this")
				if err != nil {
					fmt.Println(err)
					json.NewEncoder(w).Encode("Error")
					db.Close()
					return
				}

				_, err = db.Model(&account).Where("id = ?", accountID).Set("money = ?", account.Money+voucher.Discount).Update()
				fmt.Println("this")
				if err != nil {
					fmt.Println(err)
					json.NewEncoder(w).Encode("Error")
					db.Close()
					return
				}
			}
		}
	} else {
		json.NewEncoder(w).Encode("Coupon is already claimed")
		db.Close()
		return
	}

	json.NewEncoder(w).Encode("Success")

	db.Close()
}
