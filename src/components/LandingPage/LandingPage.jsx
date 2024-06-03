import React from "react";
import Form from "./Form.jsx";
import Logo from "../../assets/LandingPage/Logo.png";

export default function LandingPage() {
  return (
    <div className="container--landing-page">
      <div className="background--landing-page">
        <div className="form-container--landing-page">
          <Form />
        </div>
      </div>
    </div>
  );
}
