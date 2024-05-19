import { relations } from 'drizzle-orm'
import { pgEnum, pgTable, text, timestamp } from 'drizzle-orm/pg-core'
import { nanoid } from 'nanoid'

import { users } from './users'

export const tokenTypeEnum = pgEnum('token_type', ['PASSWORD_RECOVER'])

export const tokens = pgTable('tokens', {
  id: text('id').$defaultFn(() => nanoid()),
  tokenType: tokenTypeEnum('token_type'),
  userId: text('user_id'),
  createdAt: timestamp('created_at', { mode: 'date', precision: 3 })
    .defaultNow()
    .notNull(),
})

export const tokensRelations = relations(tokens, ({ one }) => ({
  user: one(users, {
    fields: [tokens.userId],
    references: [users.id],
  }),
}))
