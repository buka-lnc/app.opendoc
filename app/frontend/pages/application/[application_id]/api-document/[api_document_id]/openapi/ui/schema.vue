<script setup lang="ts">
import { OPENDOC_SCHEMAS_INJECT_KEY } from '~/constants/opendoc-schemas-inject-key'

const { schemas } = inject(OPENDOC_SCHEMAS_INJECT_KEY, { schemas: [] })

const route = useRoute()
const prefix = computed(() => `/application/${String(route.params.application_id)}/api-document/${String(route.params.api_document_id)}/openapi/ui/schema`)

const router = useRouter()
watch(
  () => toValue(schemas),
  async () => {
    const results = toValue(schemas)

    if (route.path === prefix.value && results.length > 0) {
      await router.replace(`${prefix.value}/${results[0].id}`)
    }
  },
  {
    immediate: true,
  },
)
</script>

<template>
  <div class="size-full flex items-stretch">
    <ul class="flex-0 d-menu d-menu-sm bg-base-100 overflow-hidden border-r p-0 w-fit h-full">
      <li v-for="schema in schemas" :key="schema.title">
        <NuxtLink
          :to="`${prefix}/${schema.id}`"
          active-class="d-active"
        >
          {{ schema.title }}
        </NuxtLink>
      </li>
    </ul>

    <div class="flex-1">
      <NuxtPage />
    </div>
  </div>
</template>

<style scoped lang="postcss">
</style>
