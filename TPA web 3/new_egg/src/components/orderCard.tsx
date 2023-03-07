import Image from "next/image";
import React, { ReactNode, useEffect, useState } from "react";
import style from '../styles/cartCards.module.css'
import pc from '../assets/pc.jpg'
import Link from "next/link";
import { Router, useRouter } from "next/router";
import Axios  from "axios"
import { chownSync, stat } from "fs";
import SetReview from "./review";
import { getUserID } from "@/utiil/token";
import Review from "@/pages/user/review";
import SetShopReview from "@/pages/user/review/shopReview";

var totalPrice = 0

export const Card = (props:any) =>{
  const { details } = props;
  const changeOrderStatusLink = "http://localhost:8080/changeOrderStatus"
  const cancelOrderLink = "http://localhost:8080/cancelOrder"
  const [status, setStatus] = useState(details.Status)

  const changeOrderStatus = (code:any) => {
    console.log(code)
    Axios.get(changeOrderStatusLink, {
        params:{
            InvoiceCode: code
        }
    }).then(function (response) {
        console.log(response.data)
        if(response.data == "Success"){
           setStatus("Done")
        }
    })
    .catch(function (error) {
    //   console.log(error);
    })
    .then(function () {
    // always executed
    });  
}

  const CancelOrder = (code:any) => {
    console.log(code)
    Axios.get(cancelOrderLink, {
      params:{
          orderHeaderID: code
      }
    }).then(function (response) {
      console.log(response.data)
      if(response.data == "Success"){
          setStatus("Done")
      }
    })
    .catch(function (error) {
    //   console.log(error);
    })
    .then(function () {
    // always executed
    }); 
  }
  console.log("card")
  console.log(details)
  if(status != "Done"){
    return(
      <div className={style["card-container"]}>
          <p>{details.Shop.Name}</p>
          <p>{status}</p>
          <p>{details.InvoiceCode}</p>
          <p>{details.DateOrdered}</p>
          <p>{details.Address.Location}</p>
          
          {
            status != "Sent" ? <button className={style["cancel-order"]} onClick={() => CancelOrder(details.ID)}>Cancel Order</button> : null
          }
          {
            details.Status === "Sent" ?
            <button onClick={() => changeOrderStatus(details.InvoiceCode)}>Done Order</button> : null
          }
          <ShopProductsNotHistory orderHeaderID={details.ID} accountID={details.AccountID} />
      </div>
    )
  }
  
   
}

export const CardHistory = (props:any) =>{
  const { details } = props;
  const router = useRouter()
  console.log(details)
  const changeOrderStatusLink = "http://localhost:8080/changeOrderStatus"
  const checkReviewLink = "http://localhost:8080/isShopReviewed"
  const addOrderAgainLink = "http://localhost:8080/orderAgain"
  const [status, setStatus] = useState(details.Status)
  const [isReviewed, setReviewed] = useState(false)
  const [search, setSearch] = useState('')


  const changeOrderStatus = (code:any) => {
    console.log(code)
    Axios.get(changeOrderStatusLink, {
        params:{
            InvoiceCode: code
        }
    }).then(function (response) {
        console.log(response.data)
        if(response.data == "Success"){
            setStatus("Done")
        }
    })
    .catch(function (error) {
    //   console.log(error);
    })
    .then(function () {
    // always executed
    });  
  }

  function checkReview(): Promise<boolean> {
    console.log(details.AccountID);
    console.log( details.ID);
    console.log(details.Shop.ID);

    return Axios.get(checkReviewLink,{
      params:{
          accountID : details.AccountID,
          orderHeaderID : details.ID,
          shopID: details.Shop.ID
      }
    })
      .then(response => {
        console.log(response.data)
          if(response.data == "Reviewed"){
            return true;
          }else{
            return false
          }
      })
      .catch(error => {
        console.log(error);
        return false
      });
  }
  
  const goToShopReview = () => {
    router.push("/user/review/shopReview")
  }
  

  function getReviewResult(shopID:any) {
    const [isReviewed, setIsReviewed] = useState(false);

    useEffect(() => {
      async function fetchReviewResult() {
        const result = await checkReview();
        setIsReviewed(result);
      }
      fetchReviewResult();
    }, [shopID]);
    
    return !isReviewed ? <SetShopReview shopID={details.Shop.ID} accountID={details.AccountID} orderHeaderID={details.ID}/> : null;
  }

  const orderAgain = () => {
    Axios.get(addOrderAgainLink,{
      params:{
          orderHeaderID : details.ID
      }
    })
    .then(response => {
      console.log(response.data)
    })
    .catch(error => {
      console.log(error);
      return false
    });
  }

  if(status == "Done"){
    return(
      <div className={style["card-container"]}>
          <p>{details.Shop.Name}</p>
          <p>{status}</p>
          <p>{details.InvoiceCode}</p>
          <p>{details.DateOrdered}</p>
          <p>{details.Address.Location}</p>
          <button onClick={() => orderAgain()}>Order Again</button>
          {
            details.Status === "Sent" ?
            <button onClick={() => changeOrderStatus(details.InvoiceCode)}>Done Order</button> : null
          }
           {
            getReviewResult(details.Shop.ID)
          }
          <ShopProducts orderHeaderID={details.ID} accountID={details.AccountID}/>
      </div>
    )
  }else if(status == "Cancelled"){
    return(
      <div className={style["card-container"]}>
          <p>{details.Shop.Name}</p>
          <p>{status}</p>
          <p>{details.InvoiceCode}</p>
          <p>{details.DateOrdered}</p>
          <p>{details.Address.Location}</p>
          <button onClick={() => orderAgain()}>Order Again</button>
          {/* {
            details.Status === "Sent" ?
            <button onClick={() => changeOrderStatus(details.InvoiceCode)}>Done Order</button> : null
          }
           {
            getReviewResult(details.Shop.ID)
          } */}
          <ShopProductsCancelled orderHeaderID={details.ID} accountID={details.AccountID}/>
      </div>
    )
  }
  
   
}

