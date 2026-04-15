import type { ProductCategoryData } from './product.type';
import type { SuccessResponse } from './response.type';

interface InventoryLogListResponse {
  id: string;
  product: {
    id: string;
    name: string;
    description: string;
    sku: string;
    stock: number;
    category: ProductCategoryData;
    created_at: string;
    updated_at: string;
  };
  change: number;
  source: string;
  note: string;
  created_at: string;
}

export type GetALlInventoryLogResponse = SuccessResponse<
  InventoryLogListResponse[]
>;
