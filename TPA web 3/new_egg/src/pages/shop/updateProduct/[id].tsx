import Footer from "@/components/footer";
import Navbar from "@/components/navbar";
import  Axios  from "axios";
import { useRouter } from "next/router";
import { useEffect, useState } from "react"

export default function UpdateProduct(){
    const router = useRouter()
    const {id} = router.query
    const [product, setProduct] = useState([] as any)
    const [quantity, setQuantity] = useState(0)
    const [name, setName] = useState('')
    const [price, setPrice] = useState(0)
    const [description, setDescription] = useState('')
    const updateLink = "http://localhost:8080/updateProduct"

    useEffect(() => {
        Axios.get('http://localhost:8080/getAProduct/' + id).then(function (response) {
            setProduct(response.data)
            console.log(response.data.Shop)
        })
        .catch(function (error) {
            console.log(error);
        })
        .then(function () {
            // always executed
        }); 
    },[])

    const handleIncrement = () => {
        setQuantity(quantity + 1);
    };

    const handleDecrement = () => {
        if(quantity > 0){
            setQuantity(quantity - 1);
        }
    };

    const UpdateProduct = () => {
        Axios.get(updateLink,{
            params:{
                productID: id,
                quantity: quantity,
                name: name,
                price: price,
                description: description
            }
        })
        .then(function (response) {
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
        <div>
            <Navbar/>
               <h3>Name : {product.ProductName}</h3>
               <h3>Price : {product.ProductPrice}</h3>
               <h3>Stock : {product.Stock}</h3>
               <h3>Desc : {product.Description}</h3>
               <h3>Name : </h3><input onChange={(e) => setName(e.target.value)}></input>
               <h3>Price : </h3><input onChange={(e) => setPrice(parseInt(e.target.value))}></input>
               <h3>Stock : </h3>
               <div>
                    <button onClick={handleDecrement}>-</button>
                    <input type="text" value={quantity}/>
                    <button onClick={handleIncrement}>+</button>
                </div>
               <h3>Description : </h3><input onChange={(e) => setDescription(e.target.value)}></input>
               <button onClick={() => UpdateProduct()}>Update</button>
            <Footer/>
        </div>
    )
}