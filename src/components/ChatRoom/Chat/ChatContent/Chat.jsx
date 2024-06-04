import React from "react";
import Message from "./Message";
import "../../../../styles/ChatRoom/Chat.css";

export default function Chat() {
  return (
    <div className="messages-container--chat max-h-[560px] overflow-y-auto scrollbar-custom">
      <Message isSender={false} message="Hey There!" time="3:51pm" />
      <Message isSender={true} message="Hey !" time="3:52pm" />
      <Message isSender={false} message="How are you doing ?" time="3:52pm" />
      <Message isSender={true} message="Fine 7md, u?" time="3:52pm" />
      <Message isSender={false} message="7md, im fine thanks" time="3:53pm" />
      <Message
        isSender={false}
        message="Can you send me your report?"
        time="3:53pm"
      />
      <Message
        isSender={false}
        message="Can you send me your report?"
        time="3:53pm"
      />
      <Message
        isSender={false}
        message="Can you send me your report?"
        time="3:53pm"
      />
      <Message
        isSender={false}
        message="Can you send me your report?"
        time="3:53pm"
      />
      <Message
        isSender={false}
        message="Can you send me your report?"
        time="3:53pm"
      />
      <Message
        isSender={false}
        message="Can you send me your report?"
        time="3:53pm"
      />
      <Message
        isSender={false}
        message="Can you send me your report?"
        time="3:53pm"
      />
    </div>
  );
}
