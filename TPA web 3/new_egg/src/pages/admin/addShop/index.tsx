import Footer from "@/components/footer";
import Navbar from "@/components/navbar";
import Axios from "axios";
import { useEffect, useState } from "react";
import style from '../../../styles/admins.module.css'
import { useRouter } from 'next/router';
import middleware from "@/utiil/token";
import ViewShop from "./viewShop";
import emailjs from 'emailjs-com';

export default function AddShop(){

    const getAllShops = "http://localhost:8080/getAllShops"
    const getAllShopsPaginated = "http://localhost:8080/getAllShopsPaginated"

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

    const [filterBy, setFilterBy] = useState('')
    const [shops, setShops] = useState([])
    const [pageLimit, setPageLimit] = useState(5)
    const [page, setPage] = useState(1)
    const [totalPages, setTotalPages] = useState(0)

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


    const blastEmail = () => {
        
            
            const data = {
                from_name: "NewEgg Promotion Team",
                to_name: firstName + " " + lastName,
                message: "Your Shop hase been created",
                to_email: email
            }
    
            emailjs.send("service_qti1y0g","template_r2nq9dp",data,"nlyqMaZDWWm5c0YtX").then((result:any) => {
                console.log(result.text);
              }, (error:any) => {
                console.log(error.text);
              });
        }

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
                if(response.data == "Success"){
                    blastEmail()
                }
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

    const nextPage = () => {
        console.log(totalPages)
        if(page + 1 > totalPages){
            setPage(totalPages)
        }else{
            var pageNow = page+1
            console.log(pageNow)
            setPage(pageNow)
        }
       
    }

    const prevPage = () => {
        if(page - 1 <= 0){
            setPage(1)
        }else{
            var pageNow = page-1
            console.log(pageNow)
            setPage(pageNow)
        }
    }

    useEffect(() => {
        Axios.get(getAllShops,{
            params:{
                filterBy:filterBy
            }
        }).then(function (response) {
            var jsonArray = response.data
            setTotalPages(Math.ceil(jsonArray.length / pageLimit));
        })
        .catch(function (error) {
        //   console.log(error);
        })
        .then(function () {
        // always executed
        });  
    }, [page,filterBy])

    useEffect(() => {
        Axios.get(getAllShopsPaginated,{
            params:{
                limit: pageLimit,
                page: page,
                filterBy:filterBy
            }
        }).
        then(function (response) {
            setShops(response.data)
        })
        .catch(function (error) {
        //   console.log(error);
        })
        .then(function () {
        // always executed
        });  
    }, [page,filterBy])

    
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
            <select value={filterBy} onChange={(event) =>setFilterBy(event.target.value)}>
                    <option value={""}></option>
                    <option value={"Banned"}>Banned</option>
                    <option value={"Active"}>Active</option>
            </select>
            <ViewShop details={shops}/>
            <button onClick={() => prevPage()}>prev</button>
            <button onClick={() => nextPage()}>next</button>
            <Footer/>
        </div>
    )
}