import { Request, Response, NextFunction } from 'express';
import { sendSuccess } from '../../shared/responses/api.response';
import { getParam } from '../../common/utils/params.util';
import { guardrailService } from './guardrails.service';

export class GuardrailController {
  listRules = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const result = await guardrailService.listRules(req.query as never);
      sendSuccess(res, result.items, 'Guardrail rules retrieved', 200, result.meta);
    } catch (err) {
      next(err);
    }
  };

  getRuleById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const rule = await guardrailService.getRuleById(getParam(req, 'id'));
      sendSuccess(res, rule, 'Guardrail rule retrieved');
    } catch (err) {
      next(err);
    }
  };

  createRule = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const rule = await guardrailService.createRule(req.body, req.user?.name);
      sendSuccess(res, rule, 'Guardrail rule created', 201);
    } catch (err) {
      next(err);
    }
  };

  updateRule = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const rule = await guardrailService.updateRule(getParam(req, 'id'), req.body, req.user?.name);
      sendSuccess(res, rule, 'Guardrail rule updated');
    } catch (err) {
      next(err);
    }
  };

  removeRule = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      await guardrailService.removeRule(getParam(req, 'id'), req.user?.name);
      sendSuccess(res, null, 'Guardrail rule deleted');
    } catch (err) {
      next(err);
    }
  };

  listEvents = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const result = await guardrailService.listEvents(req.query as never);
      sendSuccess(res, result.items, 'Guardrail events retrieved', 200, result.meta);
    } catch (err) {
      next(err);
    }
  };
}

export const guardrailController = new GuardrailController();
