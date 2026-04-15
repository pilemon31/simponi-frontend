import { z } from 'zod';

export const userSchema = z.object({
  email: z.string().email(),
  name: z.string().min(2).max(100),
  image_url: z.string().url().optional(),
  role_name: z.enum(['Client', 'Admin', 'Super Admin']),
  status: z.enum(['active', 'inactive']),
});

export type User = z.infer<typeof userSchema>;
