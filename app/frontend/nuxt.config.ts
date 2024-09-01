/* eslint-disable @typescript-eslint/ban-ts-comment */
import { defineNuxtConfig } from 'nuxt/config'

export default defineNuxtConfig({
  modules: [
    '@nuxt/eslint',
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
    '~/assets/css/tabs.css',
    '~/assets/css/menu.css',
    '~/assets/css/shiki-themes.css',
    '~/assets/css/tabler-icon.css',
  ],

  eslint: {
    config: {
      stylistic: true,
    },
  },

  runtimeConfig: {
    apiBaseOrigin: process.env.API_BASE_ORIGIN,
  },

  svgo: {
    defaultImport: 'component',
  },

  viewport: {
    breakpoints: {
      'xs': 320,
      'sm': 640,
      'md': 768,
      'lg': 1024,
      'xl': 1280,
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
  compatibilityDate: '2024-08-03',
})
