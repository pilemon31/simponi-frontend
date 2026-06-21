import axios from 'axios';

import axiosConfig from '@/lib/axios';
import { mapErrorResponse } from '@/lib/error-mapper';
import type { ErrorResponse } from '@/types/response.type';
import type {
  CreateStoreEmployeesRequest,
  CreateStoreEmployeesResponse,
  DeleteStoreEmployeeResponse,
  StoreEmployeesResponse,
} from '@/types/store-user.type';

export const getStoreEmployees = async (
  storeId: string,
  page = 1,
  perPage = 10,
  search = '',
): Promise<StoreEmployeesResponse | ErrorResponse> => {
  try {
    const response = await axiosConfig.get<StoreEmployeesResponse>(
      `/stores/${storeId}/users`,
      {
        params: {
          page,
          per_page: perPage,
          search: search || undefined,
        },
      },
    );

    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response) {
      return mapErrorResponse(error.response.data as ErrorResponse);
    }

    return {
      status: false,
      message: 'An unexpected error occurred',
      timestamp: new Date().toISOString(),
      error: 'Unknown error',
    };
  }
};

export const createStoreEmployees = async (
  storeId: string,
  payload: CreateStoreEmployeesRequest,
): Promise<CreateStoreEmployeesResponse | ErrorResponse> => {
  try {
    const response = await axiosConfig.post<CreateStoreEmployeesResponse>(
      `/stores/${storeId}/users`,
      payload,
      {
        headers: {
          'Content-Type': 'application/json',
        },
      },
    );

    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response) {
      return mapErrorResponse(error.response.data as ErrorResponse);
    }

    return {
      status: false,
      message: 'An unexpected error occurred',
      timestamp: new Date().toISOString(),
      error: 'Unknown error',
    };
  }
};

export const deleteStoreEmployee = async (
  storeId: string,
  userId: string,
): Promise<DeleteStoreEmployeeResponse | ErrorResponse> => {
  try {
    const response = await axiosConfig.delete<DeleteStoreEmployeeResponse>(
      `/stores/${storeId}/users/${userId}`,
    );

    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response) {
      return mapErrorResponse(error.response.data as ErrorResponse);
    }

    return {
      status: false,
      message: 'An unexpected error occurred',
      timestamp: new Date().toISOString(),
      error: 'Unknown error',
    };
  }
};