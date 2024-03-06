<script setup lang="ts">
import { OpenAPIV3 } from 'openapi-types'

const props = defineProps<{
  operation: OpenAPIV3.OperationObject
}>()

const [requestBody] = useDereference<OpenAPIV3.RequestBodyObject>(() => props.operation?.requestBody)

const requestBodyMedia = ref<string>()
watchEffect(() => {
  if (requestBody.value) {
    const medias = Object.keys(requestBody.value.content)
    requestBodyMedia.value = medias[0]
  }
})
const requestBodyMediaContent = computed(() => {
  if (!requestBodyMedia.value) return
  return requestBody.value?.content[requestBodyMedia.value]
})

const [requestBodyMediaSchema] = useDereference<OpenAPIV3.SchemaObject | OpenAPIV3.ReferenceObject>(() => requestBodyMediaContent.value?.schema)
</script>

<template>
  <div
    v-if="requestBody"
    class="space-y-4"
  >
    <div>
      <ul class="d-menu d-menu-horizontal d-menu-xs bg-base-200 p-0">
        <li
          v-for="(value, media) in requestBody.content"
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
        v-if="requestBodyMediaSchema"
        :schema="requestBodyMediaSchema"
      />
    </div>
  </div>
</template>

<style scoped lang="postcss">
</style>
