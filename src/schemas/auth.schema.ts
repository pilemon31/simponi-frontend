import { z } from 'zod';

export const signInSchema = z.object({
  email: z.email({
    error: (iss) => (iss.input === '' ? 'Masukkan alamat email' : undefined),
  }),
  password: z
    .string()
    .min(1, 'Masukkan password')
    .min(7, 'Password minimal 7 karakter'),
});
