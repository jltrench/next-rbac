import { relations } from 'drizzle-orm'
import { pgEnum, pgTable, text, unique } from 'drizzle-orm/pg-core'
import { nanoid } from 'nanoid'

import { users } from './users'

export const accountProviderEnum = pgEnum('account_provider', ['GITHUB'])

export const accounts = pgTable(
  'accounts',
  {
    id: text('id').$defaultFn(() => nanoid()),
    provider: accountProviderEnum('account_provider'),
    providerAccountId: text('provider_account_id').unique(),
  },
  (t) => ({
    unq: unique().on(t.provider, t.providerAccountId),
  }),
)

export const accountsRelations = relations(accounts, ({ one }) => ({
  user: one(users, {
    fields: [accounts.providerAccountId],
    references: [users.id],
  }),
}))
