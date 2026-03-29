import axiosConfig from "@/lib/axios";
import type {
  CreateProductRequest,
  ProductDetailResponse,
  ProductListResponse,
  UpdateProductRequest,
  UpdateStockRequest,
} from "@/types/product.type";
import type { ErrorResponse } from "@/types/response.type";
import axios, { AxiosError } from "axios";

export const getProducts = async (
  page: number = 1,
  perPage: number = 10,
): Promise<ProductListResponse | ErrorResponse> => {
  try {
    const response = await axiosConfig.get("/products", {
      params: { page, per_page: perPage },
      headers: {
        "Content-Type": "application/json",
      },
    });
    return response.data as ProductListResponse;
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response) {
      return (error as AxiosError).response?.data as ErrorResponse;
    }
    return {
      status: false,
      message: "An unexpected error occured",
      timestamp: new Date().toISOString(),
      error: "Unknown error",
    } as ErrorResponse;
  }
};

export const getProductByID = async (
  productID: string,
): Promise<ProductDetailResponse | ErrorResponse> => {
  try {
    const response = await axiosConfig.get(`/products/${productID}`, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    return response.data as ProductDetailResponse;
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response) {
      return (error as AxiosError).response?.data as ErrorResponse;
    }
    return {
      status: false,
      message: "An unexpected error occured",
      timestamp: new Date().toISOString(),
      error: "Unknown error",
    } as ErrorResponse;
  }
};

export const getProductBySKU = async (
  sku: string,
): Promise<ProductDetailResponse | ErrorResponse> => {
  try {
    const response = await axiosConfig.get(`/products/sku`, {
      params: { sku },
      headers: {
        "Content-Type": "application/json",
      },
    });
    return response.data as ProductDetailResponse;
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response) {
      return (error as AxiosError).response?.data as ErrorResponse;
    }
    return {
      status: false,
      message: "An unexpected error occured",
      timestamp: new Date().toISOString(),
      error: "Unknown error",
    } as ErrorResponse;
  }
};

export const getProductsByCategory = async (
  categoryID: string,
  page: number = 1,
  perPage: number = 10,
): Promise<ProductListResponse | ErrorResponse> => {
  try {
    const response = await axiosConfig.get(`/products/category/${categoryID}`, {
      params: { page, per_page: perPage },
      headers: {
        "Content-Type": "application/json",
      },
    });
    return response.data as ProductListResponse;
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response) {
      return (error as AxiosError).response?.data as ErrorResponse;
    }
    return {
      status: false,
      message: "An unexpected error occured",
      timestamp: new Date().toISOString(),
      error: "Unknown error",
    } as ErrorResponse;
  }
};

export const createProduct = async (
  data: CreateProductRequest,
): Promise<ProductDetailResponse | ErrorResponse> => {
  try {
    const response = await axiosConfig.post("/products", data, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    return response.data as ProductDetailResponse;
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response) {
      return (error as AxiosError).response?.data as ErrorResponse;
    }
    return {
      status: false,
      message: "An unexpected error occured",
      timestamp: new Date().toISOString(),
      error: "Unknown error",
    } as ErrorResponse;
  }
};

export const updateProduct = async (
  productID: string,
  data: UpdateProductRequest,
): Promise<ProductDetailResponse | ErrorResponse> => {
  try {
    const response = await axiosConfig.put(`/products/${productID}`, data, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    return response.data as ProductDetailResponse;
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response) {
      return (error as AxiosError).response?.data as ErrorResponse;
    }
    return {
      status: false,
      message: "An unexpected error occured",
      timestamp: new Date().toISOString(),
      error: "Unknown error",
    } as ErrorResponse;
  }
};

export const updateStock = async (
  productID: string,
  data: UpdateStockRequest,
): Promise<ErrorResponse | { status: true; message: string }> => {
  try {
    const response = await axiosConfig.patch(
      `/products/${productID}/stock`,
      data,
      {
        headers: {
          "Content-Type": "application/json",
        },
      },
    );
    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response) {
      return (error as AxiosError).response?.data as ErrorResponse;
    }
    return {
      status: false,
      message: "An unexpected error occured",
      timestamp: new Date().toISOString(),
      error: "Unknown error",
    } as ErrorResponse;
  }
};

export const deleteProduct = async (
  productID: string,
): Promise<ErrorResponse | { status: true; message: string }> => {
  try {
    const response = await axiosConfig.delete(`/products/${productID}`, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response) {
      return (error as AxiosError).response?.data as ErrorResponse;
    }
    return {
      status: false,
      message: "An unexpected error occured",
      timestamp: new Date().toISOString(),
      error: "Unknown error",
    } as ErrorResponse;
  }
};
