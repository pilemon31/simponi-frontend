import type { SuccessResponse, Pagination } from "./response.type";

export interface ProductCategory {
  id: string;
  name: string;
  created_at: string;
}

export interface ProductImage {
  id: string;
  image_url: string;
}

export interface ExternalProduct {
  id: string;
  image_url: string;
  product_name: string;
  platform: string;
  store_platform_name: string;
  price: number;
  created_at: string;
  updated_at: string;
}

export interface Product {
  id: string;
  name: string;
  description: string | null;
  sku: string;
  stock: number;
  category: ProductCategory | null;
  images: ProductImage[];
  external_products: ExternalProduct[];
  created_at: string;
  updated_at: string;
}

export interface ProductListItem {
  id: string;
  name: string;
  sku: string;
  stock: number;
  category: ProductCategory | null;
  images?: ProductImage[];
  external_products?: ExternalProduct[];
  status: "Mapped" | "Unmapped" | "Low Stock" | "Out of Stock";
  created_at: string;
}

export interface ProductStats {
  total_products: number;
  total_skus: number;
  stock_units: number;
  low_stock: number;
  out_of_stock: number;
  unsynced: number;
}

export interface UploadImage {
  image_id: string;
  image_url: string;
}

export interface CreateProductPayload {
  name: string;
  description?: string;
  sku: string;
  stock: number;
  images: string[];
  category_id?: string | null;
}

export interface UpdateProductPayload {
  name?: string;
  description?: string;
  sku?: string;
  stock?: number;
  category_id?: string | null;
  images?: string[];
}

export interface UpdateStockPayload {
  change: number;
  source: "shopee" | "tiktok" | "manual";
  note?: string;
}

export type ProductResponse = SuccessResponse<Product>;

export type GetAllProductResponse = SuccessResponse<ProductListItem[]>;

export type GetAllProductWithPaginationResponse = SuccessResponse<{
  data: ProductListItem[];
  pagination: Pagination;
}>;

export type ProductCategoryResponse = SuccessResponse<ProductCategory[]>;

export type ProductStatsResponse = SuccessResponse<ProductStats>;

export type UploadImageResponse = SuccessResponse<UploadImage[]>;
