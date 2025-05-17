import { Request, Response, NextFunction } from 'express';
import statService from '../services/stat.services';

class StatsController {
  /** GET /api/stats/dashboard */
  public dashboard = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = (req as any).user.id; // or your AuthenticatedRequest
      const stats  = await statService.getStats(userId);
      res.status(200).json({
        status:  'success',
        message: 'Stats fetched successfully',
        data:    stats,
      });
    } catch (err) {
      next(err);
    }
  };
}

export default new StatsController();
