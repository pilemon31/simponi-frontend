import type { Pagination, SuccessResponse } from "./response.type";

export type DisplayPlatform = "shopee" | "tiktok";

export type DisplayExternalProduct = {
  id: string;
  image: string | null;
  product_name: string;
  platform: DisplayPlatform;
  store_platform_name: string;
  price: number;
  created_at: string;
  updated_at: string;
};

export type ExternalProductItem = {
  id: string;
  image?: string;
  product_name: string;
  platform: string;
  store_platform_name?: string;
  price: number;
  created_at: string;
  updated_at: string;
};

export type ExternalProductListResponse =
  | SuccessResponse<{
      data: ExternalProductItem[];
      pagination: Pagination;
    }>
  | SuccessResponse<ExternalProductItem[]>;

export type ExternalProductDetailResponse =
  SuccessResponse<ExternalProductItem>;

export type CreateExternalProductRequest = {
  product_id: string;
  store_platform_id: string;
  price: number;
};

export type UpdateExternalProductRequest = {
  price: number;
};
