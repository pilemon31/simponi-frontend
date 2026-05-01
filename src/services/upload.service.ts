import axiosConfig from "@/lib/axios";
import type { UploadImageFormValues } from "@/schemas/upload.schema";
import type { UploadImageResponse } from "@/types/product.type";
import type { ErrorResponse } from "@/types/response.type";
import axios, { AxiosError } from "axios";

export const uploadProductImages = async (
  files: UploadImageFormValues,
): Promise<UploadImageResponse | ErrorResponse> => {
  try {
    const formData = new FormData();

    files.files.forEach((file) => {
      formData.append("files", file);
    });

    const response = await axiosConfig.post("/uploads/", formData);

    return response.data as UploadImageResponse;
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response) {
      return (error as AxiosError).response?.data as ErrorResponse;
    }

    return {
      status: false,
      message: "An unexpected error occured",
      timestamp: new Date().toISOString(),
      error: "Unknown error",
    } as ErrorResponse;
  }
};
