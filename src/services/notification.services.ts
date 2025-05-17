import { BaseService } from '../base/service';
import NotificationModel from '../models/notification.model';
import { INotification } from '../interfaces/notification.interface';
import { Types } from 'mongoose';
import { NotFoundError } from '../errors';

class NotificationService extends BaseService<INotification> {
  constructor() {
    super(NotificationModel);
  }

  /** Create a new notification */
  public async createForUser(
    userId: string,
    type: INotification['type'],
    payload: any,
    message: string
  ): Promise<INotification> {
    return this.create({ user: new Types.ObjectId(userId), type, payload, message });
  }

  /** Get all notifications for a user (optionally only unread) */
  public async getForUser(
    userId: string,
    onlyUnread = false
  ): Promise<INotification[]> {
    const filter: any = { user: new Types.ObjectId(userId) };
    if (onlyUnread) filter.read = false;
    return this.model
      .find(filter)
      .sort({ createdAt: -1 })
      .exec();
  }

  /** Mark a notification as read */
  public async markRead(notificationId: string, userId: string): Promise<INotification> {
    const notif = await this.model.findOneAndUpdate(
      { _id: notificationId, user: userId },
      { read: true },
      { new: true }
    ).exec();
    if (!notif) throw new NotFoundError('Notification not found');
    return notif;
  }

  /** Mark all notifications as read for a user */
  public async markAllRead(userId: string): Promise<void> {
    await this.model.updateMany(
      { user: userId, read: false },
      { read: true }
    ).exec();
  }
}
const notificationService = new NotificationService();

export { NotificationService };
export default notificationService;
