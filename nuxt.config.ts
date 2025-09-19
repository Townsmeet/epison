// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },

  css: ['~/assets/css/main.css'],

  modules: ['@nuxt/eslint', '@nuxt/image', '@nuxt/scripts', '@nuxt/test-utils', '@nuxt/ui'],

  colorMode: {
    preference: 'system',
    fallback: 'light',
  },

  runtimeConfig: {
    // Server-only secret (optional, for server-side verification/webhooks later)
    paystackSecretKey: process.env.NUXT_PAYSTACK_SECRET_KEY,

    // Expose ONLY the public key to the client
    public: {
      paystackKey: process.env.NUXT_PAYSTACK_PUBLIC_KEY,
    },

    turso: {
      databaseUrl: process.env.NUXT_TURSO_DATABASE_URL,
      authToken: process.env.NUXT_TURSO_AUTH_TOKEN,
    },
  },
})
