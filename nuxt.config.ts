// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  future: {
    compatibilityVersion: 4,
  },
  devtools: { enabled: true },
  runtimeConfig: {
    // Private keys are only available on the server
    googleClientId: process.env.GOOGLE_CLIENT_ID,
    googleClientSecret: process.env.GOOGLE_CLIENT_SECRET,
    betterAuthSecret: process.env.BETTER_AUTH_SECRET,

    public: {
      // Public keys are available on both client and server
      betterAuthUrl: process.env.BETTER_AUTH_URL || 'http://localhost:3000'
    }
  }
})
