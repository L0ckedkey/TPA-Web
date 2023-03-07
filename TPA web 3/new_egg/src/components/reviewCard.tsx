import Axios from "axios"
import { useEffect, useState } from "react"


export default function ReviewCard(props:any){
    const details = props.details
    console.log(details);
    
    const addLink = "http://localhost:8080/addHelpfull"
    const removeLink = "http://localhost:8080/removeHelpfull"
    const checkink = "http://localhost:8080/isHelpfull"

    const [isHelpfull, setHelpfull] = useState(false)

    useEffect(() => {
        Axios.get(checkink, {
            params:{
                accountID: details.AccountID,
                reviewShopID: details.ShopID
            }
        }).then(function (response) {
            console.log(response.data);

            if(response.data == "Error"){
                setHelpfull(false)
            }else{
                setHelpfull(true)
            }
            
        })
        .catch(function (error) {
        //   console.log(error);
        })
        .then(function () {
          // always executed
        });  
    }, [])

    const setUnhelpfull = () => {
        Axios.get(removeLink, {
            params:{
                accountID: details.AccountID,
                reviewShopID: details.ShopID
            }
        }).then(function (response) {
            console.log(response.data);
            setHelpfull(false)
        })
        .catch(function (error) {
        //   console.log(error);
        })
        .then(function () {
          // always executed
        });  
    }
    
    const setHelpfullInput = () => {
        Axios.get(addLink, {
            params:{
                accountID: details.AccountID,
                reviewShopID: details.ShopID
            }
        }).then(function (response) {
            console.log(response.data);
            setHelpfull(true)
        })
        .catch(function (error) {
        //   console.log(error);
        })
        .then(function () {
          // always executed
        }); 
    }

    return(
        <div>
           <label>Name : {details.Account.FirstName + " " + details.Account.LastName}</label><br></br>
           <label>Time Poster : {details.TimePosted}</label><br></br>
           <label>Question 1 : {details.PointQuestion1}</label><br></br>
           <label>Question 2 : {details.PointQuestion2}</label><br></br>
           <label>Question 3 : {details.PointQuestion3}</label><br></br>
           <label>Shop Point : {details.ShopPoint}</label><br></br>
           <label>Review : {details.Review}</label><br></br>
           {
            isHelpfull ? <button onClick={() => setUnhelpfull()}>Unhelpfull</button> : <button onClick={() => setHelpfullInput()}>Helpfull</button>
           }
        </div>
    )
}


export function ReviewWishlist(props:any){
    
    var props = props.details
    console.log(props)

    if(props.AccountID == 0){
        return(
            <div>
                <h3>Name : Anonymus</h3>
                <h3>Point : {props.Point}</h3>
                <h3>Review : {props.Review}</h3>
            </div>
        )
    }else{
        return(
            <div>
                <h3>Name : {props.Account.FirstName + " " + props.Account.LastName}</h3>
                <h3>Point : {props.Point}</h3>
                <h3>Review : {props.Review}</h3>
            </div>
        )
    }
    
}