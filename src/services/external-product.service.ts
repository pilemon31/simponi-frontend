import axiosConfig from "@/lib/axios";
import type {
  CreateExternalProductRequest,
  ExternalProductDetailResponse,
  ExternalProductListResponse,
  ExternalProductItem,
  UpdateExternalProductRequest,
} from "@/types/external-product.type";
import type { ErrorResponse } from "@/types/response.type";
import axios, { AxiosError } from "axios";

const fallbackError = (
  message = "An unexpected error occurred",
): ErrorResponse => ({
  status: false,
  message,
  timestamp: new Date().toISOString(),
  error: "Unknown error",
});

export const getExternalProducts = async (
  page: number = 1,
  perPage: number = 10,
): Promise<ExternalProductListResponse | ErrorResponse> => {
  try {
    const response = await axiosConfig.get("/external-products", {
      params: { page, per_page: perPage },
    });
    return response.data as ExternalProductListResponse;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      return (error as AxiosError).response?.data as ErrorResponse;
    }
    return fallbackError();
  }
};

export const getExternalProductByID = async (
  id: string,
): Promise<ExternalProductDetailResponse | ErrorResponse> => {
  try {
    const response = await axiosConfig.get(`/external-products/${id}`);
    return response.data as ExternalProductDetailResponse;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      return (error as AxiosError).response?.data as ErrorResponse;
    }
    return fallbackError();
  }
};

export const getExternalProductsByProductID = async (
  productID: string,
): Promise<ExternalProductItem[] | ErrorResponse> => {
  try {
    const response = await axiosConfig.get(
      `/external-products/product/${productID}`,
    );
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      return (error as AxiosError).response?.data as ErrorResponse;
    }
    return fallbackError();
  }
};

export const getExternalProductsByStorePlatformID = async (
  storePlatformID: string,
): Promise<ExternalProductItem[] | ErrorResponse> => {
  try {
    const response = await axiosConfig.get(
      `/external-products/store-platform/${storePlatformID}`,
    );
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      return (error as AxiosError).response?.data as ErrorResponse;
    }
    return fallbackError();
  }
};

export const createExternalProduct = async (
  data: CreateExternalProductRequest,
): Promise<ExternalProductDetailResponse | ErrorResponse> => {
  try {
    const response = await axiosConfig.post("/external-products", data);
    return response.data as ExternalProductDetailResponse;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      return (error as AxiosError).response?.data as ErrorResponse;
    }
    return fallbackError();
  }
};

export const updateExternalProduct = async (
  id: string,
  data: UpdateExternalProductRequest,
): Promise<ExternalProductDetailResponse | ErrorResponse> => {
  try {
    const response = await axiosConfig.put(`/external-products/${id}`, data);
    return response.data as ExternalProductDetailResponse;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      return (error as AxiosError).response?.data as ErrorResponse;
    }
    return fallbackError();
  }
};

export const deleteExternalProduct = async (
  id: string,
): Promise<ErrorResponse | { status: true; message: string }> => {
  try {
    const response = await axiosConfig.delete(`/external-products/${id}`);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      return (error as AxiosError).response?.data as ErrorResponse;
    }
    return fallbackError();
  }
};
