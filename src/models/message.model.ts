import mongoose, { Model, Schema } from "mongoose";
import { IMessage } from "../interfaces/message.interface";
import { IParticipant } from "../interfaces/chat.interface";
import { addBaseSchemaConfig } from "../utils/addBaseSchemaConfig";

const SenderSchema = new Schema<IParticipant>(
    {
      user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
      username: { type: String, required: true },
    },
    { _id: false }
  );



// Message schema: stores each individual message in a conversation
const MessageSchema: Schema = new Schema<IMessage>(
    {
        sender: { type: SenderSchema, required: true },
        chatId: {  type: Schema.Types.ObjectId, ref: 'Chat', required: true },
        content: { type: String, required: true },
        read: {type: Boolean, required: false, default: false}
    },
    { timestamps: true }
);

addBaseSchemaConfig(MessageSchema);

const MessageModel: Model<IMessage> = mongoose.model<IMessage>('Message', MessageSchema);

export default MessageModel;
