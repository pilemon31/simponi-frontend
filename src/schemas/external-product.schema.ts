import { z } from "zod";

export const externalProductSchema = z.object({
  id: z.uuid(),
  image: z.string(),
  product_name: z.string(),
  platform: z.string(),
  store_platform_name: z.string(),
  price: z.number(),
  created_at: z.string(),
  updated_at: z.string(),
});

export const createExternalProductFormSchema = z.object({
  product_id: z
    .uuid("Product ID tidak valid")
    .min(1, "Pilih produk terlebih dahulu"),
  platform_id: z
    .uuid("Platform ID tidak valid")
    .min(1, "Pilih platform terlebih dahulu"),
  price: z
    .number({ error: () => "Masukkan harga produk" })
    .int("Harga harus berupa bilangan bulat")
    .min(0, "Harga tidak boleh negatif"),
});

export const updateExternalProductFormSchema = z.object({
  price: z
    .number({ error: () => "Masukkan harga produk" })
    .int("Harga harus berupa bilangan bulat")
    .min(0, "Harga tidak boleh negatif"),
});

export const createExternalProductPayload = createExternalProductFormSchema;
export const updateExternalProductPayload = updateExternalProductFormSchema;

export type ExternalProduct = z.infer<typeof externalProductSchema>;

export type CreateExternalProductFormValues = z.infer<
  typeof createExternalProductFormSchema
>;

export type UpdateExternalProductFormValues = z.infer<
  typeof updateExternalProductFormSchema
>;

export type CreateExternalProductPayloadValues = z.infer<
  typeof createExternalProductPayload
>;
export type UpdateExternalProductPayloadValues = z.infer<
  typeof updateExternalProductPayload
>;
