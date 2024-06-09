import React from "react";
import "../../../../styles/ChatRoom/Message.css";

export default function Message(props) {
  console.log(props.username);
  switch (props.messageType) {
    case "text-message":
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
            <div className="message-username-wrapper--chat">
              <h3
                className="message-username--chat"
                style={{
                  backgroundColor: props.isSender ? "#9258DC" : "#005899",
                }}
              >
                {props.username}
              </h3>
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
          </div>
          <div className="time-container--chat">
            <span className="message-time--chat">{props.time}</span>
          </div>
        </div>
      );
    case "file-message":
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
            <div
              className="message-username-wrapper--chat"
              style={{
                backgroundColor: props.isSender ? "#9258DC" : "#005899",
              }}
            >
              <h3
                className="message-username--chat"
                style={{
                  backgroundColor: props.isSender ? "#9258DC" : "#005899",
                }}
              >
                {props.username}
              </h3>
              <div
                className="message-content--chat"
                style={{
                  backgroundColor: props.isSender ? "#9258DC" : "#005899",
                }}
              >
                <a
                  className="file-link--chat"
                  href={props.message}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    backgroundColor: props.isSender ? "#9258DC" : "#005899",
                  }}
                >
                  <div
                    className="file-wrapper--chat"
                    style={{
                      backgroundColor: props.isSender ? "#9258DC" : "#005899",
                    }}
                  >
                    <p
                      className="file-wrapper-text--chat"
                      style={{
                        backgroundColor: props.isSender ? "#9258DC" : "#005899",
                      }}
                    >
                      {props.fileName}
                    </p>
                    <div
                      className="file-wrapper-icon--chat"
                      style={{
                        backgroundColor: props.isSender ? "#9258DC" : "#005899",
                      }}
                    >
                      <svg
                        width="32"
                        height="32"
                        viewBox="0 0 32 32"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        style={{
                          backgroundColor: props.isSender
                            ? "#9258DC"
                            : "#005899",
                        }}
                      >
                        <path
                          d="M8.38051 20.6696C-0.619495 21.6696 0.380505 10.6696 8.38051 11.6696C5.38051 0.669594 22.3805 0.669594 21.3805 8.66959C31.3805 5.66959 31.3805 21.6696 22.3805 20.6696M10.3805 24.6696L15.3805 28.6696M15.3805 28.6696L20.3805 24.6696M15.3805 28.6696V14.6696"
                          stroke="white"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </div>
                  </div>
                </a>
              </div>
            </div>
          </div>
          <div className="time-container--chat">
            <span className="message-time--chat">{props.time}</span>
          </div>
        </div>
      );
    case "image-message":
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
            <div className="message-username-wrapper--chat">
              <h3
                className="message-username--chat"
                style={{
                  backgroundColor: props.isSender ? "#9258DC" : "#005899",
                }}
              >
                {props.username}
              </h3>
              <div
                className="message-content--chat"
                style={{
                  backgroundColor: props.isSender ? "#9258DC" : "#005899",
                }}
              >
                <img src={props.message} alt="Received" />
              </div>
            </div>
          </div>
          <div className="time-container--chat">
            <span className="message-time--chat">{props.time}</span>
          </div>
        </div>
      );
    default:
      return null;
  }
}
