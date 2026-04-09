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
  image_url: string;
  product_name: string;
  platform: string;
  price: number;
  created_at: string;
  updated_at: string;
};

export type ProductStatus =
  | "Mapped"
  | "Unmapped"
  | "Low Stock"
  | "Out of Stock"
  | "Out of stock";

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
  images?: ProductImageData[];
  external_products?: ExternalProductData[];
  status: ProductStatus;
  created_at: string;
};

export type ProductListResponse =
  | SuccessResponse<{
      data: ProductListItem[];
      pagination: Pagination;
    }>
  | SuccessResponse<ProductListItem[]>;

export type ProductDetailResponse = SuccessResponse<ProductData>;

export type ProductStatsData = {
  total_products: number;
  total_skus: number;
  stock_units: number;
  low_stock: number;
  out_of_stock: number;
  unsynced: number;
};

export type ProductStatsResponse = SuccessResponse<ProductStatsData>;

export type CreateProductRequest = {
  name: string;
  description?: string;
  sku: string;
  stock: number;
  image_id: string;
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
  source: "shopee" | "tiktok" | "manual";
  note?: string;
};
