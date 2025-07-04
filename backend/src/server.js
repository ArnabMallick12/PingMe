import express from 'express';
import dotenv from 'dotenv';  
import cookieParser from 'cookie-parser';
import cors from 'cors';
dotenv.config();
import authRoutes from './routes/auth.route.js';
import messageRoutes from './routes/message.route.js';
import {connectDB} from '../lib/db.js';
import { app,server } from '../lib/socket.js';


app.use(express.json());
app.use(cookieParser());
app.use(cors({
  origin:  'https://ping-me-navy.vercel.app',
  credentials: true, // Allow credentials to be sent
}));


const PORT = process.env.PORT || 3000;


app.use('/api/auth',authRoutes );
app.use('/api/messages', messageRoutes)


server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  connectDB();
}); 