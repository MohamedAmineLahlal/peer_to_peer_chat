import React from "react";
import SearchBar from "./SearchBar";
import MainTabs from "./MainTabs";
import MainButton from "./MainButton";
import ChatWrapper from "./Chat/ChatWrapper";
import Header from "./Chat/ChatHeader/Header";
import { Separator } from "@/components/ui/separator";

export default function ChatRoom() {
  return (
    <div className="chat-container--chat-room flex flex-col sm:flex-row items-center h-100">
      <div className="chats-info--chat-room w-full sm:max-w-[500px]">
        <div className="searchBar-Btn-container--chat-room relative">
          <SearchBar />
          <MainButton
            description="Create Room"
            className="absolute button--chat-room w-100 "
          />
        </div>

        <MainTabs className="main-tabs--chat-room" />
      </div>
      <div className="chat-display--chat-room flex-grow w-full sm:w-7/10">
        <div className="content-wrapper--chat-room flex flex-col">
          <div className="top-level--chat-room">
            <Header />
            <Separator className="separator--chat-room" />
          </div>
          <ChatWrapper />
        </div>
      </div>
    </div>
  );
}
