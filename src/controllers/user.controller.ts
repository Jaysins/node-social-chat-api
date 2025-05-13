import { Response } from 'express';
import { BaseController } from '../base/controller';
import { IUserDocument } from '../interfaces/user.interface';
import userService, { UserService } from '../services/user.service';
import { AuthenticatedRequest } from '../interfaces/global.interface';

class UserController extends BaseController<IUserDocument, UserService> {
  constructor(service: UserService) {
    super(service);
  }

  // Endpoint for signing up a new user.
  public signup = this.asyncHandler(async (req: AuthenticatedRequest, res: Response) => {

    console.log('tttt',req.body, typeof req.body)
    const user = await this.service.signup(req.body);

    this.sendSuccess(res, user, 'User signed up successfully', 201);
  });

  // Endpoint for logging in a user.
  public login = this.asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    console.log(req.body)
    const { email, password } = req.body;
    const { token, user } = await this.service.login(email, password);
    this.sendSuccess(res, { token, user }, 'User logged in successfully', 200);
  });

  // Endpoint for fetching the logged-in user's profile.
  public getProfile = this.asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const userObj = this.getUserFromReq(req);
    this.sendSuccess(res, await this.service.getProfile(userObj.id), 'User profile fetched successfully', 200);
  });

  public updateProfile = this.asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const userObj = this.getUserFromReq(req)
    const { bio, location, username } = req.body;

    this.sendSuccess(res, await this.service.updateProfile(userObj.id, bio, location, username),
     'User profile updated successfully', 200);
  })
  public getAllUsers = this.asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const currentUserId = this.getUserFromReq(req).id;
    const searchTerm = req.query.q as string | undefined;
    
    const users = await this.service.getAllUsers(currentUserId, searchTerm);
    this.sendSuccess(res, users, 'Users fetched successfully', 200);
  });

  public getUserById = this.asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const userId = req.params.id;
    const user = await this.service.getUserById(userId);
    this.sendSuccess(res, user, 'User fetched successfully', 200);
  });


}

const userController = new UserController(userService);
export default userController;
