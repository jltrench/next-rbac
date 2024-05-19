import { relations } from 'drizzle-orm'
import { boolean, pgTable, text, timestamp } from 'drizzle-orm/pg-core'
import { nanoid } from 'nanoid'

import { invites } from './invites'
import { members } from './members'
import { projects } from './projects'
import { users } from './users'

export const organizations = pgTable('organizations', {
  id: text('id').$defaultFn(() => nanoid()),
  owner: text('user_id'),
  name: text('name'),
  slug: text('slug').unique(),
  domain: text('domain').unique(),
  shouldAttachUsersByDomain: boolean('should_attach_users_by_domain').default(
    false,
  ),
  avatarUrl: text('avatar_url'),
  createdAt: timestamp('created_at', { mode: 'date', precision: 3 })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp('updated_at', { mode: 'date', precision: 3 }).$onUpdate(
    () => new Date(),
  ),
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
