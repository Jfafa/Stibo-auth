import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../utils/jwt';


declare global {
  namespace Express {
    interface Request {
      user?: any;
    }
  }
}

export const isAuthenticated = (req: Request, res: Response, next: NextFunction): void => {
  try {
    
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res.status(401).json({
        success: false,
        message: 'Authentication token is missing'
      });
      return;
    }
    
    
    const token = authHeader.split(' ')[1];
    
    
    const decoded = verifyToken(token);
    
    
    req.user = decoded;
    
    next();
  } catch (error) {
    res.status(401).json({
      success: false,
      message: 'Invalid or expired token'
    });
  }
}; 