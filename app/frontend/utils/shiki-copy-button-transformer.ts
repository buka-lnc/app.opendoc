/**
 * Shiki Transformer
 * 添加复制按钮
 * 点击复制按钮，触发 copy-code 事件，携带 detail 为代码内容
 */
import { h } from 'hastscript'
import { ShikiTransformer } from 'shiki'

export type CopyCodeEvent = CustomEvent<string>

export function shikiCopyButtonTransformer (): ShikiTransformer {
  return {
    name: 'shiki-transformer-copy-button',
    pre (node: any) {
      const button = h('div', {
        class: 'absolute top-4 right-6 d-tooltip',
        'data-tip': '复制',
      }, [
        h('button', {
          class: 'copy d-btn d-btn-xs d-btn-square opacity-50',
          'data-code': this.source,
          onclick: `
          const copyEvent = new CustomEvent("copy-code", { bubbles: true, cancelable: true, detail: this.getAttribute('data-code') })
          this.dispatchEvent(copyEvent)

          const classList = this.querySelector('.d-swap').classList
          if (!classList.contains('d-swap-active')) {
            classList.add('d-swap-active')

            setTimeout(() => {
              classList.remove('d-swap-active')
            }, 2000)
          }
        `,
        }, [
          h(
            'div',
            { class: 'd-swap' },
            [
              h(
                'svg',
                {
                  xmlns: 'http://www.w3.org/2000/svg',
                  width: '24',
                  height: '24',
                  viewBox: '0 0 24 24',
                  fill: 'none',
                  stroke: 'currentColor',
                  'stroke-width': '1',
                  'stroke-linecap': 'round',
                  'stroke-linejoin': 'round',
                  class: 'd-swap-off icon icon-tabler icons-tabler-outline icon-tabler-copy scale-90',
                },
                [
                  h('path', { d: 'M7 7m0 2.667a2.667 2.667 0 0 1 2.667 -2.667h8.666a2.667 2.667 0 0 1 2.667 2.667v8.666a2.667 2.667 0 0 1 -2.667 2.667h-8.666a2.667 2.667 0 0 1 -2.667 -2.667z' }),
                  h('path', { d: 'M4.012 16.737a2.005 2.005 0 0 1 -1.012 -1.737v-10c0 -1.1 .9 -2 2 -2h10c.75 0 1.158 .385 1.5 1' }),
                ],
              ),
              h(
                'svg',
                {
                  xmlns: 'http://www.w3.org/2000/svg',
                  width: '24',
                  height: '24',
                  viewBox: '0 0 24 24',
                  fill: 'none',
                  stroke: 'currentColor',
                  'stroke-width': '1',
                  'stroke-linecap': 'round',
                  'stroke-linejoin': 'round',
                  class: 'd-swap-on icon icon-tabler icons-tabler-outline icon-tabler-copy scale-90',
                },
                [
                  h('path', { d: 'M7 9.667a2.667 2.667 0 0 1 2.667 -2.667h8.666a2.667 2.667 0 0 1 2.667 2.667v8.666a2.667 2.667 0 0 1 -2.667 2.667h-8.666a2.667 2.667 0 0 1 -2.667 -2.667z' }),
                  h('path', { d: 'M4.012 16.737a2 2 0 0 1 -1.012 -1.737v-10c0 -1.1 .9 -2 2 -2h10c.75 0 1.158 .385 1.5 1' }),
                  h('path', { d: 'M11 14l2 2l4 -4' }),
                ],
              ),
            ],
          ),

        ]),
      ])

      const code = node.children[0]

      node.children = [
        {
          type: 'element',
          tagName: 'div',
          properties: {
            className: 'size-full overflow-y-auto px-6 py-4',
          },
          children: [code],
        },
        button,
      ]

      this.addClassToHast(node, 'd-mockup-code !px-0 !pb-0 overflow-visible')
    },
    // line (node: any) {
    //   this.addClassToHast(node, 'mr-5')
    // },
  }
}
