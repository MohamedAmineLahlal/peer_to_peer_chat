import React from "react";
import Chat from "./ChatContent/Chat";
import Input from "./ChatContent/Input";
import SendBtn from "./ChatContent/SendBtn";
import "../../../styles/ChatRoom/ChatWrapper.css";

export default function ChatWrapper(props) {
  return (
    <div className="chat-wrapper--chat-room relative">
      <Chat messages={props.messages} />
      <div className="input-container--chat-room ">
        <Input
          value={props.value}
          onChange={props.onChange}
          onClick={props.onClick}
        />
      </div>
    </div>
  );
}
