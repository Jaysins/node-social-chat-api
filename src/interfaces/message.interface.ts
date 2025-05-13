import { AuthUser } from "./global.interface";
import { IParticipant } from "./chat.interface";
import { Document, Types } from "mongoose";



// Message interface: sender can be an ObjectId (string) or a populated AuthUser
export interface IMessage extends Document {
    _id: string;
    chatId: string | Types.ObjectId;
    sender: string | AuthUser | IParticipant;
    content: string;
    read: boolean;
    createdAt: Date;
    updatedAt: Date;
}
