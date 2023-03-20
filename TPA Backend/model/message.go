package model

// import "time"

type Message struct {
	ID          int
	Message     string
	SenderID    int
	RecepientID int
	// Date        time.Time
	Sender      Account
	Recepient   Account
}
