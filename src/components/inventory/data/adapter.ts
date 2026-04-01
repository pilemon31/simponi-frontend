import type { ProductListItem } from "@/types/product.type";
import type { Inventory } from "./schema";
import { formatDistanceToNow } from "date-fns";

export function adaptProductToInventory(product: ProductListItem): Inventory {
  return {
    id: product.id,
    name: product.name,
    description: "",
    sku: product.sku,
    stock: product.stock,
    category: product.category
      ? { id: product.category.id, name: product.category.name }
      : null,
    imageUrl: product.images?.[0]?.image_url ?? null,
    externalProducts: product.external_products.map((ep) => ({
      id: ep.id,
      platform: ep.external_product_id.startsWith("TK") ? "tiktok" : "shopee",
      externalProductId: ep.external_product_id,
      externalModelId: ep.external_model_id ?? null,
      price: ep.price,
    })),
    status: {
      state: product.status,
      lastUpdated: formatDistanceToNow(new Date(product.created_at), {
        addSuffix: false,
      }),
    },
  };
}
