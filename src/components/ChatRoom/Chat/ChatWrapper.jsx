import React from "react";
import Chat from "./ChatContent/Chat";
import Input from "./ChatContent/Input";
import SendBtn from "./ChatContent/SendBtn";
import "../../../styles/ChatRoom/ChatWrapper.css";

export default function ChatWrapper(props) {
  return (
    <div className="chat-wrapper--chat-room">
      <Chat messages={props.messages} />
      <div className="input-container--chat-room">
        <Input onChange={props.onChange} onClick={props.onClick} />
      </div>
    </div>
  );
}
