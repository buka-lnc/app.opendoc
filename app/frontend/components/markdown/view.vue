<template>
  <StuffedLoading :pending="pending">
    <!-- eslint-disable-next-line vue/no-v-html -->
    <div
      v-bind="$attrs"
      :class="[
        'font-sans',
        'prose prose-invert lg:prose-xl',
        'prose-pre:border-4 prose-pre:border-base-content/10',
        'markdown',
      ]"
      v-html="html"
    />
  </StuffedLoading>
</template>
<script setup lang="ts">
import rehypeAutolinkHeadings from 'rehype-autolink-headings'
import rehypeKatex from 'rehype-katex'
import rehypeSlug from 'rehype-slug'
import rehypeStringify from 'rehype-stringify'
import remarkFrontmatter from 'remark-frontmatter'
import remarkGfm from 'remark-gfm'
import remarkGithub from 'remark-github'
import remarkMath from 'remark-math'
import remarkParse from 'remark-parse'
import remark2rehype from 'remark-rehype'
import rehypeShiki from '@shikijs/rehype'
import { unified } from 'unified'
import { getSingletonHighlighter } from 'shiki'
import { latte, macchiato } from '@catppuccin/vscode'

const highlighter = await getSingletonHighlighter()

defineOptions({
  inheritAttrs: false,
})

const props = defineProps<{
  content: string
}>()

await highlighter.loadTheme(macchiato as any)
await highlighter.loadTheme(latte as any)

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
  .use(rehypeShiki, {
    themes: {
      light: 'catppuccin-latte',
      dark: 'catppuccin-macchiato',
    },
    transformers: [shikiCopyButton()],
  })
  // .use(rehypeAddCopyButtonToPre)
  .use(rehypeStringify)

// const html = ref<string>('')
const { pending, data: html } = useAsyncData(
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
.markdown pre {
  text-shadow: none;
}

</style>
