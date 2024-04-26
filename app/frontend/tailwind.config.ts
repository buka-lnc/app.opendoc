import type { Config } from 'tailwindcss'
import plugin from 'tailwindcss/plugin'
import themes from 'daisyui/src/theming/themes'
import colors from 'tailwindcss/colors'

export default {
  content: [],
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
        error: colors.red[600],
        'error-content': '#ffffff',
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
} satisfies Config
