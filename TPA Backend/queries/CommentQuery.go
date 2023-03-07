package query

import (
	databaseUtil "backend/database"
	"backend/model"
	"encoding/json"
	"fmt"
	"net/http"
	"strconv"
)

func AddComment(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Access-Control-Allow-Methods", "GET, POST, PATCH, PUT, DELETE, OPTIONS")
	w.Header().Set("Access-Control-Allow-Headers:", "Origin, Content-Type, X-Auth-Token, Authorization")
	w.Header().Set("Content-Type", "application/json")

	db := databaseUtil.GetConnection()
	accountID, err := strconv.Atoi(r.URL.Query().Get("accountID"))
	wishlistHeaderID, err := strconv.Atoi(r.URL.Query().Get("wishlistHeaderID"))
	review := r.URL.Query().Get("review")
	point, err := strconv.Atoi(r.URL.Query().Get("point"))

	if err != nil {
		fmt.Println("error while parsing in add comment")
		fmt.Println(err)
		json.NewEncoder(w).Encode("Error")
		db.Close()
		return
	}

	var comment = *&model.ReviewWishlist{
		AccountID:        accountID,
		WishlistHeaderID: wishlistHeaderID,
		Review:           review,
		Point:            point,
	}

	_, err = db.Model(&comment).Insert()

	if err != nil {
		fmt.Println("error while insert review")
		fmt.Println(err)
		json.NewEncoder(w).Encode("Error")
		db.Close()
		return
	}

	var wishlistHeader model.WishlistHeader

	err = db.Model(&wishlistHeader).Where("id = ?", wishlistHeaderID).Select()

	if err != nil {
		fmt.Println("error while select wishlist header")
		fmt.Println(err)
		json.NewEncoder(w).Encode("Error")
		db.Close()
		return
	}

	var reviewsNow = wishlistHeader.Reviews + 1
	var pointNow = wishlistHeader.Point + point
	var ratingNow = pointNow / reviewsNow

	_, err = db.Model(&wishlistHeader).Where("id = ?", wishlistHeaderID).Set("reviews = ?", reviewsNow).Set("rating = ?", ratingNow).Set("point = ?", pointNow).Update()

	if err != nil {
		fmt.Println("error while update wishlist header")
		fmt.Println(err)
		json.NewEncoder(w).Encode("Error")
		db.Close()
		return
	}

	json.NewEncoder(w).Encode("Success")
	db.Close()
}

func GetComments(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Access-Control-Allow-Methods", "GET, POST, PATCH, PUT, DELETE, OPTIONS")
	w.Header().Set("Access-Control-Allow-Headers:", "Origin, Content-Type, X-Auth-Token, Authorization")
	w.Header().Set("Content-Type", "application/json")

	db := databaseUtil.GetConnection()
	wishlistHeaderID, err := strconv.Atoi(r.URL.Query().Get("wishlistHeaderID"))

	if err != nil {
		fmt.Println("error while parsing in get comments")
		fmt.Println(err)
		json.NewEncoder(w).Encode("Error")
		db.Close()
		return
	}

	var comments []model.ReviewWishlist

	err = db.Model(&comments).Where("wishlist_header_id = ?", wishlistHeaderID).Relation("Account").Relation("WishlistHeader").Select()

	if err != nil {
		fmt.Println("error while select review")
		fmt.Println(err)
		json.NewEncoder(w).Encode("Error")
		db.Close()
		return
	}

	json.NewEncoder(w).Encode(comments)
	db.Close()
}
