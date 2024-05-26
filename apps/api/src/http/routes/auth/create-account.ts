import { hash } from 'bcryptjs'
import { eq, sql } from 'drizzle-orm'
import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'

import { db } from '@/lib/db'
import { members, organizations, users } from '@/lib/db/schema'

export async function createAccount(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().post(
    '/users',
    {
      schema: {
        tags: ['auth'],
        summary: 'Create a new account',
        body: z.object({
          name: z.string(),
          email: z.string().email(),
          password: z.string().min(6),
        }),
      },
    },
    async (request, reply) => {
      const { name, email, password } = request.body

      const userWithSameEmail = await db.query.users.findFirst({
        where: eq(users.email, email),
      })

      if (userWithSameEmail) {
        return reply.status(400).send({ message: 'Email already in use' })
      }

      const [, domain] = email.split('@')

      const autoJoinOrganization = await db.query.organizations.findFirst({
        where: sql`${organizations.shouldAttachUsersByDomain} = true AND ${organizations.domain} = ${domain}`,
      })

      const passwordHash = await hash(password, 6)

      const newUser = await db
        .insert(users)
        .values({
          name,
          email,
          passwordHash,
        })
        .returning()

      if (autoJoinOrganization) {
        await db.insert(members).values({
          organization: autoJoinOrganization.id,
          user: newUser[0].id,
        })
      }

      return reply.status(201).send({ message: 'Account created' })
    },
  )
}
