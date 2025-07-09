import { createContext, useContext, useEffect, useState } from "react";
import { io } from "socket.io-client";
import { UserData } from "./userContext";

const Backend_URL = "https://mern-social-ikgl.onrender.com";

const SocketContext =createContext();


export const SocketContextProvider=({children})=>{
    const [socket, setSocket] = useState(null);
    const [onlineUsers, setOnlineUsers] = useState([]);
    const {user} =UserData();
    // useEffect(()=>{
    //     const socket =io(Backend_URL, {
    //         query: {
    //             userId: user?._id
    //         }
    //     })
    //     setSocket(socket)

    //     socket.on("getOnlineUsers", (users)=>{
    //         setOnlineUsers(users)
    //     })

    //     return ()=> socket && socket.close();
    // }, [user._id])

    useEffect(() => {
      if (!user?._id) return;

      const socket = io(Backend_URL, {
        query: {
          userId: user._id,
        },
      });

      setSocket(socket);

      socket.on("getOnlineUsers", (users) => {
        setOnlineUsers(users);
      });

      // 👇 Add this to listen to incoming messages
      socket.on("newMessage", (message) => {
        console.log("Received new message via socket:", message);
        // Optionally dispatch to global state, context, or update UI directly
      });

      return () => {
        socket.disconnect();
      };
    }, [user?._id]);


    return <SocketContext.Provider value={{socket, onlineUsers}}>{children}</SocketContext.Provider>;
}

export const SocketData=()=>useContext(SocketContext);
