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
	r.HandleFunc("/checkAccountOnID", query.CheckAccountOnID).Methods("GET")
	r.HandleFunc("/changeAccountStatus", query.ChangeAccountStatus).Methods("GET")
	r.HandleFunc("/updatePhoneNumber", query.UpdatePhoneNumber).Methods("GET")
	r.HandleFunc("/changeNewsLetterStatus", query.ChangeNewsletterStatus).Methods("GET")
	r.HandleFunc("/changePasswordOnly", query.ChangePasswordOnly).Methods("GET")
	r.HandleFunc("/signIn/checkPassword", query.CheckPassword).Methods("GET")
	r.HandleFunc("/getAllProducts", query.GetAllProducts).Methods("GET")
	r.HandleFunc("/getAllProductsPrice", query.GetAllProductsPrice).Methods("GET")
	r.HandleFunc("/getAProduct/{id}", query.GetAProduct).Methods("GET")
	r.HandleFunc("/updateProduct", query.UpdateProduct).Methods("GET")
	r.HandleFunc("/getProductsByName", query.GetAllProductsName).Methods("GET")
	r.HandleFunc("/getProductsByBrand", query.GetAllProductsBrand).Methods("GET")
	r.HandleFunc("/getAllProductsPriceBrand", query.GetAllProductsPriceBrand).Methods("GET")
	r.HandleFunc("/getProductsByNameDistinct", query.GetAllProductsNameDistinct).Methods("GET")
	r.HandleFunc("/getProductsByProductDistinct", query.GetAllProductsBrandDistinct).Methods("GET")
	r.HandleFunc("/getSimiliarProduct", query.GetSimiliarProduct).Methods("GET")
	r.HandleFunc("/getSimiliarProductShop", query.GetSimiliarProductShop).Methods("GET")

	r.HandleFunc("/getAShop/{id}", query.GetAShop).Methods("GET")
	r.HandleFunc("/GetAllProductsFromShop/{id}", query.GetAllProductsFromShop).Methods("GET")
	r.HandleFunc("/getAllProductCategoriesFromShop/{id}", query.GetAllProductCategoriesFromShop).Methods("GET")
	r.HandleFunc("/getAllProductsFromShopPaginated", query.GetAllProductsFromShopPaginated).Methods("GET")
	r.HandleFunc("/getAllProductsFromCategoryPaginated", query.GetAllProductsFromCategoryPaginated).Methods("GET")
	r.HandleFunc("/getAllProductsFromCategory", query.GetAllProductsFromCategory).Methods("GET")
	r.HandleFunc("/getUserFromCookie", query.GetUserFromToken).Methods("GET")
	r.HandleFunc("/addProduct", query.CreateProduct).Methods("GET")
	r.HandleFunc("/addPromo", query.CreatePromo).Methods("GET")
	r.HandleFunc("/usePromo", query.UseVouchers).Methods("GET")
	r.HandleFunc("/getAllVouchers", query.GetAllVouchers).Methods("GET")
	r.HandleFunc("/getAllUsersForBlastEmail", query.GetAllUsersForBlastEmail).Methods("GET")
	r.HandleFunc("/addShop", query.AddShop).Methods("GET")
	r.HandleFunc("/getBestShop", query.GetBestShop).Methods("GET")
	r.HandleFunc("/updateShop", query.UpdateShop).Methods("GET")

	r.HandleFunc("/changePassword", query.ChangePassword).Methods("GET")
	r.HandleFunc("/getCarts", query.GetCarts).Methods("GET")
	r.HandleFunc("/getCartProducts", query.GetCartProducts).Methods("GET")
	r.HandleFunc("/addToCart", query.AddToCart).Methods("GET")
	r.HandleFunc("/deleteCart", query.DeleteCart).Methods("GET")
	r.HandleFunc("/updateCart", query.UpdateCart).Methods("GET")

	r.HandleFunc("/getOneTimeCode", query.GenerateTempCode).Methods("GET")
	r.HandleFunc("/validateOneTimeCode/{code}", query.ValidateTempCode).Methods("GET")
	r.HandleFunc("/getForgotPasswordCode", query.GenerateForgotPasswordCode).Methods("GET")
	r.HandleFunc("/validateForgotPasswordCode/{code}", query.ValidateForgotPasswordCode).Methods("GET")

	r.HandleFunc("/getBannerFromShop", query.GetAllBannerFromShop).Methods("GET")
	r.HandleFunc("/addBannerFromShop", query.AddBannerFromShop).Methods("GET")
	r.HandleFunc("/updateBannerFromShop", query.UpdateBannerFromShop).Methods("GET")
	r.HandleFunc("/deleteBannerFromShop", query.DeleteBannerFromShop).Methods("GET")

	r.HandleFunc("/addWishlistDetail", query.AddWishlistDetail).Methods("GET")
	r.HandleFunc("/addWishlistHeader", query.AddWishlistHeader).Methods("GET")
	r.HandleFunc("/updateWishlistHeader", query.UpdateWishlistHeader).Methods("GET")
	r.HandleFunc("/getWishlistDetail", query.GetWishlistDetail).Methods("GET")
	r.HandleFunc("/getWishlistHeader", query.GetWishlistHeader).Methods("GET")
	r.HandleFunc("/getAllPublicWishlist", query.GetAllPublicWishlist).Methods("GET")
	r.HandleFunc("/getWishlistByAccount", query.GetWishlistByAccount).Methods("GET")
	r.HandleFunc("/getWishlistHeaderFiltered", query.GetWishlistHeaderFiltered).Methods("GET")
	r.HandleFunc("/getWishlistHeaderPublicCount", query.GetWishlistHeaderPublicCount).Methods("GET")
	r.HandleFunc("/deleteWishlistDetail", query.DeleteWishlistDetail).Methods("GET")
	r.HandleFunc("/updateWishlistDetail", query.UpdateWishlistDetail).Methods("GET")
	r.HandleFunc("/addProductToCartFromWishlist", query.AddProductToCart).Methods("GET")
	r.HandleFunc("/duplicateWishlist", query.DuplicateWishlist).Methods("GET")
	r.HandleFunc("/getReviewCount", query.GetReviewCount).Methods("GET")

	r.HandleFunc("/addComment", query.AddComment).Methods("GET")
	r.HandleFunc("/getComments", query.GetComments).Methods("GET")
	r.HandleFunc("/addFollow", query.AddFollow).Methods("GET")
	r.HandleFunc("/unFollow", query.UnFollow).Methods("GET")
	r.HandleFunc("/isFollowing", query.IsFollowing).Methods("GET")

	r.HandleFunc("/getBannerFromAdmin", query.GetAllBannerFromAdmin).Methods("GET")
	r.HandleFunc("/addBannerFromAdmin", query.AddBannerFromAdmin).Methods("GET")
	r.HandleFunc("/updateBannerFromAdmin", query.UpdateBannerFromAdmin).Methods("GET")
	r.HandleFunc("/deleteBannerFromAdmin", query.DeleteBannerFromAdmin).Methods("GET")

	r.HandleFunc("/getAllMessageIDFromAccounts", query.GetAllMessageIDFromAccount).Methods("GET")
	r.HandleFunc("/addMessageID", query.AddMessageID).Methods("GET")
	r.HandleFunc("/checkMessageIDFromAccount", query.CheckMessageIDFromAccount).Methods("GET")

	r.HandleFunc("/cancelOrder", query.CancelOrder).Methods("GET")
	r.HandleFunc("/addOrder", query.AddOrder).Methods("GET")
	r.HandleFunc("/getOrderFromUserDistinctShop", query.GetOrderFromUserDistinctShop).Methods("GET")
	r.HandleFunc("/getOrderProducts", query.GetOrderProducts).Methods("GET")
	r.HandleFunc("/getOrderDetailShop", query.GetOrderDetailShop).Methods("GET")
	r.HandleFunc("/getOrderDetail", query.GetOrderDetail).Methods("GET")
	r.HandleFunc("/changeOrderStatus", query.ChangeOrderStatus).Methods("GET")
	r.HandleFunc("/getDoneOrderFromUserDistinctShop", query.GetDoneOrderFromUserDistinctShop).Methods("GET")
	r.HandleFunc("/orderAgain", query.OrderAgain).Methods("GET")

	r.HandleFunc("/addAddress", query.AddAddress).Methods("GET")
	r.HandleFunc("/getAccountAddress", query.GetAccountAddress).Methods("GET")
	r.HandleFunc("/getAddressbyID", query.GetAddressbyID).Methods("GET")

	r.HandleFunc("/isProductReviewed", query.IsProductReviewed).Methods("GET")
	r.HandleFunc("/setReview", query.SetReview).Methods("GET")
	r.HandleFunc("/setShopReview", query.SetShopReview).Methods("GET")
	r.HandleFunc("/isShopReviewed", query.IsShopReviewed).Methods("GET")
	r.HandleFunc("/getShopReviewes", query.GetShopReviewes).Methods("GET")
	r.HandleFunc("/getProductReviewes", query.GetProductReviewes).Methods("GET")
	r.HandleFunc("/getShopReviewesFilterByTime", query.GetShopReviewesFilterByTime).Methods("GET")
	r.HandleFunc("/removeHelpfull", query.RemoveHelpfull).Methods("GET")
	r.HandleFunc("/addHelpfull", query.AddHelpfull).Methods("GET")
	r.HandleFunc("/isHelpfull", query.IsHelpfull).Methods("GET")
	r.HandleFunc("/getProductRevieweFromUser", query.GetProductRevieweFromUser).Methods("GET")
	r.HandleFunc("/getShopRevieweFromUser", query.GetShopRevieweFromUser).Methods("GET")
	r.HandleFunc("/deleteShopReview", query.DeleteShopReview).Methods("GET")
	r.HandleFunc("/deleteProductReview", query.DeleteProductReview).Methods("GET")
	r.HandleFunc("/updateShopReview", query.UpdateShopReview).Methods("GET")

	log.Fatal(http.ListenAndServe(":8080", r))
}
