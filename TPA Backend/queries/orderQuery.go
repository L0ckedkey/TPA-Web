package query

import (
	databaseUtil "backend/database"
	"backend/model"
	"encoding/json"
	"fmt"
	"net/http"
	"strconv"
	"time"

	"github.com/google/uuid"
)

func AddOrder(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Access-Control-Allow-Methods", "GET, POST, PATCH, PUT, DELETE, OPTIONS")
	w.Header().Set("Access-Control-Allow-Headers:", "Origin, Content-Type, X-Auth-Token, Authorization")
	w.Header().Set("Content-Type", "application/json")

	db := databaseUtil.GetConnection()
	accountID, err := strconv.Atoi(r.URL.Query().Get("accountID"))
	shopID, err := strconv.Atoi(r.URL.Query().Get("shopID"))
	current_time := time.Now().Format("2006-01-02")
	dateOrdered, err := time.Parse("2006-01-02", current_time)
	delivery := r.URL.Query().Get("delivery")
	payment := r.URL.Query().Get("payment")
	location := r.URL.Query().Get("location")
	invoiceCode := uuid.New()

	var address = *&model.Address{}
	error := db.Model(&address).Relation("Account").Where("location = ?", location).Where("account_id = ?", accountID).Select()

	if error != nil {
		fmt.Println(error)
		json.NewEncoder(w).Encode("No Location Data")
		db.Close()
		return
	}

	var carts []model.Cart
	var totalPrice = 0
	error = db.Model(&carts).Relation("Account").Relation("Product").Relation("Shop").Where("account_id = ?", accountID).Select()

	for _, cart := range carts {
		totalPrice = totalPrice + (cart.Product.ProductPrice * cart.Quantity)
	}

	var account model.Account

	error = db.Model(&account).Where("id = ?", accountID).Select()

	if error != nil {
		fmt.Println(error)
		json.NewEncoder(w).Encode("No account")
		db.Close()
		return
	}

	if account.Money < totalPrice {
		json.NewEncoder(w).Encode("Not enough money")
		db.Close()
		return
	} else {
		var moneyNow = account.Money - totalPrice
		_, error = db.Model(&account).Where("id = ?", accountID).Set("money = ?", moneyNow).Update()

		if error != nil {
			fmt.Println(error)
			json.NewEncoder(w).Encode("error")
			db.Close()
			return
		}
	}

	if delivery == "" {
		json.NewEncoder(w).Encode("Delivery is null")
		db.Close()
		return
	}

	if payment == "" {
		json.NewEncoder(w).Encode("Payment is null")
		db.Close()
		return
	}

	if err != nil {
		fmt.Println(err)
		json.NewEncoder(w).Encode("error")
		db.Close()
		return
	}

	orderHeader := &model.OrderHeader{
		AccountID:   accountID,
		ShopID:      shopID,
		InvoiceCode: invoiceCode.String(),
		DateOrdered: dateOrdered,
		Status:      "Request Shop Confirmation",
		AddressID:   address.ID,
		Payment:     payment,
		Delivery:    delivery,
	}

	_, err = db.Model(orderHeader).Insert()

	if err != nil {
		fmt.Println(err)
		json.NewEncoder(w).Encode("error")
		db.Close()
		return
	}

	orderHeaderID := orderHeader.ID

	error = db.Model(&carts).Relation("Account").Relation("Product").Relation("Shop").Where("account_id = ?", accountID).Where("cart.shop_id = ?", shopID).Select()

	if error != nil {
		fmt.Println(error)
		json.NewEncoder(w).Encode("error")
		db.Close()
		return
	}

	for _, cart := range carts {
		OrderDetail := &model.OrderDetail{
			OrderHeaderID: orderHeaderID,
			AccountID:     accountID,
			ProductID:     cart.ProductID,
			Quantity:      cart.Quantity,
		}

		product := model.Product{}

		error = db.Model(&product).Where("id = ?", cart.ProductID).Select()

		var quantNow = product.Stock

		_, error = db.Model(&product).Where("id = ?", cart.ProductID).Set("stock = ?", quantNow-cart.Quantity).Update()

		_, error := db.Model(OrderDetail).Insert()

		if error != nil {
			fmt.Println(error)
			json.NewEncoder(w).Encode("error")
			db.Close()
			return
		}
	}

	_, error = db.Model(&carts).Where("account_id = ?", accountID).Delete()
	if error != nil {
		fmt.Println(error)
		json.NewEncoder(w).Encode("error")
		db.Close()
		return
	}
	json.NewEncoder(w).Encode("success")
	db.Close()
}

