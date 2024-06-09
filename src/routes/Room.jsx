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
import FileReaderInput from "react-file-reader";
import { off } from "process";

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
  const receivedChunksRef = useRef({ chunks: [], totalSize: 0 });
  const [usersState, setUsersState] = useState([]);

  useEffect(() => {
    socketRef.current = io.connect("http://localhost:8000");
    username.current = generateUsername();
    localStorage.setItem("username", username.current);

    socketRef.current.emit("join room", roomID);

    socketRef.current.on("connect", () => {
      console.log("CONNECTED");
      setInterval(() => {
        socketRef.current.emit("heartbeat");
      }, 30000);
    });

    socketRef.current.on("all users", handleAllUsers);

    socketRef.current.on("connect_error", handleConnectionError);

    socketRef.current.on("offer", handleOffer);

    socketRef.current.on("answer", handleAnswer);

    socketRef.current.on("ice-candidate", handleNewICECandidateMsg);

    socketRef.current.on("user state update", handleUserStateUpdate);

    window.addEventListener("beforeunload", (event) => {
      if (socketRef.current) {
        const shouldLeave = confirm("Are you sure you want to leave the chat?");
        if (shouldLeave) {
          socketRef.current.emit("disconnect", {
            userID: socketRef.current.id,
            roomID: roomID,
            isUserOnline: false,
          }); // Send user state change event
        } else {
          event.preventDefault(); // Prevent default behavior (leaving) if user cancels
          event.returnValue = ""; // Chrome requires a string to be returned for legacy reasons
        }
      }
    });
  }, [roomID]);

  function handleUserStateUpdate({ userID, isOnline }) {
    console.log("RECEIVED USER STATE CHANGE : ", isOnline);
    console.log(usersState);
    setUsersState((prevStates) =>
      prevStates.map((user) =>
        user.userID === userID ? { ...user, isOnline: isOnline } : user
      )
    );
  }

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
    users.forEach((userObj) => {
      const peerObj = createPeer(userObj.id);
      console.log("NEW PEER OBJECT : ", userObj);

      peersRef.current.push({
        peerID: userObj.userID,
        peer: peerObj.peer,
        dataChannel: peerObj.dataChannel,
      });
      newPeers.push(peerObj.peer);
      setUsersState((prevStates) => [
        ...prevStates,
        { userID: userObj.userID, isOnline: userObj.isOnline },
      ]);

      handleNegotiationNeededEvent(userObj.userID);
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
    dataChannel.onopen = () => {
      socketRef.current.emit("user online", { userID: userID });
      console.log(`Data channel with ${userID} is open`);
    };
    dataChannel.onclose = () =>
      console.log(`Data channel with ${userID} is closed`);

    console.log("USER ID : ", userID);
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
      peerObj.dataChannel.onopen = () => {
        socketRef.current.emit("user online", { userID: incoming.caller });
        console.log(`Data channel with ${incoming.caller} is open`);
      };
      peerObj.dataChannel.onclose = () =>
        console.log(`Data channel with ${incoming.caller} is closed`);

      setUsersState((prevStates) => [
        ...prevStates,
        { userID: incoming.caller, isOnline: true },
      ]);

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
    if (message.fileBuffer) {
      handleReceiveFileMessage(e);
    } else {
      setMessages((prevMessages) => [
        ...prevMessages,
        {
          isSender: false,
          data: message.text,
          username: message.username,
          messageType: "text-message",
        },
      ]);
    }
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

    setMessages((prevMessages) => [
      ...prevMessages,
      {
        isSender: true,
        data: text,
        username: localStorage.getItem("username"),
        messageType: "text-message",
      },
    ]);
    setText("");
  }

  function handleFileChange(event) {
    const file = event.target.files[0];
    console.log(file);
    const chunkSize = 16384;
    let offset = 0;
    let sentChunks = 0; // Track the number of sent chunks

    const reader = new FileReader();
    reader.onload = (e) => {
      sendChunk(e.target.result);
      offset += chunkSize;
      if (offset < file.size) {
        readSlice(offset);
      }
    };

    const readSlice = (o) => {
      const slice = file.slice(offset, o + chunkSize);
      reader.readAsArrayBuffer(slice);
    };

    function addIfFloat(number) {
      if (number % 1 === 0) {
        return number;
      } else {
        return number + 1;
      }
    }

    const sendChunk = (chunk) => {
      console.log("FILE TYPE SENDING : ", file.type);
      const messageType = file.type.startsWith("image/")
        ? "image-message"
        : "file-message";

      const message = {
        fileName: file.name,
        fileType: file.type,
        fileBuffer: `${btoa(
          String.fromCharCode.apply(null, new Uint8Array(chunk))
        )}`,
        offset: offset,
        username: localStorage.getItem("username"),
        totalSize: file.size,
        chunksNumber: addIfFloat(Math.ceil(file.size / chunkSize)),
        messageType: messageType,
      };
      peersRef.current.forEach(({ dataChannel }) => {
        if (dataChannel.readyState === "open") {
          dataChannel.send(JSON.stringify(message));
          console.log("CHUNK SENT");
        } else {
          console.error("Data Channel is not open");
        }
      });
      sentChunks++;

      if (sentChunks === addIfFloat(Math.ceil(file.size / chunkSize))) {
        const blob = new Blob([file], { type: file.type });
        const blobUrl = URL.createObjectURL(blob);
        if (file.type.startsWith("image/")) {
          setMessages((messages) => [
            ...messages,
            {
              isSender: true,
              username: localStorage.getItem("username"),
              messageType: "image-message",
              data: blobUrl,
              fileName: file.name,
            },
          ]);
        } else {
          setMessages((messages) => [
            ...messages,
            {
              isSender: true,
              username: localStorage.getItem("username"),
              messageType: "file-message",
              data: "",
              fileURL: blobUrl,
              fileName: file.name,
            },
          ]);
        }
      }
    };

    readSlice(0);
  }

  function decodeBase64(base64) {
    const binaryString = atob(base64);
    const len = binaryString.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes;
  }

  function handleReceiveFileMessage(message) {
    console.log(JSON.parse(message.data));
    const {
      fileName,
      fileType,
      fileBuffer,
      offset,
      totalSize,
      chunksNumber,
      username,
      messageType, // Add messageType to distinguish between image and file messages
    } = JSON.parse(message.data);

    console.log(typeof fileBuffer);
    const fileData = decodeBase64(fileBuffer);
    console.log("FILE DATA : ", fileBuffer);
    console.log("CHUNK RECEIVED");
    console.log("USERNAME : ", username);

    receivedChunksRef.current.chunks[offset] = fileData;
    receivedChunksRef.current.totalSize = totalSize;

    console.log("FILE SIZE : ", totalSize);
    console.log(receivedChunksRef.current.chunks);
    console.log(chunksNumber);

    if (Object.keys(receivedChunksRef.current.chunks).length === chunksNumber) {
      receivedChunksRef.current.chunks.sort((a, b) => a.offset - b.offset);
      console.log("RECEIVED CHUNKS : ", receivedChunksRef.current.chunks);
      // If it's a file message, create a file URL and set it as the message data
      const completeFileData = new Blob(receivedChunksRef.current.chunks, {
        type: fileType,
      });
      const fileUrl = URL.createObjectURL(completeFileData);
      if (messageType === "image-message") {
        setMessages((prevMessages) => [
          ...prevMessages,
          {
            isSender: false,
            data: fileUrl,
            username: username,
            messageType: "image-message",
          },
        ]);
      } else if (messageType === "file-message") {
        setMessages((prevMessages) => [
          ...prevMessages,
          {
            isSender: false,
            data: "",
            username: username,
            messageType: "file-message",
            fileURL: fileUrl,
            fileName: fileName,
            isReadyToDownload: true,
          },
        ]);
      }

      // Clear received chunks for the next file
      receivedChunksRef.current.chunks = [];
      receivedChunksRef.current.totalSize = 0;
    }
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
        <MainTabs className="main-tabs--chat-room" users={usersState} />
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
            handleFileChange={handleFileChange}
          />
        </div>
      </div>
    </div>
  );
};

export default Room;
