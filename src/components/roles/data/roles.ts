import { faker } from '@faker-js/faker';

faker.seed(12345);

export const roles = Array.from({ length: 100 }, () => {
  const permissions = [
    'Inventory',
    'Orders',
    'Permissions',
    'Activity',
  ] as const;

  return {
    name: faker.lorem.sentence({ min: 1, max: 5 }),
    permissions: faker.helpers.shuffle(permissions),
  };
});
