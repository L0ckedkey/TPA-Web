package websocket

import (
	databaseUtil "backend/database"
	"backend/model"
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"strconv"
	// "time"

	"github.com/google/uuid"
	"github.com/gorilla/websocket"
)

var upgrader = websocket.Upgrader{
	ReadBufferSize:  1024,
	WriteBufferSize: 1024,
}

var clients = make(map[*websocket.Conn]string)

func GetMessage(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Access-Control-Allow-Methods", "GET, POST, PATCH, PUT, DELETE, OPTIONS")
	w.Header().Set("Access-Control-Allow-Headers:", "Origin, Content-Type, X-Auth-Token, Authorization")
	w.Header().Set("Content-Type", "application/json")

	var messages []*model.Message

	db := databaseUtil.GetConnection()
	senderID, err := strconv.Atoi(r.URL.Query().Get("senderID"))
	recepientID, err := strconv.Atoi(r.URL.Query().Get("recepientID"))

	if err != nil {
		fmt.Println("error while parsing in msg")
		fmt.Println(err)
		db.Close()
		return
	}

	err = db.Model(&messages).Where("sender_id = ?", senderID).Where("recepient_id = ?", recepientID).Select()

	if err != nil {
		fmt.Println("error while select msg")
		fmt.Println(err)
		db.Close()
		return
	}
	json.NewEncoder(w).Encode(messages)
	db.Close()
}

func GetMessageCustomerService(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Access-Control-Allow-Methods", "GET, POST, PATCH, PUT, DELETE, OPTIONS")
	w.Header().Set("Access-Control-Allow-Headers:", "Origin, Content-Type, X-Auth-Token, Authorization")
	w.Header().Set("Content-Type", "application/json")

	var messages []*model.ChatDetail

	db := databaseUtil.GetConnection()
	chatID, err := strconv.Atoi(r.URL.Query().Get("chatID"))

	if err != nil {
		fmt.Println("error while parsing in msg")
		fmt.Println(err)
		db.Close()
		return
	}

	err = db.Model(&messages).Where("chat_id = ?", chatID).Select()

	if err != nil {
		fmt.Println("error while select msg")
		fmt.Println(err)
		db.Close()
		return
	}
	json.NewEncoder(w).Encode(messages)
	db.Close()
}

func GetMessageHeaderCustomerService(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Access-Control-Allow-Methods", "GET, POST, PATCH, PUT, DELETE, OPTIONS")
	w.Header().Set("Access-Control-Allow-Headers:", "Origin, Content-Type, X-Auth-Token, Authorization")
	w.Header().Set("Content-Type", "application/json")

	var messages []*model.ChatHeader

	db := databaseUtil.GetConnection()
	accountID, err := strconv.Atoi(r.URL.Query().Get("accountID"))

	if err != nil {
		fmt.Println("error while parsing in msg")
		fmt.Println(err)
		db.Close()
		return
	}

	err = db.Model(&messages).Where("account_id = ?", accountID).Select()

	if err != nil {
		fmt.Println("error while select msg")
		fmt.Println(err)
		db.Close()
		return
	}
	json.NewEncoder(w).Encode(messages)
	db.Close()
}

func GetMessageHeaderCustomerServiceCS(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Access-Control-Allow-Methods", "GET, POST, PATCH, PUT, DELETE, OPTIONS")
	w.Header().Set("Access-Control-Allow-Headers:", "Origin, Content-Type, X-Auth-Token, Authorization")
	w.Header().Set("Content-Type", "application/json")

	var messages []*model.ChatHeader

	db := databaseUtil.GetConnection()

	err := db.Model(&messages).Select()

	if err != nil {
		fmt.Println("error while select msg")
		fmt.Println(err)
		db.Close()
		return
	}
	json.NewEncoder(w).Encode(messages)
	db.Close()
}

func ChangeHeaderStatus(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Access-Control-Allow-Methods", "GET, POST, PATCH, PUT, DELETE, OPTIONS")
	w.Header().Set("Access-Control-Allow-Headers:", "Origin, Content-Type, X-Auth-Token, Authorization")
	w.Header().Set("Content-Type", "application/json")

	var messages []*model.ChatHeader

	db := databaseUtil.GetConnection()
	chatID, err := strconv.Atoi(r.URL.Query().Get("chatID"))

	if err != nil {
		fmt.Println("error while parsing in msg")
		fmt.Println(err)
		db.Close()
		return
	}

	_, err = db.Model(&messages).Where("id = ?", chatID).Set("status = ?", "Resolved").Update()

	if err != nil {
		fmt.Println("error while select msg")
		fmt.Println(err)
		db.Close()
		return
	}
	json.NewEncoder(w).Encode("Success")
	db.Close()
}

