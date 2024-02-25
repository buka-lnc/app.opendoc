<script setup lang="ts">
import { IconCode, IconBrowser } from '@tabler/icons-vue'

const props = defineProps<{
  content: string
}>()

const route = useRoute()
const router = useRouter()
const mode = computed(() => (['code', 'ui'].includes(String(route.query.mode)) ? route.query.mode : 'ui'))
async function toggleMode (m?: 'code' | 'ui') {
  if (m) {
    if (route.query.mode !== m) {
      await router.replace({ query: { mode: m } })
    }
    return
  }

  if (mode.value === 'ui') {
    await router.replace({ query: { mode: 'code' } })
    return
  }

  await router.replace({ query: { mode: 'ui' } })
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
        <div class="d-join">
          <button
            class="d-join-item d-btn d-btn-xs d-btn-ghost d-btn-square"
            :class="mode === 'code' && 'd-btn-active'"
            @click="toggleMode('code')"
          >
            <IconCode
              class="size-4"
            />
          </button>

            <div
              class="d-join-item d-btn d-btn-xs d-btn-ghost d-btn-square"
              :class="mode === 'ui' && 'd-btn-active'"
              @click="toggleMode('ui')"
            >
              <IconBrowser
                class="size-4"
              />
            </div>
        </div>
      </div>
    </div>
  </div>
</template>
