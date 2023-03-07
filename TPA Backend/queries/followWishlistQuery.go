package query

import (
	databaseUtil "backend/database"
	"backend/model"
	"encoding/json"
	"fmt"
	"net/http"
	"strconv"
)

func AddFollow(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Access-Control-Allow-Methods", "GET, POST, PATCH, PUT, DELETE, OPTIONS")
	w.Header().Set("Access-Control-Allow-Headers:", "Origin, Content-Type, X-Auth-Token, Authorization")
	w.Header().Set("Content-Type", "application/json")

	db := databaseUtil.GetConnection()
	accountID, err := strconv.Atoi(r.URL.Query().Get("accountID"))
	wishlistHeaderID, err := strconv.Atoi(r.URL.Query().Get("wishlistHeaderID"))

	if err != nil {
		fmt.Println("error while parsing in add follow")
		fmt.Println(err)
		json.NewEncoder(w).Encode("Error")
		db.Close()
		return
	}

	var follow = *&model.FollowedWishlist{
		AccountID:        accountID,
		WishlistHeaderID: wishlistHeaderID,
	}

	_, err = db.Model(&follow).Insert()

	if err != nil {
		fmt.Println("error while insert add follow")
		fmt.Println(err)
		json.NewEncoder(w).Encode("Error")
		db.Close()
		return
	}

	var wishlistHeader model.WishlistHeader

	err = db.Model(&wishlistHeader).Where("id = ?", wishlistHeaderID).Select()

	if err != nil {
		fmt.Println("error while select wihlist header add follow")
		fmt.Println(err)
		json.NewEncoder(w).Encode("Error")
		db.Close()
		return
	}

	_, err = db.Model(&wishlistHeader).Where("id = ?", wishlistHeaderID).Set("followers = ?", wishlistHeader.Followers+1).Update()

	if err != nil {
		fmt.Println("error while updating header add follow")
		fmt.Println(err)
		json.NewEncoder(w).Encode("Error")
		db.Close()
		return
	}

	json.NewEncoder(w).Encode("Success")

	db.Close()

}

func UnFollow(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Access-Control-Allow-Methods", "GET, POST, PATCH, PUT, DELETE, OPTIONS")
	w.Header().Set("Access-Control-Allow-Headers:", "Origin, Content-Type, X-Auth-Token, Authorization")
	w.Header().Set("Content-Type", "application/json")

	db := databaseUtil.GetConnection()
	accountID, err := strconv.Atoi(r.URL.Query().Get("accountID"))
	wishlistHeaderID, err := strconv.Atoi(r.URL.Query().Get("wishlistHeaderID"))

	if err != nil {
		fmt.Println("error while parsing in add follow")
		fmt.Println(err)
		json.NewEncoder(w).Encode("Error")
		db.Close()
		return
	}

	var follow model.FollowedWishlist

	_, err = db.Model(&follow).Where("account_id = ?", accountID).Where("wishlist_header_id = ?", wishlistHeaderID).Delete()

	if err != nil {
		fmt.Println("error while delete un follow")
		fmt.Println(err)
		json.NewEncoder(w).Encode("Error")
		db.Close()
		return
	}

	var wishlistHeader model.WishlistHeader

	err = db.Model(&wishlistHeader).Where("id = ?", wishlistHeaderID).Select()

	if err != nil {
		fmt.Println("error while select wihlist header add follow")
		fmt.Println(err)
		json.NewEncoder(w).Encode("Error")
		db.Close()
		return
	}

	_, err = db.Model(&wishlistHeader).Where("id = ?", wishlistHeaderID).Set("followers = ?", wishlistHeader.Followers-1).Update()

	if err != nil {
		fmt.Println("error while updating header add follow")
		fmt.Println(err)
		json.NewEncoder(w).Encode("Error")
		db.Close()
		return
	}

	json.NewEncoder(w).Encode("Success")

	db.Close()

}

func IsFollowing(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Access-Control-Allow-Methods", "GET, POST, PATCH, PUT, DELETE, OPTIONS")
	w.Header().Set("Access-Control-Allow-Headers:", "Origin, Content-Type, X-Auth-Token, Authorization")
	w.Header().Set("Content-Type", "application/json")

	db := databaseUtil.GetConnection()
	accountID, err := strconv.Atoi(r.URL.Query().Get("accountID"))
	wishlistHeaderID, err := strconv.Atoi(r.URL.Query().Get("wishlistHeaderID"))

	if err != nil {
		fmt.Println("error while parsing in is follow")
		fmt.Println(err)
		json.NewEncoder(w).Encode("Error")
		db.Close()
		return
	}

	var follow model.FollowedWishlist

	err = db.Model(&follow).Where("account_id = ?", accountID).Where("wishlist_header_id = ?", wishlistHeaderID).Select()

	if err != nil {
		fmt.Println("error while delete un follow")
		fmt.Println(err)
		json.NewEncoder(w).Encode("Error")
		db.Close()
		return
	}

	json.NewEncoder(w).Encode("Following")

	db.Close()

}
