import Footer from "@/components/footer";
import Navbar from "@/components/navbar";
import { getRole, getUserID } from "@/utiil/token";
import Axios from "axios";
import { parse } from "path";
import { useEffect, useState } from "react";

export default function ChatCustomerService(){
    const addChatHeaderLink = "http://localhost:8080/addMessageHeaderCustomerService"
    const getChatHeaderLink = "http://localhost:8080/getMessageHeaderCustomerService"
    const getChatHeaderCSLink = "http://localhost:8080/getMessageHeaderCustomerServiceCS"
    const addCustomerReviewLink = "http://localhost:8080/addCustomerReview"

    
    const [userID, setUserID] = useState('')
    const [title, setTitle] = useState('')
    const [chatHeaders, setChatHeader] = useState([])
    const [checkID , setCheckID] = useState('')
    const [role, setRole] = useState('')
    const [senderID, setSenderID] = useState('')
    const [status, setStatus] = useState('')
    const [review, setReview] = useState('')
    const [point, setPoint] = useState(0)
    
    useEffect(() => {

        const getCurName = async () => {
            var name = await getUserID()
            setUserID(name)
        }

        const getCurRole = async () => {
            var name = await getRole()
            console.log(name);
            
            setRole(name)
        }
        
        getCurName() 
        getCurRole()     
    }, [])

    useEffect(() => {

        if(userID != "" && role == "Customer"){
            Axios.get(getChatHeaderLink,{
                params:{
                    accountID: userID,
                }
            })
            .then(function (response) {
                console.log(response.data)
                setChatHeader(response.data)
            })
            .catch(function (error) {
                console.log(error);
            })
            .then(function () {
            // always executed
            });  
        }else if(userID != "" && role == "Customer Service"){
            Axios.get(getChatHeaderCSLink)
            .then(function (response) {
                console.log(response.data)
                setChatHeader(response.data)
            })
            .catch(function (error) {
                console.log(error);
            })
            .then(function () {
            // always executed
            });
        }
    }, [userID, role])

    const addChatHeader = () => {
        Axios.get(addChatHeaderLink,{
            params:{
                accountID: userID,
                title: title
            }
        })
        .then(function (response) {
            console.log(response.data)
        })
        .catch(function (error) {
            console.log(error);
        })
        .then(function () {
        // always executed
        });  
    }

    const AddReview = (userID:any, review:any, point:any, chatID:any) => {
        Axios.get(addCustomerReviewLink,{
            params:{
                accountID: userID,
                chatID: chatID,
                review: review,
                point: point
            }
        })
        .then(function (response) {
            console.log(response.data)
        })
        .catch(function (error) {
            console.log(error);
        })
        .then(function () {
        // always executed
        });
    }

    if(role == "Customer"){
        return(
            <div>
                <Navbar/>
                <ShowChatDetail ID={checkID} status={status}/>
                {
                    chatHeaders ? chatHeaders.map((chatHeader:any) => {
                      if(chatHeader.Status == "Ongoing"){
                        return( 
                            <div>
                                <h3>{chatHeader.Title}</h3>
                                <h4>{chatHeader.Status}</h4>
                                <h4>{chatHeader.ID}</h4>
                                <button onClick={() => {setCheckID(chatHeader.ID); setStatus(chatHeader.Status)}}>Check chat</button>
                            </div>
                           )
                      }else{
                        
                        return( 
                            <div>
                                <h3>{chatHeader.Title}</h3>
                                <h4>{chatHeader.Status}</h4>
                                <div>
                                    <input onChange={(e) => setReview(e.target.value)}></input>
                                    <select value={point} onChange={(event) =>setPoint(parseInt(event.target.value))}>
                                        <option value={0}></option>
                                        <option value={1}>1</option>
                                        <option value={2}>2</option>
                                        <option value={3}>3</option>
                                        <option value={4}>4</option>
                                        <option value={5}>5</option>
                                    </select>
                                    <button onClick={() => AddReview(userID, review, point, chatHeader.ID)}>Set Review</button>
                                </div>
                            </div>
                           )
                      }
                    }):<h3>No Chat</h3>
                }
                <input placeholder="Input Tile" onChange={(e) => setTitle(e.target.value)}></input>
                <button onClick={() => addChatHeader()}>Add Chat</button>
                <Footer/>
            </div>
        )
    }else if(role == "Customer Service"){
        return(
            <div>
                <Navbar/>
                <ShowChatDetailCustomerService ID={checkID} senderID={senderID} status={status}/>
                {
                    chatHeaders ? chatHeaders.map((chatHeader:any) => {
                      if(chatHeader.Status == "Ongoing"){
                        return( 
                            <div>
                                <h3>{chatHeader.Title}</h3>
                                <h4>{chatHeader.Status}</h4>
                                {/* <h4>{chatHeader.ID}</h4> */}
                                {/* <h4>{chatHeader.AccountID}</h4> */}
                                <button onClick={() => {setCheckID(chatHeader.ID); setSenderID(chatHeader.AccountID); setStatus(chatHeader.Status)}}>Check chat</button>
                            </div>
                           )
                      }else{
                        return( 
                            <div>
                                <h3>{chatHeader.Title}</h3>
                                <h4>{chatHeader.Status}</h4>
                                <button onClick={() => {setCheckID(chatHeader.ID); setSenderID(chatHeader.AccountID); setStatus(chatHeader.Status)}}>Check chat</button>
                            </div>
                           )
                      }
                    }):<h3>No Chat</h3>
                }
                <input placeholder="Input Tile" onChange={(e) => setTitle(e.target.value)}></input>
                <button onClick={() => addChatHeader()}>Add Chat</button>
                <Footer/>
            </div>
        )
    }


    
}

