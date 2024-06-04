import React from "react";
import "../../../../styles/ChatRoom/Profile.css";

export default function Profile(props) {
  return (
    <div className="container-profile flex">
      <div className="image-container--profile">
        <img src={props.imgLink} alt="profile_image" />
      </div>
      <div className="info-container--profile flex flex-col">
        <h3 className="name--profile">{props.name}</h3>
        <p className="status--profile">
          {props.isOnline ? "Online" : "Offline"}
        </p>
      </div>
    </div>
  );
}
