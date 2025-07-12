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

      // Prevent multiple socket connections
      if (socket) {
        socket.disconnect();
      }

      const socket = io(Backend_URL, {
        query: {
          userId: user._id,
        },
        transports: ['websocket', 'polling'],
        timeout: 20000,
      });

      setSocket(socket);

      socket.on("getOnlineUsers", (users) => {
        setOnlineUsers(users);
      });

      socket.on("connect", () => {
        console.log("Socket connected");
      });

      socket.on("disconnect", () => {
        console.log("Socket disconnected");
      });

      return () => {
        if (socket) {
          socket.disconnect();
        }
      };
    }, [user?._id, socket]);


    return <SocketContext.Provider value={{socket, onlineUsers}}>{children}</SocketContext.Provider>;
}

export const SocketData=()=>useContext(SocketContext);
