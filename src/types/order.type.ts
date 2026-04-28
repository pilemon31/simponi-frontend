import type { SuccessResponse } from './response.type';

export type OrderExternalProduct = {
  id?: string | number;
  image?: string;
  product_name?: string;
  platform?: string;
  store_platform_name?: string;
  price?: number;
  created_at?: string;
  updated_at?: string;
};

export type OrderProductItem = {
  id?: string | number;
  order_id?: string | number;
  external_product_id?: string | number;
  quantity?: number;
  qty?: number;
  product_name?: string;
  name?: string;
  sku?: string;
  price?: number;
  unit_price?: number;
  total_price?: number;
  subtotal?: number;
  external_product?: OrderExternalProduct;
};

export type OrderItem = {
  id?: string | number;
  external_order_id?: string;
  order_number: string;
  store_id?: string;
  platform: string;
  buyer_name: string;
  buyer_email: string;
  buyer_phone: string;
  receipent_name?: string;
  receipent_phone?: string;
  shipping_address?: string;
  shipping_city?: string;
  shipping_province?: string;
  shipping_postal?: string;
  shipping_method?: string;
  tracking_number?: string;
  subtotal_amount?: number;
  shipping_fee?: number;
  marketplace_fee?: number;
  discount_amount?: number;
  tax_amount?: number;
  total_amount: number;
  net_amount?: number;
  order_status: string;
  payment_status: string;
  payment_method: string;
  ordered_at: string;
  paid_at?: string;
  shipped_at?: string;
  created_at: string;
  items?: OrderProductItem[];
  order_items?: OrderProductItem[];
  order_details?: OrderProductItem[];
};

export type GetAllOrdersResponse = SuccessResponse<OrderItem[]>;
export type GetOrderDetailResponse = SuccessResponse<OrderItem>;
