<script setup lang="ts">
import { OpenAPIV3 } from 'openapi-types'

const props = defineProps<{
  body: Record<string, OpenAPIV3.MediaTypeObject>
}>()

const active = ref<string>()
watchEffect(() => {
  if (props.body) {
    const medias = Object.keys(props.body)
    active.value = medias[0]
  }
})
console.log('🚀 ~ active:', active.value)

const content = computed(() => {
  if (!props.body || !active.value) return
  return props.body[active.value]
})
console.log('🚀 ~ content ~ content:', content.value)

const [schema] = useDereference<OpenAPIV3.SchemaObject | OpenAPIV3.ReferenceObject>(() => content?.value?.schema)
console.log('🚀 ~ schema:', schema.value)
</script>

<template>
  <div
    v-if="body"
    class="space-y-4"
  >
    <div>
      <ul class="d-menu d-menu-horizontal d-menu-xs bg-base-200 p-0">
        <li
          v-for="(value, media) in body"
          :key="media"
        >
          <NuxtLink
            :to="`#${media}`"
            class="d-active"
          >
            {{ media }}
          </NuxtLink>
        </li>
      </ul>
    </div>

    <div>
      <SchemaLangTsType
        v-if="schema"
        :schema="schema"
      />
    </div>
  </div>

  <empty-placeholder v-else class="flex-1 py-8" />
</template>

<style scoped lang="postcss">
</style>
