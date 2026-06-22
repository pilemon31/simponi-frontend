import type { SuccessResponse } from "./response.type";

export interface ProductReview {
  id: string;
  product_id: string;
  product_name: string;
  product_sku: string;
  review_text: string;
  tags: string[];
  created_at: string;
  updated_at: string;
}

export type GetProductReviewsResponse = SuccessResponse<ProductReview[]>;
