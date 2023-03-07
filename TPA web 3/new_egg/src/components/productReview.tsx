
import { getUserID } from "@/utiil/token";
import { useEffect, useState } from "react"

export default function ProductReview(props:any){
    const details = props.details
    console.log(details);
    const [userID, setUserID] = useState('')

    useEffect(() => {

        async function fetchProduct() {
            const res = await getUserID()
            setUserID(res)
          }
          fetchProduct()

    }, [])

    return(
        <div>
            <label>Name = {details.Account.FirstName + " " + details.Account.LastName}</label><br></br>
            <label>Point = {details.Point}</label><br></br>
            <label>Review = {details.Review}</label><br></br>
            {
                details.AccountID == userID ? <button>Delete</button> : null 
            }
        </div>
    )
}