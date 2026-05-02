import axiosConfig from "@/lib/axios";
import { buildStorePath } from "@/lib/shop";
import axios, { type AxiosError } from "axios";
import { mapErrorResponse } from "@/lib/error-mapper";

import type {
  CreateExternalProductRequest,
  ExternalProductDetailResponse,
  ExternalProductListResponse,
  ExternalProductItem,
  UpdateExternalProductRequest,
} from "@/types/external-product.type";
import type { ErrorResponse } from "@/types/response.type";

export const ExternalProductApi = {
  getAll: async (search = "", page = 1, perPage = 10) => {
    try {
      const response = await axiosConfig.get<ExternalProductListResponse>(
        buildStorePath("/external-products/"),
        {
          params: {
            search: search || undefined,
            page: String(page),
            per_page: String(perPage),
          },
        },
      );

      return response.data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error) && error.response) {
        const res = (error as AxiosError).response?.data;
        return mapErrorResponse(res as ErrorResponse);
      }

      return {
        status: false,
        message: "An unexpected error occurred",
        timestamp: new Date().toISOString(),
        error: "Unknown error",
      } as ErrorResponse;
    }
  },

  getById: async (id: string) => {
    try {
      const response = await axiosConfig.get<ExternalProductDetailResponse>(
        buildStorePath(`/external-products/${id}`),
      );

      return response.data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error) && error.response) {
        const res = (error as AxiosError).response?.data;
        return mapErrorResponse(res as ErrorResponse);
      }

      return {
        status: false,
        message: "An unexpected error occurred",
        timestamp: new Date().toISOString(),
        error: "Unknown error",
      } as ErrorResponse;
    }
  },

  getByStorePlatformId: async (storePlatformId: string) => {
    try {
      const response = await axiosConfig.get<ExternalProductItem[]>(
        buildStorePath(`/external-products/store-platform/${storePlatformId}`),
      );

      return response.data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error) && error.response) {
        const res = (error as AxiosError).response?.data;
        return mapErrorResponse(res as ErrorResponse);
      }

      return {
        status: false,
        message: "An unexpected error occurred",
        timestamp: new Date().toISOString(),
        error: "Unknown error",
      } as ErrorResponse;
    }
  },

  create: async (payload: CreateExternalProductRequest) => {
    try {
      const response = await axiosConfig.post<ExternalProductDetailResponse>(
        buildStorePath("/external-products/"),
        payload,
      );

      return response.data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error) && error.response) {
        const res = (error as AxiosError).response?.data;
        return mapErrorResponse(res as ErrorResponse);
      }

      return {
        status: false,
        message: "An unexpected error occurred",
        timestamp: new Date().toISOString(),
        error: "Unknown error",
      } as ErrorResponse;
    }
  },

  update: async (id: string, payload: UpdateExternalProductRequest) => {
    try {
      const response = await axiosConfig.put<ExternalProductDetailResponse>(
        buildStorePath(`/external-products/${id}`),
        payload,
      );

      return response.data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error) && error.response) {
        const res = (error as AxiosError).response?.data;
        return mapErrorResponse(res as ErrorResponse);
      }

      return {
        status: false,
        message: "An unexpected error occurred",
        timestamp: new Date().toISOString(),
        error: "Unknown error",
      } as ErrorResponse;
    }
  },

  delete: async (id: string) => {
    try {
      const response = await axiosConfig.delete<{
        status: true;
        message: string;
      }>(buildStorePath(`/external-products/${id}`));

      return response.data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error) && error.response) {
        const res = (error as AxiosError).response?.data;
        return mapErrorResponse(res as ErrorResponse);
      }

      return {
        status: false,
        message: "An unexpected error occurred",
        timestamp: new Date().toISOString(),
        error: "Unknown error",
      } as ErrorResponse;
    }
  },
};
