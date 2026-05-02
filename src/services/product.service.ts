import axiosConfig from "@/lib/axios";
import { buildStorePath } from "@/lib/shop";
import axios, { type AxiosError } from "axios";
import { mapErrorResponse } from "@/lib/error-mapper";

import type {
  ProductResponse,
  GetAllProductResponse,
  ProductStats,
  ProductStatsResponse,
  CreateProductPayload,
  UpdateProductPayload,
  UpdateStockPayload,
  ProductCategoryResponse,
} from "@/types/product.type";

import type { ErrorResponse } from "@/types/response.type";

const normalizeProductListResponse = (
  response: GetAllProductResponse,
): GetAllProductResponse => ({
  ...response,
  data: Array.isArray(response.data) ? response.data : [],
});

const emptyProductStats = (): ProductStats => ({
  total_products: 0,
  total_skus: 0,
  stock_units: 0,
  low_stock: 0,
  out_of_stock: 0,
  unsynced: 0,
});

export const ProductApi = {
  getAll: async (search = "", page = 1, perPage = 10) => {
    try {
      const response = await axiosConfig.get<GetAllProductResponse>(
        buildStorePath("/products/"),
        {
          params: {
            search: search || undefined,
            page: String(page),
            per_page: String(perPage),
          },
        },
      );

      return normalizeProductListResponse(response.data);
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
        buildStorePath(`/products/${id}/`),
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
        buildStorePath("/products/sku/"),
        {
          params: {
            sku,
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
        buildStorePath("/products/stats/"),
      );

      return response.data.data ?? emptyProductStats();
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
        buildStorePath("/products/"),
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
        buildStorePath(`/products/${id}/`),
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
        buildStorePath(`/products/${id}/`),
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
        buildStorePath(`/products/${id}/stock/`),
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
