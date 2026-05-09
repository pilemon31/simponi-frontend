import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useActiveShopId } from "@/lib/shop";
import { ProductApi } from "@/services/product.service";
import { uploadProductImages } from "@/services/upload.service";
import type { ErrorResponse } from "@/types/response.type";
import { toast } from "sonner";
import type {
  CreateProductPayload,
  ProductCategoryResponse,
  ProductResponse,
  UpdateProductPayload,
} from "@/types/product.type";

type UploadImageLike = {
  image_id?: string;
};

const isObject = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null;

const findImageId = (value: unknown): string | null => {
  if (Array.isArray(value)) {
    for (const item of value) {
      if (isObject(item) && typeof item.image_id === "string") {
        return item.image_id;
      }
    }
    return null;
  }

  if (isObject(value)) {
    const candidate = value as UploadImageLike;
    if (typeof candidate.image_id === "string") {
      return candidate.image_id;
    }

    const nestedCandidates = [
      value.images,
      value.files,
      value.items,
      value.result,
      value.data,
    ];

    for (const nested of nestedCandidates) {
      const id = findImageId(nested);
      if (id) return id;
    }
  }

  return null;
};

export const useProducts = (search = "", page = 1, perPage = 10) => {
  const activeShopId = useActiveShopId();

  return useQuery({
    queryKey: ["products", activeShopId, search, page, perPage],
    queryFn: () => ProductApi.getAll(search, page, perPage),
  });
};

export const useProductCategories = () => {
  const activeShopId = useActiveShopId();

  return useQuery<ProductCategoryResponse>({
    queryKey: ["product-categories", activeShopId],
    queryFn: ProductApi.getProductCategory,
  });
};

export const useProductStats = () => {
  const activeShopId = useActiveShopId();

  return useQuery({
    queryKey: ["product-stats", activeShopId],
    queryFn: ProductApi.getStats,
  });
};

export const useProductDetail = () => {
  const activeShopId = useActiveShopId();

  return useMutation({
    mutationKey: ["product-detail", activeShopId],
    mutationFn: (id: string) => ProductApi.getById(id),
  });
};

export const useCreateProduct = () => {
  const queryClient = useQueryClient();

  return useMutation<ProductResponse, ErrorResponse, CreateProductPayload>({
    mutationFn: async (payload: CreateProductPayload) => {
      const response = await ProductApi.create(payload);

      if (!response.status) {
        throw response;
      }

      return response;
    },

    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      toast.success(response.message);
    },

    onError: (error: ErrorResponse) => {
      toast.error(error?.error || "Failed to create product");
    },
  });
};

export const useUpdateProduct = () => {
  const queryClient = useQueryClient();

  return useMutation<
    ProductResponse,
    ErrorResponse,
    UpdateProductPayload & { id: string }
  >({
    mutationFn: async ({ id, ...payload }) => {
      const response = await ProductApi.update(id, payload);

      if (!response.status) {
        throw response;
      }

      return response;
    },

    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      toast.success(response.message);
    },

    onError: (error: ErrorResponse) => {
      toast.error(error?.error || "Failed to update product");
    },
  });
};

export const useDeleteProduct = () => {
  const queryClient = useQueryClient();

  return useMutation<ProductResponse, ErrorResponse, string>({
    mutationFn: async (id: string) => {
      const response = await ProductApi.delete(id);

      if (!response.status) {
        throw response;
      }

      return response;
    },

    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      toast.success(response.message);
    },

    onError: (error: ErrorResponse) => {
      toast.error(error?.error || "Failed to delete product");
    },
  });
};

export const useUploadProductImage = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (files: File[]) => uploadProductImages({ files: files }),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },

    onError: (error: ErrorResponse) => {
      toast.error(error?.error || "Failed to upload image");
    },
  });
};
