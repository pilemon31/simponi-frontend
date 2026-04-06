import type { Pagination, SuccessResponse } from "./response.type";

export type ExternalProductItem = {
  id: string;
  image_url?: string;
  image?: string;
  product_name: string;
  platform: string;
  price: number;
  created_at: string;
  updated_at: string;
};

export type ExternalProductListResponse = SuccessResponse<{
  data: ExternalProductItem[];
  pagination: Pagination;
}>;

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
