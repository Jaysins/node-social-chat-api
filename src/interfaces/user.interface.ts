
import {Document} from 'mongoose';

export interface IUserDocument extends Document {
    id: string;
    _id: string;
    username: string;
    email: string;
    password: string;
    location?: string;
    bio?: string;
    profileImage?: string;
    friendStatus?: string;
    createdAt: Date;
    updatedAt: Date;
}
