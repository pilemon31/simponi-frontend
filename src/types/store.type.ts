import type { ErrorResponse } from './response.type';

export interface StoreOwner {
  id: string;
  name: string;
  email: string;
}

export interface StorePlatform {
  id: string;
  name: string;
}

export interface Store {
  id: string;
  owner: StoreOwner;
  name: string;
  description: string;
  image_url: string;
  is_active: boolean;
  platforms: StorePlatform[];
}

export interface CreateStoreRequest {
  name: string;
  description?: string;
  image_url?: string;
}

export interface UpdateStoreRequest {
  name: string;
  description?: string;
  image_url?: string;
  is_active?: boolean;
}

export type StoreApiSuccess<T> = {
  status: true;
  message: string;
  data?: T;
};

export type StoreApiError = ErrorResponse & { httpStatus?: number };
export type StoreApiResult<T> = StoreApiSuccess<T> | StoreApiError;
