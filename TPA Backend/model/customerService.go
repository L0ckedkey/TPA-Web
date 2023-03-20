package model

type ChatHeader struct {
	ID        int
	AccountID int
	Title     string
	Status    string
	Account Account
}

type ChatDetail struct{
	ID int
	ChatID int
	Sender int
	Recepient int
	Message string
	
}
