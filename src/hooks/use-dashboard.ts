import { useQuery } from "@tanstack/react-query";
import { useActiveShopId } from "@/lib/shop";
import { DashboardApi } from "@/services/dashboard.service";
import type { DashboardResponse } from "@/types/dashboard.type";
import type { ErrorResponse } from "@/types/response.type";

const normalizeDashboardResponse = (
  response: DashboardResponse,
  storeId: string,
): DashboardResponse => ({
  ...response,
  summary: {
    ...response.summary,
    store: {
      id: response.summary.store?.id ?? storeId,
      name: response.summary.store?.name ?? "",
    },
  },
  trend: {
    ...response.trend,
    store_id: response.trend.store_id ?? storeId,
    series: Array.isArray(response.trend.series) ? response.trend.series : [],
  },
  recent_orders: {
    ...response.recent_orders,
    store_id: response.recent_orders.store_id ?? storeId,
    items: Array.isArray(response.recent_orders.items)
      ? response.recent_orders.items
      : [],
  },
  low_stock: {
    ...response.low_stock,
    store_id: response.low_stock.store_id ?? storeId,
    items: Array.isArray(response.low_stock.items)
      ? response.low_stock.items
      : [],
  },
  top_products: {
    ...response.top_products,
    store_id: response.top_products.store_id ?? storeId,
    items: Array.isArray(response.top_products.items)
      ? response.top_products.items
      : [],
  },
  activity: {
    ...response.activity,
    store_id: response.activity.store_id ?? storeId,
    items: Array.isArray(response.activity.items)
      ? response.activity.items
      : [],
  },
});

export const useDashboard = () => {
  const activeShopId = useActiveShopId();

  return useQuery<DashboardResponse, ErrorResponse>({
    queryKey: ["dashboard", activeShopId],
    queryFn: async () => {
      const response = await DashboardApi.getDashboard();

      if (!response.status) {
        throw response;
      }

      return normalizeDashboardResponse(response.data, activeShopId);
    },
  });
};
