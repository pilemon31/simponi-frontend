import { uploadProductImages } from "@/services/upload.service";
import type { UploadImageData } from "@/types/product.type";
import { useMutation } from "@tanstack/react-query";

const isObject = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null;

const isUploadImageData = (value: unknown): value is UploadImageData => {
  return (
    isObject(value) &&
    typeof value.image_id === "string" &&
    typeof value.image_url === "string"
  );
};

const normalizeUploadPayload = (payload: unknown): UploadImageData[] => {
  if (Array.isArray(payload)) {
    return payload.filter(isUploadImageData);
  }

  if (!isObject(payload)) {
    return [];
  }

  if (isUploadImageData(payload)) {
    return [payload];
  }

  const candidates = [
    payload.images,
    payload.files,
    payload.items,
    payload.result,
  ];

  for (const candidate of candidates) {
    if (Array.isArray(candidate)) {
      const images = candidate.filter(isUploadImageData);
      if (images.length > 0) {
        return images;
      }
    }

    if (isUploadImageData(candidate)) {
      return [candidate];
    }
  }
  return [];
};

export function useUpload() {
  const mutation = useMutation({
    mutationFn: async (files: File[]) => {
      if (files.length === 0) {
        throw new Error("No files selected");
      }

      const response = await uploadProductImages(files);
      if (response.status !== true) {
        throw new Error(response.message || "Failed to upload image");
      }

      const images = normalizeUploadPayload(response.data);
      if (images.length === 0) {
        throw new Error("Upload succeeded but image ID is missing");
      }
      return images;
    },
  });

  return {
    upload: mutation.mutate,
    uploadAsync: mutation.mutateAsync,
    data: mutation.data,
    isPending: mutation.isPending,
    error: mutation.error,
    reset: mutation.reset,
  };
}
