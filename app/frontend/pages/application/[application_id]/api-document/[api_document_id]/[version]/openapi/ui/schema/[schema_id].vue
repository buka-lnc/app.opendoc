<script setup lang="ts">
import { OPENDOC_SCHEMAS_INJECT_KEY } from '~/constants/opendoc-schemas-inject-key'

const route = useRoute()
const { schemas } = inject(OPENDOC_SCHEMAS_INJECT_KEY, { schemas: [] })

const schema = computed(() => toValue(schemas).find(schema => schema.id === route.params.schema_id))
</script>

<template>
  <div class="size-full bg-base-300 text-base-content">
    <div class="p-10 size-full overflow-y-auto">
      <div class="mb-4 text-xl text-base-content/70">{{ schema?.title }}</div>

      <flexible-div class="bg-base-100/20 rounded-sm">
        <div class="p-6">
          <json-schema-lang-ts v-if="schema" :schema="schema.value" />
        </div>
      </flexible-div>
    </div>
  </div>
</template>

<style scoped lang="postcss">
</style>
