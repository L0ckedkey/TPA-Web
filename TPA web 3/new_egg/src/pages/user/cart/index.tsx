
import { Card } from "@/components/cartCard"
import Footer from "@/components/footer"
import Navbar, { Address } from "@/components/navbar"
import { getUserID } from "@/utiil/token"
import Axios  from "axios"
import { useEffect, useState } from "react"
import style from '../../../styles/carts.module.css'

export default function GetCart(props:any){
    const [carts, setCarts] = useState([])
    const [userID, setUserID] = useState()
    const [address, setAddress] = useState('')
    const [error, setError] = useState('')
    const link = "http://localhost:8080/getCarts"
    const addOrderLink = "http://localhost:8080/addOrder"
    const [payment, setPayment] = useState('')
    const [delivery, setDelivery] = useState('')

    let isMounted = true;
    useEffect(() => {
        
        const getCurID = async () => {
            var ID = await getUserID()
            setUserID(ID)
        }
        
        getCurID()
       
       
    }, [])

    const updateAddress = (newAddresses:any) => {
        console.log("here");
        
        console.log(newAddresses)
        setAddress(newAddresses);
    };

    useEffect(() => {
        Axios.get(link, {
            params:{
                ID: userID
            }
        }).then(function (response) {
            
                if (isMounted) {
                    setCarts(response.data);
                    console.log(response.data);
                  }
        
        })
        .catch(function (error) {
        //   console.log(error);
        })
        .then(function () {
          // always executed
        });  

        return () => {
            isMounted = false; // clean up the flag when the component is unmounted
          }
    },[userID])

    const orderProducts = () => {
        console.log(carts)
        carts.map((cart:any) => {
            Axios.get(addOrderLink, {
                params:{
                    accountID: userID,
                    shopID: cart.ShopID,
                    location : address,
                    payment: payment,
                    delivery: delivery
                }
            }).then(function (response) {
                if(response.data == "success"){
                    if (isMounted) {
                        setCarts(response.data);
                        console.log(response.data);
                      }
                }else{
                    setError(response.data)
                }
            })
            .catch(function (error) {
            //   console.log(error);
            })
            .then(function () {
              // always executed
            });  
        })
       
    }

    return (
        <div> 
            <Navbar onAddressUpate={updateAddress}/>
                {
                    Array.isArray(carts) && carts.length > 0 ? carts.map((cart:any) => {
                        return(
                            <Card key={cart.ID} details={cart}></Card>
                        )
                    }):console.log("")
                }
                <select value={delivery} onChange={(event) =>setDelivery(event.target.value)} className={style["add-product-input-dropdown"]}>
                    <option value={""}></option>
                    <option value={"Gojek"}>Gojek</option>
                    <option value={"PickUp"}>Pick Up</option>
                </select>
                <select value={payment} onChange={(event) =>setPayment(event.target.value)} className={style["add-product-input-dropdown"]}>
                    <option value={""}></option>
                    <option value={"Transfer"}>Transfer</option>
                    <option value={"CA Eggs"}>CA Eggs</option>
                </select>
                {
                    carts ? <button onClick={() => orderProducts()} className={style["button-style"]}>Order</button>
                    :<h2>No Product in Cart</h2>
                }
                <h3>{error}</h3>
            <Footer/>
            
        </div>
    )
}