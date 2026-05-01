import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ProductApi } from "@/services/product.service";
import { uploadProductImages } from "@/services/upload.service";
import type { ErrorResponse } from "@/types/response.type";
import { toast } from "sonner";
import type {
  ProductCategoryResponse,
  ProductResponse,
} from "@/types/product.type";
import type { ProductMutateValues } from "@/schemas/product.schema";

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

type CreateProductPayload = ProductMutateValues & {
  imageFile: File;
};

type UpdateProductPayload = ProductMutateValues & {
  id: string;
};

export const useProducts = (search = "", page = 1, perPage = 10) => {
  return useQuery({
    queryKey: ["products", search, page, perPage],
    queryFn: () => ProductApi.getAll(search, page, perPage),
  });
};

export const useProductCategories = () => {
  return useQuery<ProductCategoryResponse>({
    queryKey: ["product-categories"],
    queryFn: ProductApi.getProductCategory,
  });
};

export const useProductStats = () => {
  return useQuery({
    queryKey: ["product-stats"],
    queryFn: ProductApi.getStats,
  });
};

export const useProductDetail = () => {
  return useMutation({
    mutationFn: (id: string) => ProductApi.getById(id),
  });
};

export const useCreateProduct = () => {
  const queryClient = useQueryClient();

  return useMutation<ProductResponse, ErrorResponse, CreateProductPayload>({
    mutationFn: async (payload: CreateProductPayload) => {
      if (!payload.imageFile) {
        throw {
          status: false,
          error: "Product image is required",
        } as ErrorResponse;
      }

      const uploadRes = await uploadProductImages([payload.imageFile]);

      if (!uploadRes.status) {
        throw uploadRes;
      }

      const imageId = uploadRes.data;

      if (!imageId) {
        throw {
          status: false,
          error: "Upload succeeded but image ID is missing",
        } as ErrorResponse;
      }

      const images = [imageId];

      const response = await ProductApi.create({
        name: payload.name,
        sku: payload.sku,
        stock: payload.stock,
        images,
        category_id: payload.category_id || null,
        description: payload.description,
      });

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

  return useMutation<ProductResponse, ErrorResponse, UpdateProductPayload>({
    mutationFn: async (payload: UpdateProductPayload) => {
      const { id, ...data } = payload;
      const response = await ProductApi.update(id, data);

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
    mutationFn: (files: File[]) => uploadProductImages(files),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },

    onError: (error: ErrorResponse) => {
      toast.error(error?.error || "Failed to upload image");
    },
  });
};
