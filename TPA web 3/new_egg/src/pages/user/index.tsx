import Footer from "@/components/footer";
import Navbar from "@/components/navbar";
import middleware, { getUser } from "@/utiil/token";
import  Axios  from "axios";
import { useRouter } from "next/router";
import { useEffect, useReducer, useState } from "react";

export default function UserDetail(){

    const router = useRouter()
    const [account, setAccount] = useState([])
    
    useEffect(() => {
        middleware("/user","", router)
        const getAccount = async () => {
            var acc = await getUser();
            setAccount(acc)
            console.log(acc)
        }

        getAccount()
    }, [])

    const signOut = (name:any) => {
        document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
        router.push("/")
    }

    return(
        <div>
            <Navbar/>
                <label>Name : {account.Name}</label><br></br>
                <label>Role : {account.Role}</label>
                <button onClick={() => signOut("Token")}>Sign Out</button>
            <Footer/>
        </div>
    )
}