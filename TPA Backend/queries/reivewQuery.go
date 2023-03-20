package query

import (
	databaseUtil "backend/database"
	"backend/model"
	"encoding/json"
	"fmt"
	"net/http"
	"strconv"
	"strings"
	"time"
)

func IsProductReviewed(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Access-Control-Allow-Methods", "GET, POST, PATCH, PUT, DELETE, OPTIONS")
	w.Header().Set("Access-Control-Allow-Headers:", "Origin, Content-Type, X-Auth-Token, Authorization")
	w.Header().Set("Content-Type", "application/json")

	db := databaseUtil.GetConnection()
	accountID, err := strconv.Atoi(r.URL.Query().Get("accountID"))
	productID, err := strconv.Atoi(r.URL.Query().Get("productID"))
	orderHeaderID, err := strconv.Atoi(r.URL.Query().Get("orderHeaderID"))
	// fmt.Println("============================")
	// fmt.Println(accountID)
	// fmt.Println(productID)
	// fmt.Println(orderHeaderID)
	if err != nil {
		fmt.Println(err)
		json.NewEncoder(w).Encode("Error")
		db.Close()
		return
	}

	var productReview model.ReviewProduct

	err = db.Model(&productReview).Where("review_product.account_id = ?", accountID).Where("review_product.product_id = ?", productID).Where("review_product.order_header_id = ?", orderHeaderID).Select()

	if err != nil {
		fmt.Println(err.Error())
		if err.Error() == "pg: no rows in result set" {
			json.NewEncoder(w).Encode("No review")
			db.Close()
			return
		}
	} else {
		json.NewEncoder(w).Encode("Reviewed")
		db.Close()
		return
	}

	if err != nil {
		fmt.Println(err)
		return
	}

}

func SetReview(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Access-Control-Allow-Methods", "GET, POST, PATCH, PUT, DELETE, OPTIONS")
	w.Header().Set("Access-Control-Allow-Headers:", "Origin, Content-Type, X-Auth-Token, Authorization")
	w.Header().Set("Content-Type", "application/json")

	db := databaseUtil.GetConnection()
	accountID, err := strconv.Atoi(r.URL.Query().Get("accountID"))
	productID, err := strconv.Atoi(r.URL.Query().Get("productID"))
	orderHeaderID, err := strconv.Atoi(r.URL.Query().Get("orderHeaderID"))
	review := r.URL.Query().Get("review")
	point, err := strconv.Atoi(r.URL.Query().Get("point"))

	if err != nil {
		fmt.Println(err)
		json.NewEncoder(w).Encode("Error")
		db.Close()
		return
	}

	if review == "" {
		fmt.Println(err)
		json.NewEncoder(w).Encode("Error")
		db.Close()
		return
	}

	var productReview = model.ReviewProduct{
		Review:        review,
		AccountID:     accountID,
		ProductID:     productID,
		OrderHeaderID: orderHeaderID,
		Point:         point,
	}

	_, err = db.Model(&productReview).Insert()

	if err != nil {
		fmt.Println("Insert review error")
		fmt.Println(err)
		json.NewEncoder(w).Encode("Error")
		db.Close()
		return
	}

	var product model.Product
	err = db.Model(&product).Where("id = ?", productID).Select()

	if err != nil {
		fmt.Println("Get product error")
		fmt.Println(err)
		json.NewEncoder(w).Encode("Error")
		db.Close()
		return
	}

	var productReviewed = product.Reviewed + 1
	var productPoint = product.Point + point
	var newProductRating = productPoint / productReviewed

	_, err = db.Model(&product).Where("id = ?", productID).Set("rating = ?", newProductRating).Set("reviewed = ?", productReviewed).Set("point = ?", productPoint).Update()

	if err != nil {
		fmt.Println("Get product error")
		fmt.Println(err)
		json.NewEncoder(w).Encode("Error")
		db.Close()
		return
	}

	json.NewEncoder(w).Encode("Success")
	db.Close()

}

