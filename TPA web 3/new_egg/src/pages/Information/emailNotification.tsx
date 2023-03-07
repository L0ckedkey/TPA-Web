import Footer from "@/components/footer";
import Navbar from "@/components/navbar";
import { getName, getNewsletterStatus, getUserID } from "@/utiil/token";
import { useContext, useEffect, useState } from 'react'
import Axios from 'axios'

export default function EmailNotification(){
    const link = "http://localhost:8080/changeNewsLetterStatus"
    const [newsletterStatus, setNewsLetterStatus] = useState('')
    const [accountID, setAccountID] = useState('')
    useEffect(() => {

        const getNewsletter = async () => {
            var status = await getNewsletterStatus()
            var id = await getUserID()
            setNewsLetterStatus(status)
            setAccountID(id)
        }
        
        getNewsletter()
    }, [])

    const changeNewsletterStatus = () => {
        console.log(accountID)
        Axios.get(link,{
            params:{
                id: accountID
            }}).then(function (response) {
                console.log(response.data)

                if(response.data === "Success"){
                    if(newsletterStatus == "yes"){
                        setNewsLetterStatus("no")
                    }else{
                        setNewsLetterStatus("yes")
                    }
                }
           
          })
          .catch(function (error) {
            // console.log(error);
          })
          .then(function () {
            // always executed
          });  
    }


    return (
        <div>
            <Navbar/>
                {newsletterStatus != '' ? <h2 >Newsletter Status : {newsletterStatus}</h2>: <h2>Newsletter Status : Loading</h2>}
                <button onClick={() => changeNewsletterStatus()}>Change news letter status</button>
            <Footer/>
        </div>
    )
}