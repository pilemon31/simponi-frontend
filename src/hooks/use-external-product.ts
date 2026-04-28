import type { ErrorResponse, Pagination } from "@/types/response.type";
import { getExternalProducts } from "@/services/external-product.service";
import { useQuery } from "@tanstack/react-query";
import type {
  DisplayExternalProduct,
  ExternalProductItem,
  ExternalProductListResponse,
} from "@/types/external-product.type";

type UseExternalProductResult = {
  data: DisplayExternalProduct[];
  isLoading: boolean;
  isError: boolean;
  totalCount: number;
  maxPage: number;
  meta?: Pagination;
  refetch: () => void;
};

const normalizePlatform = (platform: string): "shopee" | "tiktok" =>
  platform.toLowerCase().includes("tiktok") ? "tiktok" : "shopee";

const adaptExternalProductToDisplay = (
  externalProduct: ExternalProductItem,
): DisplayExternalProduct => ({
  id: externalProduct.id,
  image: externalProduct.image ?? null,
  product_name: externalProduct.product_name,
  platform: normalizePlatform(externalProduct.platform),
  store_platform_name: externalProduct.store_platform_name ?? "",
  price: externalProduct.price,
  created_at: externalProduct.created_at,
  updated_at: externalProduct.updated_at,
});

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
    : responseData && Array.isArray(responseData.data)
      ? responseData.data
      : [];

  const pagination: Pagination | null = Array.isArray(responseData)
    ? (response.meta ?? null)
    : (responseData?.pagination ?? response.meta ?? null);

  return {
    isSuccess: true,
    items,
    pagination,
  };
};

export const useExternalProduct = (
  search = "",
  page = 1,
  perPage = 10,
): UseExternalProductResult => {
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["external-products", search, page, perPage],
    queryFn: () => getExternalProducts(search, page, perPage),
  });

  const normalized = normalizeExternalProductItems(data);
  const normalizedExternalProducts = normalized.items.map(
    adaptExternalProductToDisplay,
  );
  const hasResponse = data !== undefined;

  return {
    data: normalizedExternalProducts,
    isLoading,
    isError: isError || (hasResponse && !normalized.isSuccess),
    maxPage: normalized.pagination?.max_page ?? 1,
    totalCount:
      normalized.pagination?.count ?? normalizedExternalProducts.length,
    meta: normalized.pagination ?? undefined,
    refetch,
  };
};
