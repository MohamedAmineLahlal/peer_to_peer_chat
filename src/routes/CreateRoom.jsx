import React, { useState } from "react";
import { v1 as uuid } from "uuid";
import { useNavigate } from "react-router-dom";
import Logo from "../assets/LandingPage/Logo.png";
import Form from "../components/LandingPage/Form";
import { sha256 } from "js-sha256";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, Terminal } from "lucide-react";
import "../styles/LandingPage/CreateRoom.css";
import "../styles/LandingPage/LandingPage.css";

const CreateRoom = () => {
  const navigate = useNavigate();
  const [roomName, setRoomName] = useState("");
  const [roomPasskey, setRoomPasskey] = useState("");
  const [error, setError] = useState({});
  const create = () => {
    if (!roomPasskey) {
      setError({
        description: "Please Provide a valid PassKey",
        title: "Room PassKey Error",
      });
      return;
    }
    if (!roomName) {
      const id = uuid();
      //Add the id to the server here ...
      navigate(`/room/${id}`);
    } else {
      const id = sha256(roomName);
      //Add the id to the server here ...
      navigate(`/room/${id}`);
    }
  };

  return (
    <div className="container--landing-page">
      <div className="image-container--landing-page">
        <img src={Logo} alt="Logo" />
      </div>
      <div className="background--landing-page">
        {!(Object.keys(error).length === 0) && (
          <Alert className="error-alert--landing-page">
            <Terminal className="h-4 w-4 error-icon--landing-page" />
            <AlertTitle className="error-title--landing-page">
              {error.title}
            </AlertTitle>
            <AlertDescription className="error-description--landing-page">
              {error.description}
            </AlertDescription>
          </Alert>
        )}

        <div className="form-container--landing-page">
          <Form
            onClick={create}
            onRoomNameChange={(value) => setRoomName(value)}
            onRoomPasskeyChange={(value) => setRoomPasskey(value)}
            name={roomName}
            passKey={roomPasskey}
          />
        </div>
        {error && <div className="error"></div>}
      </div>
    </div>
  );
};

export default CreateRoom;
