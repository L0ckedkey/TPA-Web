package model

type CustomerServiceReview struct{
	ID int
	AccountID int
	Review string
	Point int
	ChatID int
	Account Account
	Chat ChatHeader
}