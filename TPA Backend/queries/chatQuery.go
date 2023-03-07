package query

import (
	databaseUtil "backend/database"
	"backend/model"
	"encoding/json"
	"fmt"
	"net/http"
	"strconv"
)

func GetAllMessageIDFromAccount(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Access-Control-Allow-Methods", "GET, POST, PATCH, PUT, DELETE, OPTIONS")
	w.Header().Set("Access-Control-Allow-Headers:", "Origin, Content-Type, X-Auth-Token, Authorization")
	w.Header().Set("Content-Type", "application/json")

	db := databaseUtil.GetConnection()

	sender, error := strconv.Atoi(r.URL.Query().Get("sender"))
	if error != nil {
		fmt.Println(error)
		json.NewEncoder(w).Encode("error")
		return
	}
	var chats []*model.Chat

	err := db.Model(&chats).Where("sender = ?", sender).Select()

	if err != nil {
		fmt.Println(err)
		json.NewEncoder(w).Encode("error")
		return
	}

	json.NewEncoder(w).Encode(chats)
	db.Close()
}

func CheckMessageIDFromAccount(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Access-Control-Allow-Methods", "GET, POST, PATCH, PUT, DELETE, OPTIONS")
	w.Header().Set("Access-Control-Allow-Headers:", "Origin, Content-Type, X-Auth-Token, Authorization")
	w.Header().Set("Content-Type", "application/json")

	db := databaseUtil.GetConnection()

	sender, error := strconv.Atoi(r.URL.Query().Get("sender"))
	receiver, error := strconv.Atoi(r.URL.Query().Get("receiver"))
	if error != nil {
		fmt.Println(error)
		json.NewEncoder(w).Encode("error")
		return
	}
	var chats []*model.Chat

	err := db.Model(&chats).Where("sender = ?", sender).Where("receiver = ?", receiver).Select()

	if err != nil {
		fmt.Println(err)
		json.NewEncoder(w).Encode("error")
		return
	}

	if len(chats) == 0 {
		json.NewEncoder(w).Encode("not found")
	} else {
		json.NewEncoder(w).Encode("found")
	}

	db.Close()
}

func AddMessageID(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Access-Control-Allow-Methods", "GET, POST, PATCH, PUT, DELETE, OPTIONS")
	w.Header().Set("Access-Control-Allow-Headers:", "Origin, Content-Type, X-Auth-Token, Authorization")
	w.Header().Set("Content-Type", "application/json")

	db := databaseUtil.GetConnection()

	sender, error := strconv.Atoi(r.URL.Query().Get("sender"))
	receiver, error := strconv.Atoi(r.URL.Query().Get("receiver"))
	uuid := r.URL.Query().Get("UUID")
	fmt.Println("uuid : ")
	fmt.Println(uuid)
	if error != nil {
		fmt.Println(error)
		json.NewEncoder(w).Encode("error")
		return
	}
	chat := &model.Chat{
		Sender:   sender,
		Receiver: receiver,
		UUID:     uuid,
	}

	_, err := db.Model(chat).Insert()

	if err != nil {
		fmt.Println(err)
		json.NewEncoder(w).Encode("error")
		return
	}

	json.NewEncoder(w).Encode("Success")
	db.Close()
}
