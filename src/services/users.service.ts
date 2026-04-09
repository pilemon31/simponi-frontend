import axios, { type AxiosError } from 'axios';
import axiosConfig from '@/lib/axios';
import { type ErrorResponse } from '@/types/response.type';
import type { UsersResponse } from '@/types/user.type';

export const getUsers = async (
  page = 1,
  perPage = 10,
): Promise<UsersResponse | ErrorResponse> => {
  try {
    const response = await axiosConfig.get('/users', {
      headers: {
        'Content-Type': 'application/json',
      },
      params: {
        page,
        per_page: perPage,
      },
    });

    return response.data as UsersResponse;
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response) {
      const response = (error as AxiosError).response?.data;
      return response as ErrorResponse;
    }

    return {
      status: false,
      message: 'An unexpected error occurred',
      timestamp: new Date().toISOString(),
      error: 'Unknown error',
    } as ErrorResponse;
  }
};
