import React from "react";
import Chat from "./ChatContent/Chat";
import Input from "./ChatContent/Input";
import SendBtn from "./ChatContent/SendBtn";
import "../../../styles/ChatRoom/ChatWrapper.css";

export default function ChatWrapper(props) {
  return (
    <div className="chat-wrapper--chat-room relative">
      <Chat
        messages={props.messages}
        messageType={props.messageType}
        fileURL={props.fileURL}
      />
      <div className="input-container--chat-room ">
        <Input
          value={props.value}
          onChange={props.onChange}
          onClick={props.onClick}
          handleFileChange={props.handleFileChange}
        />
      </div>
    </div>
  );
}
