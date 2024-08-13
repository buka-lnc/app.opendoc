<script setup lang="ts">
import { IconPlus, IconTrash, IconSettings, IconPuzzle, IconPuzzleOff, IconAlertTriangle } from '@tabler/icons-vue'
import { isURL } from 'validator'
import { RequestException } from 'keq-exception'
import { queryPlugins, createPlugin, deletePlugin, updatePlugin } from '@/api/backend'
import { Plugin } from '~/api/backend/components/schemas'

const alert = useAlert()

const { status, data: plugins, execute: reload } = useAsyncData(async () => {
  const body = await queryPlugins()

  return body.results
})

const urlInput = ref('')
const pluginUrl = computed(() => `ws://${urlInput.value}`)
const isValidUrl = computed(() => isURL(pluginUrl.value, { require_host: true, require_tld: false, require_protocol: false, protocols: ['ws'] }))
const { pending: appending, execute: create } = useAsyncFn(async () => {
  if (!pluginUrl.value) return

  try {
    await createPlugin({
      url: pluginUrl.value,
    })

    urlInput.value = ''
    await reload()
  } catch (err) {
    if (!(err instanceof RequestException)) throw err
    alert.error(err.message)
  }
})

const removingCompilerIds = ref<string[]>([])

async function remove (plugin: Plugin): Promise<void> {
  try {
    const pluginId = plugin.id
    removingCompilerIds.value.push(pluginId)
    await deletePlugin({ pluginId })
    removingCompilerIds.value = removingCompilerIds.value.filter(id => id !== pluginId)
    await reload()
  } catch (e) {
    if (e instanceof Error) alert.error(e.message)
  }
}

async function toggleStatus (plugin: Plugin): Promise<void> {
  try {
    await updatePlugin({
      pluginId: plugin.id,
      status: plugin.status !== 'enabled' ? 'enabled' : 'disabled',
    })
    await reload()
  } catch (e) {
    if (e instanceof Error) alert.error(e.message)
  }
}

const pluginInSettings = ref<Plugin | null>(null)

const tipMap = {
  enabled: '已启用',
  disabled: '已禁用',
  breakdown: '已损坏',
}
</script>

<template>
  <plugin-settings-modal
    v-model:plugin="pluginInSettings"
    @updated:plugin="() => reload()"
  />

  <stuffed-loading :pending="status === 'pending' && !plugins">
    <div class="container h-full m-auto flex flex-col">
      <div class="flex-grow-0 flex-shrink-0 w-full mb-6 flex items-center">
        <h1 class="select-none text-2xl font-bold text-gray-600">
          <span>插件</span>
        </h1>

        <span v-if="status === 'pending' && !!plugins" class="ml-2 d-loading d-loading-sm d-loading-spinner text-gray-600" />
      </div>

      <div class="flex-grow-0 flex-shrink-0 flex w-full space-x-4 mb-4">
        <label class="flex-auto d-input d-input-bordered flex items-center gap-2">
          ws://

          <input
            v-model="urlInput"
            class="grow"
            placeholder="请输入需要添加的编译器地址"
            @keydown.enter="() => !appending && create()"
          >

          <kbd
            class="d-kbd d-kbd-sm "
            :class="isValidUrl ? 'opacity-100' : 'opacity-30'"
          >↵</kbd>
        </label>

        <button
          class="flex-0 d-btn d-btn-primary d-btn-square"
          :class="!isValidUrl && 'd-btn-disabled'"
          @click="() => !appending && create()"
        >
          <span v-if="appending" class="d-loading d-loading-spinner" />
          <IconPlus v-else class="size-5" />
        </button>
      </div>

      <div class="flex-1 overflow-y-auto">
        <div
          v-for="plugin in plugins"
          :key="plugin.id"
          class="d-card d-card-compact bg-base-200/70 font-sans"
        >
          <div class="d-card-body flex-row items-center">
            <div class="flex-1 flex flex-col">
              <h2 class="d-card-title items-baseline">
                {{ plugin.name }}
                <span class="text-sm text-base-content/70">v{{ plugin.version }}</span>
              </h2>
              <p class="text-base-content/60">
                {{ plugin.description }}
              </p>
            </div>

            <div class="d-card-actions ">
              <div class="d-tooltip d-tooltip-left" :data-tip="tipMap[plugin.status]">
                <button
                  class="d-btn d-btn-sm d-btn-ghost d-btn-square transition-colors"
                  @click="() => toggleStatus(plugin)"
                >
                  <IconAlertTriangle
                    v-if="plugin.status === 'breakdown'"
                    class="w-6 text-error"
                  />

                  <div
                    v-else
                    class="d-swap"
                    :class="plugin.status === 'enabled' ? 'text-success d-swap-active' : 'text-base-content/70'"
                  >
                    <div class="d-swap-on">
                      <IconPuzzle class="w-6" />
                    </div>
                    <div class="d-swap-off">
                      <IconPuzzleOff class="w-6" />
                    </div>
                  </div>
                </button>
              </div>

              <button
                class="d-btn d-btn-sm d-btn-ghost d-btn-square"
                @click="pluginInSettings = plugin"
              >
                <IconSettings class="w-6" />
              </button>

              <button
                class="d-btn d-btn-sm d-btn-ghost d-btn-square hover:text-error"
                :class="removingCompilerIds.includes(plugin.id) && 'd-btn-disabled'"
                @click="() => !removingCompilerIds.includes(plugin.id) && remove(plugin)"
              >
                <IconTrash class="w-6" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </stuffed-loading>
</template>

<style scoped lang="postcss">
</style>
