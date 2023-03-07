import Footer from "@/components/footer";
import Navbar from "@/components/navbar";
import  Axios  from "axios";
import { useEffect, useState } from "react";
import style from '../../styles/wishlists.module.css'
import { getUserID } from "@/utiil/token";
import { useRouter } from "next/router";

export default function CreateWishList(){

    const [status, setStatus] = useState('')
    const [name, setName] = useState('')
    const [description, setDescription] = useState('');
    const [accountID, setAccountID] = useState(0)
    const link = 'http://localhost:8080/addWishlistHeader';
    const router = useRouter() 

    useEffect(() => {
        const getAccountID = async () =>{
            var accountID = await getUserID()
            setAccountID(accountID)
        }

        getAccountID()
    },[])


    const addWishlist = () => {
        Axios.get(link,{
            params:{
                accountID: accountID,
                name: name,
                description: description,
                status: status,
            }
        }).then(function (response) {
            console.log(response.data)
            if(response.data == "Success"){
                router.push("/wishlist")
            }
          })
          .catch(function (error) {
            console.log(error);
          })
          .then(function () {
            // always executed
          });  
    }
    
    return (
        <div>
            <Navbar/>
            <div className={style["container"]}>
                <div className={style["add-product-detail"]}>
                    <div className={style["add-product-title"]}>
                        <label>Wishlist Name</label>
                        <label>:</label>
                    </div>
                    <input type="text" className={style["add-product-input-text"]} placeholder='Wishlist Name' id="first-name" onChange={(event) => setName(event.target.value)}></input>
                </div>
                <div className={style["add-product-detail"]}>
                    <div className={style["add-product-title"]}>
                        <label>Wishlist Status</label>
                        <label>:</label>
                    </div>
                    <select className={style["dropdown"]} value={status} onChange={(event) =>setStatus(event.target.value)}>
                        <option value={""}></option>
                        <option value={"Private"}>Private</option>
                        <option value={"Public"}>Public</option>
                    </select>
                </div>
                <div className={style["add-product-detail"]}>
                    <div className={style["add-product-title"]}>
                        <label>Wishlist Description</label>
                        <label>:</label>
                    </div>
                    <textarea className={style["textarea"]} onChange={(event) => setDescription(event.target.value)}></textarea>
                </div>
                <button onClick={() => addWishlist()}>Add Wishlist</button>
            </div>
            
            <Footer/>
        </div>
    )
}