import { pgTable, text } from 'drizzle-orm/pg-core'
import { nanoid } from 'nanoid'

export const accounts = pgTable('accounts', {
  id: text('id').$defaultFn(() => nanoid()),
})
