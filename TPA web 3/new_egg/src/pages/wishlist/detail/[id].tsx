import Footer from "@/components/footer"
import Navbar from "@/components/navbar"
import Axios from "axios";
import { useRouter } from "next/router"
import { useState, useEffect } from "react";
import style from '../../../styles/wishlists.module.css'

export default function GetDetail(){
    const router = useRouter()
    const {id} = router.query
    const [wishlistHeader, setWishlistHeader] = useState([])
    const [wishlistDetail, setWishlistDetail] = useState([])
    const wishlistHeaderLink = "http://localhost:8080/getWishlistHeader"
    const wishlistDetailLink = "http://localhost:8080/getWishlistDetail"

    useEffect(() => {
        if(id != "" && id != undefined){
            Axios.get(wishlistHeaderLink,{
                params:{
                    ID: id
                }
            }).then(function (response) {
                // console.log(response.data)
                setWishlistHeader(response.data);
            })
            .catch(function (error) {
                console.log(error);
            })
            .then(function () {
                // always executed
            }); 

            Axios.get(wishlistDetailLink,{
                params:{
                    ID: id
                }
            }).then(function (response) {
                // console.log(response.data)
                setWishlistDetail(response.data)
            })
            .catch(function (error) {
                console.log(error);
            })
            .then(function () {
                // always executed
            }); 
        }
    }, [id])

    // useEffect(() => {
    //     console.log(wishlistDetail);
        
    // },[wishlistDetail])
   
    return(
        <div>
            <Navbar/>
                <h2>{wishlistHeader.Name}</h2>
                <h2>{wishlistHeader.Description}</h2>
                <h2>{wishlistHeader.Price}</h2>
                {
                    wishlistDetail ? 
                    wishlistDetail.map((wishlistDetailSingle) => {
                        return(<DetailCard details={wishlistDetailSingle} id={id} key={wishlistDetailSingle.ID}/>)
                    }): null
                }
            <Footer/>
        </div>
    )
}

function DetailCard(props:any){
    const prop = props
    var props = props.details
    // console.log(props)
    const link = "http://localhost:8080/deleteWishlistDetail"
    const updateLink = "http://localhost:8080/updateWishlistDetail"
    const [quantity, setQuantity] = useState(0)
    
    const deleteProduct = () => {
        Axios.get(link,{
            params:{
                wishlistHeaderID: prop.id,
                productID: props.Product.ID
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
        if(quantity < props.Product.Stock){
            setQuantity(quantity + 1);
        }
    };

    const handleDecrement = () => {
        if(quantity > 0){
            setQuantity(quantity - 1);
        }
    };
      
    const updateDetail = () => {
        Axios.get(updateLink,{
            params:{
                wishlistHeaderID: prop.id,
                productID: props.Product.ID,
                quantity: quantity
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

    return(
        <div  className={style["wishlist-detail-container"]}>
            
            <img src={props.Product.Url}></img>
            <div className={style["wishlist-detail-container-inside"]}>
                <h2>{props.Product.ProductName}</h2>
                <h3>{props.Product.ProductPrice}</h3>
                <h3>{props.Quantity}</h3>
                <div>
                
                <div className={style["button-style"]}>
                    <button onClick={handleDecrement}>-</button>
                    <input type="text" value={quantity}/>
                    <button onClick={handleIncrement}>+</button>
                </div>
                <button onClick={() => updateDetail()}>Update Quantity</button><br></br>
                <button onClick={() => deleteProduct()}>Delete</button>
            </div>
            </div>
            
        </div>
    )
}