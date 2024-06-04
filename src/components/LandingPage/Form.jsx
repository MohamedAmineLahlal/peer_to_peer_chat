import React from "react";
import { Link, useLocation } from "react-router-dom";
import MainButton from "../MainButton.jsx";
import MainInput from "../MainInput.jsx";
import "../../styles/LandingPage/Form.css";

export default function Form(props) {
  const location = useLocation();
  const isJoinPage = location.pathname === "/";

  return (
    <div className="form-wrapper--landing-page">
      <h1 className="main-text--landing-page">
        Join or create <br /> a room, it’s safe!
      </h1>
      <div className="form-container--landing-page">
        <div className="input-container--landing-page">
          <MainInput
            inputName={isJoinPage ? "room-id" : "room-name"}
            placeholder={isJoinPage ? "Room Id..." : "Room Name..."}
          />
          <MainInput inputName="room-passkey" placeholder="Room PassKey..." />
          <MainButton description={isJoinPage ? "Join" : "Create"} />
        </div>
        {isJoinPage ? (
          <Link to="/create-room" className="create-room-link--landing-page">
            Create Room
          </Link>
        ) : (
          <Link to="/" className="create-room-link--landing-page">
            Join Room
          </Link>
        )}
      </div>
    </div>
  );
}
