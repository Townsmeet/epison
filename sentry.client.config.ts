import * as Sentry from '@sentry/nuxt'

// process.env.NUXT_PUBLIC_SENTRY_DSN is explicitly defined in nuxt.config.ts via vite.define
const dsn = process.env.NUXT_PUBLIC_SENTRY_DSN

if (dsn) {
  Sentry.init({
    dsn,
    tracesSampleRate: 1.0,
    integrations: [Sentry.replayIntegration()],
    replaysSessionSampleRate: 0.1,
    replaysOnErrorSampleRate: 1.0,
    sendDefaultPii: true,
    environment: process.env.NODE_ENV || 'development',
  })
} else {
  console.log('Sentry DSN not found on client, skipping initialization')
}
