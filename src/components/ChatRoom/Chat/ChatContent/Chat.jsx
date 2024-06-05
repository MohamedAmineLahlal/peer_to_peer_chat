import React from "react";
import Message from "./Message";
import "../../../../styles/ChatRoom/Chat.css";

export default function Chat(props) {
  return (
    <div className="messages-container--chat max-h-[560px] overflow-y-auto scrollbar-custom">
      {props.messages.map((message, index) => (
        <Message
          key={index}
          isSender={message.isSender}
          message={message.data}
          time="3:51pm"
        />
      ))}
    </div>
  );
}
