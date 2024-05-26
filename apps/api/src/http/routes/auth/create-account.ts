import { hash } from 'bcryptjs'
import { eq } from 'drizzle-orm'
import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'

import { db } from '@/lib/db'
import { users } from '@/lib/db/schema'

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

      const passwordHash = await hash(password, 6)

      await db.insert(users).values({
        name,
        email,
        passwordHash,
      })

      return reply.status(201).send({ message: 'Account created' })
    },
  )
}
