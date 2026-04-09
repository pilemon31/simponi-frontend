import { z } from 'zod';

export const roleSchema = z.object({
  name: z.string(),
  permissions: z.any(),
});

export type Role = z.infer<typeof roleSchema>;
