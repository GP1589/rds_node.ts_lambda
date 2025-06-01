import { Request, Response, NextFunction } from 'express';
import { UserService } from '../services/UserService';
import { NotFoundError, ValidationError } from '../../transversal/exceptions/AppError';

export class UserController {
  constructor(private userService: UserService) {}

  createUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { email, name, position } = req.body;

      if (!email || !name || !position) {
        throw new ValidationError('Email, name, and position are required');
      }

      const user = await this.userService.createUser({ email, name, position });
      res.status(201).json({
        success: true,
        data: user,
        message: 'User created successfully'
      });
    } catch (error) {
      next(error);
    }
  };

  getUserById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { userId } = req.params;
      const user = await this.userService.getUserById(userId);

      if (!user) {
        throw new NotFoundError('User not found');
      }

      res.json({
        success: true,
        data: user
      });
    } catch (error) {
      next(error);
    }
  };

  getAllUsers = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const users = await this.userService.getAllUsers();
      res.json({
        success: true,
        data: users,
        count: users.length
      });
    } catch (error) {
      next(error);
    }
  };

  updateUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { userId } = req.params;
      const updateData = req.body;

      const user = await this.userService.updateUser(userId, updateData);

      if (!user) {
        throw new NotFoundError('User not found');
      }

      res.json({
        success: true,
        data: user,
        message: 'User updated successfully'
      });
    } catch (error) {
      next(error);
    }
  };

  deleteUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { userId } = req.params;
      const deleted = await this.userService.deleteUser(userId);

      if (!deleted) {
        throw new NotFoundError('User not found');
      }

      res.json({
        success: true,
        message: 'User deleted successfully'
      });
    } catch (error) {
      next(error);
    }
  };
}