import { Types } from 'mongoose';
import friendService from './friend.services';
import messageService from './message.service';

class StatService {
  /** Count friends: accepted friend-requests where user is either `from` or `to` */
  public async getFriendsCount(userId: string): Promise<number> {
    const userObjId = new Types.ObjectId(userId);
    return friendService.model.countDocuments({
      status: 'accepted',
      $or: [
        { user: userObjId },
        { target: userObjId }
      ]
    }).exec();
  }

  /** Count pending friend-requests for the user */
  public async getPendingRequestsCount(userId: string): Promise<number> {
    const list = await friendService.getRequestsForUser(userId);
    return list.length;
  }

  /** Count unread “message” notifications for the user */
  public async getUnreadMessagesCount(userId: string): Promise<number> {
    return await messageService.getUnreadMessagesCount(userId);
  }

  /** Aggregate them all */
  public async getStats(userId: string) {
    const [friends, pendingRequests, unreadMessages] = await Promise.all([
      this.getFriendsCount(userId),
      this.getPendingRequestsCount(userId),
      this.getUnreadMessagesCount(userId),
    ]);
    return { friends, pendingRequests, unreadMessages };
  }
}

export default new StatService();
