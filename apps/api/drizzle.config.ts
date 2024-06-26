import { defineConfig } from 'drizzle-kit'

import { env } from '@/config/env'

export default defineConfig({
  schema: './src/lib/db/schema',
  dialect: 'postgresql',
  dbCredentials: {
    url: env.DATABASE_URL,
  },
  verbose: true,
  strict: true,
})
