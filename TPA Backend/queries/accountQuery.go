package query

import (
	databaseUtil "backend/database"
	config "backend/jwtConfig"
	"backend/model"
	"encoding/json"
	"fmt"
	"net/http"
	"strconv"
	"time"

	"github.com/golang-jwt/jwt/v4"
	"github.com/gorilla/mux"
	"golang.org/x/crypto/bcrypt"
)

func ChangePassword(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Access-Control-Allow-Methods", "GET, POST, PATCH, PUT, DELETE, OPTIONS")
	w.Header().Set("Access-Control-Allow-Headers:", "Origin, Content-Type, X-Auth-Token, Authorization")
	w.Header().Set("Content-Type", "application/json")

	var account = *&model.Account{}
	db := databaseUtil.GetConnection()
	email := r.URL.Query().Get("email")
	fmt.Println(email)
	fmt.Println(r.URL.Query().Get("password"))
	password, _ := bcrypt.GenerateFromPassword([]byte(r.URL.Query().Get("password")), bcrypt.DefaultCost)
	hashedPassword := string(password)
	// fmt.Println(password)
	// _, err := db.Model(&account).Where("email = ?", email).Set("password = ?", ' ').Update()
	_, error := db.Model(&account).Where("email = ?", email).Set("password = ?", hashedPassword).Update()

	// if err != nil {
	// 	fmt.Println(err)
	// 	// json.NewEncoder(w).Encode("Error change password")
	// 	return
	// }

	if error != nil {
		fmt.Println(error)
		json.NewEncoder(w).Encode("Error change password")
		return
	}

	json.NewEncoder(w).Encode("Success")
	db.Close()
}

func CreateAccount(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Access-Control-Allow-Methods", "GET, POST, PATCH, PUT, DELETE, OPTIONS")
	w.Header().Set("Access-Control-Allow-Headers:", "Origin, Content-Type, X-Auth-Token, Authorization")
	w.Header().Set("Content-Type", "application/json")

	// init ke db pake gorm
	var db = databaseUtil.GetConnection()

	// di sini kita ambil value dari hasil passing pake url tadi
	params := mux.Vars(r)
	email := r.URL.Query().Get("email")
	firstName := r.URL.Query().Get("firstName")
	lastName := r.URL.Query().Get("lastName")
	phoneNumber := r.URL.Query().Get("phoneNumber")
	passwordInput := r.URL.Query().Get("password")

	agreement := r.URL.Query().Get("agreement")
	fmt.Println(len(email))

	if len(email) == 0 || len(passwordInput) == 0 || len(firstName) == 0 || len(phoneNumber) == 0 || len(firstName) == 0 {
		json.NewEncoder(w).Encode("Error")
		db.Close()
		return
	}

	password, _ := bcrypt.GenerateFromPassword([]byte(r.URL.Query().Get("password")), bcrypt.DefaultCost)
	hashedPassword := string(password)

	fmt.Println()
	// fmt.Println("lastName : " + )
	fmt.Println(email)
	fmt.Println(params)

	credential := &model.Account{
		Email:            email,
		Password:         hashedPassword,
		FirstName:        firstName,
		LastName:         lastName,
		PhoneNumber:      phoneNumber,
		Role:             "Customer",
		NewsLetterStatus: agreement,
		Status:           "Active",
		Money:            0,
	}
	fmt.Println(credential)
	// masukin ke db pkae gorm
	var _, err = db.Model(credential).Insert()
	if err != nil {
		panic(err)
	}

	db.Close()
}

