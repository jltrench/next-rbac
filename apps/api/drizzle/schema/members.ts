import { pgTable, text } from 'drizzle-orm/pg-core'
import { nanoid } from 'nanoid'

export const members = pgTable('members', {
  id: text('id').$defaultFn(() => nanoid()),
})
