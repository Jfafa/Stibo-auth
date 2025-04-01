import jwt, { SignOptions } from 'jsonwebtoken';
import { IUser } from '../models/User';


const JWT_SECRET = process.env.JWT_SECRET || 'your-jwt-secret-key';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '1d';

export const generateToken = (user: IUser): string => {
  const payload = {
    id: user._id,
    email: user.email,
    username: user.username
  };

  
  return jwt.sign(payload, JWT_SECRET, { 
    expiresIn: JWT_EXPIRES_IN as any 
  });
};

export const verifyToken = (token: string): any => {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    throw error;
  }
}; 