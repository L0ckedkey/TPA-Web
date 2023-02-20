import Footer from "@/components/footer";
import Navbar from "@/components/navbar";
import style from '../../../styles/admins.module.css'
import { useRouter } from 'next/router'
import { userAgent } from "next/server";
import { useContext, useEffect, useState } from 'react'
import middleware from "@/utiil/token";

export default function AdminHome(){
    const router = useRouter()
    const goToAddVoucher = () => {
        router.push("/admin/addVoucher")
    }
    
    const goToShowUsers = () => {
        router.push("/admin/showUser")
    }
    
    const goToSendNewsLetter = () => {
        router.push("/admin/sendNewsLetter")
    }

    const goToAddShop = () => {
        router.push("/admin/addShop")
    }

    useEffect(() => {
        middleware('admin/home','Admin', router)
    })


    return <div>
        <Navbar/>
            <div className={style["button-container"]}>
                <button onClick={() => goToAddVoucher()}>Add Voucher</button>
                <button onClick={() => goToShowUsers()}>Show User</button>
                <button onClick={() => goToSendNewsLetter()}>Send Newsletter</button>
                <button onClick={() => goToAddShop()}>Insert New Shop</button>
                <button>View Review</button>
                <button>Manage Promotion</button>
            </div>
        <Footer/>
    </div>
}