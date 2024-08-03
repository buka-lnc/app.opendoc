import type { Config } from 'tailwindcss'
import plugin from 'tailwindcss/plugin'
import catppuccin from '@catppuccin/daisyui'

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
    darkTheme: 'macchiato',
    themes: [
      {
        light: {
          ...catppuccin('latte').latte,
        },
        dark: {
          ...catppuccin('macchiato').macchiato,
        },
      },
    ],
    prefix: 'd-',
  },
  // darkMode: ['class', '[data-theme="macchiato"]'],
} satisfies Config
