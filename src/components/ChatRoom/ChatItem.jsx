import React from "react";
import "../../styles/ChatRoom/ChatRoom.css";

export default function ChatItem({ chat }) {
  return (
    <div className="chat-item flex items-center space-x-4 p-2 chats-background--chat-room">
      <img
        src={chat.imageUrl}
        alt={chat.name}
        className="w-10 h-10 rounded-full"
      />
      <div className="flex-1 chats-background--chat-room">
        <div className="flex justify-between items-center chats-background--chat-room">
          <span className="font-semibold chats-background--chat-room">
            {chat.name}
          </span>
          <span className="text-xs text-gray-500 chats-background--chat-room">
            {new Date(chat.timeReceived).toLocaleTimeString()}
          </span>
        </div>
        <div className="flex justify-between items-center chats-background--chat-room">
          <span
            className={`chats-background--chat-room text-sm ${
              chat.isMessageRead ? "text-gray-500" : "font-bold"
            }`}
          >
            {chat.lastMessage}
          </span>
          {chat.unreadMessages > 0 && (
            <span className="bg-green-500 text-black text-xs rounded-full px-2 py-1">
              {chat.unreadMessages}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
