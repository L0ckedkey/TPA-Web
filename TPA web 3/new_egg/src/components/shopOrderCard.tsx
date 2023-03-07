import { getShopID } from '@/utiil/token'
import  Axios  from 'axios'
import { useRouter } from 'next/router'
import { useContext, useEffect, useState } from 'react'
import style from '../styles/shopOrders.module.css'

export default function OrderCard(){
    const getOrderHeader = "http://localhost:8080/getOrderDetailShop"
    const changeOrderStatusLink = "http://localhost:8080/changeOrderStatus"
    const [orderHeader, setOrderHeader] = useState([])
    const [shopID, setShopID] = useState('')
    const router = useRouter()
    const [changed, setChanged] = useState(false)
    const [filterBy, setFilterBy] = useState('')
    useEffect(() => {

        const getCurName = async () => {
            var name = await getShopID()
            // console.log("name navbar " + name)
           setShopID(name)
        }
        
        getCurName()      
         
    }, [])

    useEffect(() => {
       if(shopID != ""){
        console.log("Here");
        
        console.log(shopID);
        console.log("Herherehre")
        Axios.get(getOrderHeader, {
            params:{
                shopID: shopID,
                filterBy: filterBy
            }
        }).then(function (response) {
            console.log(response.data)
            setOrderHeader(response.data)
        //    console.log(response.data)
        })
        .catch(function (error) {
        //   console.log(error);
        })
        .then(function () {
        // always executed
        });  
       }
    }, [shopID, changed, filterBy])

    const goToCheckOrder = (id:any) => {
        router.push(`/shop/order/${id}`)
    }

    const changeOrderStatus = (code:any) => {

        console.log(code)
        Axios.get(changeOrderStatusLink, {
            params:{
                InvoiceCode: code
            }
        }).then(function (response) {
            console.log(response.data)
            if(response.data == "Success"){
                // window.location.reload()
            }
        })
        .catch(function (error) {
        //   console.log(error);
        })
        .then(function () {
        // always executed
        });  
        if(changed){
            setChanged(false)
        }else{
            setChanged(true)
        }
    }


    return (
        <div>
            <select value={filterBy} onChange={(event) =>setFilterBy(event.target.value)}>
                <option value={""}></option>
                <option value={"Cancel"}>Cancel</option>
                <option value={"Open"}>Open</option>
            </select>
            {
                orderHeader ? 
                orderHeader.map((orderHeaderSingle:any) => {
                    return(
                        <div key={orderHeaderSingle.ID} className={style["order-header-box"]}>
                            <label>{orderHeaderSingle.Account.FirstName + " " + orderHeaderSingle.Account.LastName}</label>
                            <label>{orderHeaderSingle.InvoiceCode}</label>
                            <label>{orderHeaderSingle.Status}</label>
                            {
                                orderHeaderSingle.Status == "Request Shop Confirmation" ?
                                <button onClick={() => changeOrderStatus(orderHeaderSingle.InvoiceCode)}>Processed</button> : orderHeaderSingle.Status == "Processed" ?
                                <button onClick={() => changeOrderStatus(orderHeaderSingle.InvoiceCode)}>Sent</button> : null
                            }
                            <button onClick={() => goToCheckOrder(orderHeaderSingle.ID)}>Check Order</button>
                        </div>
                    )
                }): <h3>No Order</h3>
            }
        </div>
    )

}


export function OrderDetail(props:any){
    const {details} = props
    console.log(details)
    return(
        <div className={style["order-detail-container"]}>
            <div className={style["img-container"]}>
                <img className={style["img-adjust"]} src={details.Product.Url}></img>
            </div>
            <div>
                <label>{details.Product.ProductName}</label><br></br>
                <label>{details.Product.ProductPrice}</label><br></br>
                <label>{details.Quantity}</label><br></br>
            </div>
        </div>
    )
}