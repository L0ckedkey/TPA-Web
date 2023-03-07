import style from '../styles/chats.module.css'
import { useRouter } from "next/router"
import { useEffect, useState } from 'react'
import { getUserID } from '@/utiil/token'
import axios from "axios"
import { v4 as uuidv4 } from 'uuid';
import { addDoc, collection } from 'firebase/firestore'
import { getFirestore } from "firebase/firestore";
import { db } from '@/utiil/firebase'

export default function Chat(){
    const getLink = "http://localhost:8080/getAllMessageIDFromAccounts"
    const addLink = "http://localhost:8080/addMessageID"
    const checkLink = "http://localhost:8080/checkMessageIDFromAccount"
    
    const router = useRouter()
    const { id } = router.query
    const [accountID, setAccountID] = useState()
    const [chats, setChats] = useState([])
    const [isLoading, setIsLoading] = useState(true)
    const [chatId, setChatId] = useState("");
    const [message, setMessage] = useState('')
    const firestore = db;

    const makeNewChat = async() => {
        
        if (message.trim() === "") {
            return;
        }
        
        try {
        const docRef = await addDoc(collection(firestore, `chats/${chatId}/messages`), {
            text: message,
            senderId: accountID,
            timestamp: new Date(),
        });
    
        console.log("Message sent with ID: ", docRef.id);
        setMessage("");
        } catch (e) {
        console.error("Error adding message: ", e);
        }
    };
            
    

    useEffect(() => {
        const getCurName = async () => {
            var name = await getUserID()
            setAccountID(name)
        }
        getCurName()
    }, [])

    useEffect(() => {
        if(accountID != "" && id!="" && id != undefined && accountID != undefined){
            console.log(accountID)
            console.log(id)
            axios.get(checkLink,{
                params:{
                    sender: accountID,
                    receiver: id
                }
            }).then(function (response) {
                console.log(response.data)
                if(response.data == "not found"){
                    // setChatId(;
                    let idChat = uuidv4()
                    console.log(idChat)
                    setChatId(idChat)
                    axios.get(addLink,{
                        params:{
                            sender: accountID,
                            receiver: id,
                            UUID: idChat
                        }
                    }).then(function (response) {
                        if(response.data != "error"){
                            console.log(response.data)
                        }else{
                            console.log(response.data)
                        }
                    })
                    .catch(function (error) {
                        console.log(error);
                    })
                    .then(function () {
                        // always executed
                    }); 
                }else{
                    setChatId(response.data.UUID);
                }
            })
            .catch(function (error) {
                console.log(error);
            })
            .then(function () {
                // always executed
            }); 

            axios.get(getLink,{
                params:{
                    sender: accountID,
                    receiver: id
                }
            }).then(function (response) {
                if(response.data != "error"){
                    console.log(response.data)
                    setChats(response.data)
                    setIsLoading(false)
                }else{
                    console.log(response.data)
                }
            })
            .catch(function (error) {
                console.log(error);
            })
            .then(function () {
                // always executed
            }); 
        }
    },[id, accountID])

    return (
        <div className={style["chat-container"]}>
            {/* pilihan mau chat ama siapa */}
            <div>
                {
                    !isLoading ?
                    chats.map((chat:any)=>{
                        return(
                            <div key={chat.UUID}>
                                <button key={chat.UUID}>{chat.UUID}</button>
                            </div>
                        )
                    }): null
                }
            </div>
            {/* chat nya */}
            <div>
                a
            </div>
        </div>
    )
}