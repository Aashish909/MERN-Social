import React from "react";
import { UserData } from "../../context/userContext";
import { BsSendCheck, BsCheck2All } from "react-icons/bs";

const Chat = ({ chat, setSelectedChat, isOnline }) => {
  const { user: loggedInUser } = UserData();
  let user;
  if (chat) user = chat.users[0];

  return (
    <div>
      {user && (
        <div
          onClick={() => setSelectedChat(chat)}
          className="flex items-center justify-between gap-2 p-3 rounded-md cursor-pointer hover:bg-gray-100 transition w-full"
        >
          <div className="flex items-center gap-3 w-full">
            {isOnline && (
              <div className="text-green-500 text-3xl sm:text-4xl leading-none">
                •
              </div>
            )}
            <img
              src={user.profilePic.url}
              alt="user"
              className="w-10 h-10 rounded-full object-cover"
            />
            <div className="flex flex-col min-w-0">
              <span className="font-medium text-gray-800 text-sm sm:text-base">
                {user.name}
              </span>
              <div className="text-sm text-gray-500 flex items-center gap-1 truncate max-w-[10rem] sm:max-w-[12rem] md:max-w-[14rem] lg:max-w-[16rem]">
                {loggedInUser._id === chat.latestMessage?.sender && (
                  <BsCheck2All className="text-blue-500 flex-shrink-0 size-5" />
                )}
                <span className="truncate">
                  {chat.latestMessage?.text
                    ? chat.latestMessage.text.length > 26
                      ? chat.latestMessage.text.slice(0, 26) + "..."
                      : chat.latestMessage.text
                    : "No messages yet"}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Chat;
