package model

type Banner struct {
	ID     int `pg:",pk,type:bigserial"`
	ShopID int
	Shop   Shop
	Url    string
}

type AdminBanner struct {
	ID     int `pg:",pk,type:bigserial"`
	Url    string
}
