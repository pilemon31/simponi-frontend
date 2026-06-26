import axiosConfig from "@/lib/axios";
import { buildStorePath } from "@/lib/shop";
import axios, { type AxiosError } from "axios";
import { mapErrorResponse } from "@/lib/error-mapper";

import type { GetProductReviewsResponse } from "@/types/review.type";
import type { ErrorResponse } from "@/types/response.type";

const normalizeReviewListResponse = (
  response: GetProductReviewsResponse,
): GetProductReviewsResponse => ({
  ...response,
  data: Array.isArray(response.data) ? response.data : [],
});

export const ProductReviewApi = {
  getAll: async (page = 1, perPage = 10) => {
    try {
      const response = await axiosConfig.get<GetProductReviewsResponse>(
        buildStorePath("/reviews"),
        {
          params: {
            page: String(page),
            per_page: String(perPage),
          },
        },
      );

      return normalizeReviewListResponse(response.data);
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
