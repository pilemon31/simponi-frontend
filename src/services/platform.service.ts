import axios, { type AxiosError } from 'axios';

import axiosConfig from '@/lib/axios';
import { mapErrorResponse } from '@/lib/error-mapper';
import type { ErrorResponse } from '@/types/response.type';
import type {
  ConnectPlatformResponseData,
  PlatformApiError,
  PlatformApiResult,
  PlatformApiSuccess,
  StorePlatformApiStore,
} from '@/types/platform.type';

const fallbackError = (message = 'Terjadi kesalahan'): PlatformApiError => ({
  status: false,
  message,
  timestamp: new Date().toISOString(),
  error: 'Unknown error',
});

const mapPlatformError = (error: unknown): PlatformApiError => {
  if (axios.isAxiosError(error) && error.response) {
    const axiosError = error as AxiosError<ErrorResponse>;
    return {
      ...mapErrorResponse(axiosError.response?.data as ErrorResponse),
      httpStatus: axiosError.response?.status,
    };
  }

  return fallbackError();
};

export const getStorePlatformStatus = async (
  storeId: string,
): Promise<PlatformApiResult<StorePlatformApiStore>> => {
  try {
    const response = await axiosConfig.get<
      PlatformApiSuccess<StorePlatformApiStore>
    >(`/stores/${storeId}`);
    return response.data;
  } catch (error: unknown) {
    return mapPlatformError(error);
  }
};

export const connectPlatform = async (
  storeId: string,
  platformId: string,
): Promise<PlatformApiResult<ConnectPlatformResponseData>> => {
  try {
    const response = await axiosConfig.post<
      PlatformApiSuccess<ConnectPlatformResponseData>
    >(`/store/${storeId}/platforms/${platformId}/connect`);
    return response.data;
  } catch (error: unknown) {
    return mapPlatformError(error);
  }
};

export const disconnectPlatform = async (
  storeId: string,
  platformId: string,
): Promise<PlatformApiResult<null>> => {
  try {
    const response = await axiosConfig.delete<PlatformApiSuccess<null>>(
      `/store/${storeId}/platforms/${platformId}`,
    );
    return response.data;
  } catch (error: unknown) {
    return mapPlatformError(error);
  }
};
