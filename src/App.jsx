import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import LandingPageJoinRoom from "./components/LandingPage/LandingPageJoinRoom.jsx";
import LandingPageCreateRoom from "./routes/CreateRoom.jsx";
import ChatRoom from "./routes/Room.jsx";
import NoPage from "./components/NoPage";

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<LandingPageJoinRoom />} />
          <Route path="/create-room" element={<LandingPageCreateRoom />} />
          <Route path="/chat-room" element={<ChatRoom />} />
          <Route path="/room/:roomID" element={<ChatRoom />} />
          <Route path="*" element={<NoPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
