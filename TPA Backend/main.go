package main

import (
	databaseUtil "backend/database"
	query "backend/queries"
	"log"
	"net/http"

	"github.com/gorilla/mux"
)

const defaultPort = "8080"

func main() {
	db := databaseUtil.GetConnection()
	databaseUtil.CreateSchema(db)

	r := mux.NewRouter()
	r.HandleFunc("/signUp", query.CreateAccount).Methods("GET")
	r.HandleFunc("/signIn", query.CheckAccount).Methods("GET")
	r.HandleFunc("/getAllUsers", query.GetAllUsers).Methods("GET")
	r.HandleFunc("/signIn/checkPassword", query.CheckPassword).Methods("GET")
	r.HandleFunc("/getAllProducts", query.GetAllProducts).Methods("GET")
	r.HandleFunc("/getAProduct/{id}", query.GetAProduct).Methods("GET")
	r.HandleFunc("/getAShop/{id}", query.GetAShop).Methods("GET")
	r.HandleFunc("/getAllProductsFromShop/{id}", query.GetAllProductsFromShop).Methods("GET")
	r.HandleFunc("/getUserFromCookie", query.GetUserFromToken).Methods("GET")
	r.HandleFunc("/addProduct", query.CreateProduct).Methods("GET")
	r.HandleFunc("/addPromo", query.CreatePromo).Methods("GET")
	r.HandleFunc("/getAllVouchers", query.GetAllVouchers).Methods("GET")
	r.HandleFunc("/getAllUsersForBlastEmail", query.GetAllUsersForBlastEmail).Methods("GET")
	r.HandleFunc("/addShop", query.AddShop).Methods("GET")
	r.HandleFunc("/getCarts", query.GetCarts).Methods("GET")
	r.HandleFunc("/addToCart", query.AddToCart).Methods("GET")
	r.HandleFunc("/getOneTimeCode", query.GenerateTempCode).Methods("GET")
	r.HandleFunc("/validateOneTimeCode/{code}", query.ValidateTempCode).Methods("GET")

	log.Fatal(http.ListenAndServe(":8080", r))
}
