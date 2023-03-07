package model

import "time"

type WishlistDetail struct {
	ID               int
	WishlistHeaderID int            `json: "wishlist_header_id"`
	ProductID        int            `json: "product_id`
	Quantity         int            `json: "quantity`
	WishlistHeader   WishlistHeader `json: "wishlist_header"`
	Product          Product        `json: "product"`
}

type WishlistHeader struct {
	AccountID   int `json: "account_id"`
	ID          int
	Status      string `json : "status"`
	Description string `json: "description"`
	Price       int    `json : "price"`
	Name        string `json : "name"`
	Account     Account
	CreatedDate time.Time
	Followers   int
	Reviews     int
	Rating      int
	Point       int
}

type FollowedWishlist struct {
	ID               int
	AccountID        int
	WishlistHeaderID int
	Account          Account
	WishlistHeader   WishlistHeader
}

type ReviewWishlist struct {
	ID               int
	AccountID        int
	WishlistHeaderID int
	Review           string
	Point            int
	Account          Account
	WishlistHeader   WishlistHeader
}

type ReviewCount struct {
	Point0 int
	Point1 int
	Point2 int
	Point3 int
	Point4 int
	Point5 int
}
