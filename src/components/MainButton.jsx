import React from "react";
import "../styles/Button.css";

export default function MainButton(props) {
  return <button className="main-button">{props.description}</button>;
}
