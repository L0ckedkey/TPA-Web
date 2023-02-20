
import { Card, Cards } from "@/components/cartCard"
import Footer from "@/components/footer"
import Navbar from "@/components/navbar"
import { getUserID } from "@/utiil/token"
import Axios  from "axios"
import { useEffect, useState } from "react"

export default function GetCart(){

    const [carts, setCarts] = useState([])
    const [userID, setUserID] = useState()
    const link = "http://localhost:8080/getCarts"
    let isMounted = true;
    useEffect(() => {
        
        const getCurID = async () => {
            var ID = await getUserID()
            setUserID(ID)
        }
        
        getCurID()
       
       
    }, [])

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




    return (
        <div>
            <Navbar/>
                <Cards>
                    {
                        carts ? carts.map((cart:any) => {
                            return(
                                <Card key={cart.ID} details={cart}></Card>
                            )
                        }):console.log("")
                    }
                </Cards>
            <Footer/>
            
        </div>
    )
}