import * as Sentry from '@sentry/nuxt'

// On the server, we use process.env directly
const dsn = process.env.NUXT_PUBLIC_SENTRY_DSN || process.env.NUXT_SENTRY_DSN

if (dsn) {
  Sentry.init({
    dsn,
    tracesSampleRate: 1.0,
    environment: process.env.NODE_ENV || 'development',
  })
} else {
  console.log('Sentry DSN not found on server, skipping initialization')
}