function ShowChatDetail(props:any){

    var status = props.status
    console.log(status);
    
    var checkID = props.ID
    var chatID = parseInt(props.ID)
    const [chatDetails, setChatDetails] = useState([])
    const getChatDetailLink = "http://localhost:8080/getMessageCustomerService"
    const [chats, setChat] = useState([]);
    const [socket, setSocket] = useState(null);
    const [recepient, setRecepient] = useState(25)
    const [sender, setSender] = useState()
    const [text, setText] = useState('');

    useEffect(() => {

        const getCurName = async () => {
            var name = await getUserID()
            setSender(name)
        }
        
        getCurName()      
    }, [])
    
    useEffect(() => {

        const newSocket = new WebSocket('ws://localhost:8080/ws2');
        newSocket.onopen = () => {
            console.log('WebSocket connected');
            setSocket(newSocket);
        };
        newSocket.onmessage = (event) => {
            const message = JSON.parse(event.data);
            console.log(message);
            
            setChat((prevMessages) => [...prevMessages, message]);       
        };
        return () => {
            newSocket.close();
        };
    }, []);
    
    useEffect(() => {
        const handleMessage = (event:any) => {
            const message = JSON.parse(event.data);
        //   setMessages((prevMessages) => [...prevMessages, message]);
            setChat((prevMessages) => [...prevMessages, message]);
        };

        if (socket) {
            socket.onmessage = handleMessage;
        }
    }, [socket]);

    useEffect(() => {

        if(checkID != ""){
            Axios.get(getChatDetailLink,{
                params:{
                    chatID: checkID,
                }
            })
            .then(function (response) {
                // console.log(response.data)
                setChatDetails(response.data)
            })
            .catch(function (error) {
                console.log(error);
            })
            .then(function () {
            // always executed
            });  
        } 
    }, [checkID])

    const sendMessage = async (event) => {
        event.preventDefault();
        const message = {
          recepient,
          text,
          sender,
          chatID
        };
        socket.send(JSON.stringify(message));
    
        // Save message to database
    
        // Fetch updated message list from database
       
        
        setText('');
      };

    return(
        <div>
        {
            checkID ? 
            chatDetails ? chatDetails.map((chatDetail:any, index) => {
                return(<h4 key={index}>{chatDetail.Message}</h4>)
            }):<h4>No Chat Detail</h4>
            : null
        }
         {chats ? chats.map((message, index) => {
           return(<h4 key={index}>{message.text}</h4>)
         }): null
        }
        {
            status != "Resolved" ?
            <form onSubmit={sendMessage}>
            <input type="text" value={text} onChange={(event) => setText(event.target.value)} />
            <button type="submit">Send</button>
            </form> :null
        }
        </div>
    )
}

