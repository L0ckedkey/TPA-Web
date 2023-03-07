import Axios from "axios";
import React, { ReactNode, useEffect, useState } from "react";

export default function AddToCartWishlist(props:any){
    
   // console.log(props);
   const link = "http://localhost:8080/addProductToCartFromWishlist"


   Axios.get(link,{
      params:{
            wishlistHeaderID: props
      }
   }).then(function (response) {
      console.log(response.data)
   })
   .catch(function (error) {
      console.log(error);
   })
   .then(function () {
      // always executed
   });

   // ketika di cart butuh accountID, quantity, productID, shopID
   // info dari wishlist detail productID, quantity, 
   // accountID bisa passing, shopID dapet dari productID
}