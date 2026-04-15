import { faker } from '@faker-js/faker';

faker.seed(12345);

export const inventoryLogs = Array.from({ length: 100 }, () => {
  const source = ['shopee', 'tiktok-shop'] as const;

  return {
    id: `IVL-${faker.number.int({ min: 1000, max: 9999 })}`,
    product: faker.commerce.productName(),
    source: faker.helpers.arrayElement(source),
    change: faker.number.int({ min: -100, max: 100 }),
    note: faker.lorem.sentence({ min: 1, max: 5 }),
    timestamp: faker.date.recent(),
  };
});
