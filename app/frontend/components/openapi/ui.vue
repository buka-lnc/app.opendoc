<script setup lang="ts">
import type { OpenAPIV3 } from 'openapi-types'

const props = defineProps<{
  value: string
}>()

const openapi = computed(() => JSON.parse(props.value) as OpenAPIV3.Document)

const schemas = computed(() => Object.entries(openapi.value.components?.schemas || {})
  .map(([title, value]) => ({
    id: `#/components/schemas/${title}`,
    title,
    value,
  })))
</script>
<template>
  <div class="flex">
    <div class="border-r">
      <div v-for="schema in schemas" :key="schema.title">
        <div>{{ schema.title }}</div>
      </div>
    </div>

    <div>
      123
    </div>
  </div>
</template>