func ChangeAccountStatus(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Access-Control-Allow-Methods", "GET, POST, PATCH, PUT, DELETE, OPTIONS")
	w.Header().Set("Access-Control-Allow-Headers:", "Origin, Content-Type, X-Auth-Token, Authorization")
	w.Header().Set("Content-Type", "application/json")

	id := r.URL.Query().Get("id")

	var account = *&model.Account{}
	db := databaseUtil.GetConnection()
	err := db.Model(&account).Where("id = ?", id).Select()

	if err != nil {
		fmt.Println(err)
		json.NewEncoder(w).Encode(err)
		return
	}

	if account.Role == "Seller" {
		var shop = *&model.Shop{}

		err := db.Model(&shop).Where("email = ?", account.Email).Select()

		if err != nil {
			fmt.Println(err)
			json.NewEncoder(w).Encode("error")
			return
		}

		if account.Status == "Active" {
			_, err := db.Model(&account).Where("id = ?", id).Set("status = ?", "Banned").Update()
			_, error := db.Model(&shop).Where("email = ?", account.Email).Set("status = ?", "Banned").Update()
			if err != nil {
				fmt.Println(err)
				json.NewEncoder(w).Encode(err)
				return
			}

			if error != nil {
				fmt.Println(error)
				json.NewEncoder(w).Encode(error)
				return
			}
		} else {
			_, err := db.Model(&account).Where("id = ?", id).Set("status = ?", "Active").Update()
			_, error := db.Model(&shop).Where("email = ?", account.Email).Set("status = ?", "Active").Update()
			fmt.Println("set Active")
			if err != nil {
				fmt.Println(err)
				json.NewEncoder(w).Encode(err)
				return
			}
			if error != nil {
				fmt.Println(error)
				json.NewEncoder(w).Encode(error)
				return
			}
		}
		json.NewEncoder(w).Encode("Success")

	} else {
		if account.Status == "Active" {
			_, err := db.Model(&account).Where("id = ?", id).Set("status = ?", "Banned").Update()

			if err != nil {
				fmt.Println(err)
				json.NewEncoder(w).Encode(err)
				return
			}
		} else {
			_, err := db.Model(&account).Where("id = ?", id).Set("status = ?", "Active").Update()
			fmt.Println("set Active")
			if err != nil {
				fmt.Println(err)
				json.NewEncoder(w).Encode(err)
				return
			}
		}
		json.NewEncoder(w).Encode("Success")
	}
	db.Close()
}

func ChangeNewsletterStatus(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Access-Control-Allow-Methods", "GET, POST, PATCH, PUT, DELETE, OPTIONS")
	w.Header().Set("Access-Control-Allow-Headers:", "Origin, Content-Type, X-Auth-Token, Authorization")
	w.Header().Set("Content-Type", "application/json")

	id, error := strconv.Atoi(r.URL.Query().Get("id"))
	if error != nil {
		fmt.Println(error)

	}
	var account = *&model.Account{}
	db := databaseUtil.GetConnection()
	err := db.Model(&account).Where("id = ?", id).Select()

	if err != nil {
		fmt.Println(err)
	}

	if account.NewsLetterStatus == "yes" {
		_, error := db.Model(&account).Where("id = ?", id).Set("news_letter_status = ?", "no").Update()

		if error != nil {
			fmt.Println(error)
			json.NewEncoder(w).Encode("Error")
		}

	} else {
		_, error := db.Model(&account).Where("id = ?", id).Set("news_letter_status = ?", "yes").Update()
		if error != nil {
			fmt.Println(error)
			json.NewEncoder(w).Encode("Error")
		}

	}

	json.NewEncoder(w).Encode("Success")

}

func GetAllUsers(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Access-Control-Allow-Methods", "GET, POST, PATCH, PUT, DELETE, OPTIONS")
	w.Header().Set("Access-Control-Allow-Headers:", "Origin, Content-Type, X-Auth-Token, Authorization")
	w.Header().Set("Content-Type", "application/json")

	var accounts []*model.Account
	var db = databaseUtil.GetConnection()
	status := fmt.Sprintf("%%%s%%", r.URL.Query().Get("filter"))
	fmt.Println(status)
	var err = db.Model(&accounts).Where("status LIKE ?", status).Where("role != ?", "Admin").Select()

	if err != nil {
		fmt.Println(err)
	}

	json.NewEncoder(w).Encode(accounts)
	db.Close()
}

