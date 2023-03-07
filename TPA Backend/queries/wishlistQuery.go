package query

import (
	databaseUtil "backend/database"
	"backend/model"
	"encoding/json"
	"fmt"
	"net/http"
	"strconv"
	"time"
)

func GetWishlistByAccount(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Access-Control-Allow-Methods", "GET, POST, PATCH, PUT, DELETE, OPTIONS")
	w.Header().Set("Access-Control-Allow-Headers:", "Origin, Content-Type, X-Auth-Token, Authorization")
	w.Header().Set("Content-Type", "application/json")

	accountID, error := strconv.Atoi(r.URL.Query().Get("ID"))
	if error != nil {
		fmt.Println(error)
	}
	db := databaseUtil.GetConnection()

	var wishlists []*model.WishlistHeader
	fmt.Println(accountID)
	err := db.Model(&wishlists).Where("account_id = ?", accountID).Select()

	if err != nil {
		fmt.Println(err)
	}
	fmt.Println("Wishlist HEader")
	fmt.Println(wishlists)
	json.NewEncoder(w).Encode(wishlists)
	db.Close()

}

func GetWishlistHeader(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Access-Control-Allow-Methods", "GET, POST, PATCH, PUT, DELETE, OPTIONS")
	w.Header().Set("Access-Control-Allow-Headers:", "Origin, Content-Type, X-Auth-Token, Authorization")
	w.Header().Set("Content-Type", "application/json")

	wishlistHeaderID, error := strconv.Atoi(r.URL.Query().Get("ID"))
	if error != nil {
		fmt.Println(error)
	}
	db := databaseUtil.GetConnection()

	var wishlists model.WishlistHeader

	err := db.Model(&wishlists).Where("id = ?", wishlistHeaderID).Select()

	if err != nil {
		fmt.Println("error in select wishlist header")
		fmt.Println(err)
		json.NewEncoder(w).Encode("Error")
		db.Close()
		return
	}

	json.NewEncoder(w).Encode(wishlists)
	db.Close()

}

func GetWishlistHeaderPublicCount(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Access-Control-Allow-Methods", "GET, POST, PATCH, PUT, DELETE, OPTIONS")
	w.Header().Set("Access-Control-Allow-Headers:", "Origin, Content-Type, X-Auth-Token, Authorization")
	w.Header().Set("Content-Type", "application/json")

	db := databaseUtil.GetConnection()
	var wishlists []*model.WishlistHeader
	err := db.Model(&wishlists).Where("status = ?", "Public").Select()

	if err != nil {
		fmt.Println("error in select wishlist header date desc")
		fmt.Println(err)
		json.NewEncoder(w).Encode("Error")
		db.Close()
		return
	}

	json.NewEncoder(w).Encode(wishlists)
	db.Close()

}

