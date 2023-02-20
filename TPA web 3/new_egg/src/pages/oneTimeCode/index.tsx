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
            router.push('/oneTimeCode/validateCode')
            console.log(response.data)
          }else{
            setNewEmailCorrect(false)
          }
          
        })
        .catch(function (error) {
          console.log(error);
        })
        .then(function () {
          // always executed
        }); 
        
  }



  const {theme, setNewTheme} = useContext(ThemeContext)


  return(
      <div className={style["sign-in-box"]} style={{backgroundColor: theme.primaryColor}}>
          <Image src={logo} className={style["img-adjust"]} alt='error'/>
          <h2 className={style["sign-up-title"]}>Sign In Using One Time Code</h2>
          {isEmailCorrect ? <input type="text" placeholder='Email Address' onChange={(event) => setNewEmail(event.target.value)}></input> : <input className={style["wrong-input-text"]} type="text" placeholder='Email Address' onChange={(event) => setNewEmail(event.target.value)}></input>}
          <button className={`${style["orange-button"]} ${style["button"]}`} onClick={() => fetchData()}>Sign In</button>        
      </div>
  )

}