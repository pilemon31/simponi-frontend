import { faker } from "@faker-js/faker";
import type { Inventory, ExternalProduct } from "./schema";

faker.seed(12345);

export const inventories: Inventory[] = Array.from({ length: 100 }, () => {
  const state = faker.helpers.arrayElement([
    "Mapped",
    "Low Stock",
    "Unmapped",
  ] as const);

  const isUnmapped = state === "Unmapped";
  const isLowStock = state === "Low Stock";

  const centralStock = isLowStock
    ? faker.number.int({ min: 1, max: 10 })
    : faker.number.int({ min: 50, max: 500 });

  const baseSku =
    faker.string.alphanumeric({ length: 3, casing: "upper" }) +
    "-" +
    faker.number.int({ min: 1, max: 999 }).toString().padStart(3, "0");

  const externalProducts: ExternalProduct[] = [];
  if (!isUnmapped) {
    externalProducts.push({
      id: faker.string.uuid(),
      platform: "tiktok",
      externalProductId: `TK-${baseSku}`,
      externalModelId: faker.string.numeric(8),
      price: faker.number.int({ min: 50000, max: 5000000 }),
    });

    if (faker.datatype.boolean({ probability: 0.9 })) {
      externalProducts.push({
        id: faker.string.uuid(),
        platform: "shopee",
        externalProductId: `SP-${baseSku}`,
        externalModelId: faker.string.numeric(8),
        price: faker.number.int({ min: 50000, max: 5000000 }),
      });
    }
  }

  return {
    id: faker.string.uuid(),
    name: faker.commerce.productName(),
    description: faker.commerce.productDescription(),
    sku: baseSku,
    stock: centralStock,
    category: {
      id: faker.string.uuid(),
      name: faker.commerce.department(),
    },
    imageUrl: faker.helpers.arrayElement([faker.image.urlPicsumPhotos(), null]),
    externalProducts: externalProducts,
    status: {
      state: state,
      lastUpdated: `${faker.number.int({ min: 1, max: 59 })}m ago`,
    },
  };
});
