import { pgTable, text } from 'drizzle-orm/pg-core'
import { nanoid } from 'nanoid'

export const projects = pgTable('projects', {
  id: text('id').$defaultFn(() => nanoid()),
})
