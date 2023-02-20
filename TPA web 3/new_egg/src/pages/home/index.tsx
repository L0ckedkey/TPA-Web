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

const images = [
    "https://promotions.newegg.com/nepro/23-0187/759x300.png",
    "https://promotions.newegg.com/nepro/23-0177/759x300.jpg",
    "https://promotions.newegg.com/nepro/23-0180/759x300.jpg",
];

const link = "http://localhost:8080/getAllProducts"


export default function Home(){
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [role, setRole] = useState('')
    const router = useRouter(); 
    const [shopID, setShopID] = useState('')
    const handlePrevClick = () => {
        if (currentImageIndex === 0) {
        setCurrentImageIndex(images.length - 1);
        } else {
        setCurrentImageIndex(currentImageIndex - 1);
        }
    };

    const handleNextClick = () => {
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
            console.log(response.data)
        })
        .catch(function (error) {
          console.log(error);
        })
        .then(function () {
          // always executed
        }); 
    }
    useEffect(() => {
        getAllData();
        middleware("/home","",router)
      }, []);

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

    return(
        <div> 
            <Navbar/>
            <div className={style["carousel"]}>
                <div className={style["carousel-prev"]} onClick={() => handlePrevClick()}>
                    &#10094;
                </div>
               
                <img src={images[currentImageIndex]} alt="slide" />
                <div className={style["carousel-next"]} onClick={() => handleNextClick()}>
                    &#10095;
                </div>
                
            </div>
            {/* <Cards>
                { products ? 
                    products.map((product:any) => {
                        return(
                            <Card key={product.ID} details={product}></Card>
                        ) 
                    }) : console.log('not yet')

                }
            </Cards> */}
            <List/>
            {
                role === "Seller" ? <button className={style["add-product-button"]} onClick={() => goToShop()}>Go To Shop</button> : role ==="Admin" ? <button onClick={() => goToAdmin()} className={style["add-product-button"]}>Go To Admin Page</button>: console.log()
            }
            <Footer/>
        </div>
    )

}