func GetOrderFromUserDistinctShop(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Access-Control-Allow-Methods", "GET, POST, PATCH, PUT, DELETE, OPTIONS")
	w.Header().Set("Access-Control-Allow-Headers:", "Origin, Content-Type, X-Auth-Token, Authorization")
	w.Header().Set("Content-Type", "application/json")

	db := databaseUtil.GetConnection()
	accountID, err := strconv.Atoi(r.URL.Query().Get("accountID"))

	if err != nil {
		fmt.Println(err)
		json.NewEncoder(w).Encode("error")
		db.Close()
		return
	}

	var orderHeader []*model.OrderHeader

	err = db.Model(&orderHeader).Where("order_header.account_id = ?", accountID).Where("order_header.status != ?", "Done").Relation("Address").Relation("Account").Relation("Shop").Select()

	if err != nil {
		fmt.Println(err)
		json.NewEncoder(w).Encode("error")
		db.Close()
		return
	}

	json.NewEncoder(w).Encode(orderHeader)

	db.Close()

}

func GetOrderProducts(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Access-Control-Allow-Methods", "GET, POST, PATCH, PUT, DELETE, OPTIONS")
	w.Header().Set("Access-Control-Allow-Headers:", "Origin, Content-Type, X-Auth-Token, Authorization")
	w.Header().Set("Content-Type", "application/json")

	accountID, err := strconv.Atoi(r.URL.Query().Get("accountID"))
	orderHeaderID, err := strconv.Atoi(r.URL.Query().Get("orderHeaderID"))

	if err != nil {
		fmt.Println(err)
		json.NewEncoder(w).Encode("error")
	}

	db := databaseUtil.GetConnection()

	var carts []*model.OrderDetail

	error := db.Model(&carts).Relation("Account").Relation("Product").Relation("OrderHeader").Where("order_detail.account_id = ?", accountID).Where("order_detail.order_header_id = ?", orderHeaderID).Select()
	if error != nil {
		fmt.Println(error)
		json.NewEncoder(w).Encode("error")
		db.Close()
		return
	}
	json.NewEncoder(w).Encode(carts)
	db.Close()
}

func ChangeOrderStatus(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Access-Control-Allow-Methods", "GET, POST, PATCH, PUT, DELETE, OPTIONS")
	w.Header().Set("Access-Control-Allow-Headers:", "Origin, Content-Type, X-Auth-Token, Authorization")
	w.Header().Set("Content-Type", "application/json")

	invoiceCode := r.URL.Query().Get("InvoiceCode")

	fmt.Println(invoiceCode)
	db := databaseUtil.GetConnection()

	var orderHeader = *&model.OrderHeader{}
	err := db.Model(&orderHeader).Where("invoice_code = ?", invoiceCode).Select()
	fmt.Println("this")
	if err != nil {

		fmt.Println(err)
		json.NewEncoder(w).Encode("error")
		db.Close()
		return
	}

	if orderHeader.Status == "Request Shop Confirmation" {
		_, err = db.Model(&orderHeader).Where("invoice_code = ?", invoiceCode).Set("status = ?", "Processed").Update()
		fmt.Println("this")
		if err != nil {

			fmt.Println(err)
			json.NewEncoder(w).Encode("error")
			db.Close()
			return
		}
	} else if orderHeader.Status == "Processed" {
		_, err = db.Model(&orderHeader).Where("invoice_code = ?", invoiceCode).Set("status = ?", "Sent").Update()
		fmt.Println("this")
		if err != nil {

			fmt.Println(err)
			json.NewEncoder(w).Encode("error")
			db.Close()
			return
		}
	} else if orderHeader.Status == "Sent" {
		_, err = db.Model(&orderHeader).Where("invoice_code = ?", invoiceCode).Set("status = ?", "Done").Update()

		var orderDetails []*model.OrderDetail

		err = db.Model(&orderDetails).Where("order_header_id = ? ", orderHeader.ID).Select()

		var shop = *&model.Shop{}

		err = db.Model(&shop).Where("id = ?", orderHeader.ShopID).Select()

		_, err = db.Model(&shop).Where("id = ?", orderHeader.ShopID).Set("number_of_sales = ?", shop.NumberOfSales+1).Update()

		for _, orderDetail := range orderDetails {

			var product = *&model.Product{}

			err = db.Model(&shop).Where("id = ?", orderHeader.ShopID).Select()
			_, err = db.Model(&shop).Where("id = ?", orderHeader.ShopID).Set("sold = ?", shop.Sold+orderDetail.Quantity).Update()

			err = db.Model(&product).Where("id = ?", orderDetail.ProductID).Select()
			_, err = db.Model(&product).Where("id = ?", orderDetail.ProductID).Set("sold = ?", product.Sold+orderDetail.Quantity).Update()
		}

		fmt.Println("this")
		if err != nil {

			fmt.Println(err)
			json.NewEncoder(w).Encode("error")
			db.Close()
			return
		}
	}

	json.NewEncoder(w).Encode("Success")

}