func SetShopReview(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Access-Control-Allow-Methods", "GET, POST, PATCH, PUT, DELETE, OPTIONS")
	w.Header().Set("Access-Control-Allow-Headers:", "Origin, Content-Type, X-Auth-Token, Authorization")
	w.Header().Set("Content-Type", "application/json")

	db := databaseUtil.GetConnection()
	accountID, err := strconv.Atoi(r.URL.Query().Get("accountID"))
	shopID, err := strconv.Atoi(r.URL.Query().Get("shopID"))
	orderHeaderID, err := strconv.Atoi(r.URL.Query().Get("orderHeaderID"))
	review := r.URL.Query().Get("review")
	pointQuestion1, err := strconv.Atoi(r.URL.Query().Get("pointQuestion1"))
	pointQuestion2, err := strconv.Atoi(r.URL.Query().Get("pointQuestion2"))
	pointQuestion3, err := strconv.Atoi(r.URL.Query().Get("pointQuestion3"))
	shopPoint, err := strconv.Atoi(r.URL.Query().Get("shopPoint"))

	if err != nil {
		fmt.Println(err)
		json.NewEncoder(w).Encode("Error")
		db.Close()
		return
	}

	if review == "" {
		fmt.Println(err)
		json.NewEncoder(w).Encode("Error")
		db.Close()
		return
	}

	var reviewShop = model.ReviewShop{
		Review:         review,
		AccountID:      accountID,
		ShopID:         shopID,
		OrderHeaderID:  orderHeaderID,
		PointQuestion1: pointQuestion1,
		PointQuestion2: pointQuestion2,
		PointQuestion3: pointQuestion3,
		ShopPoint:      shopPoint,
		TimePosted:     time.Now().UTC(),
	}

	_, err = db.Model(&reviewShop).Insert()

	if err != nil {
		fmt.Println("Insert review error")
		fmt.Println(err)
		json.NewEncoder(w).Encode("Error")
		db.Close()
		return
	}

	var shop model.Shop
	err = db.Model(&shop).Where("id = ?", shopID).Select()

	if err != nil {
		fmt.Println("Get shop error")
		fmt.Println(err)
		json.NewEncoder(w).Encode("Error")
		db.Close()
		return
	}

	var shopReviewed = shop.Reviewed + 1
	var shopPointInput = shop.PointShop + shopPoint
	shopPointFloat, err := strconv.ParseFloat(strconv.Itoa(shopPointInput), 64)
	if err != nil {
		fmt.Println("error while parse shop point to float")
		fmt.Println(err)
		json.NewEncoder(w).Encode("Error")
		db.Close()
		return
	}
	var shopRating = int(shopPointFloat) / shopReviewed
	var shopPointQuestion1Input = shop.PointQuestion1 + pointQuestion1
	var shopQuestion1Rating = shopPointQuestion1Input / shopReviewed
	var shopPointQuestion2Input = shop.PointQuestion2 + pointQuestion2
	var shopQuestion2Rating = shopPointQuestion2Input / shopReviewed
	var shopPointQuestion3Input = shop.PointQuestion3 + pointQuestion3
	var shopQuestion3Rating = shopPointQuestion3Input / shopReviewed

	_, err = db.Model(&shop).Where("id = ?", shopID).Set("rating_shop = ?", shopRating).Set("reviewed = ?", shopReviewed).Set("point_question1 = ?", shopPointQuestion1Input).Set("point_question2 = ?", shopPointQuestion2Input).Set("point_question3 = ?", shopPointQuestion3Input).Set("rating_question1 = ?", shopQuestion1Rating).Set("rating_question2 = ?", shopQuestion2Rating).Set("rating_question3 = ?", shopQuestion3Rating).Set("point_shop = ?", shopPointInput).Update()

	if err != nil {
		fmt.Println("update shop error")
		fmt.Println(err)
		json.NewEncoder(w).Encode("Error")
		db.Close()
		return
	}

	json.NewEncoder(w).Encode("Success")
	db.Close()

}

