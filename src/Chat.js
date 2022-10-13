import React, { useEffect, useState } from 'react'
import ScrollToBottom from "react-scroll-to-bottom";
import Axios from "axios"

function Chat({socket, username, room}) {
  const [message, setMessage] = useState("")
  const [messageList, setMessageList] = useState([])

  const retrieveMessages = async () => {
    await Axios.get(`https://chat-models.onrender.com/get-message/${room}`)
    .then(res => setMessageList(res.data))
  }

  const saveMessage = async (messageData) => {
     Axios.post("https://chat-models.onrender.com/insert", messageData)
  }

  const sendMessage = async () => {
    if (message !== "") {
      const messageData = {
        room: room,
        author: username,
        message: message,
        time: 
        new Date(Date.now()).getHours() + 
        ":" + 
        new Date(Date.now()).getMinutes(),
      }
      saveMessage(messageData)

      // in the send_message it will emit the message that you sent to the receivers
      await socket.emit("send_message", messageData) // connects to the socket and sends data to it
      setMessageList((list) => [...list, messageData])
      setMessage("")
      
    }
  }

  useEffect(() => {
      retrieveMessages()
      const getMessage = async () => {
        await socket.on("receive_message", (data) => {
          console.log(data)
          setMessageList((list) => [...list, data])
        }
        )
        await retrieveMessages()
        getMessage()
      
      }
  }) // it wll be called whenever there is a change in the socket server 

  return (
    <div className='chat-container'>
      {/* <div className='chat-header'>
        <p>Live Chat</p>
      </div> */}

      <div className='chat-body'>
      <ScrollToBottom className="message-container">
          {messageList.map((messageContent, key) => {
            return (
              <div className='contain' key={key} id={username === messageContent.author ? "you" : "other"}>
                
              <div
                className="message"
                id={username === messageContent.author ? "you" : "other"}
              >
                <div>
                    <p className='blockquote-footer' id="author">{messageContent.author}</p>
                  <div className="message-content">
                    <p className='msg'>{messageContent.message}</p>
                  </div>
                  <div className="message-meta">
                    <p id="time">{messageContent.time}</p>
                  </div>
                </div>
              </div>
                
              </div>
            );
          })}
        </ScrollToBottom>
      </div>
    
      
      <div className='chat-footer'>
        <input 
          value={message}
          type='text' 
          placeholder="Hey..." 
          onChange={(e) => setMessage(e.target.value)} />

        <button className='send-button btn btn-dark' onClick={sendMessage}>&#9658;</button>
      </div>
    </div>
  )
}

export default Chat