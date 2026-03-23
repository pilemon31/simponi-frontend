import { faker } from "@faker-js/faker";
import type { Inventory } from "./schema";

faker.seed(12345);

export const inventories: Inventory[] = Array.from({ length: 100 }, () => {
  const state = faker.helpers.arrayElement([
    "Synced",
    "Low Stock",
    "Unmapped",
  ] as const);
  const isUnmapped = state === "Unmapped";
  const isLowStock = state === "Low Stock";

  const totalStock = isLowStock
    ? faker.number.int({ min: 1, max: 10 })
    : faker.number.int({ min: 50, max: 500 });

  const tiktokStock = isUnmapped
    ? totalStock
    : faker.number.int({ min: 0, max: totalStock });
  const shopeeStock = isUnmapped ? null : totalStock - tiktokStock;
  const availableStock = isLowStock
    ? null
    : totalStock - faker.number.int({ min: 0, max: 15 });

  const baseSku =
    faker.string.alphanumeric({ length: 3, casing: "upper" }) +
    "-" +
    faker.number.int({ min: 1, max: 999 }).toString().padStart(3, "0");

  return {
    id: faker.string.uuid(),
    product: {
      name: faker.commerce.productName(),
      category: faker.commerce.department(),
      icon: faker.helpers.arrayElement([
        "Headphones",
        "Smartphone",
        "Laptop",
        "Box",
      ]),
    },
    internalSku: baseSku,
    platformSkus: {
      tiktok: `TK-${baseSku}`,
      shopee: isUnmapped ? null : `SP-${baseSku}`,
    },
    unifiedStock: {
      total: totalStock,
      available: availableStock,
      isCriticalLow: isLowStock,
    },
    tiktokStock: tiktokStock,
    shopeeStock: shopeeStock,
    status: {
      state: state,
      lastUpdated: `${faker.number.int({ min: 1, max: 59 })}m ago`,
    },
  };
});
