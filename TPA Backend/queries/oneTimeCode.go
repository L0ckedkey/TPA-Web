package query

import (
	"encoding/json"
	"fmt"
	"math/rand"
	"net/http"
	"time"

	"github.com/gorilla/mux"
	"github.com/patrickmn/go-cache"
)

var c = cache.New(2*time.Minute, 10*time.Minute)

func GenerateTempCode(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Access-Control-Allow-Methods", "GET, POST, PATCH, PUT, DELETE, OPTIONS")
	w.Header().Set("Access-Control-Allow-Headers:", "Origin, Content-Type, X-Auth-Token, Authorization")
	w.Header().Set("Content-Type", "application/json")

	rand.Seed(time.Now().UnixNano())
	randomNum := rand.Intn(1000000)
	code := fmt.Sprintf("%06d", randomNum)

	expiration := time.Now().Add(15 * time.Minute)
	c.Set(code, expiration, cache.DefaultExpiration)

	json.NewEncoder(w).Encode(code)
}

// Validate a temporary code
func ValidateTempCode(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Access-Control-Allow-Methods", "GET, POST, PATCH, PUT, DELETE, OPTIONS")
	w.Header().Set("Access-Control-Allow-Headers:", "Origin, Content-Type, X-Auth-Token, Authorization")
	w.Header().Set("Content-Type", "application/json")

	vars := mux.Vars(r)
	code := vars["code"]
	expiration, ok := c.Get(code)

	if !ok || expiration == nil {
		json.NewEncoder(w).Encode("false")
		return
	}

	expirationTime, ok := expiration.(time.Time)
	if !ok {
		json.NewEncoder(w).Encode("false")
		return
	}

	if time.Now().After(expirationTime) {
		fmt.Println("expired")
		json.NewEncoder(w).Encode("false")
		return
	}

	json.NewEncoder(w).Encode("true")
}

func GenerateForgotPasswordCode(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Access-Control-Allow-Methods", "GET, POST, PATCH, PUT, DELETE, OPTIONS")
	w.Header().Set("Access-Control-Allow-Headers:", "Origin, Content-Type, X-Auth-Token, Authorization")
	w.Header().Set("Content-Type", "application/json")

	rand.Seed(time.Now().UnixNano())
	randomNum := rand.Intn(1000000)
	code := fmt.Sprintf("%06d", randomNum)

	expiration := time.Now().Add(5 * time.Minute)
	c.Set(code, expiration, cache.DefaultExpiration)

	json.NewEncoder(w).Encode(code)
}

// Validate a temporary code
func ValidateForgotPasswordCode(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Access-Control-Allow-Methods", "GET, POST, PATCH, PUT, DELETE, OPTIONS")
	w.Header().Set("Access-Control-Allow-Headers:", "Origin, Content-Type, X-Auth-Token, Authorization")
	w.Header().Set("Content-Type", "application/json")

	vars := mux.Vars(r)
	code := vars["code"]
	expiration, ok := c.Get(code)

	if !ok || expiration == nil {
		json.NewEncoder(w).Encode("false")
		return
	}

	expirationTime, ok := expiration.(time.Time)
	if !ok {
		json.NewEncoder(w).Encode("false")
		return
	}

	if time.Now().After(expirationTime) {
		fmt.Println("expired")
		json.NewEncoder(w).Encode("false")
		return
	}

	json.NewEncoder(w).Encode("true")
}