func GetAllUsersForBlastEmail(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Access-Control-Allow-Methods", "GET, POST, PATCH, PUT, DELETE, OPTIONS")
	w.Header().Set("Access-Control-Allow-Headers:", "Origin, Content-Type, X-Auth-Token, Authorization")
	w.Header().Set("Content-Type", "application/json")

	var accounts []*model.Account
	var db = databaseUtil.GetConnection()

	var err = db.Model(&accounts).Where("news_letter_status = ?", "yes").Select()

	if err != nil {
		fmt.Println(err)
	}

	json.NewEncoder(w).Encode(accounts)
	db.Close()
}

func GetUserFromToken(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Access-Control-Allow-Methods", "GET, POST, PATCH, PUT, DELETE, OPTIONS")
	w.Header().Set("Access-Control-Allow-Headers:", "Origin, Content-Type, X-Auth-Token, Authorization")
	w.Header().Set("Content-Type", "application/json")
	tokenString := r.URL.Query().Get("token")

	fmt.Println(tokenString)
	token, err := jwt.Parse(tokenString, func(token *jwt.Token) (interface{}, error) {
		// verify the signing method
		if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
			return nil, fmt.Errorf("unexpected signing method: %v", token.Header["alg"])
		}

		// the secret key used to sign the token
		secret := []byte(config.JWT_KEY)

		// return the secret key as the signing key
		return secret, nil
	})
	if err != nil {
		fmt.Println(err)
	}

	// extract the user ID and email from the token claims
	claims, ok := token.Claims.(jwt.MapClaims)
	if !ok || !token.Valid {
		fmt.Errorf("invalid token")
	}

	// userID, ok := claims["user_id"].(float64)
	// if !ok {
	// 	return nil, fmt.Errorf("invalid user ID")
	// }

	type User struct {
		Email string
		Name  string
		Role  string
		ID    int
	}

	type Seller struct {
		Email  string
		Name   string
		Role   string
		ID     int
		ShopID int
	}

	// email, ok := claims["Email"].(string)
	// name, ok := claims["Name"].(string)
	// role, ok := claims["Role"].(string)
	// ID, ok := claims["ID"].(int)
	// fmt.Println("Get user from token : ", ID)
	// if role == "Seller" {
	// 	ShopID, ok := claims["ShopID"].(int)
	// 	if ok {
	// 		fmt.Println("yes")
	// 	}
	// 	seller := Seller{Email: email, Name: name, Role: role, ID: ID, ShopID: ShopID}
	// 	json.NewEncoder(w).Encode(seller)
	// } else {
	// 	user := User{Email: email, Name: name, Role: role, ID: ID}

	// 	json.NewEncoder(w).Encode(user)
	// }

	json.NewEncoder(w).Encode(claims)

	// create a new user object with the extracted information
	// user := &User{
	// 	ID:    int(userID),
	// 	Email: email,
	// }

}

func CheckAccount(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Access-Control-Allow-Methods", "GET, POST, PATCH, PUT, DELETE, OPTIONS")
	w.Header().Set("Access-Control-Allow-Headers:", "Origin, Content-Type, X-Auth-Token, Authorization")
	w.Header().Set("Content-Type", "application/json")

	var db = databaseUtil.GetConnection()

	email := r.URL.Query().Get("email")
	fmt.Println(email)

	var account = new(model.Account)
	var err = db.Model(account).Where("email = ?", email).Select()

	if err != nil {
		fmt.Println(err)
	}
	if account.Email != " " && account.Role != "Banned" {
		json.NewEncoder(w).Encode(&account)
	} else {
		json.NewEncoder(w).Encode("Invalid Email or Banned")
	}

	db.Close()
	// fmt.Println("hai")
}

