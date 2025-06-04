import { Server } from "socket.io";
import http from "http";
import express from "express";

const app = express();

const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"],
    },
});

const userSocketMap ={}

//user connection
io.on("connection", (socket) => {
    console.log("user connected", socket.id);
    // socket.on("disconnect", () => {
    //     console.log("user disconnected");
    // });
    const userId = socket.handshake.query.userId;
    
    if(userId !== "undefined"){
        userSocketMap[userId] = socket.id;
    }
    io.emit("getOnlineUsers", Object.keys(userSocketMap));

    socket.on("disconnect",()=>{
        console.log("user disconnected", socket.id);
        delete userSocketMap[userId];
        io.emit("getOnlineUsers", Object.keys(userSocketMap));
    })
});


//realTime chat 
export const getRecieverSocketId = (recieverId)=>{
    return userSocketMap[recieverId];
}

export { io, server, app };