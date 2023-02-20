import Image from "next/image";
import React, { ReactNode, useEffect, useState } from "react";
import style from '../styles/userCards.module.css'
import pc from '../assets/pc.jpg'
import Link from "next/link";
import { Router, useRouter } from "next/router";

export const Cards = (props:any) =>{
    return(
        <div className={style["cards-container"]}>
            {props.children}
        </div>
    )
}

export const Card = (props:any) => {

    const [link, setNewLink] = useState('')
    const router = useRouter()
    props = props.details
  
    console.log(props)
    return (
        <div className={style["card-container"]}>
            <div className={style["card-adjust"]}>
                <div className={style["card-detail-adjust"]}>
                    <label>Name : {props.FirstName + " " + props.LastName}</label>
                    <label>Email : {props.Email}</label>
                    <label>Phone Number : {props.PhoneNumber}</label>
                    <label>Role : {props.Role}</label>
                    <label className={style["special-case"]}>NewsLetter Status : {props.NewsLetterStatus === "yes" ? <div>✔️</div> : <div>❌</div>}</label>
                    <button className={style["red-button"]}>Ban</button>
                </div>
            </div>
        </div>
    )
}