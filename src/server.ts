import express from 'express';
import connectDB from './config/db';
import settings from './config/settings';
import authMiddleware from './middlewares/authMiddleware';
import http from 'http';
import { Server } from 'socket.io';
import path from 'path';
import errorHandlerMiddleware from './errors/errorHandler';
import initializeChatSocket from './sockets/chat.socket';
import cors, { CorsOptions } from 'cors';

import authRoutes from './routes/auth.route';
import userRoutes from './routes/user.route';
import chatRoutes from './routes/chat.route';
import friendRoutes from './routes/friend.route';
import notificationRoutes from './routes/notification.routes';
import statRoutes from './routes/stat.routes';


connectDB();

const app = express();
const server = http.createServer(app);

// Define CORS options
const corsOptions: CorsOptions = {
  origin: 'http://localhost:3001', // Adjust this in production for security
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true, // Enable this if you need to pass cookies or headers
};

// Apply CORS middleware to Express
app.use(cors(corsOptions));

// Optionally, if you need to handle pre-flight requests explicitly, you can add:
app.options('*', cors(corsOptions));

// Attach Socket.IO to the server with CORS configuration
const io = new Server(server, {
  cors: {
    origin: 'http://localhost:3001', // Adjust this in production for security
    methods: ['GET', 'POST'],
    credentials: true,
  },
});

app.use(express.json());
app.use(express.static(path.join(__dirname, '../public')));
app.use(express.urlencoded({ extended: true }));
app.use(authMiddleware(['login', 'signup']));

app.get('/', (req, res) => {
    res.send("Hello World");
});

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/chats', chatRoutes);
app.use('/api/friends', friendRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/stats', statRoutes);
app.use(errorHandlerMiddleware);

initializeChatSocket(io);

server.listen(settings.PORT, () => {
    console.log(`App running on http://127.0.0.1:${settings.PORT}`);
});
