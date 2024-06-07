import React from "react";
import "../../../../styles/ChatRoom/ChatHeader.css";
import Profile from "./Profile";
import MoreInfo from "./MoreInfo";
import "../../../../styles/ChatRoom/ChatHeader.css";
import { useParams } from "react-router-dom";

export default function Header() {
  const { roomID } = useParams();
  const handleCopyToClipboard = () => {
    navigator.clipboard.writeText(roomID);
  };

  // Display only the first 8 characters of the roomID
  const truncatedRoomID = roomID ? roomID.substring(0, 12) + "..." : "";
  return (
    <div className="header-wrapper--chat-room flex">
      <Profile
        name={truncatedRoomID}
        imgLink="https://via.placeholder.com/150"
        isOnline={true}
        onClick={handleCopyToClipboard}
      />
      <MoreInfo />
    </div>
  );
}
