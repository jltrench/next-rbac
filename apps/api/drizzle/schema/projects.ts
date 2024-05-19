import { relations } from 'drizzle-orm'
import { pgTable, text, timestamp } from 'drizzle-orm/pg-core'
import { nanoid } from 'nanoid'

import { organizations } from './organizations'
import { users } from './users'

export const projects = pgTable('projects', {
  id: text('id')
    .$defaultFn(() => nanoid())
    .primaryKey()
    .unique()
    .notNull(),
  owner: text('user_id').notNull(),
  organization: text('organization_id').notNull(),
  name: text('name').notNull(),
  description: text('description').notNull(),
  slug: text('slug').unique().notNull(),
  avatarUrl: text('avatar_url'),
  createdAt: timestamp('created_at', { mode: 'date', precision: 3 })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp('updated_at', { mode: 'date', precision: 3 })
    .$onUpdate(() => new Date())
    .notNull(),
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
