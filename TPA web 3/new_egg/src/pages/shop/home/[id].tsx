import { Card, Cards, CardShop } from "@/components/card"
import Footer from "@/components/footer"
import Navbar from "@/components/navbar"
import middleware from "@/utiil/token"
import axios from "axios"
import { useRouter } from "next/router"
import { useEffect, useState } from "react"
import style from '../../../styles/shops.module.css'
import changeBanner from "./changeBanner"

export default function Home(){
    const router = useRouter()
    const { id } = router.query
    const [shop, setNewShop] = useState([])
    const [products, setNewProduct] = useState([])
    const [shopID, setShopID] = useState()
    const next = () => {
        router.push("/shop/home/addProduct")
    }



    useEffect(() => {
        // Fetch the data for the specific product
        async function fetchProduct() {
          const res = await fetch(`http://localhost:3000/product/${id}`)
          console.log(id)
        }
        fetchProduct()
        if(id != undefined){
          axios.get('http://localhost:8080/getAShop/' + id).then(function (response) {
            setNewShop(response.data)
            console.log(response.data)
          })
          .catch(function (error) {
            console.log(error);
          })
          .then(function () {
            // always executed
          }); 

          axios.get("http://localhost:8080/GetAllProductsFromShop/" + id)
          .then(function (response) {
              setNewProduct(response.data)
              console.log(response.data)
          })
          .catch(function (error) {
            console.log(error);
          })
          .then(function () {
            // always executed
          }); 
        }

        // const link = "/shop/home" + 

        // middleware("/shop/home")

       
        middleware("/shop/home","Seller",router)
    }, [id])

    const goToChangeBanner = () => {
        router.push("/shop/home/changeBanner")    
    }

    const goToReview = () => {
        router.push("/shop/viewReview/" + id)
    }

    const updateShopInfo = () => {
        router.push("/shop/updateShop/" + id)
    }

    return(
        <div>
            <Navbar/>
                <div className={style["shop-header"]}>
                    <div className={style["shop-detail"]}>
                        <label className={style["shop-name"]}>{shop.Name}</label>
                        <label className={style["shop-desc"]}>{shop.Description}</label>
                    </div>
                    <div className={style["shop-statistic"]}>
                        <label className={style["shop-statistic-title"]}>Service Satisfaction</label>
                        <label className={style["shop-statistic-detail"]}>{shop.ServiceSatisfaction}</label>
                    </div>
                    <div className={style["shop-statistic"]}>
                        <label className={style["shop-statistic-title"]}>Delivery Statistic</label>
                        <label className={style["shop-statistic-detail"]}>{shop.DeliveryStatistic}</label>
                    </div>
                    <div className={style["shop-statistic"]}>
                        <label className={style["shop-statistic-title"]}>Product Accuracy</label>
                        <label className={style["shop-statistic-detail"]}>{shop.ProductAccuracy}</label>
                    </div>
                    <div className={style["shop-statistic"]}>
                        <label className={style["shop-statistic-title"]}>Success Transaction</label>
                        <label className={style["shop-statistic-detail"]}>{shop.NumberOfSales}</label>
                    </div>
                    
                </div>
                <button onClick={() => goToReview()}>View Review</button>
                <button onClick={() => updateShopInfo()}>Update Shop Info</button>
                <Cards>
                { products ? 
                    products.map((product:any) => {
                        // console.log(product)
                        return(
                            <CardShop key={product.ID} details={product}></CardShop>
                        ) 
                    }) : console.log('not yet')
                }
                </Cards>
                <div className={style["add-product-button"]} onClick={() => next()}>
                    <div className={style["plus-button"]}>
                        +
                    </div>
                </div>
                <div className={style["add-banner-button"]} onClick={() => goToChangeBanner()}>
                    <div className={style["banner-button"]}>
                        Banner
                    </div>
                </div>
                
            <Footer/>
        </div>
    )
}