func GetWishlistHeaderFiltered(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Access-Control-Allow-Methods", "GET, POST, PATCH, PUT, DELETE, OPTIONS")
	w.Header().Set("Access-Control-Allow-Headers:", "Origin, Content-Type, X-Auth-Token, Authorization")
	w.Header().Set("Content-Type", "application/json")

	db := databaseUtil.GetConnection()
	filter := r.URL.Query().Get("filterBy")
	limit, err := strconv.Atoi(r.URL.Query().Get("limit"))
	page, err := strconv.Atoi(r.URL.Query().Get("page"))
	offset := (page - 1) * limit

	if err != nil {
		fmt.Println("error while parsing")
		fmt.Println(err)
		json.NewEncoder(w).Encode("Error")
		db.Close()
		return
	}

	var wishlists []*model.WishlistHeader

	if filter == "" {
		err := db.Model(&wishlists).Where("status = ?", "Public").Limit(limit).Offset(offset).Select()

		if err != nil {
			fmt.Println("error in select wishlist header date desc")
			fmt.Println(err)
			json.NewEncoder(w).Encode("Error")
			db.Close()
			return
		}
	} else if filter == "Date DESC" {
		err := db.Model(&wishlists).Where("status = ?", "Public").Order("created_date DESC").Limit(limit).Offset(offset).Select()

		if err != nil {
			fmt.Println("error in select wishlist header date desc")
			fmt.Println(err)
			json.NewEncoder(w).Encode("Error")
			db.Close()
			return
		}
	} else if filter == "Date ASC" {
		err := db.Model(&wishlists).Where("status = ?", "Public").Order("created_date ASC").Limit(limit).Offset(offset).Select()

		if err != nil {
			fmt.Println("error in select wishlist header date asc")
			fmt.Println(err)
			json.NewEncoder(w).Encode("Error")
			db.Close()
			return
		}
	} else if filter == "Rating DESC" {
		err := db.Model(&wishlists).Where("status = ?", "Public").Order("rating DESC").Limit(limit).Offset(offset).Select()

		if err != nil {
			fmt.Println("error in select wishlist header rating desc")
			fmt.Println(err)
			json.NewEncoder(w).Encode("Error")
			db.Close()
			return
		}
	} else if filter == "Rating ASC" {
		err := db.Model(&wishlists).Where("status = ?", "Public").Order("rating ASC").Limit(limit).Offset(offset).Select()

		if err != nil {
			fmt.Println("error in select wishlist header rating asc")
			fmt.Println(err)
			json.NewEncoder(w).Encode("Error")
			db.Close()
			return
		}
	} else if filter == "Price DESC" {
		err := db.Model(&wishlists).Where("status = ?", "Public").Order("price DESC").Limit(limit).Offset(offset).Select()

		if err != nil {
			fmt.Println("error in select wishlist header price desc")
			fmt.Println(err)
			json.NewEncoder(w).Encode("Error")
			db.Close()
			return
		}
	} else if filter == "Price ASC" {
		err := db.Model(&wishlists).Where("status = ?", "Public").Order("price ASC").Limit(limit).Offset(offset).Select()

		if err != nil {
			fmt.Println("error in select wishlist header price asc")
			fmt.Println(err)
			json.NewEncoder(w).Encode("Error")
			db.Close()
			return
		}
	} else if filter == "Review DESC" {
		err := db.Model(&wishlists).Where("status = ?", "Public").Order("reviews DESC").Limit(limit).Offset(offset).Select()

		if err != nil {
			fmt.Println("error in select wishlist header review desc")
			fmt.Println(err)
			json.NewEncoder(w).Encode("Error")
			db.Close()
			return
		}
	} else if filter == "Review ASC" {
		err := db.Model(&wishlists).Where("status = ?", "Public").Order("reviews ASC").Limit(limit).Offset(offset).Select()

		if err != nil {
			fmt.Println("error in select wishlist header review asc")
			fmt.Println(err)
			json.NewEncoder(w).Encode("Error")
			db.Close()
			return
		}
	} else if filter == "Follower DESC" {
		err := db.Model(&wishlists).Where("status = ?", "Public").Order("followers DESC").Limit(limit).Offset(offset).Select()

		if err != nil {
			fmt.Println("error in select wishlist header Follower desc")
			fmt.Println(err)
			json.NewEncoder(w).Encode("Error")
			db.Close()
			return
		}
	} else if filter == "Follower ASC" {
		err := db.Model(&wishlists).Where("status = ?", "Public").Order("followers ASC").Limit(limit).Offset(offset).Select()

		if err != nil {
			fmt.Println("error in select wishlist header Follower asc")
			fmt.Println(err)
			json.NewEncoder(w).Encode("Error")
			db.Close()
			return
		}
	}

	json.NewEncoder(w).Encode(wishlists)
	db.Close()

}

