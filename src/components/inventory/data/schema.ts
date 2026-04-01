import { z } from "zod";

export const externalProductSchema = z.object({
  id: z.uuid(),
  platform: z.enum(["tiktok", "shopee"]),
  externalProductId: z.string(),
  externalModelId: z.string().nullable(),
  price: z.number(),
});

export const inventoryMappingSchema = z.object({
  id: z.uuid(),
  name: z.string(),
  description: z.string(),
  sku: z.string(),
  stock: z.number(),
  category: z
    .object({
      id: z.uuid(),
      name: z.string(),
    })
    .nullable(),
  imageUrl: z.string().nullable(),
  externalProducts: z.array(externalProductSchema),
  status: z.object({
    state: z.enum(["Mapped", "Low Stock", "Unmapped", "Out of Stock"]),
    lastUpdated: z.string(),
  }),
});

export type ExternalProduct = z.infer<typeof externalProductSchema>;
export type Inventory = z.infer<typeof inventoryMappingSchema>;
