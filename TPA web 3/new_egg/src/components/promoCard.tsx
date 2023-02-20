import Image from "next/image";
import React, { ReactNode, useEffect, useState } from "react";
import style from '../styles/promos.module.css'
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
                    <label>Name : {props.Name}</label>
                    <label>Discount : {props.Discount}%</label>
                    <label>Code : {props.Code}</label>
                    <label>Start Date : {props.StartDate}</label>
                    <label>End Date : {props.EndDate}</label>
                </div>
            </div>
        </div>
    )
}