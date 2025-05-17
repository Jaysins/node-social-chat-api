import { BaseService } from '../base/service';
import { BadRequestError, NotFoundError } from '../errors';
import { IFriendDocument } from '../interfaces/friend.interface';
import FriendModel from '../models/friend.model';
import notificationService from './notification.services';


class FriendService extends BaseService<IFriendDocument> {
  constructor() {
    super(FriendModel);
  }

  /** Send a new friend request */
  public async sendRequest(user: string, target: string): Promise<IFriendDocument> {

    if (user === target) {
      throw new BadRequestError("Cannot send request to yourself");
    }
    console.log(user, target)

    const existing = await this.model.findOne({ user, target, status: 'pending' }).exec();
    if (existing) {
      throw new BadRequestError("Friend request already pending");
    }
    const friendRequest = await this.model.create({ user, target });

    const populatedRequest = await this.model
      .findById(friendRequest._id)
      .populate('user', 'username profileImage')
      .exec();
    if (populatedRequest) {
      const sender = populatedRequest.user as any;
      await notificationService.createForUser(
        target,
        'friend_request',
        populatedRequest,
        `${sender.username} sent you a friend request`
      );
    }
    return friendRequest
  }

  /** Get all pending requests addressed *to* the given user */
  public async getRequestsForUser(userId: string): Promise<IFriendDocument[]> {
    return this.model
      .find({ target: userId, status: 'pending' })
      .populate('user', 'username profileImage')  // populate sender’s username
      .exec();
  }

  public async respondRequest(
    requestId: string,
    userId: string,
    accept: boolean
  ): Promise<IFriendDocument> {
    const req = await this.model.findOne({
      $or: [
        { _id: requestId },
        { user: requestId },
      ], target: userId
    }).exec();
    if (!req) {
      throw new NotFoundError('Friend request not found');
    }
    if (req.target.toString() !== userId) {
      throw new BadRequestError('Not authorized to respond to this request');
    }
    req.status = accept ? 'accepted' : 'declined';
    await req.save();
    return req;
  }

public async getFriends(userId: string): Promise<IFriendDocument[]> {
  return this.model.find({
    $or: [
      { user: userId },
      { target: userId }
    ],
    status: 'accepted'
  })
  .populate('user target', 'username email profileImage')
  .exec();
}
}

const friendService = new FriendService();

export { FriendService };
export default friendService;
