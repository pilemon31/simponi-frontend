import type { DisplayMutateValues } from "@/schemas/external-product.schema";
import {
  createExternalProduct,
  deleteExternalProduct,
  getExternalProductByID,
  updateExternalProduct,
} from "@/services/external-product.service";
import type {
  DisplayExternalProduct,
  ExternalProductItem,
} from "@/types/external-product.type";
import type { ErrorResponse } from "@/types/response.type";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

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

export const STORE_PLATFORM_OPTIONS = [
  { id: "c1b2c3d4-0008-4000-8000-000000000001", label: "Shopee" },
  { id: "c1b2c3d4-0008-4000-8000-000000000002", label: "TikTok" },
];

const getErrorMessage = (error: unknown, fallback: string) => {
  if (error instanceof Error) {
    return error.message;
  }

  return (error as ErrorResponse)?.error || fallback;
};

export function useDisplayManagement() {
  const queryClient = useQueryClient();

  const mutateSuccess = async (message: string) => {
    await queryClient.invalidateQueries({ queryKey: ["external-products"] });
    toast.success(message);
  };

  const createMutation = useMutation({
    mutationFn: async (payload: DisplayMutateValues) => {
      const response = await createExternalProduct({
        product_id: payload.productId,
        store_platform_id: payload.storePlatformId,
        price: payload.price,
      });

      if (response.status !== true) {
        throw new Error(response.message || "Failed to create listing");
      }

      return response;
    },
    onSuccess: async () => {
      await mutateSuccess("Listing created");
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, "Failed to create listing"));
    },
  });

  const updateMutation = useMutation({
    mutationFn: async (payload: { id: string; price: number }) => {
      const response = await updateExternalProduct(payload.id, {
        price: payload.price,
      });

      if (response.status !== true) {
        throw new Error(response.message || "Failed to update listing");
      }

      return response;
    },
    onSuccess: async () => {
      await mutateSuccess("Listing updated");
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, "Failed to update listing"));
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const response = await deleteExternalProduct(id);

      if (response.status !== true) {
        throw new Error(response.message || "Failed to delete listing");
      }

      return response;
    },
    onSuccess: async () => {
      await mutateSuccess("Listing deleted");
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, "Failed to delete listing"));
    },
  });

  const createDisplayProduct = async (values: DisplayMutateValues) => {
    await createMutation.mutateAsync(values);
    return true;
  };

  const updateDisplayProduct = async (
    row: DisplayExternalProduct,
    values: DisplayMutateValues,
  ) => {
    await updateMutation.mutateAsync({
      id: row.id,
      price: values.price,
    });

    return true;
  };

  const deleteDisplayProduct = async (row: DisplayExternalProduct) => {
    await deleteMutation.mutateAsync(row.id);
  };

  const getDisplayForEdit = async (
    item: DisplayExternalProduct,
  ): Promise<DisplayExternalProduct> => {
    const detailResponse = await getExternalProductByID(item.id);

    if (detailResponse.status !== true) {
      return item;
    }

    return adaptExternalProductToDisplay(detailResponse.data);
  };

  return {
    isMutating: createMutation.isPending || updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
    createDisplayProduct,
    updateDisplayProduct,
    deleteDisplayProduct,
    getDisplayForEdit,
  };
}
