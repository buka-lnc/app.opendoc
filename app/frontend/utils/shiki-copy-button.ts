import { h } from 'hastscript'
import { ShikiTransformer } from 'shiki'

export function shikiCopyButton (): ShikiTransformer {
  return {
    name: 'shiki-transformer-copy-button',
    pre (node: any) {
      const button = h('button', {
        class: 'copy d-btn d-btn-xs d-btn-square absolute top-4 right-6 opacity-50',
        'data-code': this.source,
      }, [
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
            class: 'icon icon-tabler icons-tabler-outline icon-tabler-copy scale-90',
          },
          [
            h('path', { d: 'M7 7m0 2.667a2.667 2.667 0 0 1 2.667 -2.667h8.666a2.667 2.667 0 0 1 2.667 2.667v8.666a2.667 2.667 0 0 1 -2.667 2.667h-8.666a2.667 2.667 0 0 1 -2.667 -2.667z' }),
            h('path', { d: 'M4.012 16.737a2.005 2.005 0 0 1 -1.012 -1.737v-10c0 -1.1 .9 -2 2 -2h10c.75 0 1.158 .385 1.5 1' }),
          ],
        ),
      ])

      const code = node.children[0]
      // this.addClassToHast(code, 'mx-4')

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

      this.addClassToHast(node, 'd-mockup-code !px-0 !pb-0')
    },
    // line (node: any) {
    //   this.addClassToHast(node, 'mr-5')
    // },
  }
}
