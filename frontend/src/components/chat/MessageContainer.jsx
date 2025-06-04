import React, { useEffect, useState } from "react";
import { UserData } from "../../context/userContext";
import axios from "axios";
import { LoadingAnimation } from "../Loading";

import Message from "./Message";
import MessageInput from "./MessageInput";
import { SocketData } from "../../context/socketContext";
import { useRef } from "react";

const MessageContainer = ({ selectedChat, setChats }) => {
  const [messages, setMessages] = useState([]);
  const { user } = UserData();
  const [loading, setLoading] = useState(false);
  const{socket} =SocketData();

  useEffect(()=>{
    socket.on('newMessage', (message)=>{
      console.log(
        "Socket received new message (in MessageContainer):",
        message
      );
      if (selectedChat._id === message.chatId) {
        console.log("Adding message from socket to state.");
        setMessages((prevMessages) => [...prevMessages, message]);
      } else {
        console.log(
          "Socket message not for current chat:",
          message.chatId,
          "Current chat:",
          selectedChat._id
        );
      }
       setChats((prev) => {
         const updatedChat = prev.map((chat) => {
           if (chat._id === message.chatId) {
             return {
               ...chat,
               latestMessage: {
                 text: message.text,
                 sender: message.sender,
               },
             };
           }
           return chat;
         });
         return updatedChat;
       });
    })

    return ()=>{
      socket.off('newMessage')
    }
  },[socket, selectedChat])

  async function fetchMessages() {
    setLoading(true);
    try {
      const { data } = await axios.get(
        `/api/messages/${selectedChat.users[0]._id}`
      );
      setMessages(data.messages);
      console.log("fetch messages:",data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (selectedChat) fetchMessages();
  }, [selectedChat]);

  const messageContainerRef =useRef(null)

  useEffect(()=>{
    if(messageContainerRef.current){
      messageContainerRef.current.scrollTop = messageContainerRef.current.scrollHeight
    }
  },[messages])

  return (
    <div className="flex flex-col h-full border-l border-gray-200 w-full">
      {selectedChat && (
        <div className="flex flex-col h-full">
          {/* Chat Header */}
          <div className="flex items-center gap-4 px-4 py-3 bg-gray-100 border-b border-gray-300">
            <img
              src={selectedChat.users[0].profilePic.url}
              alt="User"
              className="w-10 h-10 rounded-full object-cover"
            />
            <span className="font-medium text-gray-800 text-lg">
              {selectedChat.users[0].name}
            </span>
          </div>

          {/* Chat Messages */}
          <div ref={messageContainerRef} className="flex-1 overflow-y-auto px-4 py-3 bg-white space-y-2">
            {loading ? (
              <LoadingAnimation />
            ) : (
              messages?.map((item) => {
                console.log("Rendering message item:", item);
                return (
                  <Message
                    key={
                      item._id ||
                      `${item.sender}-${item.timestamp || Math.random()}`
                    }
                    message={item}
                    ownMessage={item.sender === user._id && true}
                  />
                );
              })
            )}
          </div>
          <MessageInput setMessages={setMessages} selectedChat={selectedChat} />
        </div>
      )}
    </div>
  );
};

export default MessageContainer;
