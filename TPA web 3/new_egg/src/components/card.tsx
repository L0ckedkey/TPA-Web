import Image from "next/image";
import React, { ReactNode, useEffect, useState } from "react";
import style from '../styles/cards.module.css'
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
  
    return (
        <div  className={style["card-container"]}>
            <div className={style["card-adjust"]}>
                <div className={style["card-img-adjust"]}>
                    <Image className={style["card-img"]} src={pc} alt="error" width={300} height={300}></Image>
                </div>
                <div className={style["card-detail-adjust"]}>
                    <Link href="/product/[id]" as={`/product/${props.ID}`} className={style["product-card-title"]}><label>{props.ProductName}</label></Link>
                    <br></br>
                    <label>Price : $ {props.ProductPrice}</label>
                    <label>Stock : {props.Stock}</label>
                </div>
            </div>
        </div>
    )
}