func GetAllPublicWishlist(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Access-Control-Allow-Methods", "GET, POST, PATCH, PUT, DELETE, OPTIONS")
	w.Header().Set("Access-Control-Allow-Headers:", "Origin, Content-Type, X-Auth-Token, Authorization")
	w.Header().Set("Content-Type", "application/json")

	db := databaseUtil.GetConnection()

	var wishlists []*model.WishlistHeader

	err := db.Model(&wishlists).Where("status = ?", "Public").Select()

	if err != nil {
		fmt.Println("error while select all public wishlist")
		fmt.Println(err)
		json.NewEncoder(w).Encode("Error")
		db.Close()
		return
	}

	// fmt.Println(wishlists)
	json.NewEncoder(w).Encode(wishlists)
	db.Close()

}

func GetWishlistDetail(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Access-Control-Allow-Methods", "GET, POST, PATCH, PUT, DELETE, OPTIONS")
	w.Header().Set("Access-Control-Allow-Headers:", "Origin, Content-Type, X-Auth-Token, Authorization")
	w.Header().Set("Content-Type", "application/json")

	db := databaseUtil.GetConnection()
	wishlistHeaderID, error := strconv.Atoi(r.URL.Query().Get("ID"))

	if error != nil {
		fmt.Println("error while parse int wishlistHeaderID detail")
		fmt.Println(error)
		json.NewEncoder(w).Encode("Error")
		db.Close()
		return
	}

	var wishlists []*model.WishlistDetail

	err := db.Model(&wishlists).Where("wishlist_header_id = ?", wishlistHeaderID).Relation("WishlistHeader").Relation("Product").Select()

	if err != nil {
		fmt.Println(err)
		if err.Error() == "pg: no rows in result set" {
			fmt.Println("err no result")
			json.NewEncoder(w).Encode("No data")
			db.Close()
			return
		}
	}

	json.NewEncoder(w).Encode(wishlists)
	db.Close()

}

func UpdateWishlistHeader(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Access-Control-Allow-Methods", "GET, POST, PATCH, PUT, DELETE, OPTIONS")
	w.Header().Set("Access-Control-Allow-Headers:", "Origin, Content-Type, X-Auth-Token, Authorization")
	w.Header().Set("Content-Type", "application/json")

	db := databaseUtil.GetConnection()
	wishlistHeaderID, error := strconv.Atoi(r.URL.Query().Get("wishlistHeaderID"))

	if error != nil {
		fmt.Println("error while parse int wishlistHeaderID")
		fmt.Println(error)
		json.NewEncoder(w).Encode("Error")
		db.Close()
		return
	}

	var wishlists model.WishlistHeader

	err := db.Model(&wishlists).Where("id = ?", wishlistHeaderID).Select()

	if err != nil {
		fmt.Println("error while select wishlist header")
		fmt.Println(err)
		json.NewEncoder(w).Encode("Error")
		db.Close()
		return
	}

	description := r.URL.Query().Get("description")
	status := r.URL.Query().Get("status")
	name := r.URL.Query().Get("name")

	if description != "" {
		_, err := db.Model(&wishlists).Where("id = ?", wishlistHeaderID).Set("description = ?", description).Update()
		if err != nil {
			fmt.Println("error while update description")
			fmt.Println(err)
			json.NewEncoder(w).Encode("Error")
			db.Close()
			return
		}
	}
	if status != "" {
		_, err := db.Model(&wishlists).Where("id = ?", wishlistHeaderID).Set("status = ?", status).Update()
		if err != nil {
			fmt.Println("error while update status")
			fmt.Println(err)
			json.NewEncoder(w).Encode("Error")
			db.Close()
			return
		}
	}

	if name != "" {
		_, err := db.Model(&wishlists).Where("id = ?", wishlistHeaderID).Set("name = ?", name).Update()

		if err != nil {
			fmt.Println("error while update description")
			fmt.Println(err)
			json.NewEncoder(w).Encode("Error")
			db.Close()
			return
		}
	}

	json.NewEncoder(w).Encode("Success")
	db.Close()

}

