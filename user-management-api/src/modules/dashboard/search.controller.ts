import { Request, Response, NextFunction } from 'express';
import { sendSuccess } from '../../shared/responses/api.response';
import { getQueryString } from '../../common/utils/params.util';
import { searchService } from './search.service';

export class SearchController {
  global = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const q = getQueryString(req, 'q');
      if (!q.trim()) {
        sendSuccess(res, { tenants: [], users: [], roles: [] }, 'Search results retrieved');
        return;
      }
      const results = await searchService.search(q.trim());
      sendSuccess(res, results, 'Search results retrieved');
    } catch (err) {
      next(err);
    }
  };
}

export const searchController = new SearchController();
