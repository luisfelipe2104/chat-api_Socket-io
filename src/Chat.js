import React, { useEffect, useState } from 'react'
import ScrollToBottom from "react-scroll-to-bottom";

function Chat({socket, username, room}) {
  const [message, setMessage] = useState("")
  const [messageList, setMessageList] = useState([])
  let counter = 1

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

      // in the send_message it will emit the message that you sent to the receivers
      await socket.emit("send_message", messageData) // connects to the socket and sends data to it
      setMessageList((list) => [...list, messageData])
      setMessage("")
    }
  }

  useEffect(() => {

    socket.on("receive_message", (data) => {
      if (counter === 1){
        setMessageList((list) => [...list, data])
        counter++
      }
      else if(counter == 2){
        counter--
      }
    })
  }, [socket]) // it wll be called whenever there is a change in the socket server 

  return (
    <div className='chat-container'>
      {/* <div className='chat-header'>
        <p>Live Chat</p>
      </div> */}

      <div className='chat-body'>
      <ScrollToBottom className="message-container">
          {messageList.map((messageContent) => {
            return (
              <div className='contain' id={username === messageContent.author ? "you" : "other"}>
                
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