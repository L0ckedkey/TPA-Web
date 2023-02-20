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
export default function main(){
    const router = useRouter()
    const { id } = router.query
    const [product, setNewProduct] = useState([])
    const [shop, setNewShop] = useState([])
    const [quantity, setQuantity] = useState(0)
    const [accountID, setAcountID] = useState()
    var axiosLink
    
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
        }
    }, [id])

    const handleIncrement = () => {
      setQuantity(quantity + 1);
    };
  
    const handleDecrement = () => {
      setQuantity(quantity - 1);
    };

    const handleAddToCart = () => {
      console.log(accountID)
      console.log(id)
      console.log(quantity)
      axios.get('http://localhost:8080/addToCart',{
        params: {
          accountID : accountID,
          productID : id,
          quantity: quantity,
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


    return(
        <div>
          <Navbar/>
          <div className={style["product-detail"]}>
            <Image src={cpu} alt='eror' className={style["product-image-detail"]}></Image>
            <div>
              <h2 className={style["product-title"]}>{product.ProductName}</h2>
              <div className={style["product-detail-detail"]}>
                <label className={style["product-price"]}>$ {product.ProductPrice}</label>
                <label>{product.Description}</label><br></br>
                <div>
                    <button onClick={handleDecrement}>-</button>
                    <input type="text" value={quantity} className={style["spinner-adjust"]}/>
                    <button onClick={handleIncrement}>+</button>
                  </div>
                  <button className={style["add-to-cart"]} onClick={() => handleAddToCart()}>Add to Cart</button>
                <div className={style["shop-container"]}>
                  <div className={style["shop-container-inside"]}>
                    <label className={style["shop-name"]}>{shop.Name}</label>
                    <label className={style["shop-description"]}>{shop.Description}</label>
                  </div>
                  <div>
                    <button className={style["visit-shop-button"]}> <Link href="/shop/[id]" as={`/shop/${shop.ID}`}> Visit Shop</Link></button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <Footer/>
        </div>
    )
}