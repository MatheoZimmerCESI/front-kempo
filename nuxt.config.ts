// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  // Répertoire source
  srcDir: 'src/',

  // Compatibilité
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },

  // Modules à charger
  modules: [
    '@nuxt/ui'
  ],
    css: ['~/assets/css/main.css'],

  // Configuration de Nuxt UI
  ui: {
    prefix: 'U',     // Composants : <UCard>, <UButton>, etc.
    fonts: true,
    colorMode: true
  },

  // Auto-imports
  imports: {
    dirs: ['utils', 'types', 'services']
  },

  // Configuration runtime pour l’API back
  runtimeConfig: {
    public: {
      apiBase: process.env.NUXT_PUBLIC_API_BASE_URL || 'http://localhost:5000'
    }
  }
})
