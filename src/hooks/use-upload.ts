import { uploadProductImages } from '@/services/upload.service';
import { type UploadImage } from '@/types/product.type';
import { useMutation } from '@tanstack/react-query';

const isObject = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null;

const toUploadImageData = (value: unknown): UploadImage | null => {
  if (!isObject(value) || typeof value.image_url !== 'string') {
    return null;
  }

  const imageUrl = value.image_url;
  const imageId =
    typeof value.image_id === 'string' && value.image_id.length > 0
      ? value.image_id
      : imageUrl;

  return {
    image_id: imageId,
    image_url: imageUrl,
  };
};

const normalizeUploadPayload = (payload: unknown): UploadImage[] => {
  if (Array.isArray(payload)) {
    return payload
      .map((item) => toUploadImageData(item))
      .filter((item): item is UploadImage => item !== null);
  }

  if (!isObject(payload)) {
    return [];
  }

  const payloadImage = toUploadImageData(payload);
  if (payloadImage) {
    return [payloadImage];
  }

  const candidates = [
    payload.images,
    payload.files,
    payload.items,
    payload.result,
  ];

  for (const candidate of candidates) {
    if (Array.isArray(candidate)) {
      const images = candidate
        .map((item) => toUploadImageData(item))
        .filter((item): item is UploadImage => item !== null);
      if (images.length > 0) {
        return images;
      }
    }

    const candidateImage = toUploadImageData(candidate);
    if (candidateImage) {
      return [candidateImage];
    }
  }
  return [];
};

export function useUpload() {
  const mutation = useMutation({
    mutationFn: async (files: File[]) => {
      if (files.length === 0) {
        throw new Error('No files selected');
      }

      const response = await uploadProductImages({
        files: files,
      });
      if (response.status !== true) {
        throw new Error(response.message || 'Failed to upload image');
      }

      const images = normalizeUploadPayload(response.data);
      if (images.length === 0) {
        throw new Error('Upload succeeded but image URL is missing');
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
