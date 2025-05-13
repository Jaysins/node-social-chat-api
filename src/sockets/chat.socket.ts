import { Server } from 'socket.io';
import settings from '../config/settings';
import { ChatSocket } from '../interfaces/global.interface';
import { BadRequestError, UnAuthenticatedError } from '../errors';
import jwt, { JwtPayload } from 'jsonwebtoken';
import MessageService from '../services/message.service';


const messageService = new MessageService()

// Export a function that initializes the chat socket logic
export default function initializeChatSocket(io: Server) {
  // Socket.IO middleware for authentication
  io.use((socket: ChatSocket, next) => {
    const token = socket.handshake.auth.token;
    console.log('sockeke', socket.handshake, socket.handshake.auth.token)
    if (!token) {
      return next(new Error('Authentication error'));
    }
    try {
      const decoded: string | JwtPayload = jwt.verify(token, settings.JWT_SECRET_KEY);
      if (!decoded || typeof decoded === 'string') {
        next(new UnAuthenticatedError('Invalid token'));
        return;
      }
      socket.user = {
        id: decoded.id,
        username: decoded.username,
        email: decoded.email,
      };
      next();
    } catch (err) {
      console.log(err)
      next(new Error('Authentication error'));
    }
  });

  // Handle Socket.IO connections
  io.on('connection', (socket: ChatSocket) => {
    console.log('User connected with socket id:', socket.id);

    // Event: Join a specific chat room by chatId
    
    socket.on('conversation:join', (chatId: string) => {
      socket.join(chatId);
      console.log(`Socket ${socket.id} joined chat ${chatId}`);
    });

    // Event: Send a new message
    socket.on('message:send', async (data: { chatId: string, content: string, timestamp: Date, id: string, tempId: string }) => {
      console.log('sending message---->', data)
      const senderId = socket.user?.id;
      const tempId = data.tempId
    
      try {

        if (!data.chatId || !senderId){
          throw new BadRequestError('Invalid request')
        }
        const message = await messageService.addMessage(data.chatId, {
          sender: senderId,
          content: data.content,
          createdAt: data.timestamp
        });

        console.log(message)
        io.to(data.chatId).emit('message:receive', { tempId:tempId, message });
        
      } catch (error: any) {
        console.log(error)
        socket.emit('error', { message: error.message });
      }
    });

    socket.on('message:read', async (data: { chatId: string, userId:string, messageId: string }) => {
      console.log('reading message---->', data)
      const senderId = socket.user?.id;

      try{
        await messageService.update(data.messageId, {read: true});
        // Broadcast the new message to all sockets in the chat room
        console.log('enitted')
        io.to(data.chatId).emit('message:readDone', data);
        
      } catch (error: any) {
        socket.emit('error', { message: error.message });
      }
    });

    socket.on('typing:start', async (data: { chatId: string, userId:string, username: string, isTyping?: boolean }) => {
      console.log('typing message---->', data)
      const senderId = socket.user?.id;

      try{
        // Broadcast the new message to all sockets in the chat room
        data['isTyping'] = true
        console.log('enitted')

        console.log(data)
        io.to(data.chatId).emit('typing:update', {chatId: data.chatId, userId: data.userId,  username: data.username, isTyping: data.isTyping});
        
      } catch (error: any) {
        socket.emit('error', { message: error.message });
      }
    });


    socket.on('typing:stop', async (data: { chatId: string, userId:string, username: string, isTyping?: boolean }) => {
      console.log('stopped typing---->', data)
      const senderId = socket.user?.id;

      try{
        // Broadcast the new message to all sockets in the chat room
        data['isTyping'] = false
        console.log('enitted')
        io.to(data.chatId).emit('typing:update', {chatId: data.chatId, userId: data.userId,  username: data.username, isTyping: data.isTyping});
        
      } catch (error: any) {
        socket.emit('error', { message: error.message });
      }
    });

    socket.on('reactToMessage', (reactionData) => {
      io.to(reactionData.roomId).emit('messageReaction', reactionData);
    });

    socket.on('disconnect', () => {
      console.log('Socket disconnected:', socket.id);
    });
  });
}
