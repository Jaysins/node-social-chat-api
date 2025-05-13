import mongoose,{ Schema } from 'mongoose';
import { IFriendDocument } from '../interfaces/friend.interface';
import { addBaseSchemaConfig } from '../utils/addBaseSchemaConfig';



const FriendSchema: Schema = new Schema(
    {
      user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
      target:   { type: Schema.Types.ObjectId, ref: 'User', required: true },
      status: {
        type: String,
        enum: ['pending', 'accepted', 'declined'],
        default: 'pending',
      }          
    },
    {timestamps: true}
)

addBaseSchemaConfig(FriendSchema);

const FriendModel = mongoose.model<IFriendDocument>('Friend', FriendSchema);
export default FriendModel;

