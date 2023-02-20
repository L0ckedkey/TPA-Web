import logo from '../../assets/logo_newegg_400400.png'
import style from '../../styles/pages.module.css'
import Image from 'next/image'
import Link from 'next/link'
import Axios from 'axios'
import { useContext, useEffect, useState } from 'react'
import { useQuery } from "react-query";
import React from "react";
import { ThemeContext } from '@/components/theme'
import { useRouter } from 'next/router'
import Cookies from 'universal-cookie';
import middleware from '@/utiil/token'

const link = "http://localhost:8080/signIn/checkPassword"

export default function SignIn(){

  const [data, setNewData] = useState({user: []})
  const [password, setNewPassword] = useState("")
  const [isPasswordCorrect, setNewPasswordCorrect] = useState(true)
  const router = useRouter()
  const {theme, setNewTheme} = useContext(ThemeContext)
  const [email, setEmail] = useState(null)
  const fetchData = async() => {
  Axios.get(link,{
    params:{email: sessionStorage.getItem("email"),
            password: password}
  })
    .then(function (response) {
      if(response.data.Password !== "null"){
        // sessionStorage.removeItem('email')
        var userName = response.data.FirstName + " " +response.data.LastName
        router.push('/home')
        console.log("cookie" + response)
        console.log(response.data.Key)
        const cookies = new Cookies();
        cookies.set('Token', response.data, { path: '/' });
      }else{
        setNewPasswordCorrect(false)      
      }
    })
    .catch(function (error) {
      console.log(error);
    })
    .then(function () {

    });  
    }

  const backToSignIn = () => {
    router.push("/signIn")
  }
  
  useEffect(() => {
    middleware("/password","",router)
    if (typeof window !== 'undefined') {
      const value = sessionStorage.getItem('email');
      setEmail(value)
    }
  },[])


  return(
      <div className={style["sign-in-box"]} style={{backgroundColor: theme.primaryColor}}>
          <Image src={logo} className={style["img-adjust"]} alt='error'/>
          <h2 className={style["sign-up-title"]}>Sign In</h2>
          <div className={style["back-to-signIn"]} onClick={() => backToSignIn()}>
            <i className="uil uil-arrow-left" id={style["left-arrow"]}></i>
            <label>{email}</label>
          </div>
          {isPasswordCorrect ? <input type="password" placeholder='Password' onChange={(event) => setNewPassword(event.target.value)}></input> : <input className={style["wrong-input-text"]}  type="password" placeholder='Password' onChange={(event) => setNewPassword(event.target.value)}></input>}
          <button className={`${style["orange-button"]} ${style["button"]}`} onClick={() => fetchData()}>SIGN IN</button>
          <button className={style["white-button"]} >GET ONE TIME SIGN IN CODE</button>
          <a className={style["sign-up-label"]}>What's the One-Time Code?</a>
          <div className={style["sign-up"]}>
            <h3 className={style["sign-up-label"]}>New to Newegg?</h3><Link href="/signUp" className={style["sign-up-label"]}>Sign Up</Link>
          </div>
          <h3 className={style["sign-up-label"]}>OR</h3>
          <button className={style["white-button"]}>Sign in with google</button>
          <button className={style["white-button"]}>Sign in with apple</button>            
      </div>
  )

}