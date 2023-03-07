import Footer from "@/components/footer";
import Navbar from "@/components/navbar";
import middleware, { getUser, getUserID } from "@/utiil/token";
import  Axios  from "axios";
import { useRouter } from "next/router";
import { useEffect, useReducer, useState, useTransition } from "react";
import Placeholder from "react-select/dist/declarations/src/components/Placeholder";
import style from '../../styles/accounts.module.css'
import axios from "axios";

export default function UserDetail(){
    const accLink = "http://localhost:8080/checkAccountOnID"
    const updateLink = "http://localhost:8080/updatePhoneNumber"
    const updatePasswordLink = "http://localhost:8080/changePasswordOnly"
    const usePromoLink = "http://localhost:8080/usePromo"
    const router = useRouter()
    const [account, setAccount] = useState([])
    const [user, setUser] = useState('')
    const [newPassword, setNewPassword] = useState('')
    const [changePassword, setChangePassword] = useState(false)
    const [newPhoneNumber, setNewPhoneNumber] = useState('')
    const [currentPhoneNumber, setCurrentPhoneNumber] = useState('')
    const [changePhoneNumber, setChangePhoneNumber] = useState(false)
    const [oldPassword, setOldPassword] = useState('')
    const [useCoupon, setUseCoupon] = useState(false)
    const [couponCode, setCouponCode] = useState('')
    const [accountID, setAccountID] = useState('')
    const [error, setError] = useState('') 

    useEffect(() => {
        const getAccID = async () => {
            var name = await getUserID();
            setAccountID(name);
        };
        getAccID();     
    }, []);

    useEffect(() => {
        setError('')
    }, [changePassword])

    useEffect(() => {
        middleware("/user","", router)
        if(accountID != ""){
            axios.get(accLink,{
                params:{
                    id: accountID
                }
            }).then(function (response) {
                console.log(response.data)
                setAccount(response.data)
            })
            .catch(function (error) {
                console.log(error);
            });
        }
    }, [accountID,currentPhoneNumber, couponCode])

    const signOut = (name:any) => {
        document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
        router.push("/")
    }

    const showChangePassword = () => {
        setError('')
        if(changePassword){
            setChangePassword(false)
        }else{
            setChangePassword(true)
        }
    }

    const showChangePhoneNumber = () => {
        setError('')
        if(changePhoneNumber){
            setChangePhoneNumber(false)
        }else{
            setChangePhoneNumber(true)
        }
    }

    const showUseCoupon = () => {
        setError('')
        if(useCoupon){
            setUseCoupon(false)
        }else{
            setUseCoupon(true)
        }
    }

    const updatePassword = () => {
        console.log("here")
        axios.get(updatePasswordLink,{
            params:{
                oldPassword: oldPassword,
                newPassword: newPassword,
                id: accountID
            }
        }).then(function (response) {
            console.log(response.data)
            if(response.data != "success"){
                setError(response.data)
            }

            setError(response.data)
        })
        .catch(function (error) {
            console.log(error);
        });
    }

    const updatePhoneNumber = () => {
        console.log("here")
        axios.get(updateLink,{
            params:{
                phoneNumber: newPhoneNumber,
                id: accountID
            }
        }).then(function (response) {
            console.log(response.data)
            if(response.data == "success"){
                setCurrentPhoneNumber(newPhoneNumber)
            }
        })
        .catch(function (error) {
            console.log(error);
        });
    }

    const useCouponCode = () => {
        console.log("here")
        axios.get(usePromoLink,{
            params:{
                accountID: accountID,
                couponCode: couponCode
            }
        }).then(function (response) {
            console.log(response.data)
            setError(response.data)
            if(response.data == "Success"){
                setCouponCode('')
            }
        })
        .catch(function (error) {
            console.log(error);
        });
    }

    const goToWishlist = () => {
        router.push('/wishlist')
    }

    if(user == "No data"){
        console.log("here")
        router.push("/")
    }else{
        return(
            <div>
                <Navbar/>
                    <div className={style["account-info-container"]}>
                        <label>Name : {account.FirstName + " " + account.LastName  }</label>
                        <label>Role : {account.Role}</label>
                        <label>Email : {account.Email}</label>
                        <label>PhoneNumber : {account.PhoneNumber}</label>
                        <label>Money : {account.Money}</label>
                        <label>Subscription : {account.NewsLetterStatus}</label>
                        {
                            changePhoneNumber ? 
                            <div className={style["add-on"]}>
                                <input type="text" onChange={(e) => setNewPhoneNumber(e.target.value)} placeholder={"New Phone Number"}></input>
                                <button onClick={updatePhoneNumber}>Change Phone Number</button>
                            </div>
                            :
                            null
                        }
                        {
                            changePassword ? 
                            <div className={style["add-on"]}>
                                <input type="password" onChange={(e) => setOldPassword(e.target.value)} placeholder={"Old Password"}></input>
                                <input type="password" onChange={(e) => setNewPassword(e.target.value)} placeholder={"New Password"}></input>
                                <button onClick={updatePassword}>Change Password</button>
                                <div>{error}</div>
                            </div>
                            :
                            null
                        }
                        {
                            useCoupon ? 
                            <div className={style["add-on"]}>
                                <input type="text" onChange={(e) => setCouponCode(e.target.value)} placeholder={"Coupon Code"}></input>
                                <button onClick={useCouponCode}>Use Coupon</button>
                                <div>{error}</div>
                            </div>
                            :
                            null
                        }
                        <button onClick={() => signOut("Token")}>Sign Out</button>
                        <button onClick={() => showChangePassword()}>Change Password</button>
                        <button onClick={() => showChangePhoneNumber()}>Change PhoneNumber</button>
                        <button onClick={() => showUseCoupon()}>Use Coupon</button>
                        {
                            account.Role == "Customer" ? <button onClick={() => goToWishlist()}>Wishlist</button> : null
                        }
                    </div>
                <Footer/>
            </div>
        )
    }
   
}