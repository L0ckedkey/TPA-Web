package model

import "time"

type Promo struct {
	ID          int       `pg:"pk, bigserial"`
	Name        string    `json: "name"`
	Code        string    `json: "code"`
	Description string    `json: "description"`
	StartDate   time.Time `json: "start_date" pg:"type:date`
	EndDate     time.Time `json: "end_date" pg:"type:date`
	Discount    float64   `json: "discount" pg:"type:numeric`
}
