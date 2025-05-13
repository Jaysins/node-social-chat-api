import mongoose, {Schema } from "mongoose";
import { IUserDocument } from "../interfaces/user.interface";
import { addBaseSchemaConfig } from "../utils/addBaseSchemaConfig";

const UserSchema: Schema = new Schema(
    {
        username: {type: String, required: true, unique: true},
        email: {type: String, required: true, unique: true},
        password: {type: String, required: true},
        profileImage: {type: String},
        location: {type: String},
        bio: {type: String},
        
    },
    {timestamps: true}
)
addBaseSchemaConfig(UserSchema);

UserSchema.index({ username: 'text', email: 'text', bio: 'text', location: 'text' });


const UserModel = mongoose.model<IUserDocument>('User', UserSchema);
export default UserModel;

