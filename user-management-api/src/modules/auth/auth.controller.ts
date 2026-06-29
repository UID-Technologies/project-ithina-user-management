import { Request, Response, NextFunction } from 'express';
import { sendSuccess } from '../../shared/responses/api.response';
import { authService } from './auth.service';

export class AuthController {
  login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const result = await authService.login(req.body);
      sendSuccess(res, result, 'Login successful');
    } catch (err) {
      next(err);
    }
  };

  me = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const profile = await authService.getProfileByUserId(req.user!.id);
      sendSuccess(res, profile, 'Profile retrieved');
    } catch (err) {
      next(err);
    }
  };
}

export const authController = new AuthController();
