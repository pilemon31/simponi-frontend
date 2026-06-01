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

export const signUpSchema = signInSchema
  .extend({
    name: z.string().min(1, 'Masukkan nama lengkap'),
    confirmPassword: z
      .string()
      .min(1, 'Masukkan konfirmasi password')
      .min(7, 'Password minimal 7 karakter'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ['confirmPassword'],
    message: 'Konfirmasi password tidak sama',
  });
