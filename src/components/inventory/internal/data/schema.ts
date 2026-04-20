import { z } from "zod";
import { externalProductSchema } from "../../display/data/schema";

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

export const createProductSchema = z.object({
  name: z.string().min(1, "Product name is required"),
  sku: z.string().min(1, "SKU is required"),
  stock: z.number().min(0, "Stock cannot be negative"),
  categoryId: z.string().optional(),
  description: z.string().optional(),
});

export type Inventory = z.infer<typeof inventoryMappingSchema>;
export type CreateProductFormValues = z.infer<typeof createProductSchema>;
