
import { useRouter } from 'next/router'
import style from '../styles/menus.module.css'
import { useContext, useEffect, useState } from 'react'
import { getRole } from '@/utiil/token'

export default function Menu(){

    const router = useRouter()
    const [role, setRole] = useState('')
   useEffect(() => {
    const getCurRole = async () => {
        var name = await getRole()
        // console.log("name navbar " + name)
       setRole(name)
    }
    
    getCurRole()   
   },[])

    const goToOrderPage = () => {
        if(role != "Seller"){
            router.push("/user/order")
        }else{
            router.push("/shop/order")
        }
    }

    const goToOrderHistoryPage = () => {
        router.push("/user/orderHistory")
    }

    const goToPublicWishlist = () => {
        router.push("/wishlist/publicWishlist")
    }

    const goToMyReviews = () => {
        router.push("/user/review/myReview")
    }
    
    const goToSaveForLater = () => {
        router.push("/saveForLater")
    }

    const goToChat = () => {
        router.push("/chat")
    }

    const goToCustomerService = () => {
        router.push("/chat/customerService")
    }


    return(
        <div className={style["menu-container"]}>
            <h3 onClick={() => goToOrderPage()}>Check Order</h3>
            <h3 onClick={() => goToOrderHistoryPage()}>Check Order History</h3>
            <h3 onClick={() => goToPublicWishlist()}>Public Wishlist</h3>
            <h3 onClick={() => goToMyReviews()}>My Reviews</h3>
            <h3 onClick={() => goToSaveForLater()}>Save For Later Items</h3>
            <h3 onClick={() => goToChat()}>Chat</h3>
            <h3 onClick={() => goToCustomerService()}>Customer Service</h3>
        </div>
    )
}