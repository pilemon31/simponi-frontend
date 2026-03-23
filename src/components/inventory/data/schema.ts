import { z } from "zod";

export const inventoryMappingSchema = z.object({
  id: z.string(),
  product: z.object({
    name: z.string(),
    category: z.string(),
    icon: z.enum(["Headphones", "Smartphone", "Laptop", "Box"]),
  }),
  internalSku: z.string(),
  platformSkus: z.object({
    tiktok: z.string().nullable(),
    shopee: z.string().nullable(),
  }),
  unifiedStock: z.object({
    total: z.number(),
    available: z.number().nullable(),
    isCriticalLow: z.boolean(),
  }),
  tiktokStock: z.number(),
  shopeeStock: z.number().nullable(),
  status: z.object({
    state: z.enum(["Synced", "Low Stock", "Unmapped"]),
    lastUpdated: z.string(),
  }),
});

export type Inventory = z.infer<typeof inventoryMappingSchema>;