func IsShopReviewed(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Access-Control-Allow-Methods", "GET, POST, PATCH, PUT, DELETE, OPTIONS")
	w.Header().Set("Access-Control-Allow-Headers:", "Origin, Content-Type, X-Auth-Token, Authorization")
	w.Header().Set("Content-Type", "application/json")

	db := databaseUtil.GetConnection()
	accountID, err := strconv.Atoi(r.URL.Query().Get("accountID"))
	shopID, err := strconv.Atoi(r.URL.Query().Get("shopID"))
	orderHeaderID, err := strconv.Atoi(r.URL.Query().Get("orderHeaderID"))
	fmt.Println("============================")
	fmt.Println(accountID)
	fmt.Println(shopID)
	fmt.Println(orderHeaderID)
	if err != nil {
		fmt.Println("error while parsing in is shop review")
		fmt.Println(err)
		json.NewEncoder(w).Encode("Error")
		db.Close()
		return
	}

	var shopReview model.ReviewShop

	err = db.Model(&shopReview).Where("account_id = ?", accountID).Where("shop_id = ?", shopID).Where("order_header_id = ?", orderHeaderID).Select()

	if err != nil {
		fmt.Println(err)
		json.NewEncoder(w).Encode("No review")
		db.Close()
		return
	}
	json.NewEncoder(w).Encode("Reviewed")
	db.Close()
	return

}

func GetShopReviewes(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Access-Control-Allow-Methods", "GET, POST, PATCH, PUT, DELETE, OPTIONS")
	w.Header().Set("Access-Control-Allow-Headers:", "Origin, Content-Type, X-Auth-Token, Authorization")
	w.Header().Set("Content-Type", "application/json")

	db := databaseUtil.GetConnection()
	shopID, err := strconv.Atoi(r.URL.Query().Get("shopID"))

	if err != nil {
		fmt.Println(err)
		json.NewEncoder(w).Encode("Error")
		db.Close()
		return
	}

	var shopReview []*model.ReviewShop

	err = db.Model(&shopReview).Where("review_shop.shop_id = ?", shopID).Relation("Account").Relation("Shop").Relation("OrderHeader").Select()

	if err != nil {
		fmt.Println("Error after select")
		fmt.Println(err)
		json.NewEncoder(w).Encode("Error")
		db.Close()
		return
	}

	json.NewEncoder(w).Encode(shopReview)
	db.Close()
	return

}

func GetShopReviewesFilterByTime(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Access-Control-Allow-Methods", "GET, POST, PATCH, PUT, DELETE, OPTIONS")
	w.Header().Set("Access-Control-Allow-Headers:", "Origin, Content-Type, X-Auth-Token, Authorization")
	w.Header().Set("Content-Type", "application/json")

	db := databaseUtil.GetConnection()
	shopID, err := strconv.Atoi(r.URL.Query().Get("shopID"))
	filterBy := r.URL.Query().Get("filterBy")
	search := fmt.Sprintf("%%%s%%", strings.ToLower(r.URL.Query().Get("search")))
	fmt.Println(search)
	if err != nil {
		fmt.Println(err)
		json.NewEncoder(w).Encode("error while parsing int in shop review filter")
		db.Close()
		return
	}

	var shopReview []*model.ReviewShop

	if filterBy == "" {
		err = db.Model(&shopReview).Where("review  LIKE ?", search).Where("review_shop.shop_id = ?", shopID).Relation("Account").Relation("Shop").Relation("OrderHeader").Select()

		if err != nil {
			fmt.Println("Error after select")
			fmt.Println(err)
			json.NewEncoder(w).Encode("Error")
			db.Close()
			return
		}
	} else if filterBy == "Time ASC" {
		err = db.Model(&shopReview).Where("review  LIKE ?", search).Where("review_shop.shop_id = ?", shopID).Order("time_posted ASC").Relation("Account").Relation("Shop").Relation("OrderHeader").Select()

		if err != nil {
			fmt.Println("Error after select")
			fmt.Println(err)
			json.NewEncoder(w).Encode("Error")
			db.Close()
			return
		}
	} else if filterBy == "Time DESC" {
		err = db.Model(&shopReview).Where("review  LIKE ?", search).Where("review_shop.shop_id = ?", shopID).Order("time_posted DESC").Relation("Account").Relation("Shop").Relation("OrderHeader").Select()

		if err != nil {
			fmt.Println("Error after select")
			fmt.Println(err)
			json.NewEncoder(w).Encode("Error")
			db.Close()
			return
		}
	}else if filterBy == "Week Ago" {

		now := time.Now()
		yesterdayStart := time.Date(now.Year(), now.Month(), now.Day()-1, 0, 0, 0, 0, time.Now().Location())
		yesterdayEnd := time.Date(now.Year(), now.Month(), now.Day()-1, 23, 59, 59, 999999999, time.Now().Location())
		

		err = db.Model(&shopReview).Where("time_posted BETWEEN ? AND ?", yesterdayStart, yesterdayEnd).Where("review  LIKE ?", search).Where("review_shop.shop_id = ?", shopID).Order("time_posted DESC").Relation("Account").Relation("Shop").Relation("OrderHeader").Select()

		if err != nil {
			fmt.Println("Error after select")
			fmt.Println(err)
			json.NewEncoder(w).Encode("Error")
			db.Close()
			return
		}
	}
	

	json.NewEncoder(w).Encode(shopReview)
	db.Close()
	return

}

