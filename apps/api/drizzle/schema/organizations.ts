import { pgTable, text } from 'drizzle-orm/pg-core'
import { nanoid } from 'nanoid'

export const organizations = pgTable('organizations', {
  id: text('id').$defaultFn(() => nanoid()),
})
