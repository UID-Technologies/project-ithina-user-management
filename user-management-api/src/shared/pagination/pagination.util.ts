import { PaginationQuery } from '../../common/interfaces/api.interface';
import { DEFAULT_LIMIT, DEFAULT_PAGE, MAX_LIMIT } from '../../common/constants';

export interface PaginationResult {
  page: number;
  limit: number;
  skip: number;
}

export function parsePagination(query: PaginationQuery): PaginationResult {
  const page = Math.max(Number(query.page) || DEFAULT_PAGE, 1);
  const limit = Math.min(Math.max(Number(query.limit) || DEFAULT_LIMIT, 1), MAX_LIMIT);
  const skip = (page - 1) * limit;
  return { page, limit, skip };
}

export function buildMeta(page: number, limit: number, total: number) {
  return { page, limit, total };
}
