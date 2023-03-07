import Axios from "axios";
import React, { ReactNode, useEffect, useState } from "react";

export default function DuplicateWishlist(wishlistHeader:any, accountID:any){
    
   console.log(wishlistHeader);
   console.log(accountID);
   const link = "http://localhost:8080/duplicateWishlist"


   Axios.get(link,{
      params:{
            wishlistHeaderID: wishlistHeader,
            accountID: accountID
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