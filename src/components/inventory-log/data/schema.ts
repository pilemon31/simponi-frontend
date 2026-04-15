import z from 'zod';

export const InventoryLogSchema = z.object({
  id: z.string(),
  product: z.string(),
  source: z.string(),
  change: z.number().min(-100).max(100),
  note: z.string().max(200),
  timestamp: z.date(),
});

export type InventoryLog = z.infer<typeof InventoryLogSchema>;
