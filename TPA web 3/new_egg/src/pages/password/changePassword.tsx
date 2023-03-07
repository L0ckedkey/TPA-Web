
import logo from '../../assets/logo_newegg_400400.png'
import style from '../../styles/pages.module.css'
import Image from 'next/image'
import Link from 'next/link'
import Axios from 'axios'
import { useContext, useEffect, useState } from 'react'
import { useQuery } from "react-query";
import React from "react";
import { ThemeContext } from '@/components/theme'
import middleware from '@/utiil/token'
import { useRouter } from 'next/router'
import emailjs from 'emailjs-com';
import { PassThrough } from 'stream'

const link = "http://localhost:8080/changePassword"
export default function ChangePassword(){
    const [inputCode, setInputCode] = useState("")
    const [code, setCode] = useState("")
    const router = useRouter()
    const [isTrue, setIsTrue] = useState(true)
    const [disabled, setDisabled] = useState(false);
    const [email, setEmail] = useState(null)
    const {theme, setNewTheme} = useContext(ThemeContext)
    const [newPassword, setNewPassword] = useState('*')

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const value = sessionStorage.getItem('email');
            setEmail(value)
        }
    },[])

    const changePassword = () => {
        console.log(newPassword)
        Axios.get(link,{
            params:{
                email: email,
                password: newPassword
            }
        })
        .then(function (response) {
          if(response.data == "Success"){
            router.push("/signIn")
          }else{
            console.log(response.data)
          }
        })
        .catch(function (error) {
          console.log(error);
        })
        .then(function () {
          // always executed
        });
    }
    


    return(
        <div className={style["sign-in-box"]} style={{backgroundColor: theme.primaryColor}}>
            <Image src={logo} className={style["img-adjust"]} alt='error'/>
            <h2 className={style["sign-up-title"]}>Change Password</h2>
            <h3>{email}</h3>
            <input type="password" placeholder='New Password' onChange={(event) => setNewPassword(event.target.value)}></input>
            <button className={`${style["orange-button"]} ${style["button"]}`} onClick={() => changePassword()}>Change Password</button>         
        </div>
    )
}