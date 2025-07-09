import React, { useState, useRef, useEffect } from "react";
import { ChatData } from "../../context/chatContext";
import { UserData } from "../../context/userContext";
import axios from "axios";
import toast from "react-hot-toast";
import { BsSend } from "react-icons/bs";
import { FaStar, FaMagic, FaRedo, FaCommentDots, FaGlobe } from "react-icons/fa";
import AIPopover from "../AIPopover";

const MessageInput = ({ setMessages, selectedChat, disabled }) => {
  const [textMessage, setTextMessage] = useState("");
  const { setChats } = ChatData();
  const { isAuth } = UserData();

  // AI Popover state
  const [aiPopoverOpen, setAiPopoverOpen] = useState(false);
  const aiPopoverRef = useRef(null);
  const inputRef = useRef(null);
  // Add sparkle button ref for chat input
  const aiButtonRef = useRef(null);

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
    <div className="w-full p-2 border-t bg-white dark:bg-gray-900 sticky bottom-0 left-0 right-0 z-30" style={{paddingBottom: 'env(safe-area-inset-bottom, 0px)'}}>
      <form onSubmit={handleMessage} className="flex items-center gap-2 relative">
        <div className="relative flex-1 min-h-[48px]">
          <input
            ref={inputRef}
            type="text"
            placeholder={disabled ? "Select a chat to start messaging" : "Type a message"}
            value={textMessage}
            onChange={(e) => setTextMessage(e.target.value)}
            className="w-full max-w-full p-2 rounded-lg border border-gray-300 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 pl-12"
            required={!disabled}
            style={{WebkitAppearance: 'none'}}
            disabled={disabled}
          />
          {isAuth && (
            <AIPopover
              inputValue={textMessage}
              setInputValue={setTextMessage}
              inputRef={inputRef}
              className="absolute left-3 top-1/2 -translate-y-1/2 z-50"
              position="top"
            />
          )}
        </div>
        <button
          type="submit"
          className={`p-2 rounded-full transition-colors duration-300 ${disabled ? 'bg-gray-300 text-gray-400 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-600 text-white'}`}
          disabled={disabled}
        >
          <BsSend className="text-xl" />
        </button>
        {/* AI Popover */}
        {aiPopoverOpen && (
          <AIPopover
            inputValue={textMessage}
            setInputValue={setTextMessage}
            anchorRef={aiButtonRef}
            inputRef={inputRef}
          />
        )}
      </form>
    </div>
  );
};

export default MessageInput;
