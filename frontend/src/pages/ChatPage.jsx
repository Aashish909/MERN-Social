import React, { useEffect, useState } from "react";
import { ChatData } from "../context/chatContext.jsx";
import axios from "axios";
import Chat from "../components/chat/Chat.jsx";
import MessageContainer from "../components/chat/MessageContainer.jsx";
import { SocketData } from "../context/socketContext.jsx";

const ChatPage = ({ user }) => {
  const {
    user: loggedInUser,
    chats,
    setChats,
    selectedChat,
    setSelectedChat,
    createChat,
  } = ChatData();

  const [users, setUsers] = useState([]);
  const [query, setQuery] = useState("");
  const [search, setSearch] = useState(false);

  const fetchAllUsers = async () => {
    try {
      const { data } = await axios.get("/api/user/all?search=" + query);
      setUsers(data.users);
    } catch (error) {
      console.log(error);
    }
  };

  const getAllChats = async () => {
    try {
      const { data } = await axios.get("/api/chats");
      setChats(data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchAllUsers();
  }, [query]);

  useEffect(() => {
    getAllChats();
  }, []);

  async function createNewChat(id) {
    await createChat(id);
    setSearch(false);
    getAllChats();
  }

  //chat
  const { onlineUsers, socket } = SocketData();

  return (
    <div className="flex flex-col md:flex-row h-screen md:h-[90vh] mt-0 md:mt-4 rounded-none md:rounded-lg border-0 md:border border-gray-200 shadow-none md:shadow-md overflow-hidden bg-gray-100">
      {/* Sidebar */}
      <div
        className={`w-full md:w-1/3 lg:w-1/4 border-r border-gray-300 bg-white p-4 space-y-4 ${
          selectedChat ? "hidden md:block" : "block"
        }`}
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-800">Chats</h2>
          <button
            onClick={() => setSearch(!search)}
            className="px-4 py-2 text-sm rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition duration-300 ease-in-out shadow-md"
          >
            {search ? "Close Search" : "New Chat"}
          </button>
        </div>

        {search ? (
          <>
            <input
              type="text"
              placeholder="Search users..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-gray-700"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            <div className="space-y-2 max-h-[calc(100vh-180px)] md:max-h-[calc(90vh-180px)] overflow-y-auto mt-3 pr-2 custom-scrollbar">
              {users && users.length > 0 ? (
                users.map((user) => (
                  <div
                    key={user._id}
                    onClick={() => createNewChat(user._id)}
                    className="flex items-center gap-3 p-3 cursor-pointer hover:bg-blue-50 rounded-lg transition duration-200 ease-in-out"
                  >
                    <div className="relative">
                      <img
                        src={user.profilePic.url}
                        alt={user.name}
                        className="w-10 h-10 rounded-full object-cover border-2 border-gray-200"
                      />
                      {onlineUsers.includes(user._id) && (
                        <span className="absolute bottom-0 right-0 block w-3 h-3 bg-green-500 rounded-full ring-2 ring-white"></span>
                      )}
                    </div>
                    <span className="text-base font-medium text-gray-800">
                      {user.name}
                    </span>
                  </div>
                ))
              ) : (
                <div className="text-center py-4 text-gray-500">
                  No users found
                </div>
              )}
            </div>
          </>
        ) : (
          <div className="space-y-2 max-h-[calc(100vh-120px)] md:max-h-[calc(90vh-120px)] overflow-y-auto pr-2 custom-scrollbar">
            {chats.length > 0 ? (
              chats.map((item) => (
                <Chat
                  key={item._id}
                  chat={item}
                  setSelectedChat={setSelectedChat}
                  isOnline={onlineUsers.includes(item.users[0]._id)}
                />
              ))
            ) : (
              <div className="text-center py-8 text-gray-500">
                No chats yet. Start a new conversation!
              </div>
            )}
          </div>
        )}
      </div>

      {/* Message Container */}
      <div
        className={`flex-1 bg-gray-50 ${
          selectedChat ? "block" : "hidden md:block"
        }`}
      >
        {!selectedChat ? (
          <div className="h-full flex flex-col items-center justify-center text-gray-600 text-lg font-medium p-4 text-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-20 h-20 mb-4 text-gray-400"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M8.625 12a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H8.25m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H12m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H16.5m3.071-5.914a11.75 11.75 0 0 0-7.85-2.186 11.75 11.75 0 0 0-7.85 2.186m15.7 0a11.75 11.75 0 0 1-7.85 2.186 11.75 11.75 0 0 1-7.85-2.186m15.7 0a8.9 8.9 0 0 1 2.227 5.274c.159 1.547-.282 3.023-1.284 4.208-1.002 1.185-2.457 2.016-4.088 2.508M3.155 12.086a8.9 8.9 0 0 0-2.227 5.274c-.159 1.547.282 3.023 1.284 4.208 1.002 1.185 2.457 2.016 4.088 2.508m-.833-2.914a3.75 3.75 0 0 1-3.1-3.553c-.074-.95.176-1.921.688-2.73a.75.75 0 0 1 1.011-.157.75.75 0 0 1 .157 1.011 2.25 2.25 0 0 0-.466 1.476c-.052.492.11 1.016.48 1.393ZM19.645 19.333a3.75 3.75 0 0 1-3.1-3.553c-.074-.95.176-1.921.688-2.73a.75.75 0 0 1 1.011-.157.75.75 0 0 1 .157 1.011 2.25 2.25 0 0 0-.466 1.476c-.052.492.11 1.016.48 1.393Z"
              />
            </svg>
            Hello 👋 {user.name}, select a chat to start conversation.
            <p className="text-sm text-gray-500 mt-2">
              Or click "New Chat" to find users.
            </p>
          </div>
        ) : (
          <MessageContainer selectedChat={selectedChat} setChats={setChats} />
        )}
      </div>
    </div>
  );
};

export default ChatPage;
