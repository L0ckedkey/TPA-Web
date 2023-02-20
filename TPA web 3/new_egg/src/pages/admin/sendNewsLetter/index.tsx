import Footer from "@/components/footer";
import Navbar from "@/components/navbar";
import middleware from "@/utiil/token";
import  Axios  from 'axios';
import emailjs from 'emailjs-com';
import { useRouter } from "next/router";
import { useEffect, useState } from 'react';
import style from '../../../styles/admins.module.css'

export default function SendNewsLetter(){
    const [message, setMessage] = useState('')
    const link = "http://localhost:8080/getAllUsersForBlastEmail"
    const [accounts, setAccounts] = useState([])
   
    var router = useRouter()
    useEffect(() => {
        Axios.get(link)
        .then(function (response) {
            // console.log(response.data)
            setAccounts(response.data)
        })
        .catch(function (error) {
            console.log(error);
        })
        .then(function () {
        // always executed
        });  
        middleware('admin/sendNewsLetter','Admin', router)
    }, [])

    const blastEmails = () => {
    accounts.map((account:any) => {
        console.log(account)
        const data = {
            from_name: "NewEgg Promotion Team",
            to_name: account.FirstName + " " + account.LastName,
            message: message,
            to_email: account.Email
        }

        emailjs.send("service_qti1y0g","template_r2nq9dp",data,"nlyqMaZDWWm5c0YtX").then((result) => {
            console.log(result.text);
          }, (error) => {
            console.log(error.text);
          });
    })
    }




    return (
    <div>
        <Navbar/>
        <div className={style["blast-email-container"]}>
            <label>Set Message</label>
            <textarea onChange={(event) => setMessage(event.target.value)}></textarea>
            <button onClick={() => blastEmails()}>Blast Email</button>
        </div>
        <Footer/>
    </div>)
}