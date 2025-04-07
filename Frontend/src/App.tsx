import { useEffect, useRef, useState } from 'react'
import './App.css'

function App(){

  const [messages, setMessages] = useState<string[]>([]);
  const roomIdRef = useRef <string | null>(null);
  const RoomIdInputRef = useRef<HTMLInputElement>(null);
  const socketRef = useRef<WebSocket>(null);
  const SendMessageInputRef = useRef<HTMLInputElement | null>(null);
  
  useEffect(() => {
    const Socket = new WebSocket("ws://localhost:8080");
    socketRef.current = Socket;
  
    Socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.type === "chat" && data.message) {
        setMessages((m) => [...m, `Stranger: ${data.message}`]);
      }
    };
  }, []);
  
  return <div>
    <div className="flex min-h-screen items-center justify-start px-10 bg-gradient-to-r from-cyan-600 to-blue-800">
      <div className="w-96 h-[500px] bg-slate-400 rounded-lg">
        <div className="flex justify-center p-10 text-xl font-medium">
          Enter Room Id
        </div>
        <div className="flex justify-center">
          <input ref={RoomIdInputRef} className="p-2 rounded-xl m-2" placeholder="Room Id"></input>
        </div>
        <div className=" flex justify-center">
          <button onClick={() => {
            const createdroomID = RoomIdInputRef.current?.value;
            if (socketRef.current && createdroomID) {
              socketRef.current.send(JSON.stringify({ type: "join", payload: { roomId: createdroomID } }));
              roomIdRef.current = createdroomID;
            }}} className="mt-64 p-2 pl-6 pr-6 rounded-2xl bg-sky-500 hover:bg-sky-700 ...">Join Room
          </button>
          </div>
          </div>
          <div className="ml-34 w-[800px] h-[500px] bg-slate-400 rounded-lg ml-8">
            <div className="overflow-y-auto p-4 space-y-2">
            </div>
        <div>
        <div className="overflow-y-auto p-4 space-y-2 h-[400px]">
          {messages.map((msg) => (
            <div className="bg-white p-2 rounded">{msg}</div>
            ))
          }
        </div>
        </div>
        <div className="gap-4 m-2 flex justify-center mt-[20px]">
          <input ref={SendMessageInputRef} className="p-2 rounded-xl w-[600px]"></input>
          <button onClick={() => {
            const sentMessage = SendMessageInputRef.current?.value;
            if ( SendMessageInputRef.current && socketRef.current?.readyState === WebSocket.OPEN && roomIdRef.current && sentMessage)
              {
                socketRef.current.send( JSON.stringify({ type: "chat", payload: { message: sentMessage }}));setMessages((prev) => [...prev, `You: ${sentMessage}`]);
                SendMessageInputRef.current.value = '';
              }
              }} className=" p-2 pl-8 pr-8 rounded-2xl bg-sky-500 hover:bg-sky-700 ...">Send</button>
        </div>
      </div>
    </div>
  </div>
}

export default App