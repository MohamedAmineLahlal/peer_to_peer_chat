import React from "react";
import Button from "./Button.jsx";
import Input from "./Input.jsx";

export default function Form() {
  return (
    <div className="form-wrapper--landing-page">
      <h1 className="main-text--landing-page">
        Join or create <br /> a room, it’s safe !
      </h1>
      <div className="form-container--landing-page">
        <Input inputName="room-id" placeholder="Room ID..." />
        <Button description="Next" />
        <a href="#" className="create-room-link--landing-page">
          Create Room
        </a>
      </div>
    </div>
  );
}
