import { z } from "zod";

export const uploadImageSchema = z.object({
  files: z.array(
    z
      .instanceof(File)
      .refine((file) => file.size < 100 * 1024, {
        message: "File size must be less than 100KB",
      })
      .refine((file) => ["image/jpeg", "image/png"].includes(file.type), {
        message: "Only JPG and PNG files are allowed",
      }),
  ),
});

export type UploadImageFormValues = z.infer<typeof uploadImageSchema>;
