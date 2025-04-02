import { Request, Response } from 'express';
import mongoose from 'mongoose';
import { register, login, getCurrentUser } from '../../controllers/authController';
import User from '../../models/User';
import * as dbHandler from '../helpers/dbHandler';


jest.mock('../../utils/jwt', () => ({
  generateToken: jest.fn().mockReturnValue('mocked.jwt.token'),
  verifyToken: jest.fn()
}));

describe('Auth Controller Tests', () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let nextFunction: jest.Mock;

  
  beforeAll(async () => {
    await dbHandler.connect();
  }, 30000);

  
  afterEach(async () => {
    await dbHandler.clearDatabase();
    jest.clearAllMocks();
  });

  
  afterAll(async () => {
    await dbHandler.closeDatabase();
  }, 30000);

  beforeEach(() => {
    mockRequest = {
      body: {},
      user: {}
    };
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    nextFunction = jest.fn();
  });

  describe('register', () => {
    it('should register a new user successfully', async () => {
      mockRequest.body = {
        username: 'newuser',
        email: 'new@example.com',
        password: 'password123'
      };

      await register(
        mockRequest as Request,
        mockResponse as Response,
        nextFunction
      );

      expect(mockResponse.status).toHaveBeenCalledWith(201);
      expect(mockResponse.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: true,
          message: 'User registered successfully',
          token: 'mocked.jwt.token'
        })
      );

      
      const user = await User.findOne({ username: 'newuser' });
      expect(user).toBeTruthy();
      expect(user?.email).toBe('new@example.com');
    });

    it('should return 409 if username or email already exists', async () => {
      
      await User.create({
        username: 'existinguser',
        email: 'existing@example.com',
        password: 'password123'
      });

      
      mockRequest.body = {
        username: 'existinguser',
        email: 'another@example.com',
        password: 'password123'
      };

      await register(
        mockRequest as Request,
        mockResponse as Response,
        nextFunction
      );

      expect(mockResponse.status).toHaveBeenCalledWith(409);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: false,
        message: 'Username or email already exists'
      });
    });
  });

  describe('login', () => {
    beforeEach(async () => {
      
      const user = new User({
        username: 'loginuser',
        email: 'login@example.com',
        password: 'password123'
      });
      await user.save();
    });

    it('should login successfully with correct credentials', async () => {
      mockRequest.body = {
        username: 'loginuser',
        password: 'password123'
      };

      await login(
        mockRequest as Request,
        mockResponse as Response,
        nextFunction
      );

      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: true,
          message: 'Authentication successful',
          token: 'mocked.jwt.token'
        })
      );
    });

    it('should return 401 with incorrect password', async () => {
      mockRequest.body = {
        username: 'loginuser',
        password: 'wrongpassword'
      };

      await login(
        mockRequest as Request,
        mockResponse as Response,
        nextFunction
      );

      expect(mockResponse.status).toHaveBeenCalledWith(401);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: false,
        message: 'Incorrect password'
      });
    });

    it('should return 401 with non-existent username', async () => {
      mockRequest.body = {
        username: 'nonexistentuser',
        password: 'password123'
      };

      await login(
        mockRequest as Request,
        mockResponse as Response,
        nextFunction
      );

      expect(mockResponse.status).toHaveBeenCalledWith(401);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: false,
        message: 'Incorrect username or email'
      });
    });
  });

  describe('getCurrentUser', () => {
    let userId: string;

    beforeEach(async () => {
      
      const user = new User({
        username: 'currentuser',
        email: 'current@example.com',
        password: 'password123'
      });
      const savedUser = await user.save();
      userId = savedUser._id.toString();
    });

    it('should return the current user', async () => {
      mockRequest.user = { id: userId };

      await getCurrentUser(
        mockRequest as Request,
        mockResponse as Response
      );

      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: true,
          user: expect.objectContaining({
            username: 'currentuser',
            email: 'current@example.com'
          })
        })
      );
    });

    it('should return 404 if user not found', async () => {
      mockRequest.user = { id: new mongoose.Types.ObjectId().toString() };

      await getCurrentUser(
        mockRequest as Request,
        mockResponse as Response
      );

      expect(mockResponse.status).toHaveBeenCalledWith(404);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: false,
        message: 'User not found'
      });
    });
  });
}); 