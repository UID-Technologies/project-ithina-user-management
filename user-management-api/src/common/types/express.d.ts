import { AuthUser } from '../interfaces/api.interface';

declare global {
  namespace Express {
    interface Request {
      correlationId?: string;
      user?: AuthUser;
    }
  }
}

export {};
