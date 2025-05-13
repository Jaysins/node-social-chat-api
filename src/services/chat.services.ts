// src/services/chat.service.ts
import { BaseService } from '../base/service';
import ChatModel from '../models/chat.model';
import { IChat, IParticipant } from '../interfaces/chat.interface';
import mongoose from 'mongoose';
import userService from './user.service';

class ChatService extends BaseService<IChat> {
    constructor() {
        super(ChatModel); // Pass the Mongoose model for chats
    }

    /**
     * Creates an individual chat between two participants.
     * Both participants are objects containing userId and username.
     */
    public async createChat(
        currentUser: IParticipant, 
        participant: IParticipant
    ): Promise<IChat> {
        const chat = await this.create({
            participants: [currentUser, participant],
            type: 'individual',
            archived: false,
            messages: [], // ensure an empty messages array on creation
        } as any); // Casting as needed depending on your IChat interface
        return chat;
    }

    /**
     * Finds an existing individual chat between the two provided participants,
     * or creates a new one if none exists.
     */
    public async getOrCreateChat(
        currentUser: IParticipant, 
        participantUserId: string
    ): Promise<IChat> {
        // Use aggregation query to match based on nested participant objects.

        const participantUser = await userService.getProfile(
            participantUserId)
        
        const participant = {
            user: participantUserId,
            username: participantUser.username,
          };

        let chat = await this.model.findOne({
            participants: {
                $all: [
                    { $elemMatch: { user: new mongoose.Types.ObjectId(currentUser.user) } },
                    { $elemMatch: { user: new mongoose.Types.ObjectId(participant.user) } }
                ],
                $size: 2
            }
        }).exec();

        if (!chat) {
            return await this.createChat(currentUser, participant);
        }
        return chat;
    }

    /**
     * Retrieves all chats in which the specified user participates.
     */
    public async getChatsForUser(currentUserId: string): Promise<IChat[]> {
        return await this.model.aggregate([
            { 
                $match: { "participants.user": new mongoose.Types.ObjectId(currentUserId) } 
            },
            {
                $lookup: {
                    from: 'messages', // ensure this collection name matches your implementation
                    localField: '_id',
                    foreignField: 'chatId',
                    as: 'lastMessages'
                }
            },
            { 
                $addFields: { lastMessages: { $slice: ['$lastMessages', -5] } } // Limit to last 5 messages
            }
        ]).exec();
    }    
    
    /**
     * Retrieves a specific chat by its ID.
     */
    public async getChatById(chatId: string): Promise<IChat | null> {
        const chat = await this.model.aggregate([
            { 
                $match: { _id: new mongoose.Types.ObjectId(chatId) } 
            },
            {
                $lookup: {
                    from: 'messages', // ensure this matches your actual Message collection name
                    localField: '_id',
                    foreignField: 'chatId',
                    as: 'lastMessages'
                }
            },
            { 
                $addFields: { lastMessages: { $slice: ['$lastMessages', -5] } } // Limit to the last 5 messages
            }
        ]).exec();
    
        return chat.length ? chat[0] : null;
    }
}

const chatService = new ChatService();
export { ChatService };
export default chatService;
