import { adaptProductToInventory } from "@/components/inventory/internal/data/adapter";
import type { Inventory } from "@/components/inventory/internal/data/schema";
import { getProducts, getProductStats } from "@/services/product.service";
import { uploadProductImages } from "@/services/upload.service";
import type {
  ProductListItem,
  ProductListResponse,
  ProductStatsData,
} from "@/types/product.type";
import type { ErrorResponse, Pagination } from "@/types/response.type";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

type UseInventoryResult = {
  data: Inventory[];
  isLoading: boolean;
  isError: boolean;
  maxPage: number;
  totalCount: number;
  refetch: () => void;
};

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

export const useInventory = (search = ""): UseInventoryResult => {
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["products", search],
    queryFn: () => getProducts(search),
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
