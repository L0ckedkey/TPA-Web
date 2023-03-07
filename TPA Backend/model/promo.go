package model

import "time"

type Promo struct {
	ID          int
	Name        string    `json: "name"`
	Code        string    `json: "code"`
	Description string    `json: "description"`
	StartDate   time.Time `json: "start_date" pg:"type:date`
	EndDate     time.Time `json: "end_date" pg:"type:date`
	Discount    int       `json: "discount" pg:"type:numeric`
}

type UsedPromo struct {
	ID        int
	AccountID int
	PromoID   int
	Account   Account
	Promo     Promo
}