func CheckAccountOnID(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Access-Control-Allow-Methods", "GET, POST, PATCH, PUT, DELETE, OPTIONS")
	w.Header().Set("Access-Control-Allow-Headers:", "Origin, Content-Type, X-Auth-Token, Authorization")
	w.Header().Set("Content-Type", "application/json")

	var db = databaseUtil.GetConnection()

	id, error := strconv.Atoi(r.URL.Query().Get("id"))

	if error != nil {
		fmt.Println(error)
		json.NewEncoder(w).Encode("error")
		db.Close()
		return
	}
	var account = new(model.Account)
	var err = db.Model(account).Where("id = ?", id).Select()

	if err != nil {
		fmt.Println(err)
	}
	if account.Email != " " && account.Role != "Banned" {
		json.NewEncoder(w).Encode(&account)
	} else {
		json.NewEncoder(w).Encode("Invalid Email or Banned")
	}

	db.Close()
	// fmt.Println("hai")
}

func UpdatePhoneNumber(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Access-Control-Allow-Methods", "GET, POST, PATCH, PUT, DELETE, OPTIONS")
	w.Header().Set("Access-Control-Allow-Headers:", "Origin, Content-Type, X-Auth-Token, Authorization")
	w.Header().Set("Content-Type", "application/json")

	var db = databaseUtil.GetConnection()

	phoneNumber := r.URL.Query().Get("phoneNumber")
	id, error := strconv.Atoi(r.URL.Query().Get("id"))

	if error != nil {
		fmt.Println(error)
		json.NewEncoder(w).Encode("error")
		return
	}

	var account = new(model.Account)
	var _, err = db.Model(account).Where("id = ?", id).Set("phone_number = ?", phoneNumber).Update()

	if err != nil {
		fmt.Println(err)
		json.NewEncoder(w).Encode("error")
		return
	} else {
		json.NewEncoder(w).Encode("success")
	}

	db.Close()
}

func CheckPassword(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Access-Control-Allow-Methods", "GET, POST, PATCH, PUT, DELETE, OPTIONS")
	w.Header().Set("Content-Type", "application/json")
	w.Header().Set("Access-Control-Allow-Credentials", "true")
	var db = databaseUtil.GetConnection()

	email := r.URL.Query().Get("email")
	password := r.URL.Query().Get("password")
	fmt.Println(email)

	var account = new(model.Account)
	var shop = new(model.Shop)
	var err = db.Model(account).Where("email = ?", email).First()

	var isMatch = false

	if account.Role == "Seller" {
		var error = db.Model(shop).Where("email = ?", email).First()
		if error != nil {
			fmt.Println(error)
		}
	}

	// name := account.FirstName + " " + account.LastName
	fmt.Println(account.Password)
	if bcrypt.CompareHashAndPassword([]byte(account.Password), []byte(password)) == nil {
		isMatch = true
	}

	fmt.Println(isMatch)

	if err != nil {
		fmt.Println(err)
	}

	if isMatch {
		// json.NewEncoder(w).Encode(&account)
		expTime := time.Now().Add(time.Hour * 2)
		// claims := &config.JWTClaim{
		// 	Username: email,
		// 	RegisteredClaims: jwt.RegisteredClaims{
		// 		Issuer:    "server",
		// 		ExpiresAt: jwt.NewNumericDate(expTime),
		// 	},
		// }
		fmt.Println(account.ID)
		if account.Role == "Seller" {
			fmt.Println(shop.ID)
			token := jwt.NewWithClaims(jwt.SigningMethodHS256, config.JWTClaimSeller{
				Name:             account.FirstName + " " + account.LastName,
				Email:            account.Email,
				ID:               account.ID,
				Role:             account.Role,
				ShopID:           shop.ID,
				NewsLetterStatus: account.NewsLetterStatus,
				PhoneNumber:      account.PhoneNumber,
				RegisteredClaims: jwt.RegisteredClaims{
					Issuer:    strconv.Itoa(99),
					ExpiresAt: jwt.NewNumericDate(expTime),
				},
			})

			key, err := token.SignedString([]byte(config.JWT_KEY))

			if err != nil {
				fmt.Println("error")
			}

			// resp := config.ResponseSeller{
			// 	Key: key,
			// 	Payload: config.JWTClaimSeller{
			// 		Name:   account.FirstName + " " + account.LastName,
			// 		Email:  account.Email,
			// 		ID:     account.ID,
			// 		Role:   account.Role,
			// 		ShopID: shop.ID,
			// 		RegisteredClaims: jwt.RegisteredClaims{
			// 			Issuer:    strconv.Itoa(99),
			// 			ExpiresAt: jwt.NewNumericDate(expTime),
			// 		},
			// 	},
			// }

			fmt.Println(key)
			json.NewEncoder(w).Encode(key)
		} else {
			token := jwt.NewWithClaims(jwt.SigningMethodHS256, config.JWTClaim{
				Name:             account.FirstName + " " + account.LastName,
				Email:            account.Email,
				ID:               account.ID,
				Role:             account.Role,
				NewsLetterStatus: account.NewsLetterStatus,
				PhoneNumber:      account.PhoneNumber,
				RegisteredClaims: jwt.RegisteredClaims{
					Issuer:    strconv.Itoa(99),
					ExpiresAt: jwt.NewNumericDate(expTime),
				},
			})

			key, err := token.SignedString([]byte(config.JWT_KEY))

			if err != nil {
				fmt.Println("error")
			}

			fmt.Println(key)
			json.NewEncoder(w).Encode(key)
		}

	} else {
		account = &model.Account{
			ID:       0,
			Password: "null",
		}
		json.NewEncoder(w).Encode(account)
	}

	db.Close()
	// fmt.Println("hai")
}

