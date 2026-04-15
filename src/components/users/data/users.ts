import { faker } from '@faker-js/faker';

faker.seed(12345);

export const users = Array.from({ length: 100 }, () => {
  const status = ['active', 'inactive'] as const;
  const roleName = ['Client', 'Admin', 'Super Admin'] as const;

  return {
    email: faker.internet.email(),
    name: faker.person.fullName(),
    image_url: faker.image.avatar(),
    role_name: faker.helpers.arrayElement(roleName),
    status: faker.helpers.arrayElement(status),
  };
});
