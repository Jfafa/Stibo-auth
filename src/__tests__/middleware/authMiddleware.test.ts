import { Request, Response } from 'express';
import { isAuthenticated } from '../../middleware/authMiddleware';
import { generateToken } from '../../utils/jwt';
import mongoose from 'mongoose';


jest.mock('../../utils/jwt', () => ({
  verifyToken: jest.fn().mockImplementation((token) => {
    if (token === 'valid.token') {
      return { id: 'user123', username: 'testuser', email: 'test@example.com' };
    }
    throw new Error('Invalid token');
  }),
  generateToken: jest.fn().mockReturnValue('valid.token'),
}));

describe('Auth Middleware Tests', () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let nextFunction: jest.Mock;

  beforeEach(() => {
    mockRequest = {};
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    nextFunction = jest.fn();
  });

  it('should pass for valid authorization header', () => {
    mockRequest.headers = {
      authorization: 'Bearer valid.token'
    };

    isAuthenticated(mockRequest as Request, mockResponse as Response, nextFunction);

    expect(nextFunction).toHaveBeenCalled();
    expect(mockRequest.user).toEqual({
      id: 'user123',
      username: 'testuser',
      email: 'test@example.com'
    });
  });

  it('should return 401 when authorization header is missing', () => {
    mockRequest.headers = {};

    isAuthenticated(mockRequest as Request, mockResponse as Response, nextFunction);

    expect(mockResponse.status).toHaveBeenCalledWith(401);
    expect(mockResponse.json).toHaveBeenCalledWith({
      success: false,
      message: 'Authentication token is missing'
    });
    expect(nextFunction).not.toHaveBeenCalled();
  });

  it('should return 401 for invalid token format', () => {
    mockRequest.headers = {
      authorization: 'InvalidFormat'
    };

    isAuthenticated(mockRequest as Request, mockResponse as Response, nextFunction);

    expect(mockResponse.status).toHaveBeenCalledWith(401);
    expect(mockResponse.json).toHaveBeenCalledWith({
      success: false,
      message: 'Authentication token is missing'
    });
  });

  it('should return 401 for invalid token', () => {
    mockRequest.headers = {
      authorization: 'Bearer invalid.token'
    };

    isAuthenticated(mockRequest as Request, mockResponse as Response, nextFunction);

    expect(mockResponse.status).toHaveBeenCalledWith(401);
    expect(mockResponse.json).toHaveBeenCalledWith({
      success: false,
      message: 'Invalid or expired token'
    });
  });
}); 