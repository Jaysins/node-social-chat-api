import { Request, Response, NextFunction, RequestHandler } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import settings from '../config/settings';
import { AuthenticatedRequest } from '../interfaces/global.interface';
import { BadRequestError, UnAuthenticatedError } from '../errors'; // Adjust according to your error implementation

const authMiddleware = (ignoredRoutes: string[]): RequestHandler => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    console.log('in here==');
    const baseEndpoint = '';
    const basePath = req.path.slice(baseEndpoint.length);
    const routeParts = basePath.split('/').filter(Boolean); // Filter out empty strings

    if (routeParts.includes('socket.io')){
      next()
      return;
    }
    if (routeParts.length < 2) {
      throw new BadRequestError('Invalid request URL');
    }
    const currentRoute = routeParts[2];

    console.log(req.path);
    console.log(currentRoute);
    if (ignoredRoutes.includes(currentRoute)) {
      next();
      return;
    }
    const token = req.header('Authorization');
    if (!token) {
      throw new UnAuthenticatedError('Auth token required');
    }
    try {
      const decoded: string | JwtPayload = jwt.verify(token, settings.JWT_SECRET_KEY);
      if (!decoded || typeof decoded === 'string') {
        next(new UnAuthenticatedError('Invalid token'));
        return;
      }
      req.user = {
        id: decoded.id,
        username: decoded.username,
        email: decoded.email,
      };

      console.log(req.user);
      next();
    } catch (err) {
      throw new UnAuthenticatedError('Invalid token');
    }
  };
};

export default authMiddleware;