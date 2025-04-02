import jwt from 'jsonwebtoken';
import { generateToken, verifyToken } from '../../utils/jwt';
import mongoose from 'mongoose';


process.env.JWT_SECRET = 'test-secret';
process.env.JWT_EXPIRES_IN = '1h';

describe('JWT Utility Tests', () => {
  const mockUser = {
    _id: new mongoose.Types.ObjectId().toString(),
    username: 'testuser',
    email: 'test@example.com',
  };

  it('should verify a valid token correctly', () => {
    const token = generateToken(mockUser as any);
    const decoded = verifyToken(token);
    
    expect(decoded).toHaveProperty('id', mockUser._id);
    expect(decoded).toHaveProperty('username', mockUser.username);
    expect(decoded).toHaveProperty('email', mockUser.email);
  });

  it('should throw an error for invalid tokens', () => {
    expect(() => {
      verifyToken('invalid.token.here');
    }).toThrow();
  });
}); 