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
      if (selectedChat._id === message.chatId) {
        setMessages((prevMessages) => [...prevMessages, message]);
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
    <div className="flex flex-col h-full w-full bg-gradient-to-b from-blue-50 via-white to-white md:rounded-2xl shadow-lg overflow-hidden">
      {selectedChat && (
        <div className="flex flex-col h-full">
          {/* Chat Header */}
          <div className="flex items-center gap-4 px-4 py-3 bg-white/80 border-b border-gray-200 sticky top-0 z-10 shadow-sm backdrop-blur-md">
            <img
              src={selectedChat.users[0].profilePic.url}
              alt="User"
              className="w-10 h-10 rounded-full object-cover border border-gray-200"
            />
            <span className="font-semibold text-gray-900 text-lg">
              {selectedChat.users[0].name}
            </span>
          </div>

          {/* Chat Messages */}
          <div ref={messageContainerRef} className="flex-1 overflow-y-auto px-1 sm:px-4 py-3 bg-transparent space-y-2">
            {loading ? (
              <LoadingAnimation />
            ) : (
              messages?.map((item) => (
                <Message
                  key={
                    item._id ||
                    `${item.sender}-${item.timestamp || Math.random()}`
                  }
                  message={item}
                  ownMessage={item.sender === user._id && true}
                />
              ))
            )}
          </div>
          {/* Input always at the bottom */}
          <div className="sticky bottom-0 z-20 bg-gradient-to-t from-white/90 via-white/80 to-transparent backdrop-blur-md">
            <MessageInput setMessages={setMessages} selectedChat={selectedChat} />
          </div>
        </div>
      )}
    </div>
  );
};

export default MessageContainer;
