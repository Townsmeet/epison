// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },

  css: ['~/assets/css/main.css'],

  modules: [
    '@nuxt/eslint',
    '@nuxt/image',
    '@nuxt/scripts',
    '@nuxt/test-utils',
    '@nuxt/ui',
    'nuxt-charts',
    '@nuxtjs/seo',
    'nuxt-og-image',
  ],

  colorMode: {
    preference: 'system',
    fallback: 'light',
  },

  runtimeConfig: {
    // Server-only secret (optional, for server-side verification/webhooks later)
    paystackSecretKey: process.env.NUXT_PAYSTACK_SECRET_KEY,

    turso: {
      databaseUrl: process.env.NUXT_TURSO_DATABASE_URL,
      authToken: process.env.NUXT_TURSO_AUTH_TOKEN,
    },

    brevoApiKey: process.env.NUXT_BREVO_API_KEY,

    // S3 / Object storage (server-only by default)
    s3: {
      accessKeyId: process.env.NUXT_S3_ACCESS_KEY_ID,
      secretAccessKey: process.env.NUXT_S3_SECRET_ACCESS_KEY,
      region: process.env.NUXT_S3_REGION,
      bucket: process.env.NUXT_S3_BUCKET,
      endpoint: process.env.NUXT_S3_ENDPOINT, // optional for compatible providers
      forcePathStyle: process.env.NUXT_S3_FORCE_PATH_STYLE === 'true',
      publicBaseUrl: process.env.NUXT_S3_PUBLIC_BASE_URL, // optional CDN/public base
    },

    // Expose ONLY safe values to client
    public: {
      paystackKey: process.env.NUXT_PAYSTACK_PUBLIC_KEY,
      // expose public base URL if needed by client to render image URLs
      s3PublicBaseUrl: process.env.NUXT_S3_PUBLIC_BASE_URL,
      siteUrl: process.env.NUXT_PUBLIC_SITE_URL,
    },
  },
})
