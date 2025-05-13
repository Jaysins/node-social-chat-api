
import { Request } from 'express';
import { Socket } from 'socket.io';


export interface AuthUser {
  id: string, username: string, email: string
}
export interface AuthenticatedRequest extends Request {
  user?: AuthUser;
}

export interface ChatSocket extends Socket {
  user?: AuthUser;
}
