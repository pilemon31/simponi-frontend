import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useActiveShopId } from "@/lib/shop";
import { ExternalProductApi } from "@/services/external-product.service";
import { toast } from "sonner";

import type { ErrorResponse, Pagination } from "@/types/response.type";
import type {
  ExternalProductItem,
  ExternalProductListResponse,
  ExternalProductDetailResponse,
} from "@/types/external-product.type";
import type {
  CreateExternalProductPayloadValues,
  UpdateExternalProductPayloadValues,
} from "@/schemas/external-product.schema";

const normalizePlatform = (platform: string): "shopee" | "tiktok" | string =>
  platform.toLowerCase().includes("tiktok") ? "tiktok" : "shopee";

export const adaptExternalProductToDisplay = (
  externalProduct: ExternalProductItem,
): ExternalProductItem => ({
  id: externalProduct.id,
  image: externalProduct.image ?? "",
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
    : responseData && Array.isArray((responseData as any).data)
      ? (responseData as any).data
      : [];

  const pagination: Pagination | null = Array.isArray(responseData)
    ? ((response as any).meta ?? null)
    : ((responseData as any)?.pagination ?? (response as any).meta ?? null);

  return {
    isSuccess: true,
    items,
    pagination,
  };
};

export const STORE_PLATFORM_OPTIONS = [
  { id: "c1b2c3d4-0008-4000-8000-000000000001", label: "Shopee" },
  { id: "c1b2c3d4-0008-4000-8000-000000000002", label: "TikTok" },
];

export const useExternalProducts = (search = "", page = 1, perPage = 10) => {
  const activeShopId = useActiveShopId();

  const query = useQuery({
    queryKey: ["external-products", activeShopId, search, page, perPage],
    queryFn: () => ExternalProductApi.getAll(search, page, perPage),
  });

  const normalized = normalizeExternalProductItems(
    query.data as ExternalProductListResponse | ErrorResponse,
  );
  const normalizedExternalProducts = normalized.items.map(
    adaptExternalProductToDisplay,
  );
  const hasResponse = query.data !== undefined;

  return {
    ...query,
    data: normalizedExternalProducts,
    isError: query.isError || (hasResponse && !normalized.isSuccess),
    maxPage: normalized.pagination?.max_page ?? 1,
    totalCount:
      normalized.pagination?.count ?? normalizedExternalProducts.length,
    meta: normalized.pagination ?? undefined,
  };
};

export const useExternalProductDetail = () => {
  const activeShopId = useActiveShopId();

  return useMutation({
    mutationKey: ["external-product-detail", activeShopId],
    mutationFn: async (id: string) => {
      const response = await ExternalProductApi.getById(id);

      if (!response.status) {
        throw response;
      }

      return adaptExternalProductToDisplay(
        (response as ExternalProductDetailResponse).data,
      );
    },
  });
};

export const useCreateExternalProduct = () => {
  const queryClient = useQueryClient();

  return useMutation<
    ExternalProductDetailResponse,
    ErrorResponse,
    CreateExternalProductPayloadValues
  >({
    mutationFn: async (payload) => {
      const response = await ExternalProductApi.create({
        product_id: payload.product_id,
        platform_id: payload.platform_id,
        price: payload.price,
      });

      if (!response.status) {
        throw response;
      }

      return response as ExternalProductDetailResponse;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["external-products"] });
      toast.success("Listing created successfully");
    },
    onError: (error: ErrorResponse) => {
      toast.error(error?.error || error?.message || "Failed to create listing");
    },
  });
};

export const useUpdateExternalProduct = () => {
  const queryClient = useQueryClient();

  return useMutation<
    ExternalProductDetailResponse,
    ErrorResponse,
    { id: string; payload: UpdateExternalProductPayloadValues }
  >({
    mutationFn: async ({ id, payload }) => {
      const response = await ExternalProductApi.update(id, {
        price: payload.price,
      });

      if (!response.status) {
        throw response;
      }

      return response as ExternalProductDetailResponse;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["external-products"] });
      toast.success("Listing updated successfully");
    },
    onError: (error: ErrorResponse) => {
      toast.error(error?.error || error?.message || "Failed to update listing");
    },
  });
};

export const useDeleteExternalProduct = () => {
  const queryClient = useQueryClient();

  return useMutation<
    { status: boolean; message: string },
    ErrorResponse,
    string
  >({
    mutationFn: async (id: string) => {
      const response = await ExternalProductApi.delete(id);

      if (!response.status) {
        throw response;
      }

      return response as { status: true; message: string };
    },
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ["external-products"] });
      toast.success(response.message || "Listing deleted successfully");
    },
    onError: (error: ErrorResponse) => {
      toast.error(error?.error || error?.message || "Failed to delete listing");
    },
  });
};
