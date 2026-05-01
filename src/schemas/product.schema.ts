import { z } from "zod";

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
    .int("Stok harus berupa bilangan bulat")
    .min(0, "Stok tidak boleh negatif"),
  image_id: z.uuid("Image ID tidak valid"),
  category_id: z.string().uuid("Category ID tidak valid").optional().nullable(),
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

export const productMutateSchema = z.object({
  name: z.string().trim().min(1, "Product name is required"),
  sku: z.string().trim().min(1, "SKU is required"),
  stock: z.number().min(0, "Stock cannot be negative"),
  category_id: z.uuid().optional().nullable(),
  description: z.string().optional(),
  files: z
    .instanceof(File)
    .refine((file) => file.size < 100 * 1024, {
      message: "File size must be less than 100KB",
    })
    .refine((file) => ["image/jpeg", "image/png"].includes(file.type), {
      message: "Only JPG and PNG files are allowed",
    })
    .optional(),
});

export const createProductPayload = createProductSchema;
export const updateProductPayload = updateProductSchema;

export type CreateProductFormValues = z.infer<typeof createProductSchema>;
export type UpdateProductFormValues = z.infer<typeof updateProductSchema>;
export type UpdateStockFormValues = z.infer<typeof updateStockSchema>;

export type CreateProductPayloadValues = z.infer<typeof createProductPayload>;
export type UpdateProductPayloadValues = z.infer<typeof updateProductPayload>;

export type ProductMutateValues = z.infer<typeof productMutateSchema>;
