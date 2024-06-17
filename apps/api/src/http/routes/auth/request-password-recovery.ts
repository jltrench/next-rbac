import { eq } from 'drizzle-orm'
import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'

import { db } from '@/lib/db'
import { tokens, users } from '@/lib/db/schema'

export async function requestPasswordRecovery(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().post(
    '/password/recover',
    {
      schema: {
        tags: ['auth'],
        summary: 'Get authenticated user profile',
        body: z.object({
          email: z.string().email(),
        }),
        response: {
          201: z.null(),
        },
      },
    },
    async (request, reply) => {
      const { email } = request.body

      const userFromEmail = await db.query.users.findFirst({
        where: eq(users.email, email),
      })

      if (!userFromEmail) {
        return reply.status(201).send()
      }

      const newToken = await db
        .insert(tokens)
        .values({
          tokenType: 'PASSWORD_RECOVER',
          userId: userFromEmail.id,
        })
        .returning({ insertedId: tokens.id })

      console.log('Recover password token: ', newToken[0].insertedId)

      return reply.status(201).send()
    },
  )
}
