// const http = require('http');
// const app = require('./app');
// const  { Server } = require('socket.io');
// const dbconnect = require('./config/db');
// const socketHandlers = require('./utils/socketHandlers');
// const jwt = require('jsonwebtoken')

// require('dotenv').config();
// dbconnect();

// const server = http.createServer(app);
// // const io = new Server(server, {
// //   cors: {
// //     origin: "*",
// //   },
// // });
// const io = new Server(server, {
//   cors: {
//     origin: ["https://chatleaf-messagingapp.netlify.app","http://localhost:3000"],
//     methods: ["GET", "POST"],
//     credentials: true,
//   },
// });

// io.use((socket,next)=>{
//   const token = socket.handshake.query.token;
//   if(!token) return next (new Error("Auth Error"));
//   jwt.verify(token, process.env.JWT_SECRET, (error, decoded)=>{
//     if(error) return next(new Error("Invalid token"));
//     socket.userId = decoded.id;
//     next()
//   })
// })
// socketHandlers(io);
// const PORT = process.env.PORT || 5000;
// server.listen(PORT, () => {
//   console.log(`Server is running on port ${PORT}`);
  
// });

const http = require("http");
const app = require("./app");
const { Server } = require("socket.io");
const dbconnect = require("./config/db");
const socketHandlers = require("./utils/socketHandlers");
const jwt = require("jsonwebtoken");

require("dotenv").config();

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    // Connect to MongoDB first
    await dbconnect();

    const server = http.createServer(app);

    const io = new Server(server, {
      cors: {
        origin: [
          "https://chatleaf-messagingapp.netlify.app",
          "http://localhost:3000",
        ],
        methods: ["GET", "POST"],
        credentials: true,
      },
    });

    io.use((socket, next) => {
      const token = socket.handshake.query.token;

      if (!token) {
        return next(new Error("Auth Error"));
      }

      jwt.verify(token, process.env.JWT_SECRET, (error, decoded) => {
        if (error) {
          return next(new Error("Invalid token"));
        }

        socket.userId = decoded.id;
        next();
      });
    });

    socketHandlers(io);

    server.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Server startup failed:", error.message);
    process.exit(1);
  }
};

startServer();