func GetDoneOrderFromUserDistinctShop(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Access-Control-Allow-Methods", "GET, POST, PATCH, PUT, DELETE, OPTIONS")
	w.Header().Set("Access-Control-Allow-Headers:", "Origin, Content-Type, X-Auth-Token, Authorization")
	w.Header().Set("Content-Type", "application/json")

	db := databaseUtil.GetConnection()
	accountID, err := strconv.Atoi(r.URL.Query().Get("accountID"))
	filterBy := r.URL.Query().Get("filterBy")

	if err != nil {
		fmt.Println(err)
		json.NewEncoder(w).Encode("error")
		db.Close()
		return
	}

	var orderHeader []*model.OrderHeader

	if filterBy == "" {
		err = db.Model(&orderHeader).Where("order_header.status = ? OR order_header.status = ?", "Done", "Cancelled").Where("order_header.account_id = ?", accountID).Relation("Address").Relation("Account").Relation("Shop").Select()

		if err != nil {
			fmt.Println(err)
			json.NewEncoder(w).Encode("error")
			db.Close()
			return
		}
	} else if filterBy == "time ASC" {
		err = db.Model(&orderHeader).Order("date_ordered ASC").Where("order_header.status = ? OR order_header.status = ?", "Done", "Cancelled").Where("order_header.account_id = ?", accountID).Relation("Address").Relation("Account").Relation("Shop").Select()

		if err != nil {
			fmt.Println(err)
			json.NewEncoder(w).Encode("error")
			db.Close()
			return
		}
	} else if filterBy == "time DESC" {
		err = db.Model(&orderHeader).Order("date_ordered DESC").Where("order_header.status = ? OR order_header.status = ?", "Done", "Cancelled").Where("order_header.account_id = ?", accountID).Relation("Address").Relation("Account").Relation("Shop").Select()

		if err != nil {
			fmt.Println(err)
			json.NewEncoder(w).Encode("error")
			db.Close()
			return
		}
	}

	json.NewEncoder(w).Encode(orderHeader)

	db.Close()

}

func CancelOrder(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Access-Control-Allow-Methods", "GET, POST, PATCH, PUT, DELETE, OPTIONS")
	w.Header().Set("Access-Control-Allow-Headers:", "Origin, Content-Type, X-Auth-Token, Authorization")
	w.Header().Set("Content-Type", "application/json")

	db := databaseUtil.GetConnection()
	orderHeaderID, err := strconv.Atoi(r.URL.Query().Get("orderHeaderID"))

	if err != nil {
		fmt.Println("error while parsing cancel order")
		fmt.Println(err)
		json.NewEncoder(w).Encode("error")
		db.Close()
		return
	}

	var orderHeader model.OrderHeader

	_, err = db.Model(&orderHeader).Where("id = ?", orderHeaderID).Set("status = ?", "Cancelled").Update()

	if err != nil {
		fmt.Println("error while update header")
		fmt.Println(err)
		json.NewEncoder(w).Encode("error")
		db.Close()
		return
	}

	json.NewEncoder(w).Encode("Success")

	db.Close()

}

func OrderAgain(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Access-Control-Allow-Methods", "GET, POST, PATCH, PUT, DELETE, OPTIONS")
	w.Header().Set("Access-Control-Allow-Headers:", "Origin, Content-Type, X-Auth-Token, Authorization")
	w.Header().Set("Content-Type", "application/json")

	db := databaseUtil.GetConnection()
	orderHeaderID, err := strconv.Atoi(r.URL.Query().Get("orderHeaderID"))

	if err != nil {
		fmt.Println("error while parsing order header in order again")
		fmt.Println(err)
		json.NewEncoder(w).Encode("error")
		db.Close()
		return
	}

	var orderHeader model.OrderHeader

	err = db.Model(&orderHeader).Where("id = ?", orderHeaderID).Select()

	if err != nil {
		fmt.Println("error while select header in order again")
		fmt.Println(err)
		json.NewEncoder(w).Encode("error")
		db.Close()
		return
	}

	var orderDetails []model.OrderDetail

	err = db.Model(&orderDetails).Where("order_header_id = ?", orderHeaderID).Select()

	if err != nil {
		fmt.Println("error while select detail in order again")
		fmt.Println(err)
		json.NewEncoder(w).Encode("error")
		db.Close()
		return
	}

	for i := 0; i < len(orderDetails); i++ {

		var product model.Product

		err = db.Model(&product).Where("product.id = ?", orderDetails[i].ProductID).Relation("Shop").Select()

		if err != nil {
			fmt.Println("error while select product in order again")
			fmt.Println(err)
			json.NewEncoder(w).Encode("error")
			db.Close()
			return
		}

		var cart = model.Cart{
			AccountID: orderHeader.AccountID,
			Quantity:  orderDetails[i].Quantity,
			ProductID: orderDetails[i].ProductID,
			ShopID:    product.ShopID,
		}

		_, err = db.Model(&cart).Insert()

		if err != nil {
			fmt.Println("error while insert product in order again")
			fmt.Println(err)
			json.NewEncoder(w).Encode("error")
			db.Close()
			return
		}
	}

	json.NewEncoder(w).Encode("Success")

	db.Close()

}