export const ShopProducts = (props:any) => {
    // console.log("Shop products")    
    // console.log(props)
    const [products, setProducts] = useState([]);
    const [isReviewed, setIsReviewed] = useState(false)
    const [accountID, setAccountID] = useState('')
    var price = 0
    const link = "http://localhost:8080/getOrderProducts"
    const checkReviewLink = "http://localhost:8080/isProductReviewed"

    useEffect(() => {

      const getCurName = async () => {
          var name = await getUserID()
          // console.log("name navbar " + name)
          setAccountID(name)
      }
      
      getCurName()      
      
       
  }, [])

    useEffect(() => {
      Axios.get(link,{
        params:{
            accountID : props.accountID,
            orderHeaderID : props.orderHeaderID,
        }
      })
        .then(response => {
          // console.log("ahoy");
          
          // console.log(response.data)
            setProducts(response.data);
        })
        .catch(error => {
          console.log(error);
        });
    }, [props.shopID]);

    function checkReview(productID:any): Promise<boolean> {
      console.log(accountID);
      console.log(productID);
      console.log(props.orderHeaderID);
      return Axios.get(checkReviewLink,{
        params:{
            accountID : accountID,
            orderHeaderID : props.orderHeaderID,
            productID: productID
        }
      })
        .then(response => {
          console.log(response.data)
            if(response.data == "Reviewed"){
              return true;
            }else{
              return false
            }
        })
        .catch(error => {
          console.log(error);
          return false
        });
    }
    function getReviewResult(productID:any) {
      const [isReviewed, setIsReviewed] = useState(false);
          
      
      
      useEffect(() => {
        async function fetchReviewResult() {
          const result = await checkReview(productID);
          setIsReviewed(result);
        }
        fetchReviewResult();
      }, [productID]);
      
      return isReviewed ? null : <SetReview orderHeaderID={props.orderHeaderID} accountID={accountID} productID={productID} />;
    }


    
    function PrintCard(props:any){
      console.log(props)
      const product = props.product
      price = price + (product.Product.ProductPrice * product.Quantity)
      
      return(
          <div key={product.ID} className={style["card-adjust"]}>
              <img className={style["card-img"]} src={product.Product.Url} alt={"error"}></img>
              <div>
                <p>Name     : {product.Product.ProductName}</p>
                <p>Quantity : {product.Quantity}</p>
                <p>Total Price : ${product.Product.ProductPrice * product.Quantity}</p>
              </div>
              {
                  getReviewResult(product.Product.ID)
              }   
          </div>
          
      )
    }

    return (
        <div>
          {products ? products.map((product:any) => {
            // console.log(product)
            return(<PrintCard product={product}/>)
            
          }) : null
          }
        </div>
      );
}



