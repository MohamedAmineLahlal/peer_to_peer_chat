import React from "react";
import { v1 as uuid } from "uuid";
import { useNavigate } from "react-router-dom";
import Logo from "../assets/LandingPage/Logo.png";
import Form from "../components/LandingPage/Form";

const CreateRoom = () => {
  const navigate = useNavigate();

  const create = () => {
    const id = uuid();
    navigate(`/room/${id}`);
  };

  return (
    <div className="container--landing-page">
      <div className="image-container--landing-page">
        <img src={Logo} alt="Logo" />
      </div>
      <div className="background--landing-page">
        <div className="form-container--landing-page">
          <Form onClick={create} />
        </div>
      </div>
    </div>
  );
};

export default CreateRoom;
