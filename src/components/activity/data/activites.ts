import { faker } from '@faker-js/faker';

faker.seed(12345);

export const activities = Array.from({ length: 100 }, () => {
  const modules = ['inventory', 'order'] as const;
  const actions = ['get', 'post', 'update'] as const;

  return {
    id: `ACT-${faker.number.int({ min: 1000, max: 9999 })}`,
    module: faker.helpers.arrayElement(modules),
    action: faker.helpers.arrayElement(actions),
    message: faker.lorem.sentence({ min: 1, max: 5 }),
    timestamp: faker.date.recent(),
  };
});
