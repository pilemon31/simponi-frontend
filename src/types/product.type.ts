import type { Pagination, SuccessResponse } from "./response.type";

export type ProductCategoryData = {
  id: string;
  name: string;
  created_at: string;
};

export type ProductImageData = {
  id: string;
  image_url: string;
};

export type ExternalProductData = {
  id: string;
  product_id: string | null;
  store_id: string | null;
  external_product_id: string;
  external_model_id: string;
  price: number;
};

export type ProductStatus =
  | "Mapped"
  | "Unmapped"
  | "Low Stock"
  | "Out of Stock";

export type ProductData = {
  id: string;
  name: string;
  description: string;
  sku: string;
  stock: number;
  category: ProductCategoryData | null;
  images: ProductImageData[];
  external_products: ExternalProductData[];
  created_at: string;
  updated_at: string;
};

export type ProductListItem = {
  id: string;
  name: string;
  sku: string;
  stock: number;
  category: ProductCategoryData | null;
  images: ProductImageData[];
  external_products: ExternalProductData[];
  status: ProductStatus;
  created_at: string;
};

export type ProductListResponse = SuccessResponse<{
  data: ProductListItem[];
  pagination: Pagination;
}>;

export type ProductDetailResponse = SuccessResponse<ProductData>;

export type CreateProductRequest = {
  name: string;
  description?: string;
  sku: string;
  stock: number;
  category_id?: string | null;
};

export type UpdateProductRequest = {
  name?: string;
  description?: string;
  sku?: string;
  stock?: number;
  category_id?: string | null;
};

export type UpdateStockRequest = {
  change: number;
  source: number;
  note?: string;
};
