import { Schema, model } from 'mongoose';
import { INotification } from '../interfaces/notification.interface';
import { addBaseSchemaConfig } from '../utils/addBaseSchemaConfig';

const NotificationSchema = new Schema<INotification>(
  {
    user:    { type: Schema.Types.ObjectId, ref: 'User', required: true },
    type:    { type: String, enum: ['friend_request','friend_request_accepted','message','custom'], required: true },
    payload: { type: Schema.Types.Mixed, required: true },
    message: {type: String, required: true},
    read:    { type: Boolean, default: false },
  },
  { timestamps: true }
);

addBaseSchemaConfig(NotificationSchema);


export default model<INotification>('Notification', NotificationSchema);
