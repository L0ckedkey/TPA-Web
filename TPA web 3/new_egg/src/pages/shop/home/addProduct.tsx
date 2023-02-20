import Footer from "@/components/footer";
import Navbar from "@/components/navbar";
import middleware, { getShopID } from "@/utiil/token";
import { useEffect, useState } from "react";
import style from '../../../styles/shops.module.css'
import { useRouter } from 'next/router';
import Axios from 'axios'
import https from 'https';
export default function AddProduct(){
    const [productID, setProductID] = useState('');
    const [productCategoryID, setProductCategoryID] = useState(0);
    const [productSubCategoryID, setProductSubCategoryID] = useState(0);
    const [productSubCategoryDetailID, setProductSubCategoryDetailID] = useState(0)
    const [brandID, setBrandID] = useState(0)
    const [productPrice, setProductPrice] = useState(0)
    const [rating, setRating] = useState(0);
    const [soldQuantity, setSoldQuantity] = useState(0)
    const [stock, setStock] = useState(0)
    const [shopID, setShopID] = useState(0)
    const [numberOfReview, setNumberOfReview] = useState(0)
    const [description, setDescription] = useState('')
    const [powerUsage, setPowerUsage] = useState(0)
    const [powerSupply, setPowerSupply] = useState(0)
    const [productName, setProductName] = useState('')

    const router = useRouter();
    const link = "http://localhost:8080/addProduct"

    useEffect(() => {
        console.log(productCategoryID)
        console.log(stock)
        console.log(productPrice)
        middleware("/shop/addProduct","Seller",router)
        // middleware("/shop/home/addProduct","seller",router)
    })

    const handle = (e:any) => {
        console.log(e.target)
    }

    useEffect(() => {
        const getCurName = async () => {
            var shopID = await getShopID()
           setShopID(shopID)
        }
        
        getCurName()
    }, [])

    const addProduct = async() =>{
        Axios.get(link,{
            params: {
                name: productName,
                price: productPrice,
                stock: stock,
                brandID: brandID,
                ProductCategoryID: productCategoryID,
                ProductSubCategoryID: productSubCategoryID,
                ProductSubCategoryDetailID: productSubCategoryDetailID,
                ShopID: shopID,
                description: description,
            }
        }).then(function (response) {
            console.log(response);
            router.push("/shop/home/" + shopID)
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
            <div className={style["add-product-container"]}>
            <h2>Add New Product</h2>
                <div className={style["add-product-detail"]}>
                    <div className={style["add-product-title"]}>
                        <label>Product Name</label>
                        <label>:</label>
                    </div>
                    <input type="text" className={style["add-product-input-text"]} placeholder='Product Name' id="first-name" onChange={(event) => setProductName(event.target.value)}></input>
                </div>
                <div className={style["add-product-detail"]}>
                    <div className={style["add-product-title"]}>
                        <label>Product Category</label>
                        <label>:</label>
                    </div>
                    <select value={productCategoryID} onChange={(event) =>setProductCategoryID(parseInt(event.target.value))} className={style["add-product-input-dropdown"]}>
                        <option value={1}>Component & Storage</option>
                        <option value={2}>Computer System</option>
                    </select>
                </div>
                
                {
                    productCategoryID === 1 ? 
                    <div className={style["add-product-detail"]}>
                    <div className={style["add-product-title"]}>
                        <label>Product Sub Category</label>
                        <label>:</label>
                    </div>
                    <select value={productSubCategoryID} onChange={(event) =>setProductSubCategoryID(parseInt(event.target.value))}>
                        <option value={1}>Core Components</option>
                        <option value={2}>Storage Devices</option>
                    </select>
                    </div> 
                    : 
                    <div className={style["add-product-detail"]}>
                     <div className={style["add-product-title"]}>
                        <label>Product Sub Category</label>
                        <label>:</label>
                    </div>
                    <select value={productSubCategoryID} onChange={(event) =>setProductSubCategoryID(parseInt(event.target.value))}>
                        <option value={3}>Desktops</option>
                        <option value={4}>Laptops / Notebooks</option>
                    </select>
                    </div> 
                }

                {
                    productSubCategoryID === 1 ? 
                    <div className={style["add-product-detail"]}>
                     <div className={style["add-product-title"]}>
                        <label>Product Sub Category</label>
                        <label>:</label>
                    </div>
                    <select value={productSubCategoryDetailID} onChange={(event) =>setProductSubCategoryDetailID(parseInt(event.target.value))}>
                        <option value={1}>CPU / Processor</option>
                        <option value={2}>Memory</option>
                    </select>
                    </div> 
                    : 
                    productSubCategoryID === 2 ?
                    <div className={style["add-product-detail"]}>
                     <div className={style["add-product-title"]}>
                        <label>Product Sub Category</label>
                        <label>:</label>
                    </div>
                    <select value={productSubCategoryID} onChange={(event) =>setProductSubCategoryDetailID(parseInt(event.target.value))}>
                        <option value={3}>Hard Drives</option>
                        <option value={4}>SSDs</option>
                    </select>
                    </div> :
                    productSubCategoryID === 3 ?
                    <div className={style["add-product-detail"]}>
                    <div className={style["add-product-title"]}>
                        <label>Product Sub Category Detail</label>
                        <label>:</label>
                    </div>
                    <select value={productSubCategoryID} onChange={(event) =>setProductSubCategoryDetailID(parseInt(event.target.value))}>
                        <option value={5}>Desktop Computers</option>
                        <option value={6}>Gaming Desktops</option>
                    </select>
                    </div> :
                    <div className={style["add-product-detail"]}>
                     <div className={style["add-product-title"]}>
                        <label>Product Sub Category Detail</label>
                        <label>:</label>
                    </div>
                    <select value={productSubCategoryID} onChange={(event) =>setProductSubCategoryDetailID(parseInt(event.target.value))}>
                        <option value={7}>Laptop / Notebooks</option>
                        <option value={8}>2 in 1 Laptops</option>
                    </select>
                    </div>
                }

                <div className={style["add-product-detail"]}>
                    <div className={style["add-product-title"]}>
                        <label>Brand</label>
                        <label>:</label>
                    </div>
                    <select value={brandID} onChange={(event) =>setBrandID(parseInt(event.target.value))}>
                        <option value={1}>Intel</option>
                        <option value={2}>AMD</option>
                    </select>
                </div>
                <div className={style["add-product-detail"]}>
                    <div className={style["add-product-title"]}>
                        <label>Product Price</label>
                        <label>:</label>
                    </div>
                    <input type="text" placeholder='Product Price' id="first-name" onChange={(event) => setProductPrice(parseInt(event.target.value))}></input>
                </div>
                <div className={style["add-product-detail"]}>
                    <div className={style["add-product-title"]}>
                        <label>Product Stock</label>
                        <label>:</label>
                    </div>
                    <input type="text" placeholder='Product Stock' id="first-name" onChange={(event) => setStock(parseInt(event.target.value))}></input>
                </div>
                <div className={style["add-product-detail"]}>
                    <div className={style["add-product-title"]}>
                        <label>Product Description</label>
                        <label>:</label>
                    </div>
                    <textarea onChange={(event) => setDescription(event.target.value)} className={style["add-product-text-area"]}/>
                </div>
                <div className={style["add-product-detail"]}>
                    <div className={style["add-product-title"]}>
                        <label>Power Usage</label>
                        <label>:</label>
                    </div>
                    <input type="text" placeholder='Power Usage' id="first-name" onChange={(event) => setPowerUsage(parseInt(event.target.value))}></input>
                </div>
                {
                    productID === "Power Supply" ? 
                    <div className={style["add-product-detail"]}>
                    <div className={style["add-product-title"]}>
                        <label>Power Supply</label>
                        <label>:</label>
                    </div>
                    <input type="text" placeholder='Power Supply' id="first-name" onChange={(event) => setPowerSupply(parseInt(event.target.value))}></input>
                    </div> : <></>
                }
                <button onClick={() => addProduct()}>Add Product</button>
            </div>                
            <Footer/>
        </div>
    )
}