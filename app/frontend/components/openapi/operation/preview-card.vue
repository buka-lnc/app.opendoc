<script setup lang="ts">
import { useElementHover } from '@vueuse/core'
import { OpendocOperation } from '~/types/opendoc-operation.js'

const props = defineProps<{
  operation: OpendocOperation
}>()

const deprecated = computed(() => !!props.operation.deprecated)
const description = computed(() => props.operation.value.description)

const card = ref()
const isCardHover = useElementHover(card)

</script>

<template>
  <div
    ref="card"
    class="size-full"
    :data-tip="operation.description"
  >
    <tip
      v-if="description || deprecated"
      :show="isCardHover"
      :error="deprecated"
      class="space-x-2"
    >
      <!-- eslint-disable-next-line vue/singleline-html-element-content-newline -->
      <template v-if="deprecated">废弃</template><template v-if="deprecated && description">：</template><template v-if="description">{{ description }}</template>
    </tip>

    <div class="flex items-start py-2 px-2 space-x-1 size-full">
      <div class="flex-0">
        <openapi-operation-icon :operation="props.operation" />
      </div>

      <div class="flex-auto flex flex-col justify-center items-start h-full overflow-hidden">
        <span
          class="leading-4 max-w-full truncate"
          :class="deprecated && 'text-gray-600'"
        >
          {{ props.operation.title }}
        </span>
        <span
          class="text-xs leading-4 text-gray-400 max-w-full truncate"
          :class="deprecated && 'text-gray-600'"
        >
          {{ props.operation.pathname }}
        </span>
      </div>
    </div>
  </div>
</template>

<style scoped lang="postcss">
</style>
