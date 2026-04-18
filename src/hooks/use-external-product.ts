import type { ExternalProduct } from "@/components/inventory/display/data/schema";
import { adaptExternalProductToInventory } from "@/components/inventory/display/data/adapter";
import type { ErrorResponse, Pagination } from "@/types/response.type";
import { getExternalProducts } from "@/services/external-product.service";
import { useQuery } from "@tanstack/react-query";
import type {
  ExternalProductItem,
  ExternalProductListResponse,
} from "@/types/external-product.type";

type UseExternalProductResult = {
  data: ExternalProduct[];
  isLoading: boolean;
  isError: boolean;
  totalCount: number;
  maxPage: number;
  refetch: () => void;
};

const normalizeExternalProductItems = (
  response: ExternalProductListResponse | ErrorResponse | undefined,
): {
  isSuccess: boolean;
  items: ExternalProductItem[];
  pagination: Pagination | null;
} => {
  if (!response || response.status !== true) {
    return {
      isSuccess: false,
      items: [],
      pagination: null,
    };
  }

  const responseData = response.data;

  const items: ExternalProductItem[] = Array.isArray(responseData)
    ? responseData
    : Array.isArray(responseData.data)
      ? responseData.data
      : [];

  const pagination: Pagination | null = Array.isArray(responseData)
    ? (response.meta ?? null)
    : (responseData.pagination ?? response.meta ?? null);

  return {
    isSuccess: true,
    items,
    pagination,
  };
};

export const useExternalProduct = (): UseExternalProductResult => {
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["external-products"],
    queryFn: () => getExternalProducts(),
  });

  const normalized = normalizeExternalProductItems(data);
  const normalizedExternalProducts = normalized.items.map(
    adaptExternalProductToInventory,
  );
  const hasResponse = data !== undefined;

  return {
    data: normalizedExternalProducts,
    isLoading,
    isError: isError || (hasResponse && !normalized.isSuccess),
    maxPage: normalized.pagination?.max_page ?? 1,
    totalCount: normalized.pagination?.count ?? normalizedExternalProducts.length,
    refetch,
  };
};
