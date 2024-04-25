<script setup lang="ts">
import { OpenAPIV3 } from 'openapi-types'

defineOptions({
  inheritAttrs: false,
})

const props = withDefaults(
  defineProps<{
    schema: OpenAPIV3.NonArraySchemaObject
    foldable?: boolean
    toReference:(referenceId: string, reference: string) => string
  }>(),
  {
    foldable: false,
  },
)

const fold = defineModel<boolean>('fold')
const schema = toRef(props, 'schema')
</script>

<template>
  <json-schema-lang-ts-block
    v-bind="$attrs"
    :schema="schema"
    :hide-content="$props.foldable && fold"
    :hide-tail="!$props.foldable || !fold"
  >
    <template #head>
      <slot name="head" />

      <button
        v-if="!!$props.foldable"
        class="cursor-pointer mx-2 schema-punctuation hover:font-bold"
        @click="fold = !fold"
      >
        {{ fold ? '{...}' : '{...' }}
      </button>
      <span v-else class="schema-punctuation">{</span>
    </template>

    <json-schema-lang-ts-properties
      v-if="schema.properties"
      :properties="schema.properties"
      :required="schema.required"
      :to-reference="props.toReference"
    />

    <template #tail>
      <span class="schema-punctuation">}</span>
      <slot name="tail" />
    </template>
  </json-schema-lang-ts-block>
</template>

<style scoped lang="postcss">
</style>
