import Footer from "@/components/footer";
import Navbar from "@/components/navbar";
import  Axios  from "axios";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import style from '../../styles/wishlists.module.css'
import { getUserID } from "@/utiil/token"
import { Card, Cards } from "@/components/wishlistCard";
export default function Wishlist(){

    const router = useRouter()
    const [wishlists, setWishlist] = useState([])
    const [userID, setUserID] = useState()
    const link = "http://localhost:8080/getWishlistByAccount"
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
                console.log(response.data)
                setWishlist(response.data);
                
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


    const goToCreateWishlist = () => {
        router.push('/wishlist/createWishList')
    }
    console.log("wish" +  wishlists)
    return(
        <div>
            <Navbar/>
            <Cards>
                {
                    wishlists ?
                    wishlists.map((wishlist:any) => {
                        return(<Card key={wishlist.ID} details={wishlist}/>)
                    }) : console.log("not yet")
                }
            </Cards>
            <div className={style["button-container"]}>
                <button className={style["button"]} onClick={() => goToCreateWishlist()}>Create WishLists</button>
            </div>
            <Footer/>
        </div>
    )
}