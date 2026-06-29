import { Request, Response, NextFunction } from 'express';
import { sendSuccess } from '../../shared/responses/api.response';
import { approvalService } from './approvals.service';

export class ApprovalController {
  list = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const result = await approvalService.list(req.query as never);
      sendSuccess(res, result.items, 'Approvals retrieved', 200, result.meta);
    } catch (err) {
      next(err);
    }
  };
}

export const approvalController = new ApprovalController();
