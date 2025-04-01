import { Request, Response, NextFunction } from 'express';
import User, { IUser } from '../models/User';
import { generateToken } from '../utils/jwt';

export const register = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { username, email, password } = req.body;
    
    
    const existingUser = await User.findOne({ 
      $or: [{ email }, { username }] 
    });
    
    if (existingUser) {
      res.status(409).json({ 
        success: false, 
        message: 'Username or email already exists' 
      });
      return;
    }
    
    
    const newUser = new User({ username, email, password });
    await newUser.save();
    
    
    const token = generateToken(newUser);
    
    
    const userResponse = newUser.toObject();
    userResponse.password = undefined;
    
    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      token,
      user: userResponse
    });
  } catch (error) {
    next(error);
  }
};

export const login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { username, password } = req.body;
    
    
    const user = await User.findOne({
      $or: [{ username }, { email: username }]
    });
    
    if (!user) {
      res.status(401).json({
        success: false,
        message: 'Incorrect username or email'
      });
      return;
    }
    
    
    const isValid = await user.isValidPassword(password);
    if (!isValid) {
      res.status(401).json({
        success: false,
        message: 'Incorrect password'
      });
      return;
    }
    
    
    const token = generateToken(user);
    
    
    const userResponse = user.toObject();
    userResponse.password = undefined;
    
    res.status(200).json({
      success: true,
      message: 'Authentication successful',
      token,
      user: userResponse
    });
  } catch (error) {
    next(error);
  }
};

export const getCurrentUser = async (req: Request, res: Response): Promise<void> => {
  try {
    
    const userId = req.user.id;
    
    
    const user = await User.findById(userId);
    
    if (!user) {
      res.status(404).json({
        success: false,
        message: 'User not found'
      });
      return;
    }
    
    const userResponse = user.toObject();
    userResponse.password = undefined;
    
    res.status(200).json({
      success: true,
      user: userResponse
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching user data'
    });
  }
}; 