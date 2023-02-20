import Footer from "@/components/footer";
import Navbar from "@/components/navbar";
import Axios from "axios";
import { useEffect, useState } from "react";
import style from '../../../styles/admins.module.css'
import { useRouter } from 'next/router';
import middleware from "@/utiil/token";

export default function AddShop(){

    const router = useRouter()
    const [password, setPassword] = useState('')
    const [firstName, setFirstName] = useState('')
    const [lastName, setLastName] = useState('')
    const [email ,setEmail] = useState('')
    const [description, setDescription] = useState('')
    const [phoneNumber, setPhoneNumber] = useState('')

    const [descriptionError, setDescriptionError] = useState(false)
    const [passwordError, setPasswordError] = useState(false)
    const [emailError, setEmailError] = useState(false)
    const [phoneNumberError, setPhoneNumberError] = useState(false)
    const [firstNameError, setFirstNameError] = useState(false)
    const [lastNameError, setLastNameError] = useState(false)

    const [vouchers, setVouchers] = useState([])

    const link = "http://localhost:8080/addShop"
    useEffect(() => {
        setPasswordError(false)
        setEmailError(false)
        setDescriptionError(false)
        setLastNameError(false)
        setFirstNameError(false)
        setPhoneNumberError(false)

        if(firstName.length === 0){
            setFirstNameError(true);
        }

        if(lastName.length === 0){
            setLastNameError(true);
        }

        if(email.length === 0){
            setEmailError(true);
        }

        if(description.length === 0){
            setDescriptionError(true)
        }

        if(password.length === 0){
            setPasswordError(true)
        }

        console.log("===================")
        console.log(emailError)
        console.log(descriptionError)
        console.log(firstNameError)
        console.log(lastNameError)
        console.log(phoneNumberError)
        console.log(passwordError)
    })


    const addShop = () => {
        if(!firstNameError && !descriptionError && !emailError && !phoneNumberError && !lastNameError && !passwordError){
            console.log(description)
            console.log(email)
            
            Axios.get(link, {
                params:{
                    firstName: firstName,
                    lastName: lastName,
                    description: description,
                    email: email, 
                    phoneNumber: phoneNumber,
                    password: password,
                    accuracy: 0,
                }
            }).then(function (response) {
                console.log(response.data);
                // router.push("/admin/home")
              })
              .catch(function (error) {
                console.log(error);
              })
              .then(function () {
                // always executed
              }); 

        }
    }

    useEffect(() => {
        middleware('admin/adShop','Admin', router)
    })

    return (
        <div>
            <Navbar/>
            <div className={style["add-promo-container"]}>
                <h2>Add Shop</h2>
                <div className={style["add-product-detail"]}>
                    <div className={style["add-product-title"]}>
                        <label>Shop First Name</label>
                        <label>:</label>
                    </div>
                    <input type="text" className={style["add-product-input-text"]} placeholder='Shop First Name' id="first-name" onChange={(event) => setFirstName(event.target.value)}></input>
                </div>
                <div className={style["add-product-detail"]}>
                    <div className={style["add-product-title"]}>
                        <label>Shop Last Name</label>
                        <label>:</label>
                    </div>
                    <input type="text" className={style["add-product-input-text"]} placeholder='Shop Last Name' id="first-name" onChange={(event) => setLastName(event.target.value)}></input>
                </div>
                <div className={style["add-product-detail"]}>
                    <div className={style["add-product-title"]}>
                        <label>Shop Email</label>
                        <label>:</label>
                    </div>
                    <input type="text" className={style["add-product-input-text"]} placeholder='Shop Email' id="first-name" onChange={(event) => setEmail(event.target.value)}></input>
                </div>
                <div className={style["add-product-detail"]}>
                    <div className={style["add-product-title"]}>
                        <label>Shop Password</label>
                        <label>:</label>
                    </div>
                    <input type="password" className={style["add-product-input-text"]} placeholder='Shop Password' id="first-name" onChange={(event) => setPassword(event.target.value)}></input>
                </div>
                <div className={style["add-product-detail"]}>
                    <div className={style["add-product-title"]}>
                        <label>Shop Phone Number</label>
                        <label>:</label>
                    </div>
                    <input type="text" className={style["add-product-input-text"]} placeholder='Shop Phone Number' id="first-name" onChange={(event) => setPhoneNumber(event.target.value)}></input>
                </div>
                <div className={style["add-product-detail"]}>
                    <div className={style["add-product-title"]}>
                        <label>Shop Description</label>
                        <label>:</label>
                    </div>
                    <input type="text" className={style["add-product-input-text"]} placeholder='Shop Description' id="first-name" onChange={(event) => setDescription(event.target.value)}></input>
                </div>
                <button className={style["add-promo-button"]} onClick={() => addShop()}>Add Shop</button>            
            </div>
            <Footer/>
        </div>
    )
}