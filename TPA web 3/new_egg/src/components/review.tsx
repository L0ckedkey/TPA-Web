import  Axios  from "axios";
import { useState } from "react";
import style from '../styles/cartCards.module.css'

export default function SetReview(props:any){
    // console.log(props)
    const link = "http://localhost:8080/setReview"
    const [point, setPoint] = useState(0)
    const [review, setReview] = useState('')
    const addReview = () => {
        console.log("Set Review");      
        console.log(props.productID)
        console.log(props.orderHeaderID);
        console.log(props.accountID)  

        Axios.get(link,{
        params:{
            accountID : props.accountID,
            orderHeaderID : props.orderHeaderID,
            productID : props.productID,
            review: review,
            point: point
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
        <div className={style["review-container"]}>
            <input type={"text"} onChange={(e) => setReview(e.target.value)}></input>
            <select value={point} onChange={(event) =>setPoint(parseInt(event.target.value))} className={style["add-product-input-dropdown"]}>
            <option value={0}>-</option>
            <option value={1}>1</option>
            <option value={2}>2</option>
            <option value={3}>3</option>
            <option value={4}>4</option>
            <option value={5}>5</option>
            </select>
            <button onClick={() => addReview()}>Submit</button>
      </div>
    )
}

