import React from "react";
import SearchBar from "./SearchBar";
import MainTabs from "./MainTabs";
import MainButton from "./MainButton";
import ChatWrapper from "./Chat/ChatWrapper";
import Discussion from "./Discussion/Discussion";

export default function ChatRoom() {
  return (
    <div className="chat-container--chat-room w-full h-100">
      <div className="chats-info--chat-room h-100">
        <div className="searchBar-Btn-container--chat-room relative">
          <SearchBar />
          <MainButton
            description="Create Room"
            className="absolute button--chat-room w-100 "
          />
        </div>

        <MainTabs className="main-tabs--chat-room" />
      </div>
    </div>
  );
}
