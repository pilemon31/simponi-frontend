import axios, { type AxiosError } from "axios";
import axiosConfig from "@/lib/axios";
import { buildStorePath } from "@/lib/shop";
import { mapErrorResponse } from "@/lib/error-mapper";
import type { ErrorResponse } from "@/types/response.type";
import type { DashboardApiResponse } from "@/types/dashboard.type";

type ApiResult<T> = T | ErrorResponse;

const fallbackError = (message = "Terjadi kesalahan"): ErrorResponse => ({
  status: false,
  message,
  timestamp: new Date().toISOString(),
  error: "Unknown error",
});

export const DashboardApi = {
  getDashboard: async (): Promise<ApiResult<DashboardApiResponse>> => {
    try {
      const response = await axiosConfig.get<DashboardApiResponse>(
        buildStorePath("/dashboard"),
      );

      return response.data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error) && error.response) {
        return mapErrorResponse(
          (error as AxiosError).response?.data as ErrorResponse,
        );
      }

      return fallbackError("Gagal memuat dashboard");
    }
  },
};
