export type SuccessResponse<T = unknown> = {
  meta?: Pagination;
  status: true;
  message: string;
  timestamp?: string;
  data: T;
};

export type Pagination = {
  page: number;
  per_page: number;
  max_page: number;
  count: number;
};

export type ErrorResponse = {
  status: false;
  message: string;
  timestamp: string;
  error: string;
};
