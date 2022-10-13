import './App.css';
import io from "socket.io-client"
import { useState } from 'react'
import Chat from './Chat';

const socket = io.connect("https://socket-io-jzq1.onrender.com");

function App() {
  // const navigate = useNavigate()
  const [username, setUsername] = useState("")
  const [room, setRoom] = useState("")
  const [chatAvailable, setChatAvailable] = useState(false)

  const joinRoom = () => {
    if (username !== "" && room !== ""){
      socket.emit("join_room", room)  // connects to the socket and sends the room code
      setChatAvailable(true)
      // navigate("/")
    }
  }

  return (
    <div className="App">
      { !chatAvailable ? (
        <div className='home container-fluid'>
          <div className='title'>
            <h3>Join A Chat</h3>
          </div>
          <div className='input-container row justify-content-around'>
          <input
            className='col-sm-5' 
            type='text' 
            placeholder="John..." 
            onChange={(e) => setUsername(e.target.value)} />
            
          <input 
            className='col-sm-5' 
            type='text' 
            placeholder="Room ID..." 
            onChange={(e) => setRoom(e.target.value)} />
          </div>
    
          <button className='btn btn-secondary btn-lg' onClick={joinRoom}>Join A Room</button>
        </div>
      ) : null}

      {chatAvailable ? (
        <div className='chat-screen'>
          <button className='btn btn-dark button-back' onClick={() => setChatAvailable(false)}>Back</button>
          <Chat socket={socket} username={username} room={room} />
        </div>
      ) : null}
      
    </div>
  );
}

export default App;
