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

const GET_QUERY =  `query findTodos {
    accounts{
      id
    }
  } `

const link = "http://localhost:8080/signIn"

export default function SignIn(){
  const [isEmailCorrect, setNewEmailCorrect] = useState(true)
  const [data, setNewData] = useState({user: []})
  const [email, setNewEmail] = useState("")
  const router = useRouter()



  const fetchData = async() => {      
      Axios.get(link,{
        params:{email: email}
      })
        .then(function (response) {
          if(response.data.Email !== ""){
            sessionStorage.setItem("email", email)
            router.push('/password')
            console.log(response.data)
          }else{
            setNewEmailCorrect(false)
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

  useEffect(() => {
    middleware("/signIn", "", router)
  },[])


  const {theme, setNewTheme} = useContext(ThemeContext)

  const goToOneTimeCode = () => {
    router.push("/oneTimeCode")
  }
  
  const goToHome = () =>{
    router.push("/home")
  } 

  return(
      <div className={style["sign-in-box"]} style={{backgroundColor: theme.primaryColor}}>
          <Image src={logo} className={style["img-adjust"]} alt='error' onClick={() => goToHome()}/>
          <h2 className={style["sign-up-title"]}>Sign In</h2>
          {isEmailCorrect ? <input type="text" placeholder='Email Address' onChange={(event) => setNewEmail(event.target.value)}></input> : 
            <div className={style["placeholder"]}>
              <input className={style["wrong-input-text"]} type="text" placeholder='Email Address' onChange={(event) => setNewEmail(event.target.value)}></input><br></br><label>Email invalid or banned</label>
            </div>
          }
          <button className={`${style["orange-button"]} ${style["button"]}`} onClick={() => fetchData()}>SIGN IN</button>
          <button className={style["white-button"]} onClick={() => goToOneTimeCode()}>GET ONE TIME SIGN IN CODE</button>
          <a className={style["sign-up-label"]} >What's the One-Time Code?</a>
          <div className={style["sign-up"]}>
              <h3 className={style["sign-up-label"]}>New to Newegg?</h3><Link href="/signUp" className={style["sign-up-label"]}>Sign Up</Link>
          </div>
          <h3 className={style["sign-up-label"]}>OR</h3>
          <button className={style["white-button"]}>Sign in with google</button>
          <button className={style["white-button"]}>Sign in with apple</button>            
      </div>
  )

}