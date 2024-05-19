import { relations } from 'drizzle-orm'
import { pgTable, text, timestamp } from 'drizzle-orm/pg-core'
import { nanoid } from 'nanoid'

import { organizations } from './organizations'
import { users } from './users'

export const projects = pgTable('projects', {
  id: text('id').$defaultFn(() => nanoid()),
  owner: text('user_id'),
  organization: text('organization_id'),
  name: text('name'),
  description: text('description'),
  slug: text('slug').unique(),
  avatarUrl: text('avatar_url'),
  createdAt: timestamp('created_at', { mode: 'date', precision: 3 })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp('updated_at', { mode: 'date', precision: 3 }).$onUpdate(
    () => new Date(),
  ),
})

export const projectsRelations = relations(projects, ({ one }) => ({
  owner: one(users, {
    fields: [projects.owner],
    references: [users.id],
  }),
  organization: one(organizations, {
    fields: [projects.organization],
    references: [organizations.id],
  }),
}))
