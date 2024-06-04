import React from "react";
import "../../../../styles/ChatRoom/ChatHeader.css";
import Profile from "./Profile";
import MoreInfo from "./MoreInfo";
import "../../../../styles/ChatRoom/ChatHeader.css";

export default function Header() {
  return (
    <div className="header-wrapper--chat-room flex">
      <Profile
        name="David Carlson"
        imgLink="https://via.placeholder.com/150"
        isOnline={true}
      />
      <MoreInfo />
    </div>
  );
}
