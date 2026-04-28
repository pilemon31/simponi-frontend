import { resolveImageUrl } from "@/lib/media";
import { getProducts, getProductStats } from "@/services/product.service";
import { uploadProductImages } from "@/services/upload.service";
import type {
  InternalInventory,
  InternalInventoryExternalProduct,
  InternalInventoryStatusState,
  ProductListItem,
  ProductListResponse,
  ProductStatsData,
} from "@/types/product.type";
import type { ErrorResponse, Pagination } from "@/types/response.type";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { formatDistanceToNow } from "date-fns";

type UseInventoryResult = {
  data: InternalInventory[];
  isLoading: boolean;
  isError: boolean;
  maxPage: number;
  totalCount: number;
  meta?: Pagination;
  refetch: () => void;
};

const normalizePlatform = (platform: string): "shopee" | "tiktok" =>
  platform.toLowerCase().includes("tiktok") ? "tiktok" : "shopee";

const normalizeStatus = (
  status: ProductListItem["status"],
): InternalInventoryStatusState => {
  if (status === "Out of stock") {
    return "Out of Stock";
  }

  return status as InternalInventoryStatusState;
};

const adaptExternalProductToInventory = (
  externalProduct: NonNullable<ProductListItem["external_products"]>[number],
): InternalInventoryExternalProduct => ({
  id: externalProduct.id,
  platform: normalizePlatform(externalProduct.platform),
  product_name: externalProduct.product_name,
  image: externalProduct.image_url ?? null,
  store_platform_name:
    externalProduct.store_platform_name || externalProduct.platform,
  price: externalProduct.price,
  created_at: externalProduct.created_at,
  updated_at: externalProduct.updated_at,
});

const adaptProductToInventory = (
  product: ProductListItem,
): InternalInventory => ({
  id: product.id,
  name: product.name,
  description: "",
  sku: product.sku,
  stock: product.stock,
  category: product.category
    ? { id: product.category.id, name: product.category.name }
    : null,
  imageUrl: resolveImageUrl(product.images?.[0]?.image_url),
  externalProducts: (product.external_products ?? []).map(
    adaptExternalProductToInventory,
  ),
  status: {
    state: normalizeStatus(product.status),
    lastUpdated: formatDistanceToNow(new Date(product.created_at), {
      addSuffix: false,
    }),
  },
});

const normalizeProductItems = (
  response: ProductListResponse | ErrorResponse | undefined,
): {
  isSuccess: boolean;
  items: ProductListItem[];
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

  const items: ProductListItem[] = Array.isArray(responseData)
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

export const useInventory = (
  search = "",
  page = 1,
  perPage = 10,
): UseInventoryResult => {
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["products", search, page, perPage],
    queryFn: () => getProducts(search, page, perPage),
  });

  const normalized = normalizeProductItems(data);
  const mappedData = normalized.items.map(adaptProductToInventory);
  const hasResponse = data !== undefined;

  return {
    data: mappedData,
    isLoading,
    isError: isError || (hasResponse && !normalized.isSuccess),
    maxPage: normalized.pagination?.max_page ?? 1,
    totalCount: normalized.pagination?.count ?? mappedData.length,
    meta: normalized.pagination ?? undefined,
    refetch,
  };
};

export function useProductStats() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["product-stats"],
    queryFn: getProductStats,
  });

  const stats: ProductStatsData =
    data?.status === true
      ? data.data
      : {
          total_products: 0,
          total_skus: 0,
          stock_units: 0,
          low_stock: 0,
          out_of_stock: 0,
          unsynced: 0,
        };

  return { stats, isLoading, isError };
}

export const useUploadProductImage = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: File[]) => uploadProductImages(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },

    onError: (error: unknown) => {
      toast.error(
        (error as ErrorResponse)?.error || "Gagal mengupload gambar produk",
      );
    },
  });
};
