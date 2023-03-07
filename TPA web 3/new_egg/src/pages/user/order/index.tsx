import Footer from "@/components/footer";
import Navbar from "@/components/navbar";
import { Card } from "@/components/orderCard";
import { getUserID } from "@/utiil/token";
import  Axios from "axios";
import { useEffect, useState } from "react";


export default function Order(){
    const [userID, setUserID] = useState()
    const [orderHeaders, setOrderHeader] = useState([])
    const getOrder = "http://localhost:8080/getOrderFromUserDistinctShop"
    let isMounted = true;
    useEffect(() => {
        
        const getCurID = async () => {
            var ID = await getUserID()
            setUserID(ID)
        }
        
        getCurID()
       
    }, [])

    useEffect(() => {
        if(userID != "" && userID != undefined){
            console.log("eyahhh")
            console.log(userID)
            Axios.get(getOrder, {
                params:{
                    accountID: userID
                }
            }).then(function (response) {
                if(isMounted){
                    console.log(response.data);
                    setOrderHeader(response.data)
                }
            })
            .catch(function (error) {
            //   console.log(error);
            })
            .then(function () {
              // always executed
            });  
        }
        return () => {
            isMounted = false; // clean up the flag when the component is unmounted
          }
    },[userID])

    return(
        <div>
            <Navbar/>
                {
                    orderHeaders ? orderHeaders.map((orderHeader:any) => {
                        return(
                            <Card key={orderHeader.ID} details={orderHeader}></Card>
                        )
                    }):console.log("")
                }
            <Footer/>
        </div>
    )
}