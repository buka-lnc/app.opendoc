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

const content = computed(() => {
  if (!props.body || !active.value) return
  return props.body[active.value]
})
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
      <json-schema-lang-ts
        v-if="content?.schema"
        :schema="content?.schema"
      />
    </div>
  </div>

  <empty-placeholder v-else class="flex-1 py-8" />
</template>

<style scoped lang="postcss">
</style>
