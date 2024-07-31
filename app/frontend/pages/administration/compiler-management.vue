<script setup lang="ts">
import { IconPlus, IconTrash, IconSettings, IconCpu, IconCpuOff } from '@tabler/icons-vue'
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

</script>

<template>
  <stuffed-loading :pending="status === 'pending' && !compilers">
    <div class="container h-full m-auto flex flex-col overflow-hidden">
      <div class="flex-grow-0 flex-shrink-0 w-full mb-6">
        <h1 class="select-none text-2xl font-bold text-gray-600">
          编译器
        </h1>
      </div>

      <div class="flex-grow-0 flex-shrink-0 flex w-full space-x-4 mb-4 overflow-hidden">
        <label class="flex-auto d-input d-input-bordered flex items-center gap-2">
          ws://

          <input
            v-model="urlInput"
            class="grow"
            placeholder="请输入需要添加的编译器地址"
          >
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
          class="d-card d-card-compact bg-base-200/70 transition-[background] border-b last:border-none border-neutral"
        >
          <div class="d-card-body flex-row items-center">
            <h2 class="d-card-title">
              {{ compiler.name }}
            </h2>
            <p>{{ compiler.description }}</p>

            <div class="d-card-actions ">
              <button
                class="d-swap d-btn d-btn-sm d-btn-ghost d-btn-square transition-colors"
                @click="() => toggleStatus(compiler)"
              >
                <div
                  class="d-swap"
                  :class="compiler.status === 'enabled' ? 'text-green-400 d-swap-active' : 'text-red-400'"
                >
                  <div class="d-swap-on">
                    <IconCpu class="w-6" />
                  </div>
                  <div class="d-swap-off">
                    <IconCpuOff class="w-6" />
                  </div>
                </div>
              </button>

              <!-- <button
                class="d-btn d-btn-sm d-btn-ghost d-btn-square transition-colors"
                :class="compiler.status === 'enabled' ? 'text-green-400' : 'text-red-400'"
                @click="() => toggleStatus(compiler)"
              >
                <IconCpu v-if="compiler.status === 'enabled'" class="w-6" />
                <IconCpuOff v-else class="w-6" />
              </button> -->

              <button
                class="d-btn d-btn-sm d-btn-ghost d-btn-square"
              >
                <IconSettings class="w-6" />
              </button>

              <button
                class="d-btn d-btn-sm d-btn-ghost d-btn-square"
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
