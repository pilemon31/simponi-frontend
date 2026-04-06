import z from "zod";

export const createProductSchema = z.object({
  name: z
    .string()
    .min(1, "Masukkan nama produk")
    .min(3, "Nama produk minimal 3 karakter"),
  description: z.string().optional(),
  sku: z
    .string()
    .min(1, "Masukkan SKU produk")
    .regex(/^[A-Z0-9-]+$/, "SKU hanya boleh huruf kapital, angka, dan tanda -"),
  stock: z
    .number({ error: () => "Masukkan jumlah stok" })
    .int("Stok harus beruppa bilangan bulat")
    .min(0, "Stok tidak boleh negatif"),
  image_id: z.uuid("Image ID tidak valid"),
  category_id: z.uuid("Category ID tidak valid").optional().nullable(),
});

export const updateProductSchema = z.object({
  name: z.string().min(3, "Nama produk minimal 3 karakter").optional(),
  description: z.string().optional(),
  sku: z
    .string()
    .regex(/^[A-Z0-9-]+$/, "SKU hanya boleh huruf kapital, angka, dan tanda -")
    .optional(),
  stock: z
    .number()
    .int("Stok harus berupa bilangan bulat")
    .min(0, "Stok tidak boleh negatif")
    .optional(),
  category_id: z.uuid("Category ID tidak valid").optional().nullable(),
});

export const updateStockSchema = z.object({
  change: z
    .number({ error: () => "Masukkan jumlah perubahan stok" })
    .int("Perubahan stok harus berupa bilangan bulat")
    .refine((val) => val !== 0, "Perubahan stok tidak boleh 0"),
  source: z.enum(["shopee", "tiktok", "manual"], {
    error: () => "Source harus shopee, tiktok, atau manual",
  }),
  note: z.string().optional(),
});
