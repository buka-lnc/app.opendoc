<script setup lang="ts">
import { IconCode, IconCodeOff } from '@tabler/icons-vue'

const props = defineProps<{
  content: string
}>()

const route = useRoute()
const router = useRouter()
const mode = computed(() => (['code', 'ui'].includes(String(route.query.mode)) ? route.query.mode : 'ui'))
async function toggleMode () {
  if (mode.value === 'ui') {
    await router.replace({ query: { mode: 'code' } })
  } else {
    await router.replace({ query: { mode: 'ui' } })
  }
}

</script>
<template>
  <div class="flex flex-col size-full overflow-hidden">
    <div class="flex-1 overflow-hidden">
      <JsonCodeView
        v-if="mode === 'code'"
        class="size-full"
        :value="props.content"
        theme="vs"
      />

      <OpenapiUi
        v-if="mode === 'ui'"
        class="size-full"
        :value="props.content"
      />
    </div>
    <div class="flex-0 border-t px-2 flex items-center justify-between">
      <div />

      <div class="flex items-center space-x-1">
        <button
          class="d-swap swap-flip d-btn d-btn-xs d-btn-square d-btn-ghost"
          :title="mode === 'ui' ? '切换至OpenAPI源代码' : '切换至可视化编辑器'"
          @click="toggleMode()"
        >
          <IconCode
            class="text-base-content size-5"
            :class="{
              'd-swap-on': mode === 'code',
              'd-swap-off': mode !== 'code'
            }"
          />

          <IconCodeOff
            class="text-base-content size-5"
            :class="{
              'd-swap-on': mode === 'ui',
              'd-swap-off': mode !== 'ui'
            }"
          />
        </button>
      </div>
    </div>
  </div>
</template>
