<script setup lang="ts">
import { OpenAPIV3 } from 'openapi-types'

defineOptions({
  inheritAttrs: false,
})

withDefaults(
  defineProps<{
    schema?: OpenAPIV3.SchemaObject

    hideHead?: boolean
    hideContent?: boolean
    hideTail?: boolean
  }>(),
  {
    hideHead: () => false,
    hideContent: () => false,
    hideTail: () => false,
  },
)
</script>

<template>
  <json-schema-lang-ts-line
    v-if="!$props.hideHead"
    class="schema-block-head"
    v-bind="$attrs"
    :schema="$props.schema"
  >
    <slot name="head" />
  </json-schema-lang-ts-line>

  <div v-if="!$props.hideContent" class="schema-block">
    <slot />
  </div>

  <json-schema-lang-ts-line
    v-if="$props.hideTail"
    class="schema-block-tail"
  >
    <slot name="tail" />
  </json-schema-lang-ts-line>
</template>

<style scoped lang="postcss">
</style>
