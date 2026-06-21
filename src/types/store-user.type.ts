import type { SuccessResponse } from './response.type';

export interface StoreEmployee {
  id: string;
  name: string;
  email: string;
}

export interface PaginationMeta {
  page: number;
  per_page: number;
  max_page: number;
  count: number;
}

export interface StoreEmployeesResponse {
  status: true;
  message: string;
  data: StoreEmployee[];
  meta?: PaginationMeta;
}

export interface CreateStoreEmployeesRequest {
  user_ids: string[];
}

export type CreateStoreEmployeesResponse = SuccessResponse<null>;
export type DeleteStoreEmployeeResponse = SuccessResponse<null>;
