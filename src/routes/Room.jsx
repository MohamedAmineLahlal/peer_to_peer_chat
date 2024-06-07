import React, { useRef, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import io from "socket.io-client";
import SearchBar from "../components/ChatRoom/SearchBar";
import MainTabs from "../components/ChatRoom/MainTabs";
import MainButton from "../components/ChatRoom/MainButton";
import ChatWrapper from "../components/ChatRoom/Chat/ChatWrapper";
import Header from "../components/ChatRoom/Chat/ChatHeader/Header";
import { Separator } from "@/components/ui/separator";
import generateUsername from "../utils/generateUsername";

const Room = (props) => {
  const peerRef = useRef();
  const sendChannel = useRef();
  const socketRef = useRef();
  const otherUser = useRef();
  const [text, setText] = useState("");
  const [messages, setMessages] = useState([]);
  const username = useRef("");
  const { roomID } = useParams();
  const [peers, setPeers] = useState([]);
  const peersRef = useRef([]);
  const iceCandidateQueue = useRef({});

  useEffect(() => {
    socketRef.current = io.connect("http://localhost:8000");
    username.current = generateUsername();
    localStorage.setItem("username", username.current);

    socketRef.current.emit("join room", roomID);

    socketRef.current.on("all users", handleAllUsers);

    socketRef.current.on("connect_error", handleConnectionError);

    socketRef.current.on("offer", handleOffer);

    socketRef.current.on("answer", handleAnswer);

    socketRef.current.on("ice-candidate", handleNewICECandidateMsg);
  }, [roomID]);

  function handleConnectionError(error) {
    console.error("Connection error:", error);
  }

  const getPeerByUserID = (userID) => {
    const peerObj = peersRef.current.find((peer) => peer.peerID === userID);
    return peerObj ? peerObj.peer : null;
  };

  function handleAllUsers(users) {
    const newPeers = [];
    console.log("USERS RECEIVED : ", users);
    users.forEach((userID) => {
      const peerObj = createPeer(userID);
      console.log("NEW PEER OBJECT : ", peerObj);
      peersRef.current.push({
        peerID: userID,
        peer: peerObj.peer,
        dataChannel: peerObj.dataChannel,
      });
      newPeers.push(peerObj.peer);

      handleNegotiationNeededEvent(userID);
    });

    setPeers((prevPeers) => [...prevPeers, ...newPeers]);
  }

  function createPeer(userID) {
    const peer = new RTCPeerConnection({
      iceServers: [
        {
          urls: [
            "stun:stun.l.google.com:19302",
            "stun:stun1.l.google.com:19302",
            "stun:stun2.l.google.com:19302",
          ],
        },
        {
          urls: "turn:numb.viagenie.ca",
          credential: "muazkh",
          username: "webrtc@live.com",
        },
      ],
    });

    const dataChannel = peer.createDataChannel(`sendChannel_${userID}`);
    dataChannel.onmessage = handleReceiveMessage;
    dataChannel.onopen = () =>
      console.log(`Data channel with ${userID} is open`);
    dataChannel.onclose = () =>
      console.log(`Data channel with ${userID} is closed`);

    peer.onicecandidate = (event) => handleICECandidateEvent(event, userID);
    peer.onnegotiationneeded = () => handleNegotiationNeededEvent(userID);

    return { peer, dataChannel };
  }

  function handleNegotiationNeededEvent(userID) {
    const peer = getPeerByUserID(userID);
    if (!peer) {
      console.error(`Peer with ID ${userID} not found`);
      return;
    }

    peer
      .createOffer()
      .then((offer) => peer.setLocalDescription(offer))
      .then(() => {
        console.log("****NEGOTIATING STARTED****");
        console.log("TARGET : ", userID);
        console.log("CALLER : ", socketRef.current.id);
        console.log("SDP    : ", peer.localDescription);
        const payload = {
          target: userID,
          caller: socketRef.current.id,
          sdp: peer.localDescription,
        };
        socketRef.current.emit("offer", payload);
      })
      .catch((e) => console.log(e));
  }

  function handleOffer(incoming) {
    console.log("INCOMING OFFER FROM : ", incoming.caller);

    const peerObj = createPeer(incoming.caller);
    const peer = peerObj.peer;
    peer.onicecandidate = (event) =>
      handleICECandidateEvent(event, incoming.caller);

    const desc = new RTCSessionDescription(incoming.sdp);
    otherUser.current = incoming.caller;
    peer
      .setRemoteDescription(desc)
      .then(() => {
        console.log("REMOTE DESCRIPTION SET, CREATING ANSWER...");
        return peer.createAnswer();
      })
      .then((answer) => {
        return peer.setLocalDescription(answer);
      })
      .then(() => {
        console.log("****REPLYING ON THE OFFER****");
        console.log("TARGET : ", incoming.caller);
        console.log("CALLER : ", socketRef.current.id);
        console.log("SDP    : ", peer.localDescription);
        const payload = {
          target: incoming.caller,
          caller: socketRef.current.id,
          sdp: peer.localDescription,
        };
        socketRef.current.emit("answer", payload);
      })
      .catch((e) => console.log(e));

    peer.ondatachannel = (event) => {
      peerObj.dataChannel = event.channel;
      peerObj.dataChannel.onmessage = handleReceiveMessage;
      peerObj.dataChannel.onopen = () =>
        console.log(`Data channel with ${incoming.caller} is open`);
      peerObj.dataChannel.onclose = () =>
        console.log(`Data channel with ${incoming.caller} is closed`);

      peersRef.current.push({
        peerID: incoming.caller,
        peer: peer,
        dataChannel: peerObj.dataChannel,
      });

      console.log("CHANNEL CREATED BETWEEN ME AND ", incoming.caller);
    };
  }

  function handleAnswer(message) {
    console.log("ANSWER RECEIVED FROM : ", message.caller);
    const peer = getPeerByUserID(message.caller);
    if (!peer) {
      console.error("Peer not found for", message.caller);
      return;
    }
    const desc = new RTCSessionDescription(message.sdp);
    peer
      .setRemoteDescription(desc)
      .then(() => {
        console.log("Remote description set successfully");

        if (iceCandidateQueue.current[message.caller]) {
          iceCandidateQueue.current[message.caller].forEach((candidate) => {
            peer.addIceCandidate(candidate).catch((error) => {
              console.error("Error adding queued ICE candidate:", error);
            });
          });
          delete iceCandidateQueue.current[message.caller];
        }
      })
      .catch((e) => console.log(e));
  }

  function handleICECandidateEvent(event, userID) {
    if (event.candidate) {
      console.log("****ICE CANDIDATE EVENT****");
      console.log("TARGET : ", userID);
      console.log("CANDIDATE : ", event.candidate);
      console.log("EVENT : ", event);
      const payload = {
        target: userID,
        caller: socketRef.current.id,
        candidate: event.candidate,
      };
      socketRef.current.emit("ice-candidate", payload);

      const peer = getPeerByUserID(userID);
      if (peer) {
        peer.addIceCandidate(event.candidate).catch((e) => console.log(e));
      } else {
        if (!iceCandidateQueue.current[incoming.caller]) {
          iceCandidateQueue.current[incoming.caller] = [];
        }
        iceCandidateQueue.current[incoming.caller].push(event.candidate);
      }
    }
  }

  function handleNewICECandidateMsg(incoming) {
    const candidate = new RTCIceCandidate(incoming.candidate);
    const peer = getPeerByUserID(incoming.caller);
    if (peer && peer.remoteDescription) {
      peer.addIceCandidate(candidate).catch((e) => console.log(e));
    } else {
      if (!iceCandidateQueue.current[incoming.caller]) {
        iceCandidateQueue.current[incoming.caller] = [];
      }
      iceCandidateQueue.current[incoming.caller].push(candidate);
    }
  }

  function handleReceiveMessage(e) {
    const message = JSON.parse(e.data);
    setMessages((messages) => [
      ...messages,
      { isSender: false, data: message.text, username: message.username },
    ]);
  }

  function handleChange(e) {
    setText(e.target.value);
  }

  function sendMessage() {
    const message = {
      text: text,
      username: localStorage.getItem("username"),
    };
    peersRef.current.forEach(({ dataChannel }) => {
      if (dataChannel.readyState === "open") {
        dataChannel.send(JSON.stringify(message));
      } else {
        console.error("Data channel is not open");
      }
    });

    setMessages((messages) => [
      ...messages,
      {
        isSender: true,
        data: text,
        username: localStorage.getItem("username"),
      },
    ]);
    setText("");
  }

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
