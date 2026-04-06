import type { ProductListItem } from "@/types/product.type";
import type { Inventory } from "./schema";
import { formatDistanceToNow } from "date-fns";
import { resolveImageUrl } from "@/lib/media";

const normalizePlatform = (platform: string): "shopee" | "tiktok" =>
  platform.toLowerCase().includes("tiktok") ? "tiktok" : "shopee";

const normalizeStatus = (
  status: ProductListItem["status"],
): Inventory["status"]["state"] => {
  if (status === "Out of stock") {
    return "Out of Stock";
  }
  return status as Inventory["status"]["state"];
};

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
    imageUrl: resolveImageUrl(product.images?.[0]?.image_url),
    externalProducts: (product.external_products ?? []).map((ep) => ({
      id: ep.id,
      platform: normalizePlatform(ep.platform),
      externalProductId: ep.id,
      externalModelId: null,
      price: ep.price,
    })),
    status: {
      state: normalizeStatus(product.status),
      lastUpdated: formatDistanceToNow(new Date(product.created_at), {
        addSuffix: false,
      }),
    },
  };
}
