import Image from "next/image";
import React, { ReactNode, useEffect, useState } from "react";
import style from '../styles/userCards.module.css'
import pc from '../assets/pc.jpg'
import Link from "next/link";
import { Router, useRouter } from "next/router";
import  Axios  from "axios";

export const Cards = (props:any) =>{
    return(
        <div className={style["cards-container"]}>
            {props.children}
        </div>
    )
}




export const Card = (props:any) => {
    
    props = props.details
    const linkChangeStatus = "http://localhost:8080/changeAccountStatus"
    const [isBanned, setBanned] = useState(props.Status === "Banned" ? true : false)
    const [link, setNewLink] = useState('')
    const router = useRouter()
    

    const changeAccountStatus = () => {
        Axios.get(linkChangeStatus,{
            params:{
                id: props.ID
            }
        })
        .then(function (response) {
            // console.log(response.data)

            if(response.data == "Success"){
                if(isBanned){
                    setBanned(false)
                }else{
                    setBanned(true)
                }
            }
        })
        .catch(function (error) {
          console.log(error);
        })
        .then(function () {
          // always executed
        }); 
        // console.log("Status")
        // console.log(props.ID)
    }

    // console.log(props)
    console.log(isBanned)
    if(isBanned){
        return(
                <div className={style["card-container"]}>
                <div className={style["card-adjust"]}>
                    <div className={style["card-detail-adjust-banned"]}>
                        <label>Name : {props.FirstName + " " + props.LastName}</label>
                        <label>Email : {props.Email}</label>
                        <label>Phone Number : {props.PhoneNumber}</label>
                        <label>Role : {props.Role}</label>
                        <label className={style["special-case"]}>NewsLetter Status : {props.NewsLetterStatus === "yes" ? <div>✔️</div> : <div>❌</div>}</label>
                        <button className={style["green-button"]} onClick={() => changeAccountStatus()}>UnBan</button>
                    </div>
                </div>
            </div>

        )
    }else{
        return(
            <div className={style["card-container"]}>
            <div className={style["card-adjust"]}>
                <div className={style["card-detail-adjust"]}>
                    <label>Name : {props.FirstName + " " + props.LastName}</label>
                    <label>Email : {props.Email}</label>
                    <label>Phone Number : {props.PhoneNumber}</label>
                    <label>Role : {props.Role}</label>
                    <label className={style["special-case"]}>NewsLetter Status : {props.NewsLetterStatus === "yes" ? <div>✔️</div> : <div>❌</div>}</label>
                    <button className={style["red-button"]} onClick={() => changeAccountStatus()}>Ban</button>
                </div>
            </div>
        </div>
        )
    }
}