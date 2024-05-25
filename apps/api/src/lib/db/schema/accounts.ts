import { createId } from '@paralleldrive/cuid2'
import { relations } from 'drizzle-orm'
import { pgEnum, pgTable, text, unique } from 'drizzle-orm/pg-core'

import { users } from './users'

export const accountProviderEnum = pgEnum('account_provider', ['GITHUB'])

export const accounts = pgTable(
  'accounts',
  {
    id: text('id')
      .$defaultFn(() => createId())
      .primaryKey()
      .unique()
      .notNull(),
    provider: accountProviderEnum('account_provider').notNull(),
    providerAccountId: text('provider_account_id').unique().notNull(),
    userId: text('user_id').notNull(),
  },
  (t) => ({
    unq: unique().on(t.provider, t.userId),
  }),
)

export const accountsRelations = relations(accounts, ({ one }) => ({
  user: one(users, {
    fields: [accounts.userId],
    references: [users.id],
  }),
}))
