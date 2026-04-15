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

export type Inventory = z.infer<typeof inventoryMappingSchema>;
