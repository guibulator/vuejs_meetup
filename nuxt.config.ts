// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },

  modules: ['@nuxt/ui'],

  css: ['~/assets/css/main.css'],

  runtimeConfig: {
    // Server-side only (for API routes)
    supabaseServiceKey: process.env.SUPABASE_SERVICE_KEY,
    
    // Public (available client-side)
    public: {
      supabaseUrl: "https://vgmygwuexkyrzwmrdoug.supabase.co",
      supabaseAnonKey: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZnbXlnd3VleGt5cnp3bXJkb3VnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM1OTM5MDMsImV4cCI6MjA3OTE2OTkwM30.04RMIBq1X29g67QqHJmDJvW1xvY1kDZjQ0qHjG3wXL8"
    }
  },

  app: {
    head: {
      title: 'Vue.js Meetup - Vote en direct',
      meta: [
        { name: 'description', content: 'Système de vote en direct pour les présentations Vue.js Meetup' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' }
      ],
      link: [
        { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' }
      ]
    }
  }
})