function ShowChatDetailCustomerService(props:any){

    console.log(props.senderID);
    
    var status = props.status
    console.log(status);
    
    var checkID = props.ID
    var chatID = parseInt(props.ID)
    const [chatDetails, setChatDetails] = useState([])
    const getChatDetailLink = "http://localhost:8080/getMessageCustomerService"
    const changeHeaderStatusLink = "http://localhost:8080/changeHeaderStatus"
    
    const [chats, setChat] = useState([]);
    const [socket, setSocket] = useState(null);
    const [recepient, setRecepient] = useState(25)
    const [sender, setSender] = useState(parseInt(props.senderID))
    const [text, setText] = useState('');
    
    useEffect(() => {

        const newSocket = new WebSocket('ws://localhost:8080/ws2');
        newSocket.onopen = () => {
            console.log('WebSocket connected');
            setSocket(newSocket);
        };
        newSocket.onmessage = (event) => {
            const message = JSON.parse(event.data);
            console.log(message);
            
            setChat((prevMessages) => [...prevMessages, message]);       
        };
        return () => {
            newSocket.close();
        };
    }, []);
    
    useEffect(() => {
        const handleMessage = (event:any) => {
            const message = JSON.parse(event.data);
        //   setMessages((prevMessages) => [...prevMessages, message]);
            setChat((prevMessages) => [...prevMessages, message]);
        };

        if (socket) {
            socket.onmessage = handleMessage;
        }
    }, [socket]);

    useEffect(() => {

        if(checkID != ""){
            Axios.get(getChatDetailLink,{
                params:{
                    chatID: checkID,
                }
            })
            .then(function (response) {
                // console.log(response.data)
                setChatDetails(response.data)
            })
            .catch(function (error) {
                console.log(error);
            })
            .then(function () {
            // always executed
            });  
        } 
    }, [checkID])

    const sendMessage = async (event:any) => {
        event.preventDefault();
        console.log(sender);
        
        const message = {
          recepient,
          text,
          sender,
          chatID
        };
        socket.send(JSON.stringify(message));
    
        // Save message to database
    
        // Fetch updated message list from database
       
        
        setText('');
      };

      const changeHeaderStatus = () => {
        
        Axios.get(changeHeaderStatusLink,{
            params:{
                chatID: checkID,
            }
        })
        .then(function (response) {
            console.log(response.data)
            
        })
        .catch(function (error) {
            console.log(error);
        })
        .then(function () {
        // always executed
        });  
       
      };

    return(
        <div>
            <h3>{checkID}</h3>
        {
            checkID ? 
            chatDetails ? chatDetails.map((chatDetail:any, index) => {
                return(<h4 key={index}>{chatDetail.Message}</h4>)
            }):<h4>No Chat Detail</h4>
            : null
        }
         {chats ? chats.map((message, index) => {
           return(<h4 key={index}>{message.text}</h4>)
         }): null
        }
        {
            status != "Resolved" ? 
            <div>
            <form onSubmit={sendMessage}>
            <input type="text" value={text} onChange={(event) => setText(event.target.value)} />
            <button type="submit">Send</button>
            </form>
            <button type="submit" onClick={() => changeHeaderStatus()}>Resolved</button>
            </div>
        :null
        }
       
        </div>
    )
}