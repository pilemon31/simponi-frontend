import { z } from 'zod';

export const storeFormSchema = z.object({
  name: z.string().trim().min(3, 'Nama minimal 3 karakter').max(100),
  description: z.string().trim().optional(),
  image_url: z.string().optional(),
  is_active: z.boolean(),
});

export type StoreFormValues = z.infer<typeof storeFormSchema>;
