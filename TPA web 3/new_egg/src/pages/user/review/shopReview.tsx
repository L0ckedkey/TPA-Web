import Footer from "@/components/footer";
import Navbar from "@/components/navbar";
import  Axios  from "axios";
import { useState } from "react";
import style from '../../../styles/cartCards.module.css'

export default function SetShopReview(props:any){
    console.log(props)
    const link = "http://localhost:8080/setShopReview"
    const [point, setPoint] = useState(0)
    const [review, setReview] = useState('')
    const [question1, setQuestion1] = useState(-1)
    const [question2, setQuestion2] = useState(-1)
    const [question3, setQuestion3] = useState(-1)

    const addReview = () => {
        console.log("Set Review");      
        console.log(props.shopID)
        console.log(props.orderHeaderID);
        console.log(props.accountID)  

        Axios.get(link,{
        params:{
            accountID : props.accountID,
            orderHeaderID : props.orderHeaderID,
            shopID : props.shopID,
            review: review,
            shopPoint: point,
            pointQuestion1: question1,
            pointQuestion2: question2,
            pointQuestion3: question3,
        }
        })
        .then(response => {
            console.log(response.data);
            if(response.data == "Success"){
                window.location.reload()
            }
        })
        .catch(error => {
            console.log(error);
        });
    }

    return (
        <div className={style["question-container"]}>
            <div className={style["question"]}>
                <label>Item Delivered On Time : </label>
                <select value={question1} onChange={(event) =>setQuestion1(parseInt(event.target.value))} className={style["add-product-input-dropdown"]}>
                    <option value={-1}></option>
                    <option value={1}>Yes</option>
                    <option value={0}>No</option>
                </select>
            </div>
            <div className={style["question"]}>
                <label>Item as seller described : </label>
                <select value={question2} onChange={(event) =>setQuestion2(parseInt(event.target.value))} className={style["add-product-input-dropdown"]}>
                    <option value={-1}></option>
                    <option value={1}>Yes</option>
                    <option value={0}>No</option>
                </select>
            </div>
            <div className={style["question"]}>
                <label>Satisfactory Customer Service : </label>
                <select value={question3} onChange={(event) =>setQuestion3(parseInt(event.target.value))} className={style["add-product-input-dropdown"]}>
                    <option value={-1}></option>
                    <option value={1}>Yes</option>
                    <option value={0}>No</option>
                </select>
            </div>
            <div className={style["question"]}>
                <label>Overall Shop Performance : </label>
                <select value={point} onChange={(event) =>setPoint(parseInt(event.target.value))} className={style["add-product-input-dropdown"]}>
                    <option value={-1}></option>
                    <option value={1}>1</option>
                    <option value={2}>2</option>
                    <option value={3}>3</option>
                    <option value={4}>4</option>
                    <option value={5}>5</option>
                </select>
            </div>
            <div className={style["question"]}>
                <label>Review : </label>
                <input type={"text"} onChange={(e) => setReview(e.target.value)}></input>
            </div>
            <button onClick={() => addReview()}>Submit</button>
        </div>
    )
}