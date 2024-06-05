import React from "react";
import "../../../../styles/ChatRoom/Message.css";

export default function Message(props) {
  return (
    <div
      className="info-wrapper--chat"
      style={{ alignSelf: props.isSender ? "flex-end" : "flex-start" }}
    >
      <div
        className="message-wrapper--chat"
        style={{
          backgroundColor: props.isSender ? "#9258DC" : "#005899",
        }}
      >
        <div className="message-content--chat">
          <p
            className="message--chat"
            style={{
              backgroundColor: props.isSender ? "#9258DC" : "#005899",
            }}
          >
            {props.message}
          </p>
        </div>
      </div>
      <div className="time-container--chat">
        <span className="message-time--chat">{props.time}</span>
      </div>
    </div>
  );
}
