import { IUser } from '../models/User';

declare module 'express-session' {
  interface SessionData {
    passport: {
      user: string;
    }
  }
}

declare global {
  namespace Express {
    interface User extends IUser {}
  }
} 