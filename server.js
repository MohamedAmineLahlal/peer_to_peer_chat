require("dotenv").config();
const express = require("express");
const http = require("http");
const app = express();
const server = http.createServer(app);
const socket = require("socket.io");
const io = socket(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
  },
});

const users = {};

const socketToRoom = {};

io.on("connection", (socket) => {
  console.log("New Connections :", socket.id);
  socket.on("join room", (roomID) => {
    if (users[roomID]) {
      const length = users[roomID].length;

      if (length === 10) {
        socket.emit("room full");
        return;
      }

      users[roomID].push(socket.id);
    } else {
      users[roomID] = [socket.id];
    }

    console.log(">>>>USERS_IN_ROOM : ", users[roomID]);
    socketToRoom[socket.id] = roomID;
    const usersInThisRoom = users[roomID].filter((id) => id !== socket.id);
    console.log("Users in this room (excluding current):", usersInThisRoom);

    socket.emit("all users", usersInThisRoom);
  });

  socket.on("offer", (payload) => {
    try {
      io.to(payload.target).emit("offer", payload);
    } catch (error) {
      console.error("Error in offer event:", error);
    }
  });

  socket.on("answer", (payload) => {
    try {
      io.to(payload.target).emit("answer", payload);
    } catch (error) {
      console.error("Error in answer event:", error);
    }
  });

  socket.on("ice-candidate", (payload) => {
    try {
      io.to(payload.target).emit("ice-candidate", payload);
    } catch (error) {
      console.error("Error in ice-candidate event:", error);
    }
  });

  socket.on("disconnect", () => {
    const roomID = socketToRoom[socket.id];
    let room = users[roomID];
    if (room) {
      room = room.filter((id) => id !== socket.id);
      users[roomID] = room;
    }
  });
});

server.listen(process.env.PORT || 8000, () =>
  console.log("server is running on port 8000")
);