func GetProductReviewes(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Access-Control-Allow-Methods", "GET, POST, PATCH, PUT, DELETE, OPTIONS")
	w.Header().Set("Access-Control-Allow-Headers:", "Origin, Content-Type, X-Auth-Token, Authorization")
	w.Header().Set("Content-Type", "application/json")

	db := databaseUtil.GetConnection()
	productID, err := strconv.Atoi(r.URL.Query().Get("productID"))

	if err != nil {
		fmt.Println(err)
		json.NewEncoder(w).Encode("Error")
		db.Close()
		return
	}

	var productReview []*model.ReviewProduct

	err = db.Model(&productReview).Where("review_product.product_id = ?", productID).Relation("Account").Relation("Product").Relation("OrderHeader").Select()

	if err != nil {
		fmt.Println("Error after select")
		fmt.Println(err)
		json.NewEncoder(w).Encode("Error")
		db.Close()
		return
	}

	json.NewEncoder(w).Encode(productReview)
	db.Close()
	return

}

func GetProductRevieweFromUser(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Access-Control-Allow-Methods", "GET, POST, PATCH, PUT, DELETE, OPTIONS")
	w.Header().Set("Access-Control-Allow-Headers:", "Origin, Content-Type, X-Auth-Token, Authorization")
	w.Header().Set("Content-Type", "application/json")

	db := databaseUtil.GetConnection()
	accountID, err := strconv.Atoi(r.URL.Query().Get("accountID"))

	if err != nil {
		fmt.Println(("error while parsing shop id in review from user product"))
		fmt.Println(err)
		json.NewEncoder(w).Encode("Error")
		db.Close()
		return
	}

	var productReview []*model.ReviewProduct

	err = db.Model(&productReview).Where("review_product.account_id = ?", accountID).Relation("Account").Relation("Product").Relation("OrderHeader").Select()

	if err != nil {
		fmt.Println("Error after select product review from user")
		fmt.Println(err)
		json.NewEncoder(w).Encode("Error")
		db.Close()
		return
	}

	json.NewEncoder(w).Encode(productReview)
	db.Close()
	return

}

func GetShopRevieweFromUser(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Access-Control-Allow-Methods", "GET, POST, PATCH, PUT, DELETE, OPTIONS")
	w.Header().Set("Access-Control-Allow-Headers:", "Origin, Content-Type, X-Auth-Token, Authorization")
	w.Header().Set("Content-Type", "application/json")

	db := databaseUtil.GetConnection()
	accountID, err := strconv.Atoi(r.URL.Query().Get("accountID"))

	if err != nil {
		fmt.Println(("error while parsing shop id in review from user shop"))
		fmt.Println(err)
		json.NewEncoder(w).Encode("Error")
		db.Close()
		return
	}

	var productReview []*model.ReviewShop

	err = db.Model(&productReview).Where("review_shop.account_id = ?", accountID).Relation("Account").Relation("Shop").Relation("OrderHeader").Select()

	if err != nil {
		fmt.Println("Error after select shop revie wform user")
		fmt.Println(err)
		json.NewEncoder(w).Encode("Error")
		db.Close()
		return
	}

	json.NewEncoder(w).Encode(productReview)
	db.Close()
	return

}

