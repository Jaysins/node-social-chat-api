import { Request, Response, NextFunction } from 'express';
import { BaseController } from '../base/controller';
import notificationService, {NotificationService} from '../services/notification.services';
import { INotification } from '../interfaces/notification.interface';

export class NotificationController extends BaseController<INotification, typeof notificationService> {
  constructor() {
    super(notificationService);
  }

  /** GET /notifications?unread=true */
  public getNotifications = this.asyncHandler(async (req: Request, res: Response) => {
    const userId = this.getUserFromReq(req).id;
    const onlyUnread = req.query.unread === 'true';
    const list = await this.service.getForUser(userId, onlyUnread);
    this.sendSuccess(res, list, 'Notifications fetched', 200);
  });

  /** PUT /notifications/:id/read */
  public markRead = this.asyncHandler(async (req: Request, res: Response) => {
    const userId = this.getUserFromReq(req).id;
    const notif = await this.service.markRead(req.params.id, userId);
    this.sendSuccess(res, notif, 'Notification marked read', 200);
  });

  /** PUT /notifications/read-all */
  public markAllRead = this.asyncHandler(async (req: Request, res: Response) => {
    const userId = this.getUserFromReq(req).id;
    await this.service.markAllRead(userId);
    this.sendSuccess(res, null, 'All notifications marked read', 200);
  });
}

export default new NotificationController();