func ChangePasswordOnly(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Access-Control-Allow-Methods", "GET, POST, PATCH, PUT, DELETE, OPTIONS")
	w.Header().Set("Content-Type", "application/json")
	w.Header().Set("Access-Control-Allow-Credentials", "true")
	var db = databaseUtil.GetConnection()

	id, error := strconv.Atoi(r.URL.Query().Get("id"))
	if error != nil {
		fmt.Println(error)
		json.NewEncoder(w).Encode("error")

	}
	password := r.URL.Query().Get("oldPassword")

	var account = new(model.Account)
	var err = db.Model(account).Where("id = ?", id).First()

	var isMatch = false

	// name := account.FirstName + " " + account.LastName
	if bcrypt.CompareHashAndPassword([]byte(account.Password), []byte(password)) == nil {
		isMatch = true
	}

	if err != nil {
		fmt.Println(err)
		json.NewEncoder(w).Encode("error")

	}

	if isMatch {
		password, _ := bcrypt.GenerateFromPassword([]byte(r.URL.Query().Get("newPassword")), bcrypt.DefaultCost)
		hashedPassword := string(password)
		// fmt.Println(password)
		// _, err := db.Model(&account).Where("email = ?", email).Set("password = ?", ' ').Update()
		_, error := db.Model(account).Where("id = ?", id).Set("password = ?", hashedPassword).Update()
		if error != nil {
			fmt.Println(error)
			json.NewEncoder(w).Encode("error")

		}
		json.NewEncoder(w).Encode("success")

	} else {
		json.NewEncoder(w).Encode("wrong old password")

	}

	db.Close()
	// fmt.Println("hai")
}

func GetShopID(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Access-Control-Allow-Methods", "GET, POST, PATCH, PUT, DELETE, OPTIONS")
	w.Header().Set("Access-Control-Allow-Headers:", "Origin, Content-Type, X-Auth-Token, Authorization")
	w.Header().Set("Content-Type", "application/json")

	var db = databaseUtil.GetConnection()
	accountID, error := strconv.Atoi(r.URL.Query().Get("accountID"))

	if error != nil {
		fmt.Println(error)
		json.NewEncoder(w).Encode("error")
		return
	}

	var account = new(model.Account)
	var err = db.Model(account).Where("id = ?", accountID).Select()

	if err != nil {
		fmt.Println(err)
		json.NewEncoder(w).Encode("error")
		return
	}

	var shop model.Shop
	err = db.Model(&shop).Where("email = ?", account.Email).Select()

	if err != nil {
		fmt.Println(err)
		json.NewEncoder(w).Encode("error")
		return
	}

	json.NewEncoder(w).Encode(shop.ID)

	db.Close()
}
