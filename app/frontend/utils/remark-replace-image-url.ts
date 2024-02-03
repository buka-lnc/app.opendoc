import type { Plugin } from 'unified'
import { Node } from 'unist'
import { visit } from 'unist-util-visit'

interface remarkReplaceImageUrlOptions {
  replace: (url: string) => string
}

export const remarkReplaceImageUrl: Plugin<[remarkReplaceImageUrlOptions]> = options => (tree) => {
  const isImage = (node: Node): boolean => node && 'type' in node && node.type === 'image'
  const isRelative = (node: Node): boolean => node && 'url' in node && typeof node.url === 'string' && node.url[0] === '.'

  const selector = (node: Node): boolean => isImage(node) && isRelative(node)
  const visitor = (node: any): void => {
    node.url = options.replace(node.url)
  }

  visit(tree, selector, visitor)
}
