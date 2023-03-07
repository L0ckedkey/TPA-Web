package query

import (
	databaseUtil "backend/database"
	"backend/model"
	"encoding/json"
	"fmt"
	"net/http"
	"strconv"
)

func GetAllBannerFromAdmin(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Access-Control-Allow-Methods", "GET, POST, PATCH, PUT, DELETE, OPTIONS")
	w.Header().Set("Access-Control-Allow-Headers:", "Origin, Content-Type, X-Auth-Token, Authorization")
	w.Header().Set("Content-Type", "application/json")

	db := databaseUtil.GetConnection()

	var banners []*model.AdminBanner

	err := db.Model(&banners).Select()

	if err != nil {
		fmt.Println(err)
		json.NewEncoder(w).Encode("error")
		return
	}

	json.NewEncoder(w).Encode(banners)
	db.Close()
}

func AddBannerFromAdmin(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Access-Control-Allow-Methods", "GET, POST, PATCH, PUT, DELETE, OPTIONS")
	w.Header().Set("Access-Control-Allow-Headers:", "Origin, Content-Type, X-Auth-Token, Authorization")
	w.Header().Set("Content-Type", "application/json")

	db := databaseUtil.GetConnection()

	url := r.URL.Query().Get("url")

	banner := &model.AdminBanner{
		Url: url,
	}

	_, err := db.Model(banner).Insert()
	if err != nil {
		fmt.Println(err)
		json.NewEncoder(w).Encode("error")
		return
	}

	json.NewEncoder(w).Encode("Success")
	db.Close()
}

func UpdateBannerFromAdmin(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Access-Control-Allow-Methods", "GET, POST, PATCH, PUT, DELETE, OPTIONS")
	w.Header().Set("Access-Control-Allow-Headers:", "Origin, Content-Type, X-Auth-Token, Authorization")
	w.Header().Set("Content-Type", "application/json")

	db := databaseUtil.GetConnection()

	id, error := strconv.Atoi(r.URL.Query().Get("id"))
	url := r.URL.Query().Get("url")

	if error != nil {
		fmt.Println(error)
		json.NewEncoder(w).Encode("error")
		return
	}

	banner := &model.AdminBanner{}

	_, err := db.Model(banner).Set("url = ?", url).Where("id = ?", id).Update()
	if err != nil {
		fmt.Println(err)
		json.NewEncoder(w).Encode("error")
		return
	}

	json.NewEncoder(w).Encode("Success")
	db.Close()
}

func DeleteBannerFromAdmin(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Access-Control-Allow-Methods", "GET, POST, PATCH, PUT, DELETE, OPTIONS")
	w.Header().Set("Access-Control-Allow-Headers:", "Origin, Content-Type, X-Auth-Token, Authorization")
	w.Header().Set("Content-Type", "application/json")

	db := databaseUtil.GetConnection()

	ID, error := strconv.Atoi(r.URL.Query().Get("ID"))
	if error != nil {
		fmt.Println(error)
		json.NewEncoder(w).Encode("error")
		return
	}
	var banners = &model.AdminBanner{}

	_, err := db.Model(banners).Where("id = ?", ID).Delete()

	if err != nil {
		fmt.Println(err)
		json.NewEncoder(w).Encode("error")
		return
	}

	json.NewEncoder(w).Encode(banners)
	db.Close()
}