func DeleteProductReview(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Access-Control-Allow-Methods", "GET, POST, PATCH, PUT, DELETE, OPTIONS")
	w.Header().Set("Access-Control-Allow-Headers:", "Origin, Content-Type, X-Auth-Token, Authorization")
	w.Header().Set("Content-Type", "application/json")

	db := databaseUtil.GetConnection()
	reviewID, err := strconv.Atoi(r.URL.Query().Get("reviewID"))

	if err != nil {
		fmt.Println(("error while parsing review id in delete review"))
		fmt.Println(err)
		json.NewEncoder(w).Encode("Error")
		db.Close()
		return
	}

	var productReview []*model.ReviewProduct

	_, err = db.Model(&productReview).Where("id = ?", reviewID).Delete()

	if err != nil {
		fmt.Println("Error after delte product review")
		fmt.Println(err)
		json.NewEncoder(w).Encode("Error")
		db.Close()
		return
	}

	json.NewEncoder(w).Encode("Success")
	db.Close()
	return

}

func DeleteShopReview(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Access-Control-Allow-Methods", "GET, POST, PATCH, PUT, DELETE, OPTIONS")
	w.Header().Set("Access-Control-Allow-Headers:", "Origin, Content-Type, X-Auth-Token, Authorization")
	w.Header().Set("Content-Type", "application/json")

	db := databaseUtil.GetConnection()
	reviewID, err := strconv.Atoi(r.URL.Query().Get("reviewID"))
	accountID, err := strconv.Atoi(r.URL.Query().Get("accountID"))

	if err != nil {
		fmt.Println(("error while parsing review id in delete review"))
		fmt.Println(err)
		json.NewEncoder(w).Encode("Error")
		db.Close()
		return
	}

	var productReview model.ReviewShop

	err = db.Model(&productReview).Where("id = ?", reviewID).Select()

	if productReview.AccountID == accountID {
		_, err = db.Model(&productReview).Where("id = ?", reviewID).Delete()

		if err != nil {
			fmt.Println("Error after delte shop review")
			fmt.Println(err)
			json.NewEncoder(w).Encode("Error")
			db.Close()
			return
		}

		json.NewEncoder(w).Encode("Success")
		db.Close()
		return
	} else {
		json.NewEncoder(w).Encode("Credential not match")
		db.Close()
		return
	}

}

