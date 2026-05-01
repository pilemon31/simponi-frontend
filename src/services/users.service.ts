import axiosConfig from '@/lib/axios';
import axios, { type AxiosError } from 'axios';
import { mapErrorResponse } from '@/lib/error-mapper';
import { type ErrorResponse } from '@/types/response.type';
import type { CreateUserRequest, UsersResponse } from '@/types/user.type';

export const UsersApi = {
  getAll: async (search = '', page = 1, perPage = 10) => {
    try {
      const response = await axiosConfig.get<UsersResponse>('/users', {
        params: {
          search: search || undefined,
          page: String(page),
          per_page: String(perPage),
        },
      });

      return response.data as UsersResponse;
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
  create: async (data: CreateUserRequest) => {
    try {
      const response = await axiosConfig.post('/users', data);
      return response.data as UsersResponse;
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
  updateStatus: async (id: string, data: CreateUserRequest) => {
    try {
      const response = await axiosConfig.put(`/users/${id}`, data);
      return response.data as UsersResponse;
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
  delete: async (id: string) => {
    try {
      const response = await axiosConfig.delete(`/users/${id}`);
      return response.data as UsersResponse;
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
  // getDetail: async (id: string | number) => {
  //   try {
  //     const response = await axiosConfig.get<UsersResponse>(
  //       `/users/${encodeURIComponent(String(id))}`,
  //     );

  //     return response.data as UsersResponse;
  //   } catch (error: unknown) {
  //     if (axios.isAxiosError(error) && error.response) {
  //       const response = (error as AxiosError).response?.data;
  //       return mapErrorResponse(response as ErrorResponse);
  //     }

  //     return {
  //       status: false,
  //       message: 'An unexpected error occurred',
  //       timestamp: new Date().toISOString(),
  //       error: 'Unknown error',
  //     } as ErrorResponse;
  //   }
  // },
};
