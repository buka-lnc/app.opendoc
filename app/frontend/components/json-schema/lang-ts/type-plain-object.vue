<script setup lang="ts">
import { OpenAPIV3 } from 'openapi-types'

defineOptions({
  inheritAttrs: false,
})

const props = withDefaults(
  defineProps<{
    schema: OpenAPIV3.NonArraySchemaObject
    foldable?: boolean
  }>(),
  {
    foldable: false,
  },
)

const fold = defineModel<boolean>('fold')
const schema = toRef(props, 'schema')
</script>

<template>
  <json-schema-lang-ts-line
    v-bind="$attrs"
    class="schema-block-start"
    :schema="schema"
  >
    <slot name="head" />

    <button
      v-if="!!$props.foldable"
      class="cursor-pointer mx-2 schema-punctuation hover:font-bold"
      @click="fold = !fold"
    >
      {{ fold ? '{...}' : '{...' }}
    </button>
    <span v-else class="schema-punctuation">{</span>
  </json-schema-lang-ts-line>

  <div v-if="!$props.foldable || !fold" class="pl-6 schema-block">
    <json-schema-lang-ts-properties
      v-if="schema.properties"
      :properties="schema.properties"
      :required="schema.required"
    />
  </div>

  <json-schema-lang-ts-line
    v-if="!fold || !$props.foldable"
    class="schema-line schema-block-end"
  >
    <span class="schema-punctuation">}</span>
    <slot name="tail" />
  </json-schema-lang-ts-line>
</template>

<style scoped lang="postcss">
</style>
