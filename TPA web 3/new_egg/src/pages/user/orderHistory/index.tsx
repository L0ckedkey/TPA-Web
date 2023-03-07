import Footer from "@/components/footer";
import Navbar from "@/components/navbar";
import { Card, CardHistory } from "@/components/orderCard";
import { getUserID } from "@/utiil/token";
import  Axios  from "axios";
import { useEffect, useState } from "react";
import { fileURLToPath } from "url";


export default function OrderHistory(){
    const [userID, setUserID] = useState()
    const [orderHeaders, setOrderHeader] = useState([])
    const [filterBy, setFilterBy] = useState('')
    const getOrder = "http://localhost:8080/getDoneOrderFromUserDistinctShop"
    let isMounted = true;
    useEffect(() => {
        
        const getCurID = async () => {
            var ID = await getUserID()
            setUserID(ID)
        }
        
        getCurID()
       
    }, [])

    useEffect(() => {
        if(userID != ""){
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

    useEffect(() => {
        if(userID != "" && userID != undefined){
            if(filterBy == ""){
                Axios.get(getOrder, {
                    params:{
                        accountID: userID,
                        filterBy: filterBy
                    }
                }).then(function (response) {
                    setOrderHeader(response.data)
                })
                .catch(function (error) {
                //   console.log(error);
                })
                .then(function () {
                  // always executed
                });
            }else{
                Axios.get(getOrder, {
                    params:{
                        accountID: userID,
                        filterBy: filterBy
                    }
                }).then(function (response) {
                    setOrderHeader(response.data)
                })
                .catch(function (error) {
                //   console.log(error);
                })
                .then(function () {
                // always executed
                });  
            }
        }
    }, [filterBy])


    return(
        <div>
            <Navbar/>
                <select value={filterBy} onChange={(event) =>setFilterBy(event.target.value)}>
                <option value={""}></option>
                    <option value={"time DESC"}>Time Latest to Newest</option>
                    <option value={"time ASC"}>Time Newest to Latest</option>
                </select>
                {
                    orderHeaders ? orderHeaders.map((orderHeader:any) => {
                        return(
                            <CardHistory key={orderHeader.ID} details={orderHeader}></CardHistory>
                        )
                    }):console.log("not yet")
                }
            <Footer/>
        </div>
    )
}