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
    // console.log(props)
    return (
        <div  className={style["card-container"]}>
            <div className={style["card-adjust"]}>
                <div className={style["card-img-adjust"]}>
                    <img className={style["card-img"]} src={props.Url} alt="error"></img>
                </div>
                <div className={style["card-detail-adjust"]}>
                    <Link href="/product/[id]" as={`/product/${props.ID}`} className={style["product-card-title"]}><label>{props.ProductName}</label></Link>
                    <br></br>
                    <label>Price : $ {props.ProductPrice}</label>
                    <label>Stock : {props.Stock}</label>
                    <label>Brand : {props.Brand.Name}</label>
                    <label>Shop : {props.Shop.Name}</label>
                </div>
            </div>
        </div>
    )
}

export const CardShop = (props:any) => {

    const [link, setNewLink] = useState('')
    const router = useRouter()
    props = props.details
    // console.log(props)

    const goToUpdatePage = () => {
        router.push("/shop/updateProduct/" +  props.ID)
    }

    return (
        <div  className={style["card-container"]}>
            <div className={style["card-adjust"]}>
                <div className={style["card-img-adjust"]}>
                    <img className={style["card-img"]} src={props.Url} alt="error"></img>
                </div>
                <div className={style["card-detail-adjust"]}>
                    <Link href="/product/[id]" as={`/product/${props.ID}`} className={style["product-card-title"]}><label>{props.ProductName}</label></Link>
                    <br></br>
                    <label>Price : $ {props.ProductPrice}</label>
                    <label>Stock : {props.Stock}</label>
                    <label>Brand : {props.Brand.Name}</label>
                    <label>Shop : {props.Shop.Name}</label>
                    <button onClick={() => goToUpdatePage()}>Update Product</button>
                </div>
            </div>
        </div>
    )
}