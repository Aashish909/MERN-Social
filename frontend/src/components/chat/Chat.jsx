import React from "react";
import { UserData } from "../../context/userContext";
import { BsCheck2All } from "react-icons/bs";

const Chat = ({ chat, setSelectedChat, isOnline }) => {
  const { user: loggedInUser, selectedChat } = UserData();
  let user;
  if (chat) user = chat.users[0];

  // Determine if this chat is the active/selected chat
  const isActive = selectedChat && selectedChat._id === chat._id;

  return (
    <div>
      {user && (
        <div
          onClick={() => setSelectedChat(chat)}
          className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer transition w-full relative
            ${isActive ? "bg-blue-50 shadow-md" : "hover:bg-gray-100"}`}
        >
          <div className="relative">
            <img
              src={user.profilePic.url}
              alt="user"
              className="w-12 h-12 rounded-full object-cover border-2 border-gray-200 shadow-sm"
            />
            {isOnline && (
              <span className="absolute bottom-0 right-0 block w-3 h-3 bg-green-500 rounded-full ring-2 ring-white"></span>
            )}
          </div>
          <div className="flex flex-col min-w-0 flex-1">
            <span className="font-semibold text-gray-900 text-base truncate">
              {user.name}
            </span>
            <div className="text-xs text-gray-500 flex items-center gap-1 truncate max-w-full">
              {loggedInUser._id === chat.latestMessage?.sender && (
                <BsCheck2All className="text-blue-500 flex-shrink-0 size-4" />
              )}
              <span className="truncate">
                {chat.latestMessage?.text
                  ? chat.latestMessage.text.length > 32
                    ? chat.latestMessage.text.slice(0, 32) + "..."
                    : chat.latestMessage.text
                  : "No messages yet"}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Chat;
