import axiosConfig from "@/lib/axios";
import type {
  CreateVendorRequest,
  UpdateVendorRequest,
  VendorDetailResponse,
  VendorListResponse,
} from "@/types/vendor.type";
import type { ErrorResponse } from "@/types/response.type";
import axios, { AxiosError } from "axios";

const fallbackError = (): ErrorResponse => ({
  status: false,
  message: "An unexpected error occurred",
  timestamp: new Date().toISOString(),
  error: "Unknown error",
});

// ✅ FIX: tambah param search, dikirim ke backend via query params
export const getVendors = async (
  page = 1,
  perPage = 10,
  search = ""
): Promise<VendorListResponse | ErrorResponse> => {
  try {
    const params: Record<string, unknown> = { page, per_page: perPage };
    if (search) params.search = search;

    const response = await axiosConfig.get("/vendors", { params });
    return response.data as VendorListResponse;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response)
      return (error as AxiosError).response?.data as ErrorResponse;
    return fallbackError();
  }
};

export const getVendorByID = async (
  vendorID: string
): Promise<VendorDetailResponse | ErrorResponse> => {
  try {
    const response = await axiosConfig.get(`/vendors/${vendorID}`);
    return response.data as VendorDetailResponse;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response)
      return (error as AxiosError).response?.data as ErrorResponse;
    return fallbackError();
  }
};

export const createVendor = async (
  data: CreateVendorRequest
): Promise<VendorDetailResponse | ErrorResponse> => {
  try {
    const response = await axiosConfig.post("/vendors", data);
    return response.data as VendorDetailResponse;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response)
      return (error as AxiosError).response?.data as ErrorResponse;
    return fallbackError();
  }
};

export const updateVendor = async (
  vendorID: string,
  data: UpdateVendorRequest
): Promise<VendorDetailResponse | ErrorResponse> => {
  try {
    const response = await axiosConfig.put(`/vendors/${vendorID}`, data);
    return response.data as VendorDetailResponse;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response)
      return (error as AxiosError).response?.data as ErrorResponse;
    return fallbackError();
  }
};

export const deleteVendor = async (
  vendorID: string
): Promise<{ status: true; message: string } | ErrorResponse> => {
  try {
    const response = await axiosConfig.delete(`/vendors/${vendorID}`);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response)
      return (error as AxiosError).response?.data as ErrorResponse;
    return fallbackError();
  }
};