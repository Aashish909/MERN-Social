import React, { useState } from "react";
import { ChatData } from "../../context/chatContext";
import axios from "axios";
import toast from "react-hot-toast";
import { BsSend } from "react-icons/bs";

const MessageInput = ({ setMessages, selectedChat }) => {
  const [textMessage, setTextMessage] = useState("");
  const { setChats } = ChatData();

  const handleMessage = async (e) => {
    e.preventDefault();
    if (!textMessage.trim()) {
      return;
    }

    try {
      const { data: apiResponse } = await axios.post("/api/messages", {
        // Renamed 'data' to 'apiResponse' for clarity
        message: textMessage,
        recieverId: selectedChat.users[0]._id,
      });

      // Crucial Change 1: Pass apiResponse.data (which is the actual message object)
      setMessages((prevMessages) => [...prevMessages, apiResponse.data]);

      setTextMessage("");

      // Crucial Change 2: Use apiResponse.data for updating latestMessage as well
      setChats((prevChats) => {
        const updatedChatList = prevChats.map((chat) => {
          if (chat._id === selectedChat._id) {
            return {
              ...chat,
              latestMessage: {
                text: apiResponse.data.text || apiResponse.data.message, // Use the correct message text property
                sender: apiResponse.data.sender, // Use the correct sender ID
              },
            };
          }
          return chat;
        });
        return updatedChatList;
      });
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || "Failed to send message");
    }
  };

  return (
    <div className="w-full p-2 border-t bg-white dark:bg-gray-900">
      <form onSubmit={handleMessage} className="flex items-center gap-2">
        <input
          type="text"
          placeholder="Type a message"
          value={textMessage}
          onChange={(e) => setTextMessage(e.target.value)}
          className="flex-1 p-2 rounded-lg border border-gray-300 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
        <button
          type="submit"
          className="p-2 rounded-full bg-blue-500 hover:bg-blue-600 text-white transition-colors duration-300"
        >
          <BsSend className="text-xl" />
        </button>
      </form>
    </div>
  );
};

export default MessageInput;
