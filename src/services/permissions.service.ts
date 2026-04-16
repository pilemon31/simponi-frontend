import axios, { type AxiosError } from 'axios';
import axiosConfig from '@/lib/axios';
import { mapErrorResponse } from '@/lib/error-mapper';
import { type ErrorResponse } from '@/types/response.type';
import { type GetAllPermissionsResponse } from '@/types/permission.type';

export const PermissionsApi = {
  getAll: async () => {
    try {
      const response =
        await axiosConfig.get<GetAllPermissionsResponse>('/permissions');

      return response;
    } catch (error: unknown) {
      if (axios.isAxiosError(error) && error.response) {
        const response = (error as AxiosError).response?.data;
        return mapErrorResponse(response as ErrorResponse);
      }

      return {
        status: false,
        message: 'An unexpected error occurred',
        timestamp: new Date().toISOString(),
        error: 'Unknown error',
      } as ErrorResponse;
    }
  },
};
