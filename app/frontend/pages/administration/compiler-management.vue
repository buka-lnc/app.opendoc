<script setup lang="ts">
import { IconPlus, IconTrash } from '@tabler/icons-vue'
import { isURL } from 'validator'
import { RequestException } from 'keq-exception'
import { queryCompilers, createCompiler, deleteCompiler } from '@/api/backend'

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

async function remove (compilerId: string): Promise<void> {
  try {
    removingCompilerIds.value.push(compilerId)
    await deleteCompiler({ compilerId })
    removingCompilerIds.value = removingCompilerIds.value.filter(id => id !== compilerId)
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
        <table class="d-table d-table-sm">
          <thead class="bg-base-100 sticky top-0">
            <tr>
              <th>编译器地址</th>
              <th />
            </tr>
          </thead>

          <tbody>
            <tr
              v-for="compiler in compilers"
              :key="compiler.id"
              class="bg-base-300"
            >
              <th>{{ compiler.url }}</th>
              <th class="w-10 text-center">
                <button
                  class="d-btn d-btn-sm d-btn-ghost d-btn-square"
                  :class="removingCompilerIds.includes(compiler.id) && 'd-btn-disabled'"
                  @click="() => !removingCompilerIds.includes(compiler.id) && remove(compiler.id)"
                >
                  <IconTrash class="w-6" />
                </button>
              </th>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </stuffed-loading>
</template>

<style scoped lang="postcss">
</style>