func UpdateShopReview(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Access-Control-Allow-Methods", "GET, POST, PATCH, PUT, DELETE, OPTIONS")
	w.Header().Set("Access-Control-Allow-Headers:", "Origin, Content-Type, X-Auth-Token, Authorization")
	w.Header().Set("Content-Type", "application/json")

	db := databaseUtil.GetConnection()
	reviewID, err := strconv.Atoi(r.URL.Query().Get("reviewID"))
	newQ1, err := strconv.Atoi(r.URL.Query().Get("newQ1"))
	newQ2, err := strconv.Atoi(r.URL.Query().Get("newQ2"))
	newQ3, err := strconv.Atoi(r.URL.Query().Get("newQ3"))
	shopPoint, err := strconv.Atoi(r.URL.Query().Get("shopPoint"))
	accountID, err := strconv.Atoi(r.URL.Query().Get("accountID"))
	review := r.URL.Query().Get("review")

	if err != nil {
		fmt.Println(("error while parsing review id in update review"))
		fmt.Println(err)
		json.NewEncoder(w).Encode("Error")
		db.Close()
		return
	}
	fmt.Println(reviewID)
	var shopReview model.ReviewShop

	err = db.Model(&shopReview).Where("id = ?", reviewID).Select()

	if err != nil {
		fmt.Println("Error after select shop review update reviwe")
		fmt.Println(err)
		json.NewEncoder(w).Encode("Error")
		db.Close()
		return
	}

	if shopReview.AccountID == accountID {
		var shop model.Shop

		_, err = db.Model(&shop).Where("id = ?", shopReview.ShopID).Set("point_question1 = ?", shop.PointQuestion1-shopReview.PointQuestion1).Set("point_question2 = ?", shop.PointQuestion2-shopReview.PointQuestion2).Set("point_question3 = ?", shop.PointQuestion3-shopReview.PointQuestion3).Set("point_shop = ?", shop.PointShop-shopReview.ShopPoint).Update()

		if err != nil {
			fmt.Println("Error after update point question in update reviwe")
			fmt.Println(err)
			json.NewEncoder(w).Encode("Error")
			db.Close()
			return
		}
		fmt.Println(shopReview.ShopID)
		err = db.Model(&shopReview).Where("id = ?", reviewID).Select()

		if err != nil {
			fmt.Println("Error after select 2 shop review update reviwe 1")
			fmt.Println(err)
			json.NewEncoder(w).Encode("Error")
			db.Close()
			return
		}

		_, err = db.Model(&shop).Where("id = ?", shopReview.ShopID).Set("point_question1 = ?", shop.PointQuestion1+newQ1).Set("point_question2 = ?", shop.PointQuestion2+newQ2).Set("point_question3 = ?", shop.PointQuestion3+newQ3).Set("point_shop = ?", shop.PointShop+shopPoint).Update()

		if err != nil {
			fmt.Println("Error after update point + in update reviwe")
			fmt.Println(err)
			json.NewEncoder(w).Encode("Error")
			db.Close()
			return
		}

		err = db.Model(&shopReview).Where("id = ?", reviewID).Select()

		if err != nil {
			fmt.Println("Error after select 2 shop review update reviwe 2")
			fmt.Println(err)
			json.NewEncoder(w).Encode("Error")
			db.Close()
			return
		}

		fmt.Println(shop.Reviewed)

		err = db.Model(&shop).Where("id = ?", shopReview.ShopID).Select()

		if err != nil {
			fmt.Println("Error after update point question in update reviwe")
			fmt.Println(err)
			json.NewEncoder(w).Encode("Error")
			db.Close()
			return
		}

		_, err = db.Model(&shop).Where("id = ?", shopReview.ShopID).Set("rating_question1 = ?", shop.PointQuestion1/shop.Reviewed).Set("rating_question2 = ?", shop.PointQuestion2/shop.Reviewed).Set("rating_question3 = ?", shop.PointQuestion3/shop.Reviewed).Set("rating_shop = ?", shop.PointShop/shop.Reviewed).Update()

		if err != nil {
			fmt.Println("Error after update rating question in update reviwe")
			fmt.Println(err)
			json.NewEncoder(w).Encode("Error")
			db.Close()
			return
		}

		err = db.Model(&shopReview).Where("id = ?", reviewID).Select()

		if err != nil {
			fmt.Println("Error after select 22 shop review update reviwe")
			fmt.Println(err)
			json.NewEncoder(w).Encode("Error")
			db.Close()
			return
		}

		_, err = db.Model(&shopReview).Where("id = ?", reviewID).Set("review = ?", review).Set("point_question1 = ?", newQ1).Set("point_question2 = ?", newQ2).Set("point_question3 = ?", newQ3).Set("shop_point = ?", shopPoint).Update()

		if err != nil {
			fmt.Println("Error after update point question 2 in update reviwe")
			fmt.Println(err)
			json.NewEncoder(w).Encode("Error")
			db.Close()
			return
		}

		json.NewEncoder(w).Encode("Success")
		db.Close()
		return
	} else {
		json.NewEncoder(w).Encode("Credential not match")
		db.Close()
		return
	}

}
