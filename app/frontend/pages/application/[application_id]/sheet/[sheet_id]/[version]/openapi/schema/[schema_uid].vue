<script setup lang="ts">
import { useRouteParams } from '@vueuse/router'
import { OPENAPI_SCHEMAS_INJECT_KEY } from '~/constants/openapi-schemas-inject-key'

const schemaUid = useRouteParams<string>('schema_uid')

const schemas = inject(OPENAPI_SCHEMAS_INJECT_KEY, toRef([]))
const schema = computed(() => toValue(schemas).find(schema => schema.$uid === schemaUid.value))

const toReference = useOpenapiToReference()
</script>

<template>
  <div class="size-full text-base-content">
    <div class="p-10 size-full overflow-y-auto">
      <div class="mb-4 text-xl text-base-content/70">
        {{ schema?.title }}
      </div>

      <flexible-div class="bg-base-200/30 rounded-sm">
        <div class="p-6">
          <json-schema
            v-if="schema"
            :schema="schema"
            :to-reference="toReference"
          />
        </div>
      </flexible-div>
    </div>
  </div>
</template>

<style scoped lang="postcss">
</style>
