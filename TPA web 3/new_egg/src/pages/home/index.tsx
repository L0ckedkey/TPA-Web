import bell from '../assets/bell.png'
import logo from '../../assets/banner1.jpg'
import location from '../assets/location.png'
import 'react-slideshow-image/dist/styles.css'
import { Slide } from 'react-slideshow-image';
import Footer from '@/components/footer';
import Navbar from '@/components/navbar';
import style from '../../styles/pages.module.css'
import Image from 'next/image'
import { useEffect, useState } from 'react';
import Axios from 'axios'
import { Card, Cards } from '@/components/card';
import middleware, { getName, getRole, getShopID } from '@/utiil/token';
import { useRouter } from 'next/router'
import List from '@/components/infiniteScroll';

// const images = [
//     "https://promotions.newegg.com/nepro/23-0187/759x300.png",
//     "https://promotions.newegg.com/nepro/23-0177/759x300.jpg",
//     "https://promotions.newegg.com/nepro/23-0180/759x300.jpg",
// ];

const link = "http://localhost:8080/getAllProducts"
const getLink = 'http://localhost:8080/getBannerFromAdmin';
const getBestShopsLink = 'http://localhost:8080/getBestShop';

export default function Home(){
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [role, setRole] = useState('')
    const router = useRouter(); 
    const [shopID, setShopID] = useState('')
    const [filterBy, setFilterBy] = useState('')
    const [search, setSearch] = useState('')
    const [images, setImages] = useState([])
    const [isLoading, setLoading] = useState(true)
    const [bestShop, setBestShop] = useState([])


    useEffect(() => {
        Axios.get(getLink).then(function (response) {
            console.log(response.data);
            setImages(response.data);
            setLoading(false)
        })
        .catch(function (error) {
            console.log(error);
        });

        Axios.get(getBestShopsLink)
        .then(function (response) {
            console.log(response.data);
            setBestShop(response.data)
        })
        .catch(function (error) {
            console.log(error);
        });
        
    },[]);

    const handlePrevClick = () => {
        if (currentImageIndex === 0) {
        setCurrentImageIndex(images.length - 1);
        } else {
        setCurrentImageIndex(currentImageIndex - 1);
        }
    };

    const handleNextClick = () => {
        console.log("hehe")
        if (currentImageIndex === images.length - 1) {
        setCurrentImageIndex(0);
        } else {
        setCurrentImageIndex(currentImageIndex + 1);
        }
    };
    
    const [products, setNewProduct] = useState([])

    const getAllData = () => {
        Axios.get(link)
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

    useEffect(() => {

        const getCurRole = async () => {
            var role = await getRole()
            console.log("name navbar " + name)
            setRole(role)
        }
        
        getCurRole()
        
    }, [])

    const goToShop = async () => {
        var shopID = await getShopID()

        router.push("/shop/home/" + shopID)
    }
    const goToAdmin = async () => {
        router.push("/admin/home")
    }

    const searchFilter = (search:any) => {
        console.log(search)
        setSearch(search)

    }


    return(
        <div> 
            <Navbar onSearchFilter={searchFilter}/>
           
            <div className={style["carousel"]}>
                <div className={style["carousel-prev"]} onClick={() => handlePrevClick()}>
                    &#10094;
                </div>
               
                {!isLoading ?
                    <img src={images[currentImageIndex].Url} alt="slide" /> : null
                }
                <div className={style["carousel-next"]} onClick={() => handleNextClick()}>
                    &#10095;
                </div>
                
            </div>
            
            <select value={filterBy} onChange={(event) => setFilterBy(event.target.value)} className={style["filter-style"]}>
                <option value={""}></option>
                <option value={"priceASC"}>Price Lowest to Highest</option>
                <option value={"priceDESC"}>Price Highest to Lowest</option>
            </select>
            <h3 className={style["best-shop"]}>Best Shop</h3>
            <div className={style["best-shop-container"]}>
            {
                bestShop ? bestShop.map((bestShopSingle:any) => {
                    return(
                        <h3 className={style["best-shop-style"]}>{bestShopSingle.Name}</h3>
                    )
                }):null
            }
            </div>
            <List orderBy={filterBy} search={search} products={products}/>
            {
                role === "Seller" ? <button className={style["add-product-button"]} onClick={() => goToShop()}>Go To Shop</button> : role ==="Admin" ? <button onClick={() => goToAdmin()} className={style["add-product-button"]}>Go To Admin Page</button>: console.log()
            }
           
            <Footer/>
        </div>
    )

}