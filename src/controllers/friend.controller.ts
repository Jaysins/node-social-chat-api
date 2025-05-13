import { Response } from 'express';
import { BaseController } from '../base/controller';
import { AuthenticatedRequest } from '../interfaces/global.interface';
import friendService from '../services/friend.services';

class FriendController extends BaseController<any, any> {
  constructor() {
    super(friendService);
  }

  public sendRequest = this.asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const { target } = req.body;
    const from = this.getUserFromReq(req);
    const request = await friendService.sendRequest(from.id, target);
    this.sendSuccess(res, request, 'Friend request sent', 201);
  });

  public getRequests = this.asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const userId = this.getUserFromReq(req).id;
    const requests = await friendService.getRequestsForUser(userId);
    this.sendSuccess(res, requests, 'Friend requests retrieved', 200);
  });

  public respondToRequest = this.asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const userId = this.getUserFromReq(req).id;
    const requestId = req.params.id;
    const { accept } = req.body;

    const request = await friendService.respondRequest(requestId, userId, accept);
    this.sendSuccess(res, request, `Request ${accept ? 'accepted' : 'declined'}`, 200);
  });

  public getFriends = this.asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const userId = this.getUserFromReq(req).id;
    const friends = await friendService.getFriends(userId);
    this.sendSuccess(res, friends, 'Friends list retrieved', 200);
  });

}

export default new FriendController();