export const ShopProductsCancelled = (props:any) => {
  // console.log("Shop products")    
  // console.log(props)
  const [products, setProducts] = useState([]);
  const [isReviewed, setIsReviewed] = useState(false)
  const [accountID, setAccountID] = useState('')
  var price = 0
  const link = "http://localhost:8080/getOrderProducts"
  const checkReviewLink = "http://localhost:8080/isProductReviewed"

  useEffect(() => {

    const getCurName = async () => {
        var name = await getUserID()
        // console.log("name navbar " + name)
        setAccountID(name)
    }
    
    getCurName()      
    
     
}, [])

  useEffect(() => {
    Axios.get(link,{
      params:{
          accountID : props.accountID,
          orderHeaderID : props.orderHeaderID,
      }
    })
      .then(response => {
        // console.log("ahoy");
        
        // console.log(response.data)
          setProducts(response.data);
      })
      .catch(error => {
        console.log(error);
      });
  }, [props.shopID]);

  function checkReview(productID:any): Promise<boolean> {
    console.log(accountID);
    console.log(productID);
    console.log(props.orderHeaderID);
    return Axios.get(checkReviewLink,{
      params:{
          accountID : accountID,
          orderHeaderID : props.orderHeaderID,
          productID: productID
      }
    })
      .then(response => {
        console.log(response.data)
          if(response.data == "Reviewed"){
            return true;
          }else{
            return false
          }
      })
      .catch(error => {
        console.log(error);
        return false
      });
  }
  function getReviewResult(productID:any) {
    const [isReviewed, setIsReviewed] = useState(false);
        
    
    
    useEffect(() => {
      async function fetchReviewResult() {
        const result = await checkReview(productID);
        setIsReviewed(result);
      }
      fetchReviewResult();
    }, [productID]);
    
    return isReviewed ? null : <SetReview orderHeaderID={props.orderHeaderID} accountID={accountID} productID={productID} />;
  }


  
  function PrintCard(props:any){
    console.log(props)
    const product = props.product
    price = price + (product.Product.ProductPrice * product.Quantity)
    
    return(
        <div key={product.ID} className={style["card-adjust"]}>
            <img className={style["card-img"]} src={product.Product.Url} alt={"error"}></img>
            <div>
              <p>Name     : {product.Product.ProductName}</p>
              <p>Quantity : {product.Quantity}</p>
              <p>Total Price : ${product.Product.ProductPrice * product.Quantity}</p>
            </div>
        </div>
        
    )
  }

  return (
      <div>
        {products ? products.map((product:any) => {
          // console.log(product)
          return(<PrintCard product={product}/>)
          
        }) : null
        }
      </div>
    );
}

export const ShopProductsNotHistory = (props:any) => {
  // console.log("Shop products")    
  // console.log(props)
  const [products, setProducts] = useState([]);
  const [isReviewed, setIsReviewed] = useState(false)
  const [accountID, setAccountID] = useState('')
  var price = 0
  const link = "http://localhost:8080/getOrderProducts"
  const checkReviewLink = "http://localhost:8080/isProductReviewed"

  useEffect(() => {

    const getCurName = async () => {
        var name = await getUserID()
        // console.log("name navbar " + name)
        setAccountID(name)
    }
    
    getCurName()      
    
     
}, [])

  useEffect(() => {
    Axios.get(link,{
      params:{
          accountID : props.accountID,
          orderHeaderID : props.orderHeaderID,
      }
    })
      .then(response => {
        // console.log("ahoy");
        
        // console.log(response.data)
          setProducts(response.data);
      })
      .catch(error => {
        console.log(error);
      });
  }, [props.shopID]);
  
  function PrintCard(props:any){
    console.log(props)
    const product = props.product
    price = price + (product.Product.ProductPrice * product.Quantity)
    
    return(
        <div key={product.ID} className={style["card-adjust"]}>
            <img className={style["card-img"]} src={product.Product.Url} alt={"error"}></img>
            <div>
              <p>Name     : {product.Product.ProductName}</p>
              <p>Quantity : {product.Quantity}</p>
              <p>Total Price : ${product.Product.ProductPrice * product.Quantity}</p>
            </div> 
        </div>
        
    )
  }

  return (
      <div>
        {products ? products.map((product:any) => {
          // console.log(product)
          return(<PrintCard product={product}/>)
          
        }) : null
        }
      </div>
    );
}


