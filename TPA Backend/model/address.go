package model

type Address struct {
	ID        int
	AccountID int
	Location  string
	Account   Account
}
