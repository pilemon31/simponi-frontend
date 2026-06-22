import axios, { type AxiosError } from 'axios';

import axiosConfig from '@/lib/axios';
import { mapErrorResponse } from '@/lib/error-mapper';
import type { ErrorResponse } from '@/types/response.type';
import type {
  CreateStoreRequest,
  Store,
  StoreApiError,
  StoreApiResult,
  StoreApiSuccess,
  UpdateStoreRequest,
} from '@/types/store.type';

const fallbackError = (): StoreApiError => ({
  status: false,
  message: 'Terjadi kesalahan',
  timestamp: new Date().toISOString(),
  error: 'Unknown error',
});

const mapStoreError = (error: unknown): StoreApiError => {
  if (axios.isAxiosError(error) && error.response) {
    const axiosError = error as AxiosError<ErrorResponse>;
    const response = axiosError.response?.data;
    if (response) {
      return {
        ...mapErrorResponse(response),
        httpStatus: axiosError.response?.status,
      };
    }
  }
  return fallbackError();
};

export const getStores = async (): Promise<StoreApiResult<Store[]>> => {
  try {
    const response = await axiosConfig.get<StoreApiSuccess<Store[]>>('/stores');
    return response.data;
  } catch (error: unknown) {
    return mapStoreError(error);
  }
};

export const getStore = async (
  storeId: string,
): Promise<StoreApiResult<Store>> => {
  try {
    const response = await axiosConfig.get<StoreApiSuccess<Store>>(
      `/stores/${storeId}`,
    );
    return response.data;
  } catch (error: unknown) {
    return mapStoreError(error);
  }
};

export const createStore = async (
  payload: CreateStoreRequest,
): Promise<StoreApiResult<Store>> => {
  try {
    const response = await axiosConfig.post<StoreApiSuccess<Store>>(
      '/stores',
      payload,
    );
    return response.data;
  } catch (error: unknown) {
    return mapStoreError(error);
  }
};

export const updateStore = async (
  storeId: string,
  payload: UpdateStoreRequest,
): Promise<StoreApiResult<Store>> => {
  try {
    const response = await axiosConfig.put<StoreApiSuccess<Store>>(
      `/stores/${storeId}`,
      payload,
    );
    return response.data;
  } catch (error: unknown) {
    return mapStoreError(error);
  }
};

export const deleteStore = async (
  storeId: string,
): Promise<StoreApiResult<null>> => {
  try {
    const response = await axiosConfig.delete<StoreApiSuccess<null>>(
      `/stores/${storeId}`,
    );
    return response.data;
  } catch (error: unknown) {
    return mapStoreError(error);
  }
};
