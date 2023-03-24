import { useEffect, useState } from "react"
import { useRouter } from "next/router"
import axios from "axios"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import style from '../../../styles/shops.module.css'
import Axios from 'axios'
import { Card, Cards } from "@/components/card"
import middleware from "@/utiil/token"
import { json } from "stream/consumers"
import { limit } from "firebase/firestore"

const PAGE_LIMIT = 20;

export default function ShopDetail(){
    const router = useRouter()
    const { id } = router.query
    const [shop, setNewShop] = useState([])
    const [products, setNewProduct] = useState([])
    const [categories, setNewCategories] = useState([])
    const [filterBy, setFilterBy] = useState('')
    const [sortBy, setSortBy] = useState('')
    const [links, setLinks] = useState([])
    const getLink = 'http://localhost:8080/getBannerFromShop';
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [page, setPage] = useState(1); // Current page
    const [totalPages, setTotalPages] = useState(1);
    const [totalProduct, setTotalProducts] = useState('')
    const [status, setStatus] = useState('')

    // var status = ''

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
            console.log(response.data.Status);
            setStatus(response.data.Status)
            setNewShop(response.data)
            // console.log(response.data)
          })
          .catch(function (error) {
            console.log(error);
          })
          .then(function () {
            // always executed
          }); 
        }
        
        Axios.get("http://localhost:8080/getAllProductCategoriesFromShop/" + id)
        .then(function (response) {
            setNewCategories(response.data)
            // console.log(response.data)
            // setTotalPages(Math.ceil(response.data.total / PAGE_LIMIT));
        })
        .catch(function (error) {
          console.log(error);
        })
        .then(function () {
          // always executed
        }); 

        Axios.get("http://localhost:8080/GetAllProductsFromShop/" + id)
        .then(function (response) {
            console.log("hereeee")
            var jsonArray = response.data
            // console.log(response.data)
            console.log(Math.ceil(jsonArray.length / PAGE_LIMIT))
            setTotalPages(Math.ceil(jsonArray.length / PAGE_LIMIT));
            setTotalProducts(jsonArray.length)
        })
        .catch(function (error) {
          console.log(error);
        })
        .then(function () {
          // always executed
        }); 

        getAllProducts()
    }, [id])
    

    useEffect(() => {
        Axios.get(getLink,{
            params:{
                shopID: id
            }
        })
        .then(function (response) {
            setLinks(response.data)
            console.log(response.data)
        })
        .catch(function (error) {
          console.log(error);
        })
        .then(function () {
          // always executed
        }); 

        getAllProducts()
    }, [])


    
    const getAllProducts = () => {
        console.log("heho");
        
        Axios.get("http://localhost:8080/getAllProductsFromShopPaginated",{
            params:{
                page: page,
                limit: PAGE_LIMIT,
                shopID: id,
                sort: sortBy
            }
        })
        .then(function (response) {
            // console.log(response.data)
            setNewProduct(response.data)
            // setTotalPages(Math.ceil(products.length / PAGE_LIMIT));
            // console.log(response.data)
        })
        .catch(function (error) {
          console.log(error);
        })
        .then(function () {
          // always executed
        }); 
    }

    const getAllProductFromCategory = () => {

        Axios.get("http://localhost:8080/getAllProductsFromCategory",{
            params:{
                category: filterBy,
                sort: sortBy,
               
            }
        })
        .then(function (response) {
            var jsonArray = response.data
            console.log(Math.ceil(jsonArray.length / PAGE_LIMIT))
            setTotalPages(Math.ceil(jsonArray.length / PAGE_LIMIT));
        })
        .catch(function (error) {
          console.log(error);
        })
        .then(function () {
          // always executed
        }); 


        Axios.get("http://localhost:8080/getAllProductsFromCategoryPaginated",{
            params:{
                category: filterBy,
                page: page,
                limit: PAGE_LIMIT,
                sort: sortBy,
                shopID: id,
            }
        })
        .then(function (response) {
            setNewProduct(response.data)
            // console.log(response.data)
        })
        .catch(function (error) {
          console.log(error);
        })
        .then(function () {
          // always executed
        }); 
    }

    

    const handlePrevClick = () => {
        if (currentImageIndex === 0) {
        setCurrentImageIndex(links.length - 1);
        } else {
        setCurrentImageIndex(currentImageIndex - 1);
        }
    };

    const handleNextClick = () => {
        if (currentImageIndex === links.length - 1) {
        setCurrentImageIndex(0);
        } else {
        setCurrentImageIndex(currentImageIndex + 1);
        }
    };

    useEffect(() => {
        Axios.get("http://localhost:8080/getAllProductsFromShopPaginated",{
            params:{
                page: page,
                limit: PAGE_LIMIT,
                shopID: id,
                sort: sortBy
            }
        })
        .then(function (response) {
            // console.log(response.data)
            setNewProduct(response.data)
            // console.log(response.data)
        })
        .catch(function (error) {
          console.log(error);
        })
        .then(function () {
          // always executed
        }); 
    }, [page])


    const nextPage = () => {
        console.log(totalPages)
        if(page + 1 > totalPages){
            setPage(totalPages)
        }else{
            var pageNow = page+1
            console.log(pageNow)
            setPage(pageNow)
        }
       
    }

    const prevPage = () => {
        if(page - 1 <= 0){
            setPage(1)
        }else{
            var pageNow = page-1
            console.log(pageNow)
            setPage(pageNow)
        }
    }

    useEffect(() => {
        console.log(filterBy)
        console.log(sortBy)
        if(filterBy === ""){
            getAllProducts()
        }else{
            getAllProductFromCategory()
        }
    }, [filterBy, sortBy])

    const goToReview = () => {
        router.push("/shop/viewReview/" + id)
    }

    return(
        <div>
            <Navbar/>
                <h1>{status}</h1>
                <div className={style["shop-header"]}>
                    <div className={style["shop-detail"]}>
                        <label className={style["shop-name"]}>{shop.Name}</label>
                        <label className={style["shop-desc"]}>{shop.Description}</label>
                    </div>
                    <div className={style["shop-statistic"]}>
                        <label className={style["shop-statistic-title"]}>Service Satisfaction</label>
                        <label className={style["shop-statistic-detail"]}>{shop.PointQuestion1 / shop.Reviewed}</label>
                    </div>
                    <div className={style["shop-statistic"]}>
                        <label className={style["shop-statistic-title"]}>Delivery Statistic</label>
                        <label className={style["shop-statistic-detail"]}>{shop.PointQuestion2 / shop.Reviewed}</label>
                    </div>
                    <div className={style["shop-statistic"]}>
                        <label className={style["shop-statistic-title"]}>Product Accuracy</label>
                        <label className={style["shop-statistic-detail"]}>{shop.PointQuestion3 / shop.Reviewed}</label>
                    </div>
                    <div className={style["shop-statistic"]}>
                        <label className={style["shop-statistic-title"]}>Success Transaction</label>
                        <label className={style["shop-statistic-detail"]}>{shop.NumberOfSales}</label>
                    </div>
                    <div className={style["shop-statistic"]}>
                        <label className={style["shop-statistic-title"]}>Product Count</label>
                        <label className={style["shop-statistic-detail"]}>{totalProduct}</label>
                    </div>
                </div>
                  
                <select value={filterBy} onChange={(event) => setFilterBy(event.target.value)} className={style["dropdown"]} >
                    <option value={""}></option>
                   {
                    categories ?
                    categories.map((category:any) => {
                        return(<option key={category.ProductCategory.ID} value={category.ProductCategory.CategoryName}>{category.ProductCategory.CategoryName}</option>)
                    }): null
                   }
                </select>
                <select value={sortBy} onChange={(event) => setSortBy(event.target.value)} className={style["dropdown"]} >
                    <option value={""}></option>
                    <option value={"Price ASC"}>Sort Price Low to High</option>
                    <option value={"Price DESC"}>Sort Price High to Low</option>
                    <option value={"Rating ASC"}>Sort Rating Low to High</option>
                    <option value={"Rating DESC"}>Sort Rating High to Low</option>
                    <option value={"Reviews ASC"}>Sort Review Low to High</option>
                    <option value={"Reviews DESC"}>Sort Review High to Low</option>
                    <option value={"Sold ASC"}>Sort Sold Low to High</option>
                    <option value={"Sold DESC"}>Sort Sold High to Low</option>
                </select>
                <button onClick={() => goToReview()}>View Review</button>
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
                <button onClick={() => prevPage()}>prev</button>
                <button onClick={() => nextPage()}>next</button>
            <Footer/>
        </div>
    )

    
}