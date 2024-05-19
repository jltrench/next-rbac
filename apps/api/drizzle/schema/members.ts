import { relations } from 'drizzle-orm'
import { pgEnum, pgTable, text, unique } from 'drizzle-orm/pg-core'
import { nanoid } from 'nanoid'

import { organizations } from './organizations'
import { users } from './users'

// mandatory export for drizzle migration
export const membersUsersRole = pgEnum('role', ['ADMIN', 'MEMBER', 'BILLING'])

export const members = pgTable(
  'members',
  {
    id: text('id').$defaultFn(() => nanoid()),
    user: text('user_id'),
    role: membersUsersRole('role').default('MEMBER'),
    organization: text('organization_id'),
  },
  (t) => ({
    unq: unique().on(t.organization, t.user),
  }),
)

export const membersRelations = relations(members, ({ one }) => ({
  organization: one(organizations, {
    fields: [members.organization],
    references: [organizations.id],
  }),
  users: one(users, {
    fields: [members.user],
    references: [users.id],
  }),
}))
