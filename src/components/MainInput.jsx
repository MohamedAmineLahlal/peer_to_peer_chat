import React from "react";
import "../styles/Input.css";

export default function MainInput(props) {
  return (
    <input
      type="text"
      name={props.inputName}
      placeholder={props.placeholder}
      className="input-text--landing-page"
    />
  );
}
