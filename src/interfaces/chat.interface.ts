import { Document, Types } from "mongoose";


export interface IParticipant {
    user: Types.ObjectId | string;
    username: string;
}


// Chat interface
export interface IChat extends Document {
    participants: IParticipant[]; // will store ObjectId strings
    type: string;
    archived: boolean;
    createdAt: Date;
    updatedAt: Date;
}
