import React from "react";

export default function Input(props) {
  return (
    <input
      type="text"
      name={props.inputName}
      placeholder={props.placeholder}
      className="input-text--landing-page"
    />
  );
}
