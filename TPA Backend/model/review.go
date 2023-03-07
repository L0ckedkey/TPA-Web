package model

import "time"

type ReviewProduct struct {
	ID            int
	Review        string
	AccountID     int
	ProductID     int
	OrderHeaderID int
	Point         int
	Account       Account
	Product       Product
	OrderHeader   OrderHeader
}

type ReviewShop struct {
	ID             int
	Review         string
	AccountID      int
	ShopID         int
	OrderHeaderID  int
	PointQuestion1 int
	PointQuestion2 int
	PointQuestion3 int
	ShopPoint      int
	TimePosted     time.Time
	Account        Account
	Shop           Shop
	OrderHeader    OrderHeader
}

type HelpfullReview struct {
	ID           int
	AccountID    int
	ReviewShopID int
	Account      Account
	ReviewShop   ReviewShop
}
