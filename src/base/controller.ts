import { Request, Response, NextFunction } from 'express';
import { BaseService } from './service';
import { Document } from 'mongoose';
import { AuthUser, AuthenticatedRequest } from '../interfaces/global.interface';


export abstract class BaseController<T extends Document, S extends BaseService<T>> {
  protected service: S;

  constructor(service: S) {
    this.service = service;
  }

  protected sendSuccess<U>(res: Response, data: U, message: string = 'Success', statusCode: number = 200): void {
    res.status(statusCode).json({
      status: 'success',
      message,
      data,
    });
  }
  
  protected sendError(res: Response, error: any, statusCode: number = 500): void {
    res.status(statusCode).json({
      status: 'error',
      message: error instanceof Error ? error.message : error,
    });
  }

  protected asyncHandler(fn: (req: Request, res: Response, next: NextFunction) => Promise<any>) {
    return (req: Request, res: Response, next: NextFunction) => {
      fn(req, res, next).catch(next);
    };
  }

  protected getUserFromReq(req: Request): AuthUser {
    const authReq = req as AuthenticatedRequest;
    if (!authReq.user?.id) {
      throw new Error('User not authenticated');
    }
    return authReq.user;
  }
}
