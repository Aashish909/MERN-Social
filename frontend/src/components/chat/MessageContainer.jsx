import React, { useEffect, useState } from "react";
import { UserData } from "../../context/userContext";
import axios from "axios";
import { LoadingAnimation } from "../Loading";

import Message from "./Message";
import MessageInput from "./MessageInput";
import { SocketData } from "../../context/socketContext";
import { useRef } from "react";

const MessageContainer = ({ selectedChat, setChats, setSelectedChat }) => {
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
      <div className="flex flex-col h-full w-full">
        {/* Chat Header or Welcome */}
        {selectedChat ? (
          <div className="flex items-center gap-4 px-4 py-3 bg-white/80 border-b border-gray-200 sticky top-0 z-10 shadow-sm backdrop-blur-md">
            {/* Mobile Back Button */}
            <button
              className="md:hidden p-2 mr-2 text-blue-600 rounded-full hover:bg-blue-100 focus:outline-none"
              onClick={() => setSelectedChat && setSelectedChat(null)}
              aria-label="Back to chat list"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
              </svg>
            </button>
            <img
              src={selectedChat.users[0].profilePic.url}
              alt="User"
              className="w-10 h-10 rounded-full object-cover border border-gray-200"
            />
            <span className="font-semibold text-gray-900 text-lg">
              {selectedChat.users[0].name}
            </span>
          </div>
        ) : (
          <div className="flex items-center justify-center h-32 text-gray-600 text-lg font-medium p-4 text-center">
            Select a chat to start conversation.
          </div>
        )}

        {/* Chat Messages */}
        <div className="flex-1 overflow-y-auto px-1 sm:px-4 py-3 bg-transparent space-y-2">
          {selectedChat && !loading ? (
            messages?.map((item) => (
              <Message
                key={item._id || `${item.sender}-${item.timestamp || Math.random()}`}
                message={item}
                ownMessage={item.sender === user._id && true}
              />
            ))
          ) : loading ? (
            <LoadingAnimation />
          ) : null}
        </div>

        {/* Input always at the bottom */}
        <div className="w-full p-2 bg-white dark:bg-gray-900" style={{ paddingBottom: '64px' }}>
          <MessageInput setMessages={setMessages} selectedChat={selectedChat} disabled={!selectedChat} />
        </div>
      </div>
    </div>
  );
};

export default MessageContainer;
