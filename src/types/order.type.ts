import type { Pagination, SuccessResponse } from "./response.type";

export type OrderData = {
  id: string;
  order_number: string;
  buyer_name: string;
  platform: string;
  buyer_phone: string;
  buyer_email: string;
  order_status: string;
  payment_status: string;
  payment_method: string;
  created_at: string;
  updated_at: string;
};


export type OrderListResponse =
  | SuccessResponse<{
      data: OrderData[];
      pagination: Pagination;
    }>
  | SuccessResponse<OrderData[]>;

