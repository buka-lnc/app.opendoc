import { defineNuxtConfig } from 'nuxt/config'

export default defineNuxtConfig({
  devtools: { enabled: false },
  app: {
  },

  ssr: false,
  modules: [
    '@pinia/nuxt',
    '@nuxtjs/tailwindcss',
    '@vite-pwa/nuxt',
    '@vueuse/nuxt',
    'nuxt-svgo',
    'nuxt-viewport',
    'nuxt-monaco-editor',
  ],

  css: ['~/assets/css/main.css'],

  // build: {
  //   extractCSS: true,
  // },

  nitro: {
    devProxy: {
      '/api': {
        target: 'http://localhost:8080/api',
        changeOrigin: false,
      },
    },
  },

  vite: {
    server: {
      fs: {
        allow: ['/home/admin/workdir'],
      },
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
    config: {
      plugins: [
        require('tailwindcss-safe-area'),
        require('tailwind-scrollbar-hide'),
        require('daisyui'),
        require('@tailwindcss/typography'),
      ],
      daisyui: {
        themes: ['light'],
        prefix: 'd-',
      },
    },
  },

  postcss: {
    plugins: {
      /**
       * 修复IOS 100vh问题
       * https://github.com/tailwindlabs/tailwindcss/discussions/4515
       */
      // 'postcss-100vh-fix': {},
    },
  },
  pwa: {
    registerType: 'autoUpdate',
    // selfDestroying: false,
    // client: {
    //   // installPrompt: true,
    //   // periodicSyncForUpdates: 3600,
    // },
    workbox: {
      navigateFallback: null,
      sourcemap: true,
      globPatterns: ['**/*.{js,css,html,png,jpg,jpeg,svg,ico}'],
      skipWaiting: true,
      clientsClaim: true,
      cleanupOutdatedCaches: true,
      runtimeCaching: [
        {
          urlPattern: /^(http[s]?:\/\/)([^:/?#\s]+)(:\d+)?\/api/,
          handler: 'NetworkFirst',
          options: {
            cacheName: 'api-cache',
            cacheableResponse: {
              statuses: [200],
            },
            networkTimeoutSeconds: 60,
          },
        },
        {
          urlPattern: /.*\.(png|jpg|jpeg|svg|ico)/,
          handler: 'CacheFirst',
          options: {
            cacheName: 'image-cache',
          },
        },
        {
          urlPattern: /.*\.(woff|woff2|eot|ttf|otf)/,
          handler: 'CacheFirst',
          options: {
            cacheName: 'font-cache',
          },
        },
        {
          urlPattern: ({ url, request }) => {
            if (!/.*\.(css|less|sass|scss)/.test(url.pathname)) {
              return false
            }

            // 开发环境的css文件会生成一个同名的js文件，此处需要过滤掉
            if (request.destination === 'script') {
              return false
            }

            return true
          },
          handler: 'CacheFirst',
          options: {
            cacheName: 'style-cache',
          },
        },
        {
          urlPattern: /.*\.(js|jsx|ts|tsx|mjs|mts)/,
          handler: 'CacheFirst',
          options: {
            cacheName: 'script-cache',
          },
        },
        {
          // page
          urlPattern: /\/[^.]*/,
          handler: 'NetworkFirst',
          options: {
            cacheName: 'page-cache',
            networkTimeoutSeconds: 60,
          },
        },
      ],
    },
    manifest: {
      name: 'Val.istar.Guo Blog',
      short_name: 'VBlog',
      description: 'Val.istar.Guo Blog',
      theme_color: '#ffffff',
      start_url: '/',
      background_color: '#ffffff',
      display: 'fullscreen',
      icons: [
        {
          src: '/android-chrome-192x192.png',
          sizes: '192x192',
          type: 'image/png',
        },
        {
          src: '/android-chrome-512x512.png',
          sizes: '512x512',
          type: 'image/png',
        },
        {
          src: '/android-chrome-512x512.png',
          sizes: '512x512',
          type: 'image/png',
          purpose: 'any',
        },
        {
          src: '/android-chrome-512x512.png',
          sizes: '512x512',
          type: 'image/png',
          purpose: 'maskable',
        },
      ],
    },
    devOptions: {
      // 需要测试Service Worker时打开
      enabled: false,
      type: 'module',
      suppressWarnings: true,
    },
  },
})
