import React from "react";
import "../styles/Input.css";

export default function MainInput(props) {
  return (
    <input
      type="text"
      onChange={(e) => props.onRoomChange(e.target.value)}
      value={props.value}
      name={props.inputName}
      placeholder={props.placeholder}
      className="input-text--landing-page"
    />
  );
}
