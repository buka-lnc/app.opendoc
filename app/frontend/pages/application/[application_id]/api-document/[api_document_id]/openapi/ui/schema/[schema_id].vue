<script setup lang="ts">
import { OPENDOC_SCHEMAS_INJECT_KEY } from '~/constants/opendoc-schemas-inject-key'

const route = useRoute()
const { schemas } = inject(OPENDOC_SCHEMAS_INJECT_KEY, { schemas: [] })

const schema = computed(() => toValue(schemas).find(schema => schema.id === route.params.schema_id))
</script>

<template>
  <div class="size-full p-10 bg-base-300 text-base-content">
    <json-schema-lang-ts-type v-if="schema" :schema="schema.value" />
  </div>
</template>

<style scoped lang="postcss">
</style>
