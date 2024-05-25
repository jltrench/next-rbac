import { createId } from '@paralleldrive/cuid2'
import { relations } from 'drizzle-orm'
import { pgEnum, pgTable, text, timestamp, unique } from 'drizzle-orm/pg-core'

import { organizations } from './organizations'
import { users } from './users'

// mandatory export for drizzle migration
export const invitesUsersRole = pgEnum('role', ['ADMIN', 'MEMBER', 'BILLING'])

export const invites = pgTable(
  'invites',
  {
    id: text('id')
      .$defaultFn(() => createId())
      .primaryKey()
      .unique()
      .notNull(),
    email: text('email').notNull(),
    role: invitesUsersRole('role').notNull(),
    author: text('user_id'),
    organization: text('organization_id').notNull(),
    createdAt: timestamp('created_at', { mode: 'date', precision: 3 })
      .defaultNow()
      .notNull(),
  },
  (t) => ({
    unq: unique().on(t.email, t.organization),
  }),
)

export const invitesRelations = relations(invites, ({ one }) => ({
  user: one(users, {
    fields: [invites.author],
    references: [users.id],
  }),
  organization: one(organizations, {
    fields: [invites.organization],
    references: [organizations.id],
  }),
}))
