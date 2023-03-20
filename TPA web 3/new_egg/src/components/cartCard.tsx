import Image from "next/image";
import React, { ReactNode, useEffect, useState } from "react";
import style from '../styles/cartCards.module.css'
import pc from '../assets/pc.jpg'
import Link from "next/link";
import { Router, useRouter } from "next/router";
import Axios  from "axios"
import { chownSync } from "fs";
import { getUserID } from "@/utiil/token";

var totalPrice = 0

export const Card = (props:any) =>{
    const { details } = props;
    // console.log("card")
    // console.log(details)
    return(
        <div className={style["card-container"]}>
            <p>{details.Shop.Name}</p>
            <p>{details.address}</p>
            <ShopProducts shopID={details.ShopID} accountID={details.AccountID} />
        </div>
    )
   
}


export const ShopProducts = (props:any) => {
    // console.log("Shop products")
    // console.log(props)
    const [products, setProducts] = useState([]);
    
    var price = 0
    const link = "http://localhost:8080/getCartProducts"
    useEffect(() => {
      Axios.get(link,{
        params:{
            accountID : props.accountID,
            shopID : props.shopID,
        }
      })
        .then(response => {
            console.log(response.data)
            setProducts(response.data);
        })
        .catch(error => {
          console.log(error);
        });
    }, [props.shopID]);


    

    return (
        <div>
          {products ? products.map((product:any) => {
            price = price + (product.Product.ProductPrice * product.Quantity)
            // console.log(product)
            return(
              <div>
                <ShopProductCard details={product}/>
               
              </div>

              
              )
          }) : null
          }
          <label className={style["label-total-price"]}>Total Price : ${price}</label>
        </div>
      );
}

const ShopProductCard = (props:any) => {

  

  var product = props.details
  console.log("cart card");
  
  console.log(product);
  
  const [quantity, setQuantity] = useState(1)

  const updateLink = "http://localhost:8080/updateCart"
  const deleteLink = "http://localhost:8080/deleteCart"
  const saveForLaterLink = "http://localhost:8080/addSaveForLater"
  const [accountID, setAccountID] = useState('')


  useEffect(() => {

    const getCurName = async () => {
        var name = await getUserID()
        setAccountID(name)
    }
    
    getCurName()      
}, [])

  const handleIncrement = () => {
    if(quantity < product.Product.Stock){
      setQuantity(quantity + 1);
    }
  };

  const handleDecrement = () => {
    if(quantity > 1){
      setQuantity(quantity - 1);
    }
  };

  const deleteCart = () => {
    Axios.get(deleteLink,{
      params:{
          cartID : product.ID,
      }
    })
      .then(response => {
          console.log(response.data)
          window.location.reload()
      })
      .catch(error => {
        console.log(error);
      });
  }

  const updateCart = () => {
    Axios.get(updateLink,{
      params:{
          cartID : product.ID,
          quantity: quantity
      }
    })
      .then(response => {
          console.log(response.data)
          window.location.reload()
      })
      .catch(error => {
        console.log(error);
      });
  }

  const saveForLater = () => {
    Axios.get(saveForLaterLink,{
      params:{
          accountID : accountID,
          productID:  product.Product.ID, 
          quantity:quantity
      }
    })
    .then(response => {
        console.log(response.data)
        window.location.reload()
    })
    .catch(error => {
      console.log(error);
    });
  }

  return(
  <div key={product.ID} className={style["card-adjust"]}>
      <img className={style["card-img"]} src={product.Product.Url} alt={"error"}></img>
      <div>
        <p>Name     : {product.Product.ProductName}</p>
        <p>Quantity : {product.Quantity}</p>
        <p>Total Price : ${product.Product.ProductPrice * product.Quantity}</p>
      </div>
      <div>
        <button onClick={handleDecrement}>-</button>
        <input type="text" value={quantity} className={style["spinner-adjust"]}/>
        <button onClick={handleIncrement}>+</button>
      </div>
      <button onClick={() => updateCart()}>Update</button>
      <button onClick={() => deleteCart()}>Delete</button>
      <button onClick={() => saveForLater()}>Save for later</button>
  </div>
  )
}