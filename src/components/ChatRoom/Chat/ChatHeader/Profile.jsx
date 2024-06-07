import React from "react";
import "../../../../styles/ChatRoom/Profile.css";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export default function Profile(props) {
  return (
    <div className="container-profile flex">
      <div className="image-container--profile">
        <img src={props.imgLink} alt="profile_image" />
      </div>
      <div className="info-container--profile flex flex-col">
        <TooltipProvider className="tooltip--profile">
          <Tooltip className="tooltip--profile">
            <TooltipTrigger>
              <h3
                className="name--profile"
                style={{ cursor: "pointer" }}
                onClick={props.onClick}
              >
                {props.name}
              </h3>
            </TooltipTrigger>
            <TooltipContent className="tooltip-descsription--profile">
              <p>Click to copy ID</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <p className="status--profile">
          {props.isOnline ? "Online" : "Offline"}
        </p>
      </div>
    </div>
  );
}
