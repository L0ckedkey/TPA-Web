import Footer from "@/components/footer"
import Navbar from "@/components/navbar"
import axios from "axios"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/router"
import { useEffect, useState } from "react"
import cpu from '../../assets/inteli9.jpg'
import style from '../../styles/cards.module.css'
import { getUserID } from '@/utiil/token'
import Chat from "@/components/chat"
import ProductReview from "@/components/productReview"
import { AddToWishlist } from "@/components/wishlistCard"

export default function main(){
  const router = useRouter()
  const { id } = router.query
  const [product, setNewProduct] = useState([])
  const [shop, setNewShop] = useState([])
  const [quantity, setQuantity] = useState(0)
  const [accountID, setAcountID] = useState()
  const [wantToChat, setWantToChat] = useState(false)
  const [reviews, setReviews] = useState([])
  const [insertToWishlist, setInsertToWishlist] = useState(false)
  const [similiarProducts, setSimiliarProducts] = useState([])
  const [similiarShops, setSimiliarShops] = useState([])

  useEffect(() => {
    const getCurName = async () => {
      var name = await getUserID()
      setAcountID(name)

    }

    getCurName()
  }, [])
  
    useEffect(() => {
        // Fetch the data for the specific product
        async function fetchProduct() {
          const res = await fetch(`http://localhost:3000/product/${id}`)
          console.log(id)
        }
        fetchProduct()
        if(id != undefined){
          axios.get('http://localhost:8080/getAProduct/' + id).then(function (response) {
            setNewProduct(response.data)
            setNewShop(response.data.Shop)
            console.log(response.data.Shop)
          })
          .catch(function (error) {
            console.log(error);
          })
          .then(function () {
            // always executed
          }); 

          axios.get('http://localhost:8080/getProductReviewes',{
            params:{
              productID: id
            }
          }).then(function (response) {
            // setNewProduct(response.data)
            // setNewShop(response.data.Shop)
          
            setReviews(response.data)
          })
          .catch(function (error) {
            console.log(error);
          })
          .then(function () {
            // always executed
          });

          axios.get('http://localhost:8080/getSimiliarProduct',{
            params:{
              id: id
            }
          }).then(function (response) {
            console.log("similiar products");
            
            console.log(response.data);
                    
            setSimiliarProducts(response.data)
          })
          .catch(function (error) {
            console.log(error);
          })
          .then(function () {
            // always executed
          }); 
          axios.get('http://localhost:8080/getSimiliarProductShop',{
            params:{
              id: id
            }
          }).then(function (response) {
            console.log("similiar shop");
            
            console.log(response.data);
            setSimiliarShops(response.data)
            // setSimiliarProducts(response.data)
          })
          .catch(function (error) {
            console.log(error);
          })
          .then(function () {
            // always executed
          }); 

          

        }
    }, [id])

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

    const handleAddToCart = () => {
      // getCurName()
      console.log(accountID)
      console.log(id)
      console.log(quantity)
      if(quantity != 0){
        axios.get('http://localhost:8080/addToCart',{
        params: {
          accountID : accountID,
          productID : id,
          quantity: quantity,
          shopID : shop.ID,
        }
      }).then(function (response) {
          router.push("/home")
          })
          .catch(function (error) {
            console.log(error);
          })
          .then(function () {
            // always executed
          }); 
      }
    }

    const isChatting = () => {
      if(wantToChat){
        setWantToChat(false)
      }else{
        setWantToChat(true)
      }
    }

    const isAddToWishlist = () => {
      if(insertToWishlist){
        setInsertToWishlist(false)
      }else{
        setInsertToWishlist(true)
      }
    }
    return(
        <div>
          <Navbar/>
          <div className={style["product-detail"]}>
            <img src={product.Url} alt='eror' className={style["product-image-detail"]}></img>
            <div>
              <h2 className={style["product-title"]}>{product.ProductName}</h2>
              <div className={style["product-detail-detail"]}>
                <label className={style["product-price"]}>$ {product.ProductPrice}</label>
                <label>{product.Description}</label><br></br>
                {
                  accountID !== undefined && product.Stock > 0 ?
                  <div>
                    <div>
                    <button onClick={handleDecrement}>-</button>
                    <input type="text" value={quantity} className={style["spinner-adjust"]}/>
                    <button onClick={handleIncrement}>+</button>
                  </div>
                  <button className={style["add-to-cart"]} onClick={() => handleAddToCart()}>Add to Cart</button>
                    </div> : <h3>No stock</h3>
                }
                <div className={style["shop-container"]}>
                  <div className={style["shop-container-inside"]}>
                    <label className={style["shop-name"]}>{shop.Name}</label>
                    <label className={style["shop-description"]}>{shop.Description}</label>
                  </div>
                  <div>
                    <button className={style["visit-shop-button"]}> <Link href="/shop/[id]" as={`/shop/${shop.ID}`}>Visit Shop</Link></button>
                  </div>
                  <div>
                    <button className={style["visit-shop-button"]} onClick={isChatting}>Chat</button>
                  </div>
                  <div>
                    <button className={style["visit-shop-button"]} onClick={() => isAddToWishlist()}>Add to Wishlist</button>
                  </div>
                  {
                    wantToChat ? <Chat/> : null
                  }
                  
                </div>
               
              </div>
              
            </div>
            
          </div>
          {
            insertToWishlist ? <AddToWishlist accountID={accountID} product={product}/> : null
          }
          <div><br></br></div>
          {
            similiarShops ? 
            similiarShops.map((similiarProduct:any) => {
              return(<h5>Shop name : {similiarProduct.Shop.Name}</h5>)
            }):<h5>No similiar product</h5>
          }
          {
            similiarProducts ? 
            similiarProducts.map((similiarProduct:any) => {
              return(<h5>name : {similiarProduct.ProductName}</h5>)
            }):<h5>No similiar product</h5>
          }
          {
            reviews ?
            reviews.map((review:any) => {
              return(<ProductReview details={review} key={review.ID}/>)
            }): <h5>No Review</h5>
          }
          <Footer/>
        </div>
    )
}