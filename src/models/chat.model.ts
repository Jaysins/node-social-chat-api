import mongoose, { Schema, Model } from "mongoose";
import { IChat, IParticipant } from "../interfaces/chat.interface";
import { addBaseSchemaConfig } from "../utils/addBaseSchemaConfig";


const ParticipantSchema = new Schema<IParticipant>(
    {
      user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
      username: { type: String, required: true },
    },
    { _id: false }
  );

  
// Chat schema: stores the conversation info
const ChatSchema: Schema = new Schema<IChat>(
    {
        participants: { type: [ParticipantSchema], required: true },
        type: { type: String, default: 'individual' },
        archived: { type: Boolean, default: false },
    },
    { timestamps: true }
);


addBaseSchemaConfig(ChatSchema);

// Export models for use elsewhere in your application
const ChatModel: Model<IChat> = mongoose.model<IChat>('Chat', ChatSchema);

export default ChatModel;
