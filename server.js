const http = require('http');
const app = require('./app');
const  { Server } = require('socket.io');
const dbconnect = require('./config/db');
const socketHandlers = require('./utils/socketHandlers');
const jwt = require('jsonwebtoken')

require('dotenv').config();
dbconnect();

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

io.use((socket,next)=>{
  const token = socket.handshake.query.token;
  if(!token) return next (new Error("Auth Error"));
  jwt.verify(token, process.env.JWT_SECRET, (error, decoded)=>{
    if(error) return next(new Error("Invalid token"));
    socket.userId = decoded.id;
    next()
  })
})
socketHandlers(io);
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  
});