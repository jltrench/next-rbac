import { relations } from 'drizzle-orm'
import { pgTable, text, timestamp } from 'drizzle-orm/pg-core'
import { nanoid } from 'nanoid'

import { accounts } from './accounts'
import { invites } from './invites'
import { members } from './members'
import { organizations } from './organizations'
import { projects } from './projects'
import { tokens } from './tokens'

export const users = pgTable('users', {
  id: text('id')
    .$defaultFn(() => nanoid())
    .primaryKey()
    .unique()
    .notNull(),
  name: text('name'),
  email: text('email').notNull(),
  passwordHash: text('password_hash'),
  avatarUrl: text('avatar_url'),
  createdAt: timestamp('created_at', { mode: 'date', precision: 3 })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp('updated_at', { mode: 'date', precision: 3 })
    .$onUpdate(() => new Date())
    .notNull(),
})

export const usersRelations = relations(users, ({ many }) => ({
  tokens: many(tokens),
  accounts: many(accounts),
  invites: many(invites),
  memberOn: many(members),
  ownsOrganizations: many(organizations),
  ownsProjects: many(projects),
}))
