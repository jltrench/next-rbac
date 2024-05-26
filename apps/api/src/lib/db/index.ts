import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'

import { env } from '@/config/env'
import * as schema from '@/lib/db/schema'

const { DATABASE_URL } = env

const client = postgres(DATABASE_URL ?? 'Not Valid URL', { prepare: false })
export const db = drizzle(client, { schema, logger: true })
