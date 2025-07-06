import React from "react";
import moment from "moment";

const Message = ({ message, ownMessage }) => {
  const time = moment(message.createdAt).format("h:mm A");

  return (
    <div
      className={`w-full flex ${ownMessage ? "justify-end" : "justify-start"} my-1 px-2`}
    >
      <div
        className={`max-w-[80%] md:max-w-[60%] px-4 py-2 rounded-2xl shadow-sm transition-all
          ${ownMessage
            ? "bg-blue-500 text-white rounded-br-md rounded-tr-2xl rounded-tl-2xl"
            : "bg-gray-100 text-gray-900 rounded-bl-md rounded-tl-2xl rounded-tr-2xl border border-gray-200"}
        `}
        style={{ wordBreak: "break-word" }}
      >
        <span className="block text-base leading-snug whitespace-pre-line">{message.text}</span>
        <div className={`flex justify-end mt-1 text-xs opacity-60 ${ownMessage ? "text-white" : "text-gray-500"}`}>
          {time}
        </div>
      </div>
    </div>
  );
};

export default Message;
