import axiosConfig from '@/lib/axios';
import { getActiveShopId } from '@/lib/shop';
import axios, { type AxiosError } from 'axios';
import { mapErrorResponse } from '@/lib/error-mapper';
import { type ErrorResponse } from '@/types/response.type';
import type {
  GetAllOrdersResponse,
  GetOrderDetailResponse,
} from '@/types/order.type';

export const OrdersApi = {
  getAll: async (search = '', page = 1, perPage = 10) => {
    try {
      const activeShopId = getActiveShopId();
      console.log(activeShopId)
      const response = await axiosConfig.get<GetAllOrdersResponse>(`stores/${activeShopId}/orders`, {
        params: {
          search: search || undefined,
          page: String(page),
          per_page: String(perPage),
        },
      });

      console.log(response.data)
      console.log('test')

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

  getDetail: async (id: string | number) => {
    try {
      const activeShopId = getActiveShopId();
      const response = await axiosConfig.get<GetOrderDetailResponse>(
        `stores/${activeShopId}/orders/${encodeURIComponent(String(id))}`,
      );

      return response.data as GetOrderDetailResponse;
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
