import type { SuccessResponse } from "./response.type";

export type DashboardSummaryMetricsResponse = {
  revenue_month_to_date: number;
  orders_month_to_date: number;
  active_products: number;
  low_stock_products: number;
  out_of_stock_products: number;
  pending_orders: number;
  ready_to_ship_orders: number;
  completed_orders: number;
};

export type DashboardStoreResponse = {
  id: string;
  name: string;
};


export type DashboardSummaryResponse = {
  store: DashboardStoreResponse;
  metrics: DashboardSummaryMetricsResponse;
};

export type DashboardTrendPointResponse = {
  month: string;
  revenue: number;
  orders: number;
};

export type DashboardTrendResponse = {
  store_id: string;
  range: string;
  series: DashboardTrendPointResponse[];
};

export type DashboardRecentOrderItemResponse = {
  id: string;
  order_number: string;
  buyer_name: string;
  order_status: string;
  payment_status: string;
  total_amount: number;
  ordered_at?: string | null;
};

export type DashboardRecentOrdersResponse = {
  store_id: string;
  items: DashboardRecentOrderItemResponse[];
};

export type DashboardLowStockItemResponse = {
  product_id: string;
  name: string;
  sku: string;
  stock: number;
  threshold: number;
};

export type DashboardLowStockResponse = {
  store_id: string;
  items: DashboardLowStockItemResponse[];
};

export type DashboardTopProductItemResponse = {
  product_id: string;
  name: string;
  sku: string;
  sold_qty: number;
  revenue: number;
};

export type DashboardTopProductsResponse = {
  store_id: string;
  items: DashboardTopProductItemResponse[];
};

export type DashboardActivityItemResponse = {
  id: string;
  type: string;
  title: string;
  message: string;
  created_at: string;
};

export type DashboardActivityResponse = {
  store_id: string;
  items: DashboardActivityItemResponse[];
};

export type DashboardResponse = {
  summary: DashboardSummaryResponse;
  trend: DashboardTrendResponse;
  recent_orders: DashboardRecentOrdersResponse;
  low_stock: DashboardLowStockResponse;
  top_products: DashboardTopProductsResponse;
  activity: DashboardActivityResponse;
};

export type DashboardApiResponse = SuccessResponse<DashboardResponse>;