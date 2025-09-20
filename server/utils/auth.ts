import { betterAuth } from 'better-auth'
import { drizzleAdapter } from 'better-auth/adapters/drizzle'
import { db } from '../utils/drizzle' // your drizzle instance
import * as schema from '../db/schema' // import schema

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: 'sqlite',
    schema: schema, // pass the schema to the adapter
  }),
  emailAndPassword: {
    enabled: true,
  },
})
