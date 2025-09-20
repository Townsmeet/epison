import { betterAuth } from 'better-auth'
import { drizzleAdapter } from 'better-auth/adapters/drizzle'
import { db } from '../utils/drizzle' // your drizzle instance
import * as schema from '../db/schema' // import schema
import { sendEmail, createPasswordResetEmail } from './email'

// Minimal shape we need for the email callback
type PasswordResetUser = {
  email: string
  name?: string | null
}

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: 'sqlite',
    schema: schema, // pass the schema to the adapter
  }),
  emailAndPassword: {
    enabled: true,
    // Better Auth requires enabling password reset by providing a sender
    // function. Different versions name this hook differently; for v1.3.x
    // it's `sendResetPassword`.
    sendResetPassword: async ({ user, url }: { user: PasswordResetUser; url: string }) => {
      const { subject, htmlContent } = createPasswordResetEmail(url, user.name ?? undefined)
      await sendEmail({ to: user.email, subject, htmlContent })
    },
  },
  // Base URL used by Better Auth to build links in emails
  baseURL: process.env.NUXT_BETTER_AUTH_URL,
})
