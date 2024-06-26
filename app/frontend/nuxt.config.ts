import { defineNuxtConfig } from 'nuxt/config'

export default defineNuxtConfig({
  modules: [
    '@pinia/nuxt',
    '@nuxtjs/tailwindcss',
    '@vueuse/nuxt',
    'nuxt-svgo',
    'nuxt-viewport',
    'nuxt-monaco-editor',
  ],

  css: [
    '~/assets/css/main.css',
    '~/assets/css/schema.css',
  ],

  runtimeConfig: {
    apiBaseOrigin: process.env.API_BASE_ORIGIN,
  },
  svgo: {
    defaultImport: 'component',
  },

  viewport: {
    breakpoints: {
      xs: 320,
      sm: 640,
      md: 768,
      lg: 1024,
      xl: 1280,
      '2xl': 1536,
    },

    defaultBreakpoints: {
      desktop: 'lg',
      mobile: 'xs',
      tablet: 'md',
    },

    fallbackBreakpoint: 'lg',
  },

  tailwindcss: {
    exposeConfig: true,
  },

  vue: {
    // @ts-ignore
    config: {
      devtools: true,
    },
  },
  devtools: {
    enabled: false,
  },
  ssr: false,
})
