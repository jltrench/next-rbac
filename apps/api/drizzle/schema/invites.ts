import { pgTable, text } from 'drizzle-orm/pg-core'
import { nanoid } from 'nanoid'

export const invites = pgTable('invites', {
  id: text('id').$defaultFn(() => nanoid()),
})
