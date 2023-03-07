import Image from "next/image";
import React, { ReactNode, useEffect, useState } from "react";
import style from '../styles/userCards.module.css'
import pc from '../assets/pc.jpg'
import Link from "next/link";
import { Router, useRouter } from "next/router";
import  Axios from "axios";
import { getUserID } from "@/utiil/token";
import { setFlagsFromString } from "v8";
import AddToCartWishlist from "./addToCart";
import DuplicateWishlist from "./duplicateWishlist";

export const Cards = (props:any) =>{
    return(
        <div className={style["cards-container"]}>
            {props.children}
        </div>
    )
}

function EditWishlist(props:any){
    // console.log(props.details);

    const link = 'http://localhost:8080/updateWishlistHeader';
    
    const [status, setStatus] = useState('')
    const [name, setName] = useState('')
    const [description, setDescription] = useState('');
    


    const updateWishlist = () => {
        Axios.get(link,{
            params:{
                name: name,
                description: description,
                status: status,
                wishlistHeaderID: props.details.ID
            }
        }).then(function (response) {
            // console.log(response.data)
            if(response.data == "Success"){
                window.location.reload()
            }
        })
        .catch(function (error) {
            console.log(error);
        })
        .then(function () {
            // always executed
        });  
    }

   

    return(
        <div>
            <div className={style["add-product-detail"]}>
                    <div className={style["add-product-title"]}>
                        <label>Wishlist Name</label>
                        <label>:</label>
                    </div>
                    <input type="text" className={style["add-product-input-text"]} placeholder='Wishlist Name' id="first-name" onChange={(event) => setName(event.target.value)}></input>
                </div>
                <div className={style["add-product-detail"]}>
                    <div className={style["add-product-title"]}>
                        <label>Wishlist Status</label>
                        <label>:</label>
                    </div>
                    <select className={style["dropdown"]} value={status} onChange={(event) =>setStatus(event.target.value)}>
                        <option value={""}></option>
                        <option value={"Private"}>Private</option>
                        <option value={"Public"}>Public</option>
                    </select>
                </div>
                <div className={style["add-product-detail"]}>
                    <div className={style["add-product-title"]}>
                        <label>Wishlist Description</label>
                        <label>:</label>
                    </div>
                    <textarea className={style["textarea"]} onChange={(event) => setDescription(event.target.value)}></textarea>
                </div>
                <button onClick={() => updateWishlist()}>Update Wishlist</button>
                
        </div>
    )
}

export const Card = (props:any) => {
    // console.log(props)
    const [link, setNewLink] = useState('')
    const router = useRouter()
    const [editWishlist, setEditWishlist] = useState(false)
    props = props.details
    // console.log(props);
    
    // console.log("card")

    const setNewEditWishlist = () => {
        if(editWishlist){
            setEditWishlist(false)
        }else{
            setEditWishlist(true)
        }
    }

    const goToWishlistDetail = () => {
        router.push("/wishlist/detail/"+props.ID)
    }

    const addToCart = (wishlistHeaderID:any) => {
        console.log("here");
        
        AddToCartWishlist(wishlistHeaderID)
    }

    return (
        <div className={style["card-container"]}>
            <div className={style["card-adjust"]}>
                <div className={style["card-detail-adjust"]}>
                    <label>Name : {props.Name}</label>
                    <label>Price : {props.Price}</label>
                    <label>Status : {props.Status}</label>
                    <label>Description : {props.Description}</label>
                    <label>ID : {props.ID}</label>
                    <button onClick={() => goToWishlistDetail()}>Details</button>
                    <button onClick={() => setNewEditWishlist()}>Edit</button>
                    <button onClick={() => addToCart(props.ID)}>Add To Cart</button>
                </div>
            </div>
           {
            editWishlist ?
            <EditWishlist details={props}/>: null
           }
        </div>
    )
}

export function AddToWishlist(props:any){
    console.log(props);
    const [wishlistHeader, setWishlistHeader] = useState([])
    const link = 'http://localhost:8080/getWishlistByAccount';
   

    useEffect(() => {
        Axios.get(link,{
            params:{
                ID: props.accountID
            }
        }).then(function (response) {
            console.log(response.data)
            setWishlistHeader(response.data)
          })
          .catch(function (error) {
            console.log(error);
          })
          .then(function () {
            // always executed
          });  
    }, [props])


    return(
        wishlistHeader ?
        wishlistHeader.map((wishlistHeaderSingle:any) => {
            return<AddToWishlistCard details={wishlistHeaderSingle} product={props.product}/>
        }):null
    )
   

   
}

