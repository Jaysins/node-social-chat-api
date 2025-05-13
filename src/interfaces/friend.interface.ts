import { Document, Types } from 'mongoose';

export type FriendRequestStatus = 'pending' | 'accepted' | 'declined';

export interface IFriendDocument extends Document {
  user: Types.ObjectId;
  target: Types.ObjectId;
  status: FriendRequestStatus;
  createdAt: Date;
  updatedAt: Date;
}
