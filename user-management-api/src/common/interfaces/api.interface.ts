export interface ApiMeta {
  page: number;
  limit: number;
  total: number;
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data?: T;
  meta?: ApiMeta;
  errors?: unknown[];
}

export interface PaginationQuery {
  page?: number;
  limit?: number;
}

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  roleIds: string[];
  tenantId: string | 'platform';
  permissions: string[];
}
