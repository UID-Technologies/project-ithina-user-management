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

export class ApiError extends Error {
  constructor(
    message: string,
    public statusCode: number,
    public errors?: unknown[],
  ) {
    super(message);
    this.name = 'ApiError';
  }
}
