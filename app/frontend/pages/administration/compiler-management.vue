<script setup lang="ts">
import { IconPlus, IconTrash, IconSettings, IconPuzzle, IconPuzzleOff } from '@tabler/icons-vue'
import { isURL } from 'validator'
import { RequestException } from 'keq-exception'
import { queryCompilers, createCompiler, deleteCompiler, updateCompiler } from '@/api/backend'
import { Compiler } from '~/api/backend/components/schemas'

const alert = useAlert()

const { status, data: compilers, execute: reload } = useAsyncData(async () => {
  const body = await queryCompilers()

  return body.results
})

const urlInput = ref('')
const compilerUrl = computed(() => `ws://${urlInput.value}`)
const isValidUrl = computed(() => isURL(compilerUrl.value, { require_host: true, require_protocol: true, protocols: ['ws'] }))
const { pending: appending, execute: create } = useAsyncFn(async () => {
  if (!compilerUrl.value) return

  try {
    await createCompiler({
      url: compilerUrl.value,
    })

    urlInput.value = ''
    await reload()
  } catch (err) {
    if (!(err instanceof RequestException)) throw err
    alert.error(err.message)
  }
})

const removingCompilerIds = ref<string[]>([])

async function remove (compiler: Compiler): Promise<void> {
  try {
    const compilerId = compiler.id
    removingCompilerIds.value.push(compilerId)
    await deleteCompiler({ compilerId })
    removingCompilerIds.value = removingCompilerIds.value.filter(id => id !== compilerId)
    await reload()
  } catch (e) {
    if (e instanceof Error) alert.error(e.message)
  }
}

async function toggleStatus (compiler: Compiler): Promise<void> {
  try {
    await updateCompiler({
      compilerId: compiler.id,
      status: compiler.status === 'enabled' ? 'disabled' : 'enabled',
    })
    await reload()
  } catch (e) {
    if (e instanceof Error) alert.error(e.message)
  }
}

const compilerInSettings = ref<Compiler | null>(null)
</script>

<template>
  <compiler-settings-modal
    v-model:compiler="compilerInSettings"
    @updated:compiler="() => reload()"
  />

  <stuffed-loading :pending="status === 'pending' && !compilers">
    <div class="container h-full m-auto flex flex-col overflow-hidden">
      <div class="flex-grow-0 flex-shrink-0 w-full mb-6 flex items-center">
        <h1 class="select-none text-2xl font-bold text-gray-600">
          <span>编译器</span>
        </h1>

        <span v-if="status === 'pending' && !!compilers" class="ml-2 d-loading d-loading-sm d-loading-spinner text-gray-600" />
      </div>

      <div class="flex-grow-0 flex-shrink-0 flex w-full space-x-4 mb-4 overflow-hidden">
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
          v-for="compiler in compilers"
          :key="compiler.id"
          class="d-card d-card-compact bg-base-200/70 font-sans"
        >
          <div class="d-card-body flex-row items-center">
            <div class="flex-1 flex flex-col">
              <h2 class="d-card-title items-baseline">
                {{ compiler.name }}
                <span class="text-sm text-base-content/70">v{{ compiler.version }}</span>
              </h2>
              <p class="text-base-content/60">
                {{ compiler.description }}
              </p>
            </div>

            <div class="d-card-actions ">
              <button
                class="d-swap d-btn d-btn-sm d-btn-ghost d-btn-square transition-colors d-tooltip"
                :data-tip="compiler.status === 'enabled' ? '已启用' : '已禁用'"
                @click="() => toggleStatus(compiler)"
              >
                <div
                  class="d-swap"
                  :class="compiler.status === 'enabled' ? 'text-success d-swap-active' : 'text-error'"
                >
                  <div class="d-swap-on">
                    <IconPuzzle class="w-6" />
                  </div>
                  <div class="d-swap-off">
                    <IconPuzzleOff class="w-6" />
                  </div>
                </div>
              </button>

              <button
                class="d-btn d-btn-sm d-btn-ghost d-btn-square"
                @click="compilerInSettings = compiler"
              >
                <IconSettings class="w-6" />
              </button>

              <button
                class="d-btn d-btn-sm d-btn-ghost d-btn-square hover:text-error"
                :class="removingCompilerIds.includes(compiler.id) && 'd-btn-disabled'"
                @click="() => !removingCompilerIds.includes(compiler.id) && remove(compiler)"
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
