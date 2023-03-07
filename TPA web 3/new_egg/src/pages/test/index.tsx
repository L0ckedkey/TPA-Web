import { addDoc, collection, getFirestore, onSnapshot, orderBy, query, where } from "firebase/firestore";
import { db } from "../../utiil/firebase";
import React, { useEffect, useState } from "react";

function ChatMessages() {
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    const messagesRef = collection(db, "messages");
    const q = query(messagesRef, orderBy("timestamp"), where("senderId", "==", 1));

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const messages = [];
      querySnapshot.forEach((doc) => {
        messages.push({ id: doc.id, ...doc.data() });
      });
      setMessages(messages);
    });

    return () => unsubscribe();
  }, []);

  return (
    <ul>
      {messages.map((message) => (
        <li key={message.id}>
          {message.senderId}: {message.text}
        </li>
      ))}
    </ul>
  );
}

export default function Chatt() {
  const [message, setMessage] = useState("");
  const db = getFirestore();

  const sendMessage = async () => {
    if (message.trim() === "") {
      return;
    }

    try {
      const docRef = await addDoc(collection(db, "messages"), {
        text: message,
        senderId: 2,
        timestamp: new Date(),
      });

      console.log("Message sent with ID: ", docRef.id);
      setMessage("");
    } catch (e) {
      console.error("Error adding message: ", e);
    }
  };

  const handleChange = (e:any) => {
    setMessage(e.target.value);
  };

  const handleSubmit = (e:any) => {
    e.preventDefault();
    sendMessage();
  };

  return (
    <div>
      <h1>Chat</h1>
      <ChatMessages />
      <form onSubmit={handleSubmit}>
        <input type="text" value={message} onChange={handleChange} />
        <button type="submit">Send</button>
      </form>
    </div>
  );
}
