<script setup lang="ts">
import { IconPlus, IconTrash } from '@tabler/icons-vue'
import dayjs from 'dayjs'
import { createForbiddenApplicationCode, deleteForbiddenApplicationCode, queryForbiddenApplicationCodes } from '~/api/backend'

const { data: forbiddenApplicationCodes, pending, execute: reload } = useAsyncData(
  async () => await queryForbiddenApplicationCodes<'200'>(),
)

const alert = useAlert()
const applicationCode = ref('')
const {
  pending: appending,
  execute: appendForbiddenApplicationCode,
} = useAsyncFn(
  async () => {
    try {
      await createForbiddenApplicationCode({
        code: applicationCode.value,
      })
      applicationCode.value = ''
    } catch (e) {
      if (e instanceof Error) alert.error(e.message)
    }

    await reload()
  },
)

const removingForbiddenApplicationCode = ref<string[]>([])

async function removeForbiddenApplicationCode (code: string) {
  removingForbiddenApplicationCode.value.push(code)
  await deleteForbiddenApplicationCode({ code })
  await reload()
  removingForbiddenApplicationCode.value = removingForbiddenApplicationCode.value.filter(c => c !== code)
}
</script>

<template>
  <StuffedLoading :pending="pending && !forbiddenApplicationCodes">
    <div class="flex w-full space-x-4 mb-6">
      <input
        v-model="applicationCode"
        class="flex-auto d-input d-input-bordered"
        placeholder="请输入需要添加的应用编号"
      >

      <button
        class="flex-0 d-btn d-btn-primary d-btn-square"
        :class="!applicationCode.length && 'd-btn-disabled'"
        @click="() => !appending && appendForbiddenApplicationCode()"
      >
        <span v-if="appending" class="loading loading-spinner" />
        <IconPlus v-else class="size-5" />
      </button>
    </div>

    <div class="overflow-x-auto">
      <table class="d-table">
        <thead>
          <tr>
            <th>应用编码</th>
            <th>更新日期</th>
            <th />
          </tr>
        </thead>

        <tbody>
          <tr
            v-for="forbiddenCode in forbiddenApplicationCodes"
            :key="forbiddenCode.id"
            class="bg-base-300"
          >
            <th>{{ forbiddenCode.code }}</th>
            <th>{{ dayjs(forbiddenCode.updatedAt).format('YYYY-MM-DD HH:mm:ss') }}</th>
            <th class="w-10 text-center">
              <button
                class="d-btn d-btn-ghost d-btn-square"
                :class="removingForbiddenApplicationCode.includes(forbiddenCode.code) && 'd-btn-disabled'"
                @click="() => !removingForbiddenApplicationCode.includes(forbiddenCode.code) && removeForbiddenApplicationCode(forbiddenCode.code)"
              >
                <IconTrash class="w-6" />
              </button>
            </th>
          </tr>
        </tbody>
      </table>
    </div>
  </StuffedLoading>
</template>

<style scoped lang="postcss">
</style>
