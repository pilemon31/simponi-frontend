import type { ProductListItem } from "@/types/product.type";
import type { Inventory } from "./schema";
import { formatDistanceToNow } from "date-fns";
import { resolveImageUrl } from "@/lib/media";

type InventoryExternalProduct = Inventory["externalProducts"][number];
type ProductExternalProduct = NonNullable<
  ProductListItem["external_products"]
>[number];

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

export function adaptExternalProductToInventory(
  externalProduct: ProductExternalProduct,
): InventoryExternalProduct {
  return {
    id: externalProduct.id,
    platform: normalizePlatform(externalProduct.platform),
    product_name: externalProduct.product_name,
    image: externalProduct.image_url,
    price: externalProduct.price,
    created_at: externalProduct.created_at,
    updated_at: externalProduct.updated_at,
  };
}

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
    externalProducts: (product.external_products ?? []).map(
      adaptExternalProductToInventory,
    ),
    status: {
      state: normalizeStatus(product.status),
      lastUpdated: formatDistanceToNow(new Date(product.created_at), {
        addSuffix: false,
      }),
    },
  };
}
