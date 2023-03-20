import Footer from '@/components/footer';
import Navbar from '@/components/navbar';
import { getRole, getShopID, getUserID } from '@/utiil/token';
import  Axios  from 'axios';
import React, { useState, useEffect } from 'react';

function Chat(props:any) {
console.log(props.recepient);
console.log(props.sender);


  const [messages, setMessages] = useState([]);
  const [chats, setChat] = useState([]);
  const [socket, setSocket] = useState(null);
  const [text, setText] = useState('');
  const [recepient, setRecepient] = useState(parseInt(props.recepient))
  const [sender, setSender] = useState(parseInt(props.sender))

  useEffect(() => {

    const newSocket = new WebSocket('ws://localhost:8080/ws');
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
    fetchMesage()
  }, [sender, recepient])

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

//   useEffect(() => {
//     console.log(chats);
    
//   })


  const fetchMesage =async () => {
    const response = await Axios.get('http://localhost:8080/getMessage',{
        params:{
            senderID : sender,
            recepientID : parseInt(props.recepient),
        }
    });
    const messages = await response.data;
    setMessages(messages);
    setChat([])
    console.log(messages);
  }

  const sendMessage = async (event) => {
    event.preventDefault();
    const message = {
      recepient,
      text,
      sender,
    };
    socket.send(JSON.stringify(message));

    // Save message to database

    // Fetch updated message list from database
   
    
    setText('');
  };

  return (
    <div>
      <ul>
        {messages ? messages.map((message, index) => (
           <li key={message.ID}>{message.Message}</li>
        )): null
        }
        {chats ? chats.map((message, index) => (
           <li key={index}>{message.text}</li>
        )): null
        }
      </ul>
      <form onSubmit={sendMessage}>
        <input type="text" value={text} onChange={(event) => setText(event.target.value)} />
        <button type="submit">Send</button>
      </form>
    </div>
  );
}

export default function ChatList(){

  const getMessageHeaderLink = "http://localhost:8080/getAllMessagesHeader"
  const getMessageHeaderLinkFromShop = "http://localhost:8080/getAllMessagesHeaderFromShop"
  const getShopIDFromShop = "http://localhost:8080/getShopID"
  const getOrderHeaderForShopLink = "http://localhost:8080/getOrderHeaderForShop"
  const getOrderHeader = "http://localhost:8080/getOrderDetailShop"

  const [messageHeaders, setMessageHedaers] = useState([])
  const [orderHeader, setOrderHeader] = useState([])
  const [shopID, setShopID] = useState('')
  const [accountID, setAccountID] = useState('')
  const [recepient, setRecepient] = useState('')
  const [role, setRole] = useState('')
  const [filterBy, setFilterBy] = useState('Open')

  useEffect(() => {

    const getCurName = async () => {
        var name = await getShopID()
        // console.log("name navbar " + name)
       setShopID(name)
    }
    
    getCurName()      
     
}, [])

  useEffect(() => {
    const getCurName = async () => {
      var name = await getUserID()
      setAccountID(name)
    };

    getCurName();

    const getCurRole = async () => {
      var name = await getRole()
      setRole(name)
    };

    getCurRole();
    

  },[])

  useEffect(() => {
    if(role == "Seller"){
      Axios.get(getShopIDFromShop, {
        params:{
            accountID: accountID
        }
      }).then(function (response) {
        console.log(response.data);
        if(response.data != "error"){
          setAccountID(response.data)
        }
       
      })
      .catch(function (error) {
        //   console.log(error);
      })
      .then(function () {
        // always executed
      }); 
    }
  }, [role])

  useEffect(() => {
    if(accountID != ""){
      if(role == "Customer"){
        Axios.get(getMessageHeaderLink, {
          params:{
              accountID: accountID
          }
        }).then(function (response) {
          console.log(response.data);
          setMessageHedaers(response.data)
        })
        .catch(function (error) {
          //   console.log(error);
        })
        .then(function () {
          // always executed
        });  
      }else if(role == "Seller"){
        Axios.get(getMessageHeaderLinkFromShop, {
          params:{
              accountID: accountID
          }
        }).then(function (response) {
          console.log(response.data);
          setMessageHedaers(response.data)
        })
        .catch(function (error) {
          //   console.log(error);
        })
        .then(function () {
          // always executed
        });  

        Axios.get(getOrderHeader, {
          params:{
              shopID: shopID,
              filterBy: filterBy
          }
        }).then(function (response) {
          console.log(response.data)
          setOrderHeader(response.data)
        //    console.log(response.data)
        })
        .catch(function (error) {
        //   console.log(error);
        })
        .then(function () {
        // always executed
        });  
      }
    }
    
  },[accountID])

  const getAccountIDFromShop = () => {
    Axios.get(getShopIDFromShop, {
      params:{
          accountID: accountID
      }
    }).then(function (response) {
      console.log(response.data);
      
      setAccountID(response.data)
    })
    .catch(function (error) {
      //   console.log(error);
    })
    .then(function () {
      // always executed
    });  
  }

  if(role == "Seller"){
    return(
      <div>
          <Navbar/>
          {
                orderHeader ? 
                orderHeader.map((orderHeaderSingle:any) => {
                    return(
                        <div key={orderHeaderSingle.ID}>
                            <label>{orderHeaderSingle.Account.FirstName + " " + orderHeaderSingle.Account.LastName}</label>
                            <label>{orderHeaderSingle.InvoiceCode}</label>
                            <label>{orderHeaderSingle.Status}</label>                            
                        </div>
                    )
                }): <h3>No Order</h3>
            }
          {
            messageHeaders ? messageHeaders.map((messageHeader:any) => {
              return(
                <h1 onClick={() => setRecepient(messageHeader.AccountID)} key={messageHeader.ID}>{messageHeader.Account.FirstName + " " + messageHeader.Account.LastName}</h1>
              )
            }):null
          }
  
            <Chat key={recepient}  sender={recepient} recepient={accountID}/>
          <Footer/>
      </div>
    )
  }else if(role == "Customer"){
    return(
      <div>
          <Navbar/>
            {
              messageHeaders ? messageHeaders.map((messageHeader:any) => {
                return(
                  <h1 onClick={() => setRecepient(messageHeader.Shop.ID)} key={messageHeader.ID}>{messageHeader.Shop.Name}</h1>
                )
              }):null
            }
  
            <Chat key={recepient}  sender={accountID} recepient={recepient}/>
          <Footer/>
      </div>
    )
  }

  
}