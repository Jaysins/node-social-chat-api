import { Document, Types } from 'mongoose';

export type NotificationType =
  | 'friend_request'
  | 'friend_request_accepted'
  | 'message'
  | 'custom';

export interface INotification extends Document {
  user: Types.ObjectId;         // who receives the notification
  type: NotificationType;
  payload: any;                 // e.g. { from: ObjectId, chatId?: ObjectId, ... }
  read: boolean;
  message: string;
  createdAt: Date;
  updatedAt: Date;
}
