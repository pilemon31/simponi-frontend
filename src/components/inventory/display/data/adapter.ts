import type { ExternalProduct } from "./schema";
import type { ExternalProductItem } from "@/types/external-product.type";

const normalizePlatform = (platform: string): "shopee" | "tiktok" =>
  platform.toLowerCase().includes("tiktok") ? "tiktok" : "shopee";

export function adaptExternalProductToInventory(
  externalProduct: ExternalProductItem,
): ExternalProduct {
  return {
    id: externalProduct.id,
    image: externalProduct.image,
    product_name: externalProduct.product_name,
    platform: normalizePlatform(externalProduct.platform),
    store_platform_name: externalProduct.store_platform_name ?? "",
    price: externalProduct.price,
    created_at: externalProduct.created_at,
    updated_at: externalProduct.updated_at,
  };
}
