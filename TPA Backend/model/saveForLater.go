package model

type SaveForLater struct {
	ID        int
	AccountID int
	ProductID int
	Quantity  int
	Product   Product
	Account   Account
}
