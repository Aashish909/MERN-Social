import React from "react";
import moment from "moment";

const Message = ({ message, ownMessage }) => {
  const time = moment(message.createdAt).format("h:mm A");

  return (
    <div
      className={`w-full flex ${
        ownMessage ? "justify-end" : "justify-start"
      } my-2 px-2`}
    >
      <div
        className={`max-w-[80%] px-4 py-2 rounded-lg shadow-md
          ${
            ownMessage
              ? "bg-blue-600 text-white rounded-br-none"
              : "bg-gray-200 text-gray-800 rounded-bl-none"
          }`}
      >
        {/* Message text */}
        <p className="break-words text-sm">{message.text}</p>

        {/* Timestamp */}
        <div className="text-[10px] text-right mt-1 opacity-80">{time}</div>
      </div>
    </div>
  );
};

export default Message;
