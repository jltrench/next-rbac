import { pgTable, text } from 'drizzle-orm/pg-core'
import { nanoid } from 'nanoid'

export const tokens = pgTable('tokens', {
  id: text('id').$defaultFn(() => nanoid()),
})
