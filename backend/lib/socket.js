import {Server} from 'socket.io';
import http from 'http';
import express from 'express';
import e from 'cors';
// import { emit } from 'process';

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: ['http://localhost:5173'], // Adjust this to your frontend URL
  },
});

const userSocketMap = {} ; 

export function getReceiverSocketId(userId) {
  return userSocketMap[userId];
}

io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);
  const userId = socket.handshake.query.userId;

  if (userId) {
    userSocketMap[userId] = socket.id;
    console.log(`User ${userId} connected with socket ID: ${socket.id}`);
    io.emit("getOnlineUsers", Object.keys(userSocketMap));
  }
//   // Listen for join event to join a specific room
//   socket.on('join', (room) => {
//     socket.join(room);
//     console.log(`User ${socket.id} joined room: ${room}`);
//   });

//   // Listen for message event to handle incoming messages
//   socket.on('message', (data) => {
//     const { room, message } = data;
//     io.to(room).emit('message', message);
//     console.log(`Message sent to room ${room}:`, message);
//   });

  // Handle disconnection
  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
      delete userSocketMap[userId];
      console.log(`User ${userId} disconnected`);
      io.emit("getOnlineUsers", Object.keys(userSocketMap));
  });
}); 

export { io, server,app };