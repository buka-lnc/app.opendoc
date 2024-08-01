<script setup lang="ts">
import { useRouteParams } from '@vueuse/router'
import { ASYNCAPI_SCHEMAS_INJECT_KEY } from '~/constants/asyncapi-schemas-inject-key'

const schemas = inject(ASYNCAPI_SCHEMAS_INJECT_KEY, toRef([]))

const schemaUid = useRouteParams<string>('schema_uid')
const schema = computed(() => schemas.value.find(schema => schema.$uid === schemaUid.value))

const toReference = useAsyncapiToReference()
</script>

<template>
  <div class="size-full text-base-content">
    <div v-if="schema" class="p-10 size-full overflow-y-auto">
      <div class="mb-4 text-xl text-base-content/70">
        {{ schema.$name }}
      </div>

      <flexible-div class="bg-base-200/30 rounded-sm">
        <div class="p-6">
          <json-schema-lang-ts
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
