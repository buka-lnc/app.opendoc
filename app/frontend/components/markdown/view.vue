<template>
  <!-- eslint-disable-next-line vue/no-v-html -->
  <div
    :class="[
      'prose lg:prose-xl',
      'prose-pre:shadow-lg',
      'markdown',
    ]"
    v-html="html"
  />
</template>
<script setup lang="ts">
import rehypeAutolinkHeadings from 'rehype-autolink-headings'
import rehypeKatex from 'rehype-katex'
import rehypePrism from 'rehype-prism'
import rehypeSlug from 'rehype-slug'
import rehypeStringify from 'rehype-stringify'
import remarkFrontmatter from 'remark-frontmatter'
import remarkGfm from 'remark-gfm'
import remarkGithub from 'remark-github'
import remarkMath from 'remark-math'
import remarkParse from 'remark-parse'
import remark2rehype from 'remark-rehype'
import { unified } from 'unified'
import { remarkReplaceImageUrl } from '~/utils/remark-replace-image-url'

import 'prismjs/themes/prism.min.css'
import 'prism-themes/themes/prism-a11y-dark.min.css'
import 'prismjs/components/prism-bash.js'
import 'prismjs/components/prism-docker.js'
import 'prismjs/components/prism-typescript.js'
import 'prismjs/components/prism-yaml.js'
import 'prismjs/plugins/line-numbers/prism-line-numbers.css'
import 'prismjs/plugins/toolbar/prism-toolbar.min.css'

const props = defineProps<{
  content: string
}>()

const processor = unified()
  .use(remarkParse)
  .use(remarkFrontmatter)
  .use(remarkReplaceImageUrl, {
    replace: (url: string): string => {
      const nodeURL = (url).replace(/^\.\//, '')
      return `/api/articles/files/${nodeURL}`
    },
  })
  .use(remarkGfm)
  .use(remarkMath)
  .use(remarkGithub, { repository: 'val-istar-guo/article' })
  .use(remark2rehype)
  .use(rehypeSlug)
  .use(rehypeAutolinkHeadings)
  .use(rehypeKatex)
  .use(rehypePrism, {
    plugins: ['line-numbers'],
  })
  .use(rehypeStringify)

const { data: html } = useAsyncData(
  async () => {
    const html = await processor.process(props.content)
    return html.value
  },
  {
    default: () => '<div></div>',
    watch: [() => props.content],
  },
)
</script>
<style lang="postcss">
.markdown code[class*=language-],
.markdown pre[class*=language-] {
  text-shadow: none;
}
.markdown .token.operator {
  background: none;
}
</style>
