import axiosConfig from "@/lib/axios";
import axios, { type AxiosError } from "axios";
import { mapErrorResponse } from "@/lib/error-mapper";

import type {
  ProductResponse,
  GetAllProductResponse,
  ProductStatsResponse,
  CreateProductPayload,
  UpdateProductPayload,
  UpdateStockPayload,
  ProductCategoryResponse,
} from "@/types/product.type";

import type { ErrorResponse } from "@/types/response.type";

export const ProductApi = {
  getAll: async (search = "", page = 1, perPage = 10) => {
    try {
      const response = await axiosConfig.get<GetAllProductResponse>(
        "/stores/fb03a935-3b35-4653-8ab9-8c97309012e8/products/",
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
      const response = await axiosConfig.get<ProductResponse>(
        `/stores/fb03a935-3b35-4653-8ab9-8c97309012e8/products/${id}/`,
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

  getBySKU: async (sku: string) => {
    try {
      const response = await axiosConfig.get<ProductResponse>(
        `/stores/fb03a935-3b35-4653-8ab9-8c97309012e8/products/sku/`,
        {
          params: { sku },
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

  getProductCategory: async () => {
    try {
      const response = await axiosConfig.get<ProductCategoryResponse>(
        "/products/categories/",
      );
      return response.data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error) && error.response) {
        throw error.response.data;
      }

      throw new Error("An unexpected error occured.");
    }
  },

  getStats: async () => {
    try {
      const response = await axiosConfig.get<ProductStatsResponse>(
        "/stores/fb03a935-3b35-4653-8ab9-8c97309012e8/products/stats/",
      );

      return response.data.data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error) && error.response) {
        throw error.response.data;
      }

      throw new Error("An unexpected error occured.");
    }
  },

  create: async (payload: CreateProductPayload) => {
    try {
      const response = await axiosConfig.post<ProductResponse>(
        "/stores/fb03a935-3b35-4653-8ab9-8c97309012e8/products/",
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

  update: async (id: string, payload: UpdateProductPayload) => {
    try {
      const response = await axiosConfig.put<ProductResponse>(
        `/stores/fb03a935-3b35-4653-8ab9-8c97309012e8/products/${id}/`,
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
      const response = await axiosConfig.delete<ProductResponse>(
        `/stores/fb03a935-3b35-4653-8ab9-8c97309012e8/products/${id}/`,
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

  updateStock: async (id: string, payload: UpdateStockPayload) => {
    try {
      const response = await axiosConfig.patch<ProductResponse>(
        `/stores/fb03a935-3b35-4653-8ab9-8c97309012e8/products/${id}/stock/`,
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
};
