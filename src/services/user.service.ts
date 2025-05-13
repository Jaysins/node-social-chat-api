import { BaseService } from '../base/service';
import UserModel from '../models/user.model';
import { IUserDocument } from '../interfaces/user.interface';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import settings from '../config/settings';
import { BadRequestError } from '../errors';
import FriendModel from '../models/friend.model';

class UserService extends BaseService<IUserDocument> {
  constructor() {
    super(UserModel); // Pass the Mongoose model to the base service
  }

  // Signup: Create a new user if one doesn't already exist.
  public async signup(data: Partial<IUserDocument>): Promise<IUserDocument> {
    // Check if the user exists based on email.
    const existingUser = await this.model.findOne({ email: data.email }).exec();
    if (existingUser) {
      throw new BadRequestError('User already exists');
    }

    // Hash the password before saving.
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(data.password as string, saltRounds);
    data.password = hashedPassword;

    // Create and return the new user.
    const newUser = await this.create(data);
    return newUser;
  }

  // Login: Verify credentials and return a JWT.
  public async login(email: string, password: string): Promise<{ token: string, user: IUserDocument }> {
    // Find the user by email.
    const user = await this.model.findOne({ email }).exec();
    if (!user) {
      throw new BadRequestError('Invalid credentials');
    }

    // Compare the provided password with the stored hashed password.
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new BadRequestError('Invalid credentials');
    }

    // Generate a JWT token (ensure process.env.JWT_SECRET is set).
    const token = jwt.sign({ id: user._id, username: user.username, email: user.email }, settings.JWT_SECRET_KEY as string, {
      expiresIn: '1h'
    });
    return {token, user};
  }

  // Get Profile: Retrieve user details by id.
  public async getProfile(id: string): Promise<IUserDocument> {
    const user = await this.getById(id);
    if (!user) {
      throw new BadRequestError('User not found');
    }
    return user;
  }

    // Get Profile: Retrieve user details by id.
    public async updateProfile(id: string, bio?: string, location?: string, username?: string): Promise<IUserDocument> {
      const user = await this.model.findByIdAndUpdate(id, {bio, location, username}, {new: true});
      if (!user) {
        throw new BadRequestError('User not found');
      }
      console.log
      return user;
    }

    public async getAllUsers(currentUserId: string, searchTerm?: string): Promise<Array<
    IUserDocument
  >> {
    const query: any = { _id: { $ne: currentUserId } };
  
    if (searchTerm) {
      const searchRegex = new RegExp(searchTerm, 'i');
      query.$or = [
        { username: { $regex: searchRegex } },
        { email: { $regex: searchRegex } },
        { bio: { $regex: searchRegex } },
        { location: { $regex: searchRegex } }
      ];
    }
  
    const users = await this.model.find(query).lean().exec();
    const friendRelations = await FriendModel.find({
      $or: [
        { user: currentUserId },
        { target: currentUserId }
      ]
    }).exec();
  
    return users.map(user => {
      const relations = friendRelations.filter(rel => 
        rel.user.equals(user._id) || rel.target.equals(user._id)
      );
      console.log(relations)
      const status = relations.reduce((acc, rel) => {
        if (rel.status === 'accepted') return 'accepted';
        if (rel.user.equals(currentUserId)) return 'pending-sent';
        if (rel.target.equals(currentUserId)) return 'pending-received';
        return acc;
      }, 'none' as any);

      const { password, ...safeUser } = user.toObject?.() || user;

      return {
        ...safeUser,
        id: user._id,
        friendStatus: status
      };
    });
  }
  
  public async getUserById(id: string): Promise<IUserDocument> {
    const user = await this.getById(id);
    if (!user) {
      throw new BadRequestError('User not found');
    }
    return user;
  }


}

const userService = new UserService();

export { UserService };
export default userService;
