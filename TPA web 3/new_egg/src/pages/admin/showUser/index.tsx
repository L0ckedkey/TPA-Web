import Footer from "@/components/footer";
import Navbar from "@/components/navbar";
import { Card, Cards } from "@/components/userCard";
import middleware from "@/utiil/token";
import  Axios  from "axios";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function ShowUser(){
    const link = "http://localhost:8080/getAllUsers"
    const [accounts, setAccounts] = useState([])
    var router = useRouter()
    useEffect(() => {
        Axios.get(link)
        .then(function (response) {
            // console.log(response.data)
            setAccounts(response.data)
        })
        .catch(function (error) {
            console.log(error);
        })
        .then(function () {
        // always executed
        });  
    
        middleware('admin/showUser','Admin', router)

    }, [])
       



    return(
        <div>
            <Navbar/>
                <Cards>
                    {
                        accounts ? 
                        accounts.map((account:any) => {
                            return(
                                <Card key={account.ID} details={account}>
                            
                                </Card>
                            )
                        }):
                        console.log("not yet")
                    }
                </Cards>
            <Footer/>
        </div>
    )
}