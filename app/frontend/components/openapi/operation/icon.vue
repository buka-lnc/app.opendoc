<script setup lang="ts">
import {
  IconHttpGet,
  IconHttpPost,
  IconHttpPut,
  IconHttpDelete,
  IconHttpHead,
  IconHttpPatch,
  IconHttpOptions,
} from '@tabler/icons-vue'
import { OpenapiOperation } from '~/types/openapi-operation'

const props = defineProps<{
  operation: OpenapiOperation
}>()

const deprecated = computed(() => !!props.operation.deprecated)
const method = computed(() => props.operation.$method)
const textColor = useOpenapiMethodTextColor(method)
const color = computed(() => (deprecated.value ? 'text-base-content/40' : textColor.value))
</script>

<template>
  <IconHttpGet
    v-if="method === 'get'"
    :class="[color,'size-8']"
  />

  <IconHttpPost
    v-if="method === 'post'"
    :class="[color,'size-8']"
  />

  <IconHttpPut
    v-if="method === 'put'"
    :class="[color,'size-8']"
  />

  <IconHttpDelete
    v-if="method === 'delete'"
    :class="[color,'size-8']"
  />

  <IconHttpHead
    v-if="method === 'head'"
    :class="[color,'size-8']"
  />

  <IconHttpPatch
    v-if="method === 'patch'"
    :class="[color,'size-8']"
  />

  <IconHttpOptions
    v-if="method === 'options'"
    :class="[color,'size-8']"
  />
</template>

<style scoped lang="postcss">
</style>