func AddMessageHeaderCustomerService(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Access-Control-Allow-Methods", "GET, POST, PATCH, PUT, DELETE, OPTIONS")
	w.Header().Set("Access-Control-Allow-Headers:", "Origin, Content-Type, X-Auth-Token, Authorization")
	w.Header().Set("Content-Type", "application/json")

	db := databaseUtil.GetConnection()
	accountID, err := strconv.Atoi(r.URL.Query().Get("accountID"))
	title := r.URL.Query().Get("title")

	if title == "" {
		json.NewEncoder(w).Encode("Title is null")
		db.Close()
		return
	}

	if err != nil {
		fmt.Println("error while parsing in msg")
		fmt.Println(err)
		db.Close()
		return
	}

	var header = model.ChatHeader{
		AccountID: accountID,
		Title:     title,
		Status:    "Ongoing",
	}

	_, err = db.Model(&header).Insert()

	if err != nil {
		fmt.Println("error while select msg")
		fmt.Println(err)
		db.Close()
		return
	}
	json.NewEncoder(w).Encode("Success")
	db.Close()
}

func HandleConnections(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Access-Control-Allow-Methods", "GET, POST, PATCH, PUT, DELETE, OPTIONS")
	w.Header().Set("Access-Control-Allow-Headers:", "Origin, Content-Type, X-Auth-Token, Authorization")
	w.Header().Set("Content-Type", "application/json")

	db := databaseUtil.GetConnection()

	var upgrader = websocket.Upgrader{
		CheckOrigin: func(r *http.Request) bool {
			return true
		},
	}

	// Upgrade HTTP connection to WebSocket
	conn, err := upgrader.Upgrade(w, r, nil)
	if err != nil {
		log.Fatal(err)
	}

	// Generate a unique ID for this client
	id := uuid.New().String()

	// Register the new client with its ID
	clients[conn] = id

	for {
		// Read incoming message
		_, message, err := conn.ReadMessage()
		if err != nil {
			log.Printf("WebSocket error: %v", err)
			delete(clients, conn)
			break
		}

		// Parse the message to extract the recipient ID and message text
		var msg struct {
			RecepientID int    `json:"recepient"`
			Text        string `json:"text"`
			SenderID    int    `json:"sender"`
		}
		err = json.Unmarshal(message, &msg)
		if err != nil {
			log.Printf("Invalid message format: %v", err)
			continue
		}
		fmt.Println("recepient ID :")
		fmt.Println(msg.RecepientID)
		fmt.Println("sender ID :")
		fmt.Println(msg.SenderID)
		var messageInput = model.Message{
			Message:     msg.Text,
			SenderID:    msg.SenderID,
			RecepientID: msg.RecepientID,
			// Date:        time.Now(),
		}

		_, err = db.Model(&messageInput).Insert()

		if err != nil {
			fmt.Println("error while insert to db")
			fmt.Println(err)
			db.Close()
			return
		}

		// Send the message to the recipient if they are connected
		for client := range clients {
			// fmt.Println(client)
			if true {
				err := client.WriteMessage(websocket.TextMessage, message)
				if err != nil {
					log.Printf("WebSocket error: %v", err)
					client.Close()
					delete(clients, client)
				}
			}
		}

		fmt.Println(msg.Text)
		// db.Close()
	}
}

func HandleConnectionsCustomerService(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Access-Control-Allow-Methods", "GET, POST, PATCH, PUT, DELETE, OPTIONS")
	w.Header().Set("Access-Control-Allow-Headers:", "Origin, Content-Type, X-Auth-Token, Authorization")
	w.Header().Set("Content-Type", "application/json")

	db := databaseUtil.GetConnection()

	var upgrader = websocket.Upgrader{
		CheckOrigin: func(r *http.Request) bool {
			return true
		},
	}

	// Upgrade HTTP connection to WebSocket
	conn, err := upgrader.Upgrade(w, r, nil)
	if err != nil {
		log.Fatal(err)
	}

	// Generate a unique ID for this client
	id := uuid.New().String()

	// Register the new client with its ID
	clients[conn] = id

	for {
		// Read incoming message
		_, message, err := conn.ReadMessage()
		if err != nil {
			log.Printf("WebSocket error: %v", err)
			delete(clients, conn)
			break
		}

		// Parse the message to extract the recipient ID and message text
		var msg struct {
			RecepientID int    `json:"recepient"`
			Text        string `json:"text"`
			SenderID    int    `json:"sender"`
			ChatID      int    `json:"chatID"`
		}
		err = json.Unmarshal(message, &msg)
		if err != nil {
			log.Printf("Invalid message format: %v", err)
			continue
		}
		fmt.Println("recepient ID :")
		fmt.Println(msg.RecepientID)
		fmt.Println("sender ID :")
		fmt.Println(msg.SenderID)
		var messageInput = model.ChatDetail{
			Message:   msg.Text,
			Sender:    msg.SenderID,
			Recepient: msg.RecepientID,
			ChatID:    msg.ChatID,
		}

		var header model.ChatHeader

		err = db.Model(&header).Where("id = ?", msg.ChatID).Select()

		if header.Status == "Resolved" {
			return
		}

		_, err = db.Model(&messageInput).Insert()

		if err != nil {
			fmt.Println("error while insert to db")
			fmt.Println(err)
			db.Close()
			return
		}

		// Send the message to the recipient if they are connected
		for client := range clients {
			// fmt.Println(client)
			if true {
				err := client.WriteMessage(websocket.TextMessage, message)
				if err != nil {
					log.Printf("WebSocket error: %v", err)
					client.Close()
					delete(clients, client)
				}
			}
		}

		fmt.Println(msg.Text)
		// db.Close()
	}
}
