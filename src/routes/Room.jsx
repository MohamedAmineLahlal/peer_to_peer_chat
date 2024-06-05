import React, { useRef, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import io from "socket.io-client";
import SearchBar from "../components/ChatRoom/SearchBar";
import MainTabs from "../components/ChatRoom/MainTabs";
import MainButton from "../components/ChatRoom/MainButton";
import ChatWrapper from "../components/ChatRoom/Chat/ChatWrapper";
import Header from "../components/ChatRoom/Chat/ChatHeader/Header";
import { Separator } from "@/components/ui/separator";

const Room = (props) => {
  const peerRef = useRef();
  const socketRef = useRef();
  const otherUser = useRef();
  const sendChannel = useRef();
  const [text, setText] = useState("");
  const [messages, setMessages] = useState([]);
  const { roomID } = useParams();

  useEffect(() => {
    socketRef.current = io.connect("http://localhost:8000");

    socketRef.current.emit("join room", roomID);

    socketRef.current.on("connect_error", (error) => {
      console.error("Connection error:", error);
    });

    socketRef.current.on("other user", (userID) => {
      callUser(userID);
      otherUser.current = userID;
    });

    socketRef.current.on("user joined", (userID) => {
      otherUser.current = userID;
    });

    socketRef.current.on("offer", handleOffer);

    socketRef.current.on("answer", handleAnswer);

    socketRef.current.on("ice-candidate", handleNewICECandidateMsg);
  }, [roomID]);

  function callUser(userID) {
    peerRef.current = createPeer(userID);
    sendChannel.current = peerRef.current.createDataChannel("sendChannel");
    sendChannel.current.onmessage = handleReceiveMessage;
  }

  function handleReceiveMessage(e) {
    setMessages((messages) => [...messages, { isSender: false, data: e.data }]);
  }

  function createPeer(userID) {
    const peer = new RTCPeerConnection({
      iceServers: [
        {
          urls: "stun:stun.stunprotocol.org",
        },
        {
          urls: "turn:numb.viagenie.ca",
          credential: "muazkh",
          username: "webrtc@live.com",
        },
      ],
    });

    peer.onicecandidate = handleICECandidateEvent;
    peer.onnegotiationneeded = () => handleNegotiationNeededEvent(userID);

    return peer;
  }

  function handleNegotiationNeededEvent(userID) {
    peerRef.current
      .createOffer()
      .then((offer) => {
        return peerRef.current.setLocalDescription(offer);
      })
      .then(() => {
        const payload = {
          target: userID,
          caller: socketRef.current.id,
          sdp: peerRef.current.localDescription,
        };
        socketRef.current.emit("offer", payload);
      })
      .catch((e) => console.log(e));
  }

  function handleOffer(incoming) {
    peerRef.current = createPeer();
    peerRef.current.ondatachannel = (event) => {
      sendChannel.current = event.channel;
      sendChannel.current.onmessage = handleReceiveMessage;
    };
    const desc = new RTCSessionDescription(incoming.sdp);
    peerRef.current
      .setRemoteDescription(desc)
      .then(() => peerRef.current.createAnswer())
      .then((answer) => peerRef.current.setLocalDescription(answer))
      .then(() => {
        const payload = {
          target: incoming.caller,
          caller: socketRef.current.id,
          sdp: peerRef.current.localDescription,
        };
        socketRef.current.emit("answer", payload);
      });
  }

  function handleAnswer(message) {
    const desc = new RTCSessionDescription(message.sdp);
    peerRef.current.setRemoteDescription(desc).catch((e) => console.log(e));
  }

  function handleICECandidateEvent(e) {
    if (e.candidate) {
      const payload = {
        target: otherUser.current,
        candidate: e.candidate,
      };
      socketRef.current.emit("ice-candidate", payload);
    }
  }

  function handleNewICECandidateMsg(incoming) {
    const candidate = new RTCIceCandidate(incoming);
    peerRef.current.addIceCandidate(candidate).catch((e) => console.log(e));
  }

  function handleChange(e) {
    setText(e.target.value);
  }

  const sendMessage = () => {
    if (sendChannel.current && sendChannel.current.readyState === "open") {
      sendChannel.current.send(text);
      setMessages((messages) => [...messages, { isSender: true, data: text }]);
      setText("");
    } else {
      console.error("Data channel is not open");
    }
  };

  return (
    <div className="chat-container--chat-room flex flex-col sm:flex-row items-center h-100">
      <div className="chats-info--chat-room w-full sm:max-w-[500px]">
        <div className="searchBar-Btn-container--chat-room relative">
          <SearchBar />
          <MainButton
            description="Create Room"
            className="absolute button--chat-room w-100 "
          />
        </div>

        <MainTabs className="main-tabs--chat-room" />
      </div>
      <div className="chat-display--chat-room flex-grow w-full sm:w-7/10">
        <div className="content-wrapper--chat-room flex flex-col">
          <div className="top-level--chat-room">
            <Header />
            <Separator className="separator--chat-room" />
          </div>
          <ChatWrapper
            onClick={sendMessage}
            messages={messages}
            onChange={handleChange}
            value={text}
          />
        </div>
      </div>
    </div>
  );
};

export default Room;