func AddWishlistHeader(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Access-Control-Allow-Methods", "GET, POST, PATCH, PUT, DELETE, OPTIONS")
	w.Header().Set("Access-Control-Allow-Headers:", "Origin, Content-Type, X-Auth-Token, Authorization")
	w.Header().Set("Content-Type", "application/json")

	name := r.URL.Query().Get("name")
	status := r.URL.Query().Get("status")
	description := r.URL.Query().Get("description")
	accountID, error := strconv.Atoi(r.URL.Query().Get("accountID"))

	if error != nil {
		fmt.Println(error)
	}
	db := databaseUtil.GetConnection()

	wishlistHeader := &model.WishlistHeader{
		AccountID:   accountID,
		Status:      status,
		Description: description,
		Price:       0,
		Name:        name,
		CreatedDate: time.Now(),
		Followers:   0,
	}

	var _, err = db.Model(wishlistHeader).Insert()

	if err != nil {
		fmt.Println("error in add wishlist header")
		fmt.Println(err)
		json.NewEncoder(w).Encode("Error")
		db.Close()
		return
	}
	json.NewEncoder(w).Encode("Success")
	db.Close()
}

func AddWishlistDetail(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Access-Control-Allow-Methods", "GET, POST, PATCH, PUT, DELETE, OPTIONS")
	w.Header().Set("Access-Control-Allow-Headers:", "Origin, Content-Type, X-Auth-Token, Authorization")
	w.Header().Set("Content-Type", "application/json")

	productID, error := strconv.Atoi(r.URL.Query().Get("productID"))
	quantity, error := strconv.Atoi(r.URL.Query().Get("quantity"))
	wishlistHeaderID, error := strconv.Atoi(r.URL.Query().Get("wishlistHeaderID"))
	db := databaseUtil.GetConnection()

	if error != nil {
		fmt.Println(error)
	}

	wishlistDetail := &model.WishlistDetail{
		WishlistHeaderID: wishlistHeaderID,
		ProductID:        productID,
		Quantity:         quantity,
	}

	var _, err = db.Model(wishlistDetail).Insert()

	if err != nil {
		fmt.Println("Error while insert wishlist detail")
		fmt.Println(err)
		json.NewEncoder(w).Encode("Error")
		db.Close()
		return
	}

	var wishlistHeader model.WishlistHeader
	err = db.Model(&wishlistHeader).Where("id = ?", wishlistHeaderID).Select()

	if err != nil {
		fmt.Println("Error while select wishlist header")
		fmt.Println(err)
		json.NewEncoder(w).Encode("Error")
		db.Close()
		return
	}

	var product model.Product

	err = db.Model(&product).Where("id = ?", productID).Select()
	if err != nil {
		fmt.Println("Error while select product")
		fmt.Println(err)
		json.NewEncoder(w).Encode("Error")
		db.Close()
		return
	}
	var price = wishlistHeader.Price + (product.ProductPrice * quantity)
	fmt.Println(price)
	_, err = db.Model(&wishlistHeader).Where("id = ?", wishlistHeaderID).Set("price = ?", price).Update()
	if err != nil {
		fmt.Println("Error while update wishlist header")
		fmt.Println(err)
		json.NewEncoder(w).Encode("Error")
		db.Close()
		return
	}

	json.NewEncoder(w).Encode("Success")
	db.Close()
}

func DeleteWishlistDetail(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Access-Control-Allow-Methods", "GET, POST, PATCH, PUT, DELETE, OPTIONS")
	w.Header().Set("Access-Control-Allow-Headers:", "Origin, Content-Type, X-Auth-Token, Authorization")
	w.Header().Set("Content-Type", "application/json")

	db := databaseUtil.GetConnection()
	wishlistHeaderID, err := strconv.Atoi(r.URL.Query().Get("wishlistHeaderID"))
	productID, err := strconv.Atoi(r.URL.Query().Get("productID"))

	if err != nil {
		fmt.Println("error while parsing to int delete wishlist")
		fmt.Println(err)
		json.NewEncoder(w).Encode("Error")
		db.Close()
		return
	}

	var wishlists []*model.WishlistDetail

	_, err = db.Model(&wishlists).Where("wishlist_header_id = ?", wishlistHeaderID).Where("product_id = ?", productID).Delete()

	if err != nil {
		fmt.Println("error in delete wishlist detail")
		fmt.Println(err)
		json.NewEncoder(w).Encode("Error")
		db.Close()
		return
	}

	json.NewEncoder(w).Encode("Success")
	db.Close()

}

