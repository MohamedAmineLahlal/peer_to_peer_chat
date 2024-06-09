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
      <div className="flex left-side-container--chat-room">
        <div className="refresh--chat-room">
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M3 4C1.9 4 1 4.9 1 6V18C1 19.1 1.9 20 3 20H13.5C13.228 19.3642 13.0592 18.689 13 18H3V8L11 13L19 8V11C19.1666 10.994 19.3334 10.994 19.5 11C20.0053 11.0015 20.5087 11.0619 21 11.18V6C21 4.9 20.1 4 19 4H3ZM3 6H19L11 11L3 6ZM19 12L16.75 14.25L19 16.5V15C19.663 15 20.2989 15.2634 20.7678 15.7322C21.2366 16.2011 21.5 16.837 21.5 17.5C21.5 17.9 21.41 18.28 21.24 18.62L22.33 19.71C22.75 19.08 23 18.32 23 17.5C23 15.29 21.21 13.5 19 13.5V12ZM15.67 15.29C15.25 15.92 15 16.68 15 17.5C15 19.71 16.79 21.5 19 21.5V23L21.25 20.75L19 18.5V20C18.337 20 17.7011 19.7366 17.2322 19.2678C16.7634 18.7989 16.5 18.163 16.5 17.5C16.5 17.1 16.59 16.72 16.76 16.38L15.67 15.29Z"
              fill="black"
            />
          </svg>
        </div>
        <MoreInfo />
      </div>
    </div>
  );
}
