

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

const linkGetCode = "http://localhost:8080/getForgotPasswordCode"
const linkVerifyCode = "http://localhost:8080/validateForgotPasswordCode/"

export default function ForgotPassword(){
    const [inputCode, setInputCode] = useState("")
    const [code, setCode] = useState("")
    const router = useRouter()
    const [isTrue, setIsTrue] = useState(true)
    const [disabled, setDisabled] = useState(false);
    const [email, setEmail] = useState(null)

    const handleClick = () => {
      setDisabled(true);
      // Perform some action here
    };

    useEffect(() => {
        if (typeof window !== 'undefined') {
          const value = sessionStorage.getItem('email');
          setEmail(value)
        }
      },[])
  
    useEffect(() => {
      const timer = setTimeout(() => {
        setDisabled(false);
      }, 120000);
  
      return () => clearTimeout(timer);
    }, [disabled]);
  
  
   useEffect(() => {
  
      setIsTrue(true)
  
      Axios.get(linkGetCode)
      .then(function (response) {
        setCode(response.data)
          console.log(code)
      })
      .catch(function (error) {
        console.log(error);
      })
      .then(function () {
        // always executed
      });
  
  
      
   }, [])
  
      const sendCode = () => {
        console.log(code)
        handleClick()
        console.log("clicked")
          emailjs.send('service_qti1y0g', 'template_k8x1h22', {
              sender_name: 'NewEgg Admin',
              recipient_name: sessionStorage.getItem("email"),
              recipient_email: sessionStorage.getItem("email"),
              message: "Your Code is " + code,
            }, "nlyqMaZDWWm5c0YtX")
            .then((response) => {
              console.log('SUCCESS!', response.status, response.text);
            }, (error) => {
              console.log('FAILED...', error);
            });
      }
  
      const validateCode = () =>{
          Axios.get(linkVerifyCode + inputCode)
          .then(function (response) {
              console.log(response.data)
              setIsTrue(response.data)
  
              if(isTrue){
                  router.push("/password/changePassword")
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
            <h2 className={style["sign-up-title"]}>Forgot Password</h2>
            <h3>{email}</h3>
            {isTrue === true ? <input type="text" placeholder='Code' onChange={(event) => setInputCode(event.target.value)}></input> : <input type="text" className={style["wrong-input-text"]} placeholder='Code' onChange={(event) => setInputCode(event.target.value)}></input>}
            <button className={`${style["orange-button"]} ${style["button"]}`} onClick={() => validateCode()}>Verify Code</button>  
            <button className={`${style["orange-button"]} ${style["button"]}`} onClick={() => sendCode()} disabled={disabled}>Request Code</button>        
        </div>
    )
}