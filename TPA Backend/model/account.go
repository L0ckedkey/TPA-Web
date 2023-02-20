package model

type Account struct {
	FirstName        string
	LastName         string
	PhoneNumber      string
	ID               int `pg: "pk,bigserial"`
	Email            string
	Password         string
	NewsLetterStatus string
	Role             string
}
