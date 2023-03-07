import Image from 'next/image';
import Link from 'next/link';
import { ReactElement, useEffect, useState } from 'react'
import logo from '../../assets/logo_newegg_400400.png'
import style from '../../styles/pages.module.css'
import Axios from 'axios'
import { useRouter } from 'next/router';
import middleware from '@/utiil/token';
const baseURL = "https://localhost:8080"


export default function SignUp(){

    const [test, setNewTest] = useState([]);

    const [firstName, setNewFirstName] = useState('a')
    const [lastName, setNewLastName] = useState('a')
    const [emailAddress, setNewEmailAddress] = useState('a')
    const [phoneNumber, setNewPhoneNumber] = useState('a')
    const [password, setNewPassword] = useState('*')
    const [isUpperCase, setNewIsUpperCase] = useState(false)
    const [isLowerCase, setNewIsLowerCase] = useState(false)
    const [isNumeric, setNewIsNumeric] = useState(false)
    const [isContainSpecialChar, setNewIsContainSpecialChar] = useState(false)
    const [isLengthRequired, setNewIsLengthRequired] = useState(false)
    const [additional, setNewAdditional] = useState(0)
    const [isAgree, setNewAgreement] = useState('');
    const [isPhoneNumber, setIsPhoneNumber] = useState(false)
    const [errorMessage, setErrorMessage] = useState('')

    const link = "http://localhost:8080/signUp"
    const link2 = "http://localhost:8080/signIn"
    const router = useRouter()


    const fetchData = async() => {

        if(additional >= 3 && isLengthRequired && firstName.length >= 0 && lastName.length >= 0 && emailAddress.length >= 0 && phoneNumber.length >= 0 && isPhoneNumber){
            
            Axios.get(link2,{
                params:{email: emailAddress}}).then(function (response) {
                // console.log(response.data);

                if(response.data.Email === ''){
                    Axios.get(link, {
                      params: {lastName: lastName,
                              firstName: firstName,
                              phoneNumber: phoneNumber,
                              email: emailAddress,
                              password: password,
                              agreement: isAgree
                              }
                    })
                      .then(function (response) {
                        // console.log(typeof(response.data));
                        console.log(response.data);
                        if(response.data != "Error"){
                          router.push("/signIn")
                        }else{
                            console.log(response.data);
                        }
                      })
                      .catch(function (error) {
                        // console.log(error);
                      })
                      .then(function () {
                        // always executed
                      });  
                }
               
              })
              .catch(function (error) {
                // console.log(error);
              })
              .then(function () {
                // always executed
              });  

            
        }
       
      }

    useEffect(() => {

        setNewIsUpperCase(false)
        setNewIsLowerCase(false)
        setNewIsNumeric(false)
        setNewIsContainSpecialChar(false)
        setNewIsLengthRequired(false)
        setIsPhoneNumber(false)

        if(password.length >= 8 && password.length <= 30){
            setNewIsLengthRequired(true)
        }

        if(!isNaN(Number(phoneNumber))){
            setIsPhoneNumber(true)
        }

        for(let i =0; i<password.length; i++){
            let char = password.charAt(i)
            if(char >= "A" && char <= "Z"){
                setNewIsUpperCase(true)
            }
        }

        for(let i =0; i<password.length; i++){
            let char = password.charAt(i)
            if(char >= "a" && char <= 'z'){
                setNewIsLowerCase(true)
            }
        }

        for(let i = 0; i<password.length; i++){
            let char = password.charAt(i)
            if(char >= '1' && char <= '9'){
                setNewIsNumeric(true)
            }
        }

        for(let i = 0; i<password.length; i++){
            let char = password.charAt(i)
            if(char === '@' || char === '#' ||char === '$'){
                setNewIsContainSpecialChar(true)
            }
        }
     
        var isTrue = 0
        if(isUpperCase){
            isTrue++
        }else{
            // if(isTrue > 0) isTrue-- 
        }

        if(isLowerCase){
            isTrue++
        }else{
            // if(isTrue > 0) isTrue-- 
        }

        if(isNumeric){
            isTrue++
        }else{
            // if(isTrue > 0) isTrue-- 
        }

        if(isContainSpecialChar){
            isTrue++
        }else{
            // if(isTrue > 0) isTrue-- 
        }

        setNewAdditional(isTrue)

        // console.log("isTrue" + isTrue);


        // console.log(password)
        // console.log(isUpperCase)
        // console.log(isLowerCase)
        // console.log(isNumeric)
        // console.log(isContainSpecialChar)
        // console.log(isAgree)
        // console.log("=================")
    })

    useEffect(() => {
        middleware("/signUp", "", router)
      },[])
    

    const handleChange = (event:any) => {
        if (event.target.checked) {
            console.log("here")
            setNewAgreement("yes")
          } else {
            // console.log("hore")
            setNewAgreement("no")
          }
          console.log(isAgree);
          
    }

    // useEffect(() => {
    //     console.log(isAgree)
    // }, [isAgree])


    return(
        <div className={style["sign-in-box"]}>
            <Image src={logo} className={style["img-adjust"]} alt='error'/>
            <div className={style["sign-up"]}>
                <h3 className={style["sign-up-label"]}>Shopping for your business? <a className={style["sign-up-label"]}>Create a free business account</a></h3>
            </div>
            <h2 className={style["sign-up-label"]}>Create Account</h2>
            <input type="text" placeholder='First Name' id="first-name" onChange={(event) => setNewFirstName(event.target.value)}></input>
            {firstName.length == 0 ? <div className={style["error"]}>Must not empty</div> :<div></div>}
            <input type="text" placeholder='Last Name' id="last-name" onChange={(event) => setNewLastName(event.target.value)}></input>
            {lastName.length == 0 ? <div className={style["error"]}>Must not empty</div> :<div></div>}
            <input type="email" placeholder='Email Address' id="email-address" onChange={(event) => setNewEmailAddress(event.target.value)}></input>
            {emailAddress.length == 0 ? <div className={style["error"]}>Must not empty</div> :<div></div>}
            <input type="text" placeholder='Mobile Phone Number (optional)' id="mobile-phone" onChange={(event) => setNewPhoneNumber(event.target.value)}></input>
            {phoneNumber.length == 0 ? <div className={style["error"]}>Must not empty</div> :<div></div>}
            <input type="password" placeholder='Password' id="password" onChange={(event) => setNewPassword(event.target.value)}></input>
            {password.length == 0 ? <div className={style["error"]}>Must not empty</div> :<div></div>}
            <div className={style["error-message"]}>
                <div className={style["error-message-left"]}>
                    <div>Including 3 of the following:</div>
                    <div className={style["contain-three"]}>
                    {isUpperCase ?  <div>✔️ ABC</div> : <div>❌ ABC</div>}
                    {isLowerCase ?  <div>✔️ abc</div> : <div>❌ abc</div>}
                    {isNumeric ?    <div>✔️ 123</div> : <div>❌ 123</div>}
                    {isContainSpecialChar ? <div>✔️ @#$</div> : <div>❌ @#$</div>}
                    </div>
                </div>
                <div className={style["error-message-left"]}>
                    <div>Must Contain :</div>
                    <div className={style["contain-three"]}>
                    {isLengthRequired ? <div>✔️ 8-30 Chars</div> : <div>❌ 8-30 Chars</div>}
                    </div>
                </div>
               
            </div>
            <div>
                <input type="checkbox" id="checkbox" value={isAgree} onChange={(event) => handleChange(event) }></input>
                <label>Subscribe for exclusive e-mail offers and discounts</label>
            </div>
            
            <div className={style["sign-up"]} >
                <h3 className={style["sign-up-label"]}>By creating an account, you agree to Newegg’s Privacy Notice and Terms of Use. <a>Privacy Notice</a> and <a>Terms of Use</a></h3>
            </div>
            <button className={style["orange-button"]} onClick={() => fetchData()}>SIGN UP</button>
            <div className={style["sign-up"]}>
                <h3 className={style["sign-up-label"]}>Have an Account? </h3><Link href="/signIn" className={style["sign-up-label"]}>Sign In?</Link>
            </div>
            
        </div>
    )
}