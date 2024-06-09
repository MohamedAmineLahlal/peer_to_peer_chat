import React from "react";
import Message from "./Message";
import "../../../../styles/ChatRoom/Chat.css";

export default function Chat(props) {
  return (
    <div className="messages-container--chat max-h-[560px] overflow-y-auto scrollbar-custom">
      {props.messages.map((message, index) => (
        <Message
          key={index}
          username={message.username}
          isSender={message.isSender}
          message={
            message.messageType === "text-message"
              ? message.data
              : message.messageType === "image-message"
              ? message.data
              : message.fileURL
          }
          fileName={
            message.messageType === "file-message" ? message.fileName : ""
          }
          messageType={message.messageType}
          time="3:51pm"
        />
      ))}
    </div>
  );
}
