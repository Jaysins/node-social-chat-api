import { Request, Response, NextFunction } from 'express';
import { BaseController } from '../base/controller';
import chatService, { ChatService } from '../services/chat.services';
import { IChat } from '../interfaces/chat.interface';

class ChatController extends BaseController<IChat, ChatService> {
  constructor(service: ChatService) {
    super(service);
  }

  public startChat = this.asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const currentUser = this.getUserFromReq(req);
    const currentUserParticipant = {
      user: currentUser.id,
      username: currentUser.username,
    };

    const chat = await this.service.getOrCreateChat(currentUserParticipant, req.body.participantUserId);
    this.sendSuccess(res, chat, 'Chat started successfully', 201);
  });

  public getAllChats = this.asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const currentUserId = this.getUserFromReq(req).id;
    const chats = await this.service.getChatsForUser(currentUserId);
    this.sendSuccess(res, chats, 'Chats fetched successfully', 200);
  });

  public getChatHistory = this.asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const chatId = req.params.id;
    const chat = await this.service.getChatById(chatId);
    this.sendSuccess(res, chat, 'Chat history fetched successfully', 200);
  });
}


const chatController = new ChatController(chatService);
export default chatController;