func UpdateWishlistDetail(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Access-Control-Allow-Methods", "GET, POST, PATCH, PUT, DELETE, OPTIONS")
	w.Header().Set("Access-Control-Allow-Headers:", "Origin, Content-Type, X-Auth-Token, Authorization")
	w.Header().Set("Content-Type", "application/json")

	db := databaseUtil.GetConnection()
	wishlistHeaderID, err := strconv.Atoi(r.URL.Query().Get("wishlistHeaderID"))
	productID, err := strconv.Atoi(r.URL.Query().Get("productID"))
	quantity, err := strconv.Atoi(r.URL.Query().Get("quantity"))

	if err != nil {
		fmt.Println("error while parsing to int update wishlist")
		fmt.Println(err)
		json.NewEncoder(w).Encode("Error")
		db.Close()
		return
	}

	var wishlists []*model.WishlistDetail

	err = db.Model(&wishlists).Where("wishlist_header_id = ?", wishlistHeaderID).Where("product_id = ?", productID).Relation("Product").Select()

	if err != nil {
		fmt.Println("error in select wishlist header")
		fmt.Println(err)
		json.NewEncoder(w).Encode("Error")
		db.Close()
		return
	}

	var wishlistHeader model.WishlistHeader

	err = db.Model(&wishlistHeader).Where("id = ?", wishlistHeaderID).Select()

	if err != nil {
		fmt.Println("error in select wishlist header")
		fmt.Println(err)
		json.NewEncoder(w).Encode("Error")
		db.Close()
		return
	}

	var totalPrice = 0

	for i := 0; i < len(wishlists); i++ {
		var quan = wishlists[i].Quantity
		var price = wishlists[i].Product.ProductPrice

		totalPrice = totalPrice + (quan * price)
	}
	fmt.Println("total price")
	fmt.Println(totalPrice)
	fmt.Println(wishlistHeader.Price)
	var newPriceInput = wishlistHeader.Price - totalPrice
	_, err = db.Model(&wishlistHeader).Where("id = ?", wishlistHeaderID).Set("price = ?", newPriceInput).Update()

	if err != nil {
		fmt.Println("error in neutralizing price header")
		fmt.Println(err)
		json.NewEncoder(w).Encode("Error")
		db.Close()
		return
	}

	_, err = db.Model(&wishlists).Where("wishlist_header_id = ?", wishlistHeaderID).Where("product_id = ?", productID).Delete()

	if err != nil {
		fmt.Println("error in delete wishlist header")
		fmt.Println(err)
		json.NewEncoder(w).Encode("Error")
		db.Close()
		return
	}

	wishlistInsert := model.WishlistDetail{
		ProductID:        productID,
		WishlistHeaderID: wishlistHeaderID,
		Quantity:         quantity,
	}

	_, err = db.Model(&wishlistInsert).Insert()
	if err != nil {
		fmt.Println("error in insert wishlist detail")
		fmt.Println(err)
		json.NewEncoder(w).Encode("Error")
		db.Close()
		return
	}

	var product model.Product

	err = db.Model(&product).Where("id = ?", productID).Select()

	if err != nil {
		fmt.Println("error in select product")
		fmt.Println(err)
		json.NewEncoder(w).Encode("Error")
		db.Close()
		return
	}

	var newPrice = quantity * product.ProductPrice

	err = db.Model(&wishlistHeader).Where("id = ?", wishlistHeaderID).Select()

	if err != nil {
		fmt.Println("error in select price header again")
		fmt.Println(err)
		json.NewEncoder(w).Encode("Error")
		db.Close()
		return
	}

	_, err = db.Model(&wishlistHeader).Where("id = ?", wishlistHeaderID).Set("price = ?", wishlistHeader.Price+newPrice).Update()

	if err != nil {
		fmt.Println("error in update price header")
		fmt.Println(err)
		json.NewEncoder(w).Encode("Error")
		db.Close()
		return
	}

	json.NewEncoder(w).Encode("Success")
	db.Close()

}

