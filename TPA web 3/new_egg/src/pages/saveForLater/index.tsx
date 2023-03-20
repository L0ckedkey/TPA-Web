import Footer from "@/components/footer";
import Navbar from "@/components/navbar";
import { getUserID } from "@/utiil/token";
import Axios from "axios";
import { useEffect, useState } from "react";

export default function SaveForLater(){
    const [accountID, setAccountID] = useState('')
    const getsaveForLater = "http://localhost:8080/getSaveForLater"
    const [products, setProduct] = useState([])

    useEffect(() => {
        
        const getCurID = async () => {
            var ID = await getUserID()
            setAccountID(ID)
        }
        
        getCurID()       
    }, [])


    useEffect(() => {
       if(accountID != ""){
        Axios.get(getsaveForLater, {
            params:{
                accountID: accountID
            }
        }).then(function (response) {
            if(response.data != "Error"){
                setProduct(response.data)
            }
        
        })
        .catch(function (error) {
        //   console.log(error);
        })
        .then(function () {
          // always executed
        });  
       }
    }, [accountID])


    return(
        <div>
            <Navbar/>
                {
                    products ? products.map((product:any) => {
                        return(
                            <div>
                                <img src={product.Product.Url}></img>
                                <h3>{product.Product.ProductName}</h3>
                                <h3>{product.Product.ProductPrice}</h3>
                                <h3>{product.Quantity}</h3>
                            </div>
                        )
                    }):<h3>No item</h3>
                }
            <Footer/>
        </div>
    )
}