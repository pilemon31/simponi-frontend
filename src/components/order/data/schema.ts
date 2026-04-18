import { z } from "zod";

export const orderMappingSchema = z.object({
  id: z.uuid(),
  orderNumber: z.string(),
  buyerName: z.string(),
  platform: z.string(),
  buyerPhone: z.string(),
  buyerEmail: z.string(),
  orderStatus: z.string(),
  paymentStatus: z.string(),
  paymentMethod: z.string(),
  stock: z.number(),
  category: z
    .object({
      id: z.uuid(),
      name: z.string(),
    })
    .nullable(),
  imageUrl: z.string().nullable(),
  status: z.object({
    state: z.enum(["Mapped", "Low Stock", "Unmapped", "Out of Stock"]),
    lastUpdated: z.string(),
  }),
});

export type Order = z.infer<typeof orderMappingSchema>;
