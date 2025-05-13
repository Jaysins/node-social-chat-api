// src/services/message.service.ts
import { BaseService } from '../base/service';
import MessageModel from '../models/message.model';
import { IMessage } from '../interfaces/message.interface';
import userService from './user.service';
import { BadRequestError } from '../errors';

class MessageService extends BaseService<IMessage> {
  constructor() {
    super(MessageModel); // Pass the Mongoose model for messages
  }

  /**
   * Adds a new message to a chat.
   * The chat_id is set to the provided chatId.
   */
  public async addMessage(chatId: string, messageData: Partial<IMessage>): Promise<IMessage> {
    // Ensure that the message has the correct chat_id
    messageData.chatId = chatId;

    const senderId = messageData.sender as string;

    const sender = await userService.getProfile(senderId)
    messageData['sender'] = {
      user: sender.id,
      username: sender.username
    }

    console.log(messageData)
    const message = await this.create(messageData);
    message.sender = messageData['sender']
    console.log('aaal', message)
    return message;
  }

  /**
   * Retrieves all messages for a specific chat, sorted by creation time.
   */
  public async getMessagesForChat(chatId: string): Promise<IMessage[]> {
    return await this.model.find({ chat_id: chatId }).sort({ createdAt: 1 }).exec();
  }
}

export default MessageService;
