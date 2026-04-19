import axiosConfig from '@/lib/axios';
import axios, { type AxiosError } from 'axios';
import { mapErrorResponse } from '@/lib/error-mapper';
import { type ErrorResponse } from '@/types/response.type';
import type { GetAllOrdersResponse } from '@/types/order.type';

export const OrdersApi = {
  getAll: async (search = '', page = 1, perPage = 10) => {
    try {
      const response = await axiosConfig.get<GetAllOrdersResponse>('/orders', {
        params: {
          search: search || undefined,
          page: String(page),
          per_page: String(perPage),    
        },
      });

      return response.data as GetAllOrdersResponse;
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

}