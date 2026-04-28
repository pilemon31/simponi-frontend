import type {
  ExternalProductData,
  InternalInventory,
  ProductCategoryData,
} from "@/types/product.type";
import type { InternalInventoryMutateValues } from "@/schemas/product.schema";
import { resolveImageUrl } from "@/lib/media";
import {
  createProduct,
  deleteProduct,
  getProductByID,
  updateProduct,
} from "@/services/product.service";
import type { ErrorResponse } from "@/types/response.type";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useMemo } from "react";
import { toast } from "sonner";
import { useUpload } from "./use-upload";

const normalizePlatform = (platform: string): "shopee" | "tiktok" =>
  platform.toLowerCase().includes("tiktok") ? "tiktok" : "shopee";

const adaptExternalProductToInventory = (
  externalProduct: ExternalProductData,
) => ({
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

type CategoryOption = {
  id: string;
  name: string;
};

type InventoryMutateValues = InternalInventoryMutateValues & {
  imageFile?: File | null;
};

const INTERNAL_CATEGORIES: ProductCategoryData[] = [
  {
    id: "a1b2c3d4-0001-4000-8000-000000000001",
    name: "Electronics",
    created_at: "2024-01-01T00:00:00Z",
  },
  {
    id: "a1b2c3d4-0001-4000-8000-000000000002",
    name: "Fashion",
    created_at: "2024-01-01T00:00:00Z",
  },
  {
    id: "a1b2c3d4-0001-4000-8000-000000000003",
    name: "Health & Beauty",
    created_at: "2024-01-01T00:00:00Z",
  },
  {
    id: "a1b2c3d4-0001-4000-8000-000000000004",
    name: "Home & Living",
    created_at: "2024-01-01T00:00:00Z",
  },
];

const getErrorMessage = (error: unknown, fallback: string) => {
  if (error instanceof Error) {
    return error.message;
  }

  return (error as ErrorResponse)?.error || fallback;
};

const uniqueCategories = (categories: CategoryOption[]): CategoryOption[] => {
  return categories.filter(
    (category, index, list) =>
      index === list.findIndex((item) => item.id === category.id),
  );
};

export function useInventoryManagement(inventoryItems: InternalInventory[]) {
  const queryClient = useQueryClient();
  const { uploadAsync, isPending: isUploading } = useUpload();

  const categories = useMemo(() => {
    const categoriesFromProducts = inventoryItems
      .map((product) => product.category)
      .filter((category): category is NonNullable<typeof category> =>
        Boolean(category),
      )
      .map((category) => ({
        id: category.id,
        name: category.name,
      }));

    const defaultCategories = INTERNAL_CATEGORIES.map((category) => ({
      id: category.id,
      name: category.name,
    }));

    return uniqueCategories([...categoriesFromProducts, ...defaultCategories]);
  }, [inventoryItems]);

  const invalidateInventoryQueries = async () => {
    await queryClient.invalidateQueries({ queryKey: ["products"] });
    await queryClient.invalidateQueries({ queryKey: ["product-stats"] });
  };

  const createMutation = useMutation({
    mutationFn: async (payload: {
      name: string;
      sku: string;
      stock: number;
      imageId: string;
      categoryId?: string;
      description?: string;
    }) => {
      const response = await createProduct({
        name: payload.name,
        sku: payload.sku,
        stock: payload.stock,
        image_id: payload.imageId,
        category_id: payload.categoryId || null,
        description: payload.description || undefined,
      });

      if (response.status !== true) {
        throw new Error(response.message || "Failed to create product");
      }

      return response;
    },
    onSuccess: async () => {
      await invalidateInventoryQueries();
      toast.success("Product created");
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, "Failed to create product"));
    },
  });

  const updateMutation = useMutation({
    mutationFn: async (payload: {
      id: string;
      name: string;
      sku: string;
      stock: number;
      categoryId?: string;
      description?: string;
    }) => {
      const response = await updateProduct(payload.id, {
        name: payload.name,
        sku: payload.sku,
        stock: payload.stock,
        category_id: payload.categoryId || null,
        description: payload.description || undefined,
      });

      if (response.status !== true) {
        throw new Error(response.message || "Failed to update product");
      }

      return response;
    },
    onSuccess: async () => {
      await invalidateInventoryQueries();
      toast.success("Product updated");
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, "Failed to update product"));
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (productId: string) => {
      const response = await deleteProduct(productId);

      if (response.status !== true) {
        throw new Error(response.message || "Failed to delete product");
      }

      return response;
    },
    onSuccess: async () => {
      await invalidateInventoryQueries();
      toast.success("Product deleted");
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, "Failed to delete product"));
    },
  });

  const createInventory = async (values: InventoryMutateValues) => {
    if (!values.imageFile) {
      toast.error("Product image is required for creating product");
      return false;
    }

    const uploadedImages = await uploadAsync([values.imageFile]);
    const firstImage = uploadedImages[0];

    if (!firstImage?.image_id) {
      toast.error("Upload succeeded but image ID is missing");
      return false;
    }

    await createMutation.mutateAsync({
      name: values.name,
      sku: values.sku,
      stock: values.stock,
      imageId: firstImage.image_id,
      categoryId: values.categoryId,
      description: values.description,
    });

    return true;
  };

  const updateInventory = async (
    row: InternalInventory,
    values: InventoryMutateValues,
  ) => {
    await updateMutation.mutateAsync({
      id: row.id,
      name: values.name,
      sku: values.sku,
      stock: values.stock,
      categoryId: values.categoryId,
      description: values.description,
    });

    return true;
  };

  const deleteInventory = async (row: InternalInventory) => {
    await deleteMutation.mutateAsync(row.id);
  };

  const getInventoryForEdit = async (
    item: InternalInventory,
  ): Promise<InternalInventory> => {
    const detailResponse = await getProductByID(item.id);

    if (detailResponse.status !== true) {
      return item;
    }

    const detail = detailResponse.data;

    return {
      ...item,
      name: detail.name,
      sku: detail.sku,
      stock: detail.stock,
      description: detail.description ?? "",
      category: detail.category
        ? {
            id: detail.category.id,
            name: detail.category.name,
          }
        : null,
      imageUrl: resolveImageUrl(detail.images?.[0]?.image_url),
      externalProducts: (detail.external_products ?? []).map(
        adaptExternalProductToInventory,
      ),
    };
  };

  return {
    categories,
    isMutating:
      createMutation.isPending || updateMutation.isPending || isUploading,
    isDeleting: deleteMutation.isPending,
    createInventory,
    updateInventory,
    deleteInventory,
    getInventoryForEdit,
  };
}
