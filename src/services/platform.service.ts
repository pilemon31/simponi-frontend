// src/services/platform.service.ts
import axios, { AxiosError } from 'axios';
import axiosConfig from '@/lib/axios';
import { mapErrorResponse } from '@/lib/error-mapper';
import type { ConnectPlatformRequest, MyStoreResponse } from '@/types/platform.type';
import type { ErrorResponse } from '@/types/response.type';

type ApiSuccess<T> = { status: true; message: string; data: T };
type ApiResult<T> = ApiSuccess<T> | ErrorResponse;

const fallbackError = (message = 'Terjadi kesalahan'): ErrorResponse => ({
  status: false,
  message,
  timestamp: new Date().toISOString(),
  error: 'Unknown error',
});

export const getMyStore = async (): Promise<ApiResult<MyStoreResponse | null>> => {
  try {
    const res = await axiosConfig.get('/platforms/my-store');
    return res.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      return mapErrorResponse((error as AxiosError).response?.data as ErrorResponse);
    }
    return fallbackError();
  }
};

export const connectPlatform = async (
  data: ConnectPlatformRequest,
): Promise<ApiResult<MyStoreResponse>> => {
  try {
    const res = await axiosConfig.post('/platforms/connect', data);
    return res.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      return mapErrorResponse((error as AxiosError).response?.data as ErrorResponse);
    }
    return fallbackError();
  }
};

export const disconnectPlatform = async (
  storePlatformId: string,
): Promise<ApiResult<null>> => {
  try {
    const res = await axiosConfig.delete(`/platforms/${storePlatformId}/disconnect`);
    return res.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      return mapErrorResponse((error as AxiosError).response?.data as ErrorResponse);
    }
    return fallbackError();
  }
};