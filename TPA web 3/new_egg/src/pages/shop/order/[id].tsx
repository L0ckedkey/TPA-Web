
import Footer from '@/components/footer';
import Navbar from '@/components/navbar';
import { OrderDetail } from '@/components/shopOrderCard';
import  Axios  from 'axios';
import { useRouter } from 'next/router';
import { useContext, useEffect, useState } from 'react'
import style from '../../../styles/shopOrders.module.css'

export default function CheckOrder(){
    const getOrderHeader = "http://localhost:8080/getOrderDetail"
    const router = useRouter()
    const { id } = router.query
    const [orderDetails, setOrderDetail] = useState([])

    useEffect(() => {
       if(id != ""){
        console.log(id)
            Axios.get(getOrderHeader, {
                params:{
                    orderHeaderID: id
                }
            }).then(function (response) {
                console.log(response.data)
                setOrderDetail(response.data)
            //    console.log(response.data)
            })
            .catch(function (error) {
            //   console.log(error);
            })
            .then(function () {
            // always executed
            });  
       }
    }, [id])


    return(
        <div>
            <Navbar/>
                {
                    orderDetails ?
                    orderDetails.map((orderDetail:any) => {
                        console.log(orderDetail)
                        return(
                            <div key={orderDetail.OrderHeaderID} className={style["order-detail-parent"]}>
                                <label>{orderDetail.Account.FirstName + " " + orderDetail.Account.LastName}</label>
                                <OrderDetail details={orderDetail}></OrderDetail>
                            </div>
                        )
                    }): null
                }
            <Footer/>
        </div>
    )
}