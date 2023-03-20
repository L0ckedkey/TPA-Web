package query

import (
	databaseUtil "backend/database"
	"backend/model"
	"encoding/json"
	"fmt"
	"net/http"
	"strconv"
)

func AddCustomerReview(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Access-Control-Allow-Methods", "GET, POST, PATCH, PUT, DELETE, OPTIONS")
	w.Header().Set("Access-Control-Allow-Headers:", "Origin, Content-Type, X-Auth-Token, Authorization")
	w.Header().Set("Content-Type", "application/json")

	db := databaseUtil.GetConnection()
	accountID, err := strconv.Atoi(r.URL.Query().Get("accountID"))
	chatID, err := strconv.Atoi(r.URL.Query().Get("chatID"))
	point, err := strconv.Atoi(r.URL.Query().Get("point"))
	review := r.URL.Query().Get("review")

	if err != nil {
		fmt.Println("error while parsing in msg")
		fmt.Println(err)
		db.Close()
		return
	}

	var reviewMsg = model.CustomerServiceReview{
		AccountID: accountID,
		Review:    review,
		Point:     point,
		ChatID:    chatID,
	}

	_, err = db.Model(&reviewMsg).Insert()

	if err != nil {
		fmt.Println("error while parsing in msg")
		fmt.Println(err)
		db.Close()
		return
	}

	json.NewEncoder(w).Encode("Success")
	db.Close()
}
