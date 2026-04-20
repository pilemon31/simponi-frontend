import axiosConfig from '@/lib/axios';
import { type GetAllRoleResponse, type RoleResponse } from '@/types/role.type';
import axios, { type AxiosError } from 'axios';
import { mapErrorResponse } from '@/lib/error-mapper';
import { type ErrorResponse } from '@/types/response.type';
import type {
  CreateRolePayloadValues,
  UpdateRolePayloadValues,
} from '@/schemas/roles.schema';

export const RolesApi = {
  getAll: async (search = '', page = 1, perPage = 10) => {
    try {
      const response = await axiosConfig.get<GetAllRoleResponse>('/roles', {
        params: {
          search: search || undefined,
          page: String(page),
          per_page: String(perPage),
        },
      });

      return response.data as GetAllRoleResponse;
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

  create: async (payload: CreateRolePayloadValues) => {
    try {
      const response = await axiosConfig.post<RoleResponse>('/roles', payload);

      return response.data as RoleResponse;
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

  update: async (payload: UpdateRolePayloadValues) => {
    try {
      const response = await axiosConfig.put<RoleResponse>(
        `/roles/${payload.id}`,
        {
          name: payload.name,
          permission_ids: payload.permission_ids,
        },
      );

      return response.data as RoleResponse;
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
      const response = await axiosConfig.delete<RoleResponse>(`/roles/${id}`);

      return response.data as RoleResponse;
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
