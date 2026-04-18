import axiosConfig from "@/lib/axios";
import type { OrderListResponse } from "@/types/order.type";
import type { ErrorResponse } from "@/types/response.type";
import axios, { AxiosError } from "axios";

export const getOrders = async (
  search = "",
  page: number = 1,
  perPage: number = 10,
): Promise<OrderListResponse | ErrorResponse> => {
  try {
    const response = await axiosConfig.get("/orders", {
      params: { search, page: String(page), per_page: String(perPage) },
    });
    return response.data as OrderListResponse;
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

// export const getOrderByID = async (
//   orderID: string,
// ): Promise<ProductDetailResponse | ErrorResponse> => {
//   try {
//     const response = await axiosConfig.get(`/orders/${orderID}`);
//     return response.data as ProductDetailResponse;
//   } catch (error: unknown) {
//     if (axios.isAxiosError(error) && error.response) {
//       return (error as AxiosError).response?.data as ErrorResponse;
//     }
//     return {
//       status: false,
//       message: "An unexpected error occured",
//       timestamp: new Date().toISOString(),
//       error: "Unknown error",
//     } as ErrorResponse;
//   }
// };
