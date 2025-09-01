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
    paystackSecretKey: process.env.PAYSTACK_SECRET_KEY,

    // Expose ONLY the public key to the client
    public: {
      paystackKey: process.env.PAYSTACK_PUBLIC_KEY || process.env.NUXT_PUBLIC_PAYSTACK_KEY,
    },
  },
})
