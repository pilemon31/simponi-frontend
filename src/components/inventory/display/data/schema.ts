import { z } from "zod";

export const externalProductSchema = z.object({
  id: z.uuid(),
  image: z.string().optional(),
  product_name: z.string(),
  platform: z.enum(["tiktok", "shopee"]),
  store_platform_name: z.string(),
  price: z.number(),
  created_at: z.string(),
  updated_at: z.string(),
});

export type ExternalProduct = z.infer<typeof externalProductSchema>;
