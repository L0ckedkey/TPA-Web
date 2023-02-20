import { useEffect, useState } from "react"
import { useRouter } from "next/router"
import axios from "axios"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import style from '../../styles/shops.module.css'
import Axios from 'axios'
import { Card, Cards } from "@/components/card"
import middleware from "@/utiil/token"

export default function ShopDetail(){
    const router = useRouter()
    const { id } = router.query
    const [shop, setNewShop] = useState([])
    const [products, setNewProduct] = useState([])

    useEffect(() => {
        // Fetch the data for the specific product

        middleware(router.asPath, "",router)

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
        }


        Axios.get("http://localhost:8080/getAllProductsFromShop/" + id)
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

    }, [id])
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
                <Cards>
                { products ? 
                    products.map((product:any) => {
                        // console.log(product)
                        return(
                            <Card key={product.ID} details={product}></Card>
                        ) 
                    }) : console.log('not yet')

                }
                </Cards>
            <Footer/>
        </div>
    )
}