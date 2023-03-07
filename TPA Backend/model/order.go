package model

import (
	"time"
)

type OrderHeader struct {
	ID          int
	AccountID   int
	ShopID      int
	DateOrdered time.Time
	InvoiceCode string
	Status      string
	Payment     string
	Delivery    string
	AddressID   int
	Address     Address
	Shop        Shop
	Account     Account
}

type OrderDetail struct {
	OrderHeaderID int
	AccountID     int
	ProductID     int
	Quantity      int
	Account       Account
	OrderHeader   OrderHeader
	Product       Product
}
