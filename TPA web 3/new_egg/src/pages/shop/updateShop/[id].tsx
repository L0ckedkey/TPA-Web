import Footer from "@/components/footer";
import Navbar from "@/components/navbar";
import  Axios  from "axios";
import { useRouter } from "next/router";
import { useEffect, useState } from "react"

export default function UpdateShopInfo(){
    const router = useRouter()
    const {id} = router.query
    const [name, setName] = useState('')
    const [description, setDescription] = useState('')
    const updateLink = "http://localhost:8080/updateShop"


    const UpdateShop = () => {
        Axios.get(updateLink,{
            params:{
                shopID: id,
                name: name,
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
                <h3>Name : </h3><input onChange={(e) => setName(e.target.value)}></input>
                <h3>Description : </h3><input onChange={(e) => setDescription(e.target.value)}></input>
                <button onClick={() => UpdateShop()}>Update</button>
            <Footer/>
        </div>
    )
}