func AddProductToCart(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Access-Control-Allow-Methods", "GET, POST, PATCH, PUT, DELETE, OPTIONS")
	w.Header().Set("Access-Control-Allow-Headers:", "Origin, Content-Type, X-Auth-Token, Authorization")
	w.Header().Set("Content-Type", "application/json")

	db := databaseUtil.GetConnection()
	wishlistHeaderID, err := strconv.Atoi(r.URL.Query().Get("wishlistHeaderID"))

	if err != nil {
		fmt.Println("error while parsing to int add to cart wishlist")
		fmt.Println(err)
		json.NewEncoder(w).Encode("Error")
		db.Close()
		return
	}

	var wishlistHeader model.WishlistHeader

	err = db.Model(&wishlistHeader).Where("id = ?", wishlistHeaderID).Select()

	if err != nil {
		fmt.Println("error while select header add to cart")
		fmt.Println(err)
		json.NewEncoder(w).Encode("Error")
		db.Close()
		return
	}

	var wishlistDetails []*model.WishlistDetail

	err = db.Model(&wishlistDetails).Where("wishlist_header_id = ?", wishlistHeaderID).Relation("Product").Select()

	if err != nil {
		fmt.Println("error while select details add to cart")
		fmt.Println(err)
		json.NewEncoder(w).Encode("Error")
		db.Close()
		return
	}

	for i := 0; i < len(wishlistDetails); i++ {
		var cart = model.Cart{
			AccountID: wishlistHeader.AccountID,
			Quantity:  wishlistDetails[i].Quantity,
			ProductID: wishlistDetails[i].ProductID,
			ShopID:    wishlistDetails[i].Product.ShopID,
		}

		_, err = db.Model(&cart).Insert()

		if err != nil {
			fmt.Println("error while insert to cart")
			fmt.Println(err)
			json.NewEncoder(w).Encode("Error")
			db.Close()
			return
		}

	}

	json.NewEncoder(w).Encode("Success")
	db.Close()

}

func DuplicateWishlist(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Access-Control-Allow-Methods", "GET, POST, PATCH, PUT, DELETE, OPTIONS")
	w.Header().Set("Access-Control-Allow-Headers:", "Origin, Content-Type, X-Auth-Token, Authorization")
	w.Header().Set("Content-Type", "application/json")

	db := databaseUtil.GetConnection()
	wishlistHeaderID, err := strconv.Atoi(r.URL.Query().Get("wishlistHeaderID"))
	accountID, err := strconv.Atoi(r.URL.Query().Get("accountID"))

	if err != nil {
		fmt.Println("error while parsing to int add to cart wishlist")
		fmt.Println(err)
		json.NewEncoder(w).Encode("Error")
		db.Close()
		return
	}

	var wishlistHeader model.WishlistHeader

	err = db.Model(&wishlistHeader).Where("id = ?", wishlistHeaderID).Select()

	if err != nil {
		fmt.Println("error while select header add to cart")
		fmt.Println(err)
		json.NewEncoder(w).Encode("Error")
		db.Close()
		return
	}

	wishlistHeader = model.WishlistHeader{
		AccountID:   accountID,
		Status:      wishlistHeader.Status,
		Description: wishlistHeader.Description,
		Price:       wishlistHeader.Price,
		Name:        wishlistHeader.Name,
	}

	_, err = db.Model(&wishlistHeader).Insert()

	if err != nil {
		fmt.Println("error while insert duplicate header")
		fmt.Println(err)
		json.NewEncoder(w).Encode("Error")
		db.Close()
		return
	}

	var wishlistDetails []*model.WishlistDetail

	err = db.Model(&wishlistDetails).Where("wishlist_header_id = ?", wishlistHeaderID).Relation("Product").Select()

	if err != nil {
		fmt.Println("error while select details add to cart")
		fmt.Println(err)
		json.NewEncoder(w).Encode("Error")
		db.Close()
		return
	}

	for i := 0; i < len(wishlistDetails); i++ {
		var detail = model.WishlistDetail{
			Quantity:         wishlistDetails[i].Quantity,
			ProductID:        wishlistDetails[i].ProductID,
			WishlistHeaderID: wishlistHeader.ID,
		}

		_, err = db.Model(&detail).Insert()

		if err != nil {
			fmt.Println("error while insert to detail")
			fmt.Println(err)
			json.NewEncoder(w).Encode("Error")
			db.Close()
			return
		}

	}

	json.NewEncoder(w).Encode("Success")
	db.Close()

}

func GetReviewCount(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Access-Control-Allow-Methods", "GET, POST, PATCH, PUT, DELETE, OPTIONS")
	w.Header().Set("Access-Control-Allow-Headers:", "Origin, Content-Type, X-Auth-Token, Authorization")
	w.Header().Set("Content-Type", "application/json")

	db := databaseUtil.GetConnection()
	wishlistHeaderID, err := strconv.Atoi(r.URL.Query().Get("wishlistHeaderID"))
	var point0 = 0
	var point1 = 0
	var point2 = 0
	var point3 = 0
	var point4 = 0
	var point5 = 0

	if err != nil {
		fmt.Println("error while parsing to int add to cart wishlist")
		fmt.Println(err)
		json.NewEncoder(w).Encode("Error")
		db.Close()
		return
	}

	var reviews []model.ReviewWishlist

	err = db.Model(&reviews).Where("wishlist_header_id = ?", wishlistHeaderID).Where("point = 0").Select()

	if err != nil {
		fmt.Println("error while select point 0")
		fmt.Println(err)
		json.NewEncoder(w).Encode("Error")
		db.Close()
		return
	}

	point0 = len(reviews)

	err = db.Model(&reviews).Where("wishlist_header_id = ?", wishlistHeaderID).Where("point = 1").Select()

	if err != nil {
		fmt.Println("error while select point 1")
		fmt.Println(err)
		json.NewEncoder(w).Encode("Error")
		db.Close()
		return
	}

	point1 = len(reviews)

	err = db.Model(&reviews).Where("wishlist_header_id = ?", wishlistHeaderID).Where("point = 2").Select()

	if err != nil {
		fmt.Println("error while select point 2")
		fmt.Println(err)
		json.NewEncoder(w).Encode("Error")
		db.Close()
		return
	}

	point2 = len(reviews)

	err = db.Model(&reviews).Where("wishlist_header_id = ?", wishlistHeaderID).Where("point = 3").Select()

	if err != nil {
		fmt.Println("error while select point 3")
		fmt.Println(err)
		json.NewEncoder(w).Encode("Error")
		db.Close()
		return
	}

	point3 = len(reviews)

	err = db.Model(&reviews).Where("wishlist_header_id = ?", wishlistHeaderID).Where("point = 4").Select()

	if err != nil {
		fmt.Println("error while select point 4")
		fmt.Println(err)
		json.NewEncoder(w).Encode("Error")
		db.Close()
		return
	}

	point4 = len(reviews)

	err = db.Model(&reviews).Where("wishlist_header_id = ?", wishlistHeaderID).Where("point = 5").Select()

	if err != nil {
		fmt.Println("error while select point 5")
		fmt.Println(err)
		json.NewEncoder(w).Encode("Error")
		db.Close()
		return
	}

	point5 = len(reviews)

	var points = model.ReviewCount{
		Point0: point0,
		Point1: point1,
		Point2: point2,
		Point3: point3,
		Point4: point4,
		Point5: point5,
	}

	json.NewEncoder(w).Encode(points)
	db.Close()

}
