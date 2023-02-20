import Footer from '@/components/footer'
import Navbar from '@/components/navbar'
import  Axios  from 'axios'
import { useEffect, useReducer, useRef, useState } from 'react'
import { start } from 'repl'
import style from '../../../styles/admins.module.css'
import { useRouter } from 'next/router';
import { Card, Cards } from '@/components/promoCard'
import middleware from '@/utiil/token'

export default function AddVoucher(){


    const [name, setName] = useState('')
    const [code ,setCode] = useState('')
    const [description, setDescription] = useState('')
    const [discount, setDiscount] = useState(0)
    const [endDate, setEndDate] = useState('')
    const [startDate, setStartDate] = useState('')
    const [discountError, setDiscountError] = useState(false)
    const [nameError, setNameError] = useState(false)
    const [codeError, setCodeError] = useState(false)
    const [descriptionError, setDescriptionError] = useState(false)
    const [startDateError, setStartDateError] = useState(false)
    const [endDateError, setEndDateError] = useState(false)
    const [dateDiffError, setDateDiffError] = useState(false)
    const [vouchers, setVouchers] = useState([])
    const link = "http://localhost:8080/addPromo"
    const link2 = "http://localhost:8080/getAllVouchers"
    const router = useRouter()
    useEffect(() => {
        setNameError(false)
        setCodeError(false)
        setDescriptionError(false)
        setStartDateError(false)
        setEndDateError(false)
        setDateDiffError(false)
        setDiscountError(false)

        if(name.length === 0){
            setNameError(true);
        }

        if(code.length === 0){
            setCodeError(true);
        }

        if(description.length === 0){
            setDescriptionError(true);
        }

        if(startDate.length === 0){
            setStartDateError(true);
        }

        if(endDate.length === 0){
            setEndDateError(true);
        }

        if(startDate > endDate){
            setDateDiffError(true)
        }

        if(discount === 0){
            setDiscountError(true)
        }
        console.log("===================")
        console.log(nameError)
        console.log(codeError)
        console.log(descriptionError)
        console.log(startDateError)
        console.log(endDateError)
        console.log(dateDiffError)
        console.log(discountError)
    })

    useEffect(() => {
        Axios.get(link2).then(function (response) {
            console.log(response.data);
            setVouchers(response.data)
          })
          .catch(function (error) {
            console.log(error);
          })
          .then(function () {
            // always executed
          }); 
          middleware('admin/addVoucher','Admin', router)
    },[])

    const addVoucer = () => {
        if(!nameError && !codeError && !descriptionError && !startDateError && !endDateError && !dateDiffError && !discountError){
            console.log(name)
            console.log(code)
            console.log(description)
            console.log(startDate)
            console.log(endDate)

            Axios.get(link, {
                params:{
                    name: name,
                    code: code,
                    description: description,
                    startDate : startDate,
                    endDate: endDate,
                    discount: discount,
                }
            }).then(function (response) {
                console.log(response.data);
                router.push("/admin/home")
              })
              .catch(function (error) {
                console.log(error);
              })
              .then(function () {
                // always executed
              }); 

        }
        

    }

    return (
    <div>
        <Navbar/>
            <div className={style["add-promo-container"]}>
                <h2>Add Promo</h2>
                <div className={style["add-product-detail"]}>
                    <div className={style["add-product-title"]}>
                        <label>Promo Name</label>
                        <label>:</label>
                    </div>
                    <input type="text" className={style["add-product-input-text"]} placeholder='Promo Name' id="first-name" onChange={(event) => setName(event.target.value)}></input>
                </div>
                <div className={style["add-product-detail"]}>
                    <div className={style["add-product-title"]}>
                        <label>Promo Code</label>
                        <label>:</label>
                    </div>
                    <input type="text" className={style["add-product-input-text"]} placeholder='Promo Code' id="first-name" onChange={(event) => setCode(event.target.value)}></input>
                </div>
                <div className={style["add-product-detail"]}>
                    <div className={style["add-product-title"]}>
                        <label>Promo Discount</label>
                        <label>:</label>
                    </div>
                    <input type="text" className={style["add-product-input-text"]} placeholder='Promo Discount' id="first-name" onChange={(event) => setDiscount(parseFloat(event.target.value))}></input>
                </div>
                <div className={style["add-product-detail"]}>
                    <div className={style["add-product-title"]}>
                        <label>Promo Description</label>
                        <label>:</label>
                    </div>
                    <textarea className={style["add-promo-text-area"]} onChange={(event) => setDescription(event.target.value)}/>
                </div>    
                <div className={style["add-product-detail"]}>
                    <div className={style["add-product-title"]}>
                        <label>Start Date</label>
                        <label>:</label>
                    </div>
                    <input type="date" className={style["add-product-input-text"]} placeholder='Promo Code' id="first-name" onChange={(event) => setStartDate(event.target.value)}></input>
                </div>
                <div className={style["add-product-detail"]}>
                    <div className={style["add-product-title"]}>
                        <label>End Date</label>
                        <label>:</label>
                    </div>
                    <input type="date" className={style["add-product-input-text"]} placeholder='Promo Code' id="first-name" onChange={(event) => setEndDate(event.target.value)}></input>
                </div>
                <button className={style["add-promo-button"]} onClick={() => addVoucer()}>Add Promo</button>            
            </div>
            <Cards>
                {
                    vouchers ? 
                    vouchers.map((voucher:any) => {
                        return(<Card key={voucher.ID} details={voucher}></Card>)
                    }):
                    console.log("not yet")
                }
            </Cards>
        <Footer/>
    </div>
    )
}