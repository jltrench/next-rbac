import { createId } from '@paralleldrive/cuid2'
import { relations } from 'drizzle-orm'
import { boolean, pgTable, text, timestamp } from 'drizzle-orm/pg-core'

import { invites } from './invites'
import { members } from './members'
import { projects } from './projects'
import { users } from './users'

export const organizations = pgTable('organizations', {
  id: text('id')
    .$defaultFn(() => createId())
    .primaryKey()
    .unique()
    .notNull(),
  owner: text('user_id').notNull(),
  name: text('name').notNull(),
  slug: text('slug').unique().notNull(),
  domain: text('domain').unique(),
  shouldAttachUsersByDomain: boolean('should_attach_users_by_domain')
    .default(false)
    .notNull(),
  avatarUrl: text('avatar_url'),
  createdAt: timestamp('created_at', { mode: 'date', precision: 3 })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp('updated_at', { mode: 'date', precision: 3 })
    .$onUpdate(() => new Date())
    .notNull(),
})

export const organizationRelations = relations(
  organizations,
  ({ many, one }) => ({
    invites: many(invites),
    members: many(members),
    projects: many(projects),
    owner: one(users, {
      fields: [organizations.owner],
      references: [users.id],
    }),
  }),
)
