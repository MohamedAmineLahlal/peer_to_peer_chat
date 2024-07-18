# P2P Group Chat Application



## Description
This project is a Peer-to-Peer (P2P) group chat application designed to enable real-time communication between multiple users without the need for a central server. Built with React for the frontend and Node.js for the backend, the application leverages WebRTC technology to establish direct peer-to-peer connections. This ensures a more secure, scalable, and efficient chat experience.

### Key Features:
- **Real-time Messaging:** Instant message delivery across all participants in the chat.
- **Decentralized Communication:** Direct peer-to-peer connections eliminate the need for a central server (only for handshake).
- **Group Chats:** Support for multiple chat rooms where users can join, leave, and create groups.
- **Responsive Design:** Optimized for both desktop and mobile devices.

### Technologies Used:
- **Frontend:** React, WebRTC, Socket.IO
- **Backend:** Node.js, Express, WebRTC, Socket.IO
- **Database:** MySql, indexedDB

### Key Features Not Yet Implemented:
- **Message Encryption:** End-to-end encryption for secure communication.
- **User authentification:** User Authentification before joining a room.
- **Join Room:** User can join a room with room id and passkey.
- **User Presence:** Real-time status updates showing which users are online.
- **Chat History:** User can restore it's chat history

## Installation
1. **Clone the repository:**
    ```sh
    https://github.com/m-elhamlaoui/P2P-chatRoom-apt_iccn.git
    ```

2. **Navigate to the project directory:**
    ```sh
    cd P2P-chatRoom-apt_iccn
    ```

3. **Install backend dependencies:**
    ```sh
    cd server
    npm install
    ```

4. **Install frontend dependencies:**
    ```sh
    npm install
    ```

5. **Start the backend server:**
    ```sh
    cd server
    node server.cjs
    ```

6. **Start the frontend server:**
    ```sh
    npm run dev
    ```

## Usage
1. **Open Website:**
    - Open the application in your browser (by default : http://localhost:5173/).

2. **Join/Create a Chat Room:**
    - Click on Create Room (Join room not yet available).

3. **Peer-to-Peer Communication:**
    - Share room link with other users and enjoy chatting.

## Features
- **Real-time Chat:** Instant messaging with all participants in the chat room.
- **Group Chat Rooms:** Create and join multiple chat rooms.
- **User Presence:** See who is online in real-time.

## Project Members
- **BAHYA Ahmed** 
- **ALOUACHE Abdelmoula**
- **OUCHINE Nabyl**
- **LAHLAL Mohamed Amine** 
- **ELMOUMEN Yassine** 
- **ELOUAZZANI Soufian**

## Demo Video:
[![P2P Group Chat Demo](https://img.youtube.com/vi/OcNPE_Z-S-Q/0.jpg)](https://www.youtube.com/watch?v=OcNPE_Z-S-Q)

## Images:
![Chat Application Architecture](images/simple_architecture.jpg)
![Landing Page](images/landing_page.png)
![Chat Page](images/chat.png)
