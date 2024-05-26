import { faker } from '@faker-js/faker'
import { hash } from 'bcryptjs'
import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'

import { env } from '../src/config/env'
import * as schema from '../src/lib/db/schema'

const { DATABASE_URL } = env

const client = postgres(DATABASE_URL ?? 'Not Valid URL', { prepare: false })
export const drizzleClient = drizzle(client, { schema })

async function seed() {
  await drizzleClient.delete(schema.users)
  await drizzleClient.delete(schema.organizations)
  await drizzleClient.delete(schema.projects)
  await drizzleClient.delete(schema.members)

  const passwordHash = await hash('123456', 1)

  const [user, user1, user2] = await drizzleClient
    .insert(schema.users)
    .values([
      {
        name: 'John Doe',
        email: 'john@acme.com',
        avatarUrl: 'https://github.com/jltrench.png',
        passwordHash,
      },
      {
        name: faker.person.fullName(),
        email: faker.internet.email(),
        avatarUrl: faker.image.avatarGitHub(),
        passwordHash,
      },
      {
        name: faker.person.fullName(),
        email: faker.internet.email(),
        avatarUrl: faker.image.avatarGitHub(),
        passwordHash,
      },
    ])
    .returning()

  const [org, org1, org2] = await drizzleClient
    .insert(schema.organizations)
    .values([
      {
        name: 'Acme Inc (Admin)',
        domain: 'acme-admin.com',
        slug: 'acme-admin',
        avatarUrl: faker.image.avatarGitHub(),
        shouldAttachUsersByDomain: true,
        owner: user.id,
      },
      {
        name: 'Acme Inc (Billing)',
        domain: 'acme-billing.com',
        slug: 'acme-billing',
        avatarUrl: faker.image.avatarGitHub(),
        shouldAttachUsersByDomain: true,
        owner: user.id,
      },
      {
        name: 'Acme Inc (Member)',
        domain: 'acme-member.com',
        slug: 'acme-member',
        avatarUrl: faker.image.avatarGitHub(),
        shouldAttachUsersByDomain: true,
        owner: user.id,
      },
    ])
    .returning()

  await drizzleClient.insert(schema.projects).values([
    {
      name: faker.lorem.words(5),
      slug: faker.lorem.slug(5),
      description: faker.lorem.paragraph(),
      avatarUrl: faker.image.avatarGitHub(),
      organization: org.id,
      owner: faker.helpers.arrayElement([user.id, user1.id, user2.id]),
    },
    {
      name: faker.lorem.words(5),
      slug: faker.lorem.slug(5),
      description: faker.lorem.paragraph(),
      avatarUrl: faker.image.avatarGitHub(),
      organization: org.id,
      owner: faker.helpers.arrayElement([user.id, user1.id, user2.id]),
    },
    {
      name: faker.lorem.words(5),
      slug: faker.lorem.slug(5),
      description: faker.lorem.paragraph(),
      avatarUrl: faker.image.avatarGitHub(),
      organization: org.id,
      owner: faker.helpers.arrayElement([user.id, user1.id, user2.id]),
    },
    {
      name: faker.lorem.words(5),
      slug: faker.lorem.slug(5),
      description: faker.lorem.paragraph(),
      avatarUrl: faker.image.avatarGitHub(),
      organization: org1.id,
      owner: faker.helpers.arrayElement([user.id, user1.id, user2.id]),
    },
    {
      name: faker.lorem.words(5),
      slug: faker.lorem.slug(5),
      description: faker.lorem.paragraph(),
      avatarUrl: faker.image.avatarGitHub(),
      organization: org1.id,
      owner: faker.helpers.arrayElement([user.id, user1.id, user2.id]),
    },
    {
      name: faker.lorem.words(5),
      slug: faker.lorem.slug(5),
      description: faker.lorem.paragraph(),
      avatarUrl: faker.image.avatarGitHub(),
      organization: org1.id,
      owner: faker.helpers.arrayElement([user.id, user1.id, user2.id]),
    },
    {
      name: faker.lorem.words(5),
      slug: faker.lorem.slug(5),
      description: faker.lorem.paragraph(),
      avatarUrl: faker.image.avatarGitHub(),
      organization: org2.id,
      owner: faker.helpers.arrayElement([user.id, user1.id, user2.id]),
    },
    {
      name: faker.lorem.words(5),
      slug: faker.lorem.slug(5),
      description: faker.lorem.paragraph(),
      avatarUrl: faker.image.avatarGitHub(),
      organization: org2.id,
      owner: faker.helpers.arrayElement([user.id, user1.id, user2.id]),
    },
    {
      name: faker.lorem.words(5),
      slug: faker.lorem.slug(5),
      description: faker.lorem.paragraph(),
      avatarUrl: faker.image.avatarGitHub(),
      organization: org2.id,
      owner: faker.helpers.arrayElement([user.id, user1.id, user2.id]),
    },
  ])

  await drizzleClient.insert(schema.members).values([
    {
      user: user.id,
      role: 'ADMIN',
      organization: org.id,
    },
    {
      user: user1.id,
      role: 'MEMBER',
      organization: org.id,
    },
    {
      user: user2.id,
      role: 'BILLING',
      organization: org.id,
    },
    {
      user: user.id,
      role: 'BILLING',
      organization: org1.id,
    },
    {
      user: user1.id,
      role: 'ADMIN',
      organization: org1.id,
    },
    {
      user: user2.id,
      role: 'MEMBER',
      organization: org1.id,
    },
    {
      user: user.id,
      role: 'MEMBER',
      organization: org2.id,
    },
    {
      user: user1.id,
      role: 'ADMIN',
      organization: org2.id,
    },
    {
      user: user2.id,
      role: 'MEMBER',
      organization: org2.id,
    },
  ])
}

seed().then(() => {
  console.log('Seed completed!')
})
