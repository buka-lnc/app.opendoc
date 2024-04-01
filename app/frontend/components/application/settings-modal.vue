<script setup lang="ts">
import { Application } from '~/api/backend/components/schemas'

const props = defineProps<{
  application: Application
}>()

const application = toRef(props, 'application')

const show = defineModel<boolean>('show', {
  default: false,
})

defineEmits<{
  'changed:application': [code: string]
  'deleted:apiDocument': [code: string]
  'changed:apiDocument': [code: string]
}>()

const active = ref('0')
const activeApiDocument = computed(() => application.value.apiDocuments.find(item => item.id === active.value))
</script>

<template>
  <Teleport to="body">
    <dialog class="d-modal overflow-auto" :class="show && 'd-modal-open'">
      <div class="d-modal-box w-[48rem] max-w-[48rem] h-[44rem] max-h-[44rem] p-0 font-sans !border-[#5b6078] overflow-auto">
        <div class="flex-auto flex flex-row size-full overflow-hidden">
          <div class="flex-0 bg-base-200 w-40">
            <ul class="d-menu">
              <li>
                <button
                  :class="active === '0' && 'd-active'"
                  @click="active = '0'"
                >
                  应用配置
                </button>
              </li>

              <li class="d-menu-title select-none">
                文档
              </li>

              <li v-for="apiDocument in application.apiDocuments" :key="apiDocument.id">
                <button
                  :class="active === apiDocument.id && 'd-active'"
                  @click="active = apiDocument.id"
                >
                  {{ apiDocument.title }}
                </button>
              </li>
            </ul>
          </div>

          <div class="flex-auto flex flex-col px-8 py-4 bg-base-100 size-full overflow-hidden">
            <div class="flex-auto overflow-auto">
              <application-settings-modal-application-settings
                v-if="active === '0'"
                :application="application"
                @changed:application="$emit('changed:application', $event)"
              />

              <application-settings-modal-api-document-settings
                v-else-if="activeApiDocument"
                :application="application"
                :api-document="activeApiDocument"
                @deleted:api-document="$emit('deleted:apiDocument', $event)"
                @changed:api-document="$emit('changed:apiDocument', $event)"
              />
            </div>

            <div class="d-modal-action flex-0">
              <button class="d-btn" @click="show = false">
                关闭
              </button>
            </div>

          <!-- <input class="d-input d-input-bordered" placeholder="名称"> -->
          </div>
        </div>
      </div>
    </dialog>
  </Teleport>
</template>

<style scoped lang="postcss">
</style>
