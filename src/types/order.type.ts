import type { SuccessResponse } from "./response.type";

export type OrderItem = {
  order_number: string;
  platform: string;
  buyer_name: string;
  buyer_email: string;
  buyer_phone: string;
  total_amount: number;
  order_status: string;
  payment_status: string;
  payment_method: string;
  ordered_at: string;
  created_at: string;
}

export type GetAllOrdersResponse = SuccessResponse<OrderItem[]>;