function AddToWishlistCard(props:any){
    var product = props.product
    var props = props.details
    console.log(props);
    
    const [quantity, setQuantity] = useState(0)
    const link = 'http://localhost:8080/addWishlistDetail';
    const addDetailToHeader = () => {
        Axios.get(link,{
            params:{
                productID: product.ID,
                quantity: quantity,
                wishlistHeaderID: props.ID
            }
        }).then(function (response) {
            console.log(response.data)
            window.location.reload()
          })
          .catch(function (error) {
            console.log(error);
          })
          .then(function () {
            // always executed
          });  
    }

    const handleIncrement = () => {
      
        if(quantity < product.Stock){
          setQuantity(quantity + 1);
        }
        
      };
    
      const handleDecrement = () => {
        if(quantity > 0){
          setQuantity(quantity - 1);
        }
        
      };

      return(
        <div>
            <label>{props.Name}</label><br></br>
            <label>{props.Status}</label><br></br>
            <label>{props.Price}</label><br></br>
            <div>
                <button onClick={handleDecrement}>-</button>
                <input type="text" value={quantity} className={style["spinner-adjust"]}/>
                <button onClick={handleIncrement}>+</button>
            </div>
            <button onClick={() => addDetailToHeader()}>Add to wishlists</button>
        </div>
    )
}


export const PublicCard = (props:any) => {
    // console.log(props)
    const [link, setNewLink] = useState('')
    const router = useRouter()
    const [editWishlist, setEditWishlist] = useState(false)
    props = props.details
    console.log(props);
    const [accountID, setAccountID] = useState('')
    const isFollowinglink = 'http://localhost:8080/isFollowing';
    const unFollowinglink = 'http://localhost:8080/unFollow';
    const Followinglink = 'http://localhost:8080/addFollow';
    const [following, setFollowing] = useState(false)
    useEffect(() => {

        const getCurName = async () => {
            var name = await getUserID()
            setAccountID(name)
        }
        
        getCurName()      
    }, [])

   useEffect(() => {
        if(accountID != ""){
            Axios.get(isFollowinglink,{
                params:{
                    accountID : accountID,
                    wishlistHeaderID: props.ID
                }
            }).then(function (response) {
                console.log(response.data)

                if(response.data == "Error"){
                    setFollowing(false)
                }else{
                    setFollowing(true)
                }
            })
            .catch(function (error) {
                console.log(error);
            })
            .then(function () {
                // always executed
            });  
        }
   }, [accountID])


    const goToWishlistDetail = () => {
        router.push("/wishlist/public/"+props.ID)
    }

    const updateFollStatus = () => {
        if(following){
            Axios.get(unFollowinglink,{
                params:{
                    accountID : accountID,
                    wishlistHeaderID: props.ID
                }
            }).then(function (response) {
                console.log(response.data)

                if(response.data == "Error"){
                    setFollowing(false)
                }else{
                    setFollowing(true)
                }
            })
            .catch(function (error) {
                console.log(error);
            })
            .then(function () {
                // always executed
            });
        }else{
            Axios.get(Followinglink,{
                params:{
                    accountID : accountID,
                    wishlistHeaderID: props.ID
                }
            }).then(function (response) {
                console.log(response.data)

                if(response.data == "Error"){
                    setFollowing(false)
                }else{
                    setFollowing(true)
                }
            })
            .catch(function (error) {
                console.log(error);
            })
            .then(function () {
                // always executed
            });
        }
    }

    const goToDuplicateWishlist = (wishlistHeaderID:any, accountID:any) => {
        DuplicateWishlist(wishlistHeaderID, accountID)
    }


    return (
        <div className={style["card-container"]}>
            <div className={style["card-adjust"]}>
                <div className={style["card-detail-adjust"]}>
                    <label>Name : {props.Name}</label>
                    <label>Price : {props.Price}</label>
                    <label>Status : {props.Status}</label>
                    <label>Description : {props.Description}</label>
                    <label>ID : {props.ID}</label>
                    {
                        following ? <button onClick={() => updateFollStatus()}>Unfoll</button> : <button onClick={() => updateFollStatus()}>follow</button>
                    }
                    <button onClick={() => goToWishlistDetail()}>Details</button>
                    <button onClick={() => goToDuplicateWishlist(props.ID, accountID)}>Duplicate</button>
                </div>
            </div>
        </div>
    )
}