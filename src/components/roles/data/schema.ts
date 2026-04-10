import { z } from 'zod';

export const roleSchema = z.object({
  id: z.string(),
  name: z.string(),
  permissions: z.any(),
});

export type Role = z.infer<typeof roleSchema>;
