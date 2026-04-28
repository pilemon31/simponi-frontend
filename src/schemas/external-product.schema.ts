import { z } from "zod";

export const externalProductSchema = z.object({
  id: z.string(),
  image_url: z.string().nullish(),
  product_name: z.string(),
  platform: z.enum(["tiktok", "shopee"]),
  store_platform_name: z.string(),
  price: z.number(),
  created_at: z.string(),
  updated_at: z.string(),
});

export const externalProductFormSchema = z.object({
  product_id: z.string().min(1, "Product is required"),
  store_platform_id: z.string().min(1, "Store platform is required"),
  price: z.number().min(0, "Price cannot be negative"),
});

export const displayMutateSchema = z.object({
  productId: z.string().trim().min(1, "Product is required"),
  storePlatformId: z.string().trim().min(1, "Store platform is required"),
  price: z.number().min(0, "Price cannot be negative"),
});

export const createExternalProductPayload = z.object({
  product_id: z.string(),
  store_platform_id: z.string(),
  price: z.number(),
});

export const updateExternalProductPayload = z.object({
  price: z.number(),
});

export type ExternalProduct = z.infer<typeof externalProductSchema>;

export type ExternalProductFormValues = z.infer<
  typeof externalProductFormSchema
>;

export type DisplayMutateValues = z.infer<typeof displayMutateSchema>;

export type CreateExternalProductPayloadValues = z.infer<
  typeof createExternalProductPayload
>;

export type UpdateExternalProductPayloadValues = z.infer<
  typeof updateExternalProductPayload
>;
