import { defineNuxtConfig } from 'nuxt/config'
import plugin from 'tailwindcss/plugin'
import themes from 'daisyui/src/theming/themes'
import colors from 'tailwindcss/colors'

export default defineNuxtConfig({
  devtools: { enabled: false },
  app: {
  },

  ssr: false,
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
        // 添加插件
        plugin(function ({ addComponents }) {
          const newProseStyles = {
            // 这里的`.prose pre`选择器对应于将要扩展的prose类用法
            '.prose pre': {
              // 这将重置text-shadow，也可以是'none'根据具体的CSS实现
              textShadow: '0 0 0 transparent',
            },
          }

          // 使用addComponents方法添加新的组件样式
          addComponents(newProseStyles)
        }),
      ],
      daisyui: {
        themes: [{
          dark: {
            ...themes.dark,
            primary: '#c29df0',
            accent: colors.gray[950],
            neutral: '#2f3347',
            'neutral-content': '#cad3f5',
            'base-100': '#181926',
            'base-200': '#1e2030',
            'base-300': '#24273a',
            'base-content': '#cad3f5',
            'popover-border': '#5b6078',

            '--rounded-box': '0.5rem',
            '--rounded-btn': '0.25rem',
            '--rounded-badge': '1rem',
          },
        }],
        prefix: 'd-',
      },
    },
  },
})
