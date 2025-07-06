import React, { useState, useRef, useEffect } from "react";
import { ChatData } from "../../context/chatContext";
import { UserData } from "../../context/userContext";
import axios from "axios";
import toast from "react-hot-toast";
import { BsSend } from "react-icons/bs";
import { FaStar, FaMagic, FaRedo, FaCommentDots, FaGlobe } from "react-icons/fa";
import AIPopover from "../AIPopover";

const MessageInput = ({ setMessages, selectedChat }) => {
  const [textMessage, setTextMessage] = useState("");
  const { setChats } = ChatData();
  const { isAuth } = UserData();

  // AI Popover state
  const [aiPopoverOpen, setAiPopoverOpen] = useState(false);
  const aiPopoverRef = useRef(null);
  const inputRef = useRef(null);

  // Close popover on outside click
  useEffect(() => {
    function handleClickOutside(event) {
      if (
        aiPopoverRef.current &&
        !aiPopoverRef.current.contains(event.target) &&
        !inputRef.current.contains(event.target)
      ) {
        setAiPopoverOpen(false);
      }
    }
    if (aiPopoverOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [aiPopoverOpen]);

  // Reset AI state when popover closes
  useEffect(() => {
    if (!aiPopoverOpen) {
      setTextMessage("");
    }
  }, [aiPopoverOpen]);

  const handleMessage = async (e) => {
    e.preventDefault();
    if (!textMessage.trim()) {
      return;
    }
    try {
      const { data: apiResponse } = await axios.post("/api/messages", {
        message: textMessage,
        recieverId: selectedChat.users[0]._id,
      });
      setMessages((prevMessages) => [...prevMessages, apiResponse.data]);
      setTextMessage("");
      setChats((prevChats) => {
        const updatedChatList = prevChats.map((chat) => {
          if (chat._id === selectedChat._id) {
            return {
              ...chat,
              latestMessage: {
                text: apiResponse.data.text || apiResponse.data.message,
                sender: apiResponse.data.sender,
              },
            };
          }
          return chat;
        });
        return updatedChatList;
      });
      setAiPopoverOpen(false); // close popover on send
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || "Failed to send message");
    }
  };

  return (
    <div className="w-full p-2 border-t bg-white dark:bg-gray-900 relative">
      <form onSubmit={handleMessage} className="flex items-center gap-2 relative">
        {isAuth && (
          <button
            type="button"
            className={`flex items-center gap-1 px-2 py-1 rounded-full bg-gray-50 hover:bg-blue-100 text-blue-600 font-semibold transition-colors duration-300 shadow-sm border border-gray-200 absolute left-2 top-1/2 -translate-y-1/2 z-20 ${aiPopoverOpen ? "ring-2 ring-blue-400" : ""}`}
            onClick={() => setAiPopoverOpen((v) => !v)}
            title="AI Tools"
            tabIndex={0}
            style={{ left: 8 }}
          >
            <FaStar className="text-base" />
            <span className="text-sm font-medium">AI</span>
          </button>
        )}
        <input
          ref={inputRef}
          type="text"
          placeholder="Type a message"
          value={textMessage}
          onChange={(e) => setTextMessage(e.target.value)}
          className="flex-1 p-2 rounded-lg border border-gray-300 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 pl-16"
          required
        />
        <button
          type="submit"
          className="p-2 rounded-full bg-blue-500 hover:bg-blue-600 text-white transition-colors duration-300"
        >
          <BsSend className="text-xl" />
        </button>
        {/* AI Popover */}
        {aiPopoverOpen && (
          <AIPopover
            inputValue={textMessage}
            setInputValue={setTextMessage}
            inputRef={inputRef}
          />
        )}
      </form>
    </div>
  );
};

export default MessageInput;
