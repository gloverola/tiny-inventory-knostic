import { faker } from '@faker-js/faker'

// Set a fixed seed for consistent data generation
faker.seed(12345)

export const stores = Array.from({ length: 100 }, () => {
  const createdAt = faker.date.past()
  const updatedAt = faker.date.between({ from: createdAt, to: new Date() })

  return {
    id: faker.string.uuid(),
    name: faker.company.name(),
    location: `${faker.location.city()}, ${faker.location.state()}`,
    createdAt,
    updatedAt,
  }
})
