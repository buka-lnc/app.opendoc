<script setup lang="ts">
import { APPLICATION_INJECT_KEY } from '~/constants/application-inject-key'

const { application, sheets } = inject(APPLICATION_INJECT_KEY, {
  application: toRef(null),
  sheets: toRef([]),
})

const show = defineModel<boolean>('show', {
  default: false,
})

defineEmits<{
  'updated:application': [code: string]
  'deleted:sheet': [code: string]
  'updated:sheet': [code: string]
}>()

const activeSheetId = ref('0')
const activeSheet = computed(() => sheets.value.find(sheet => sheet.id === activeSheetId.value))

watchEffect(() => {
  if (activeSheetId.value !== '0' && sheets.value.every(sheet => sheet.id !== activeSheetId.value)) {
    activeSheetId.value = '0'
  }
})
</script>

<template>
  <Teleport to="body">
    <dialog v-if="application" class="d-modal overflow-auto" :class="show && 'd-modal-open'">
      <div class="d-modal-box w-[48rem] max-w-[48rem] h-[44rem] max-h-[44rem] p-0 font-sans !border-[#5b6078] overflow-auto">
        <div class="flex-auto flex flex-row size-full overflow-hidden">
          <div class="flex-0 bg-ctp-mantle w-40">
            <ul class="d-menu">
              <li>
                <button
                  :class="activeSheetId === '0' && 'd-active'"
                  @click="activeSheetId = '0'"
                >
                  应用配置
                </button>
              </li>

              <li class="d-menu-title select-none">
                文档
              </li>

              <li v-for="sheet in sheets" :key="sheet.id">
                <button
                  :class="activeSheetId === sheet.id && 'd-active'"
                  @click="activeSheetId = sheet.id"
                >
                  {{ sheet.title }}
                </button>
              </li>
            </ul>
          </div>

          <div class="flex-auto flex flex-col px-8 py-4 bg-base-100 size-full overflow-hidden">
            <div class="flex-auto overflow-auto">
              <application-settings-modal-application-settings
                v-if="activeSheetId === '0'"
                :application="application"
                @updated:application="$emit('updated:application', $event)"
              />

              <application-settings-modal-sheet-settings
                v-else-if="activeSheet"
                :application="application"
                :sheet="activeSheet"
                @deleted:sheet="$emit('deleted:sheet', $event)"
                @updated:sheet="$emit('updated:sheet', $event)"
              />
            </div>

            <div class="d-modal-action flex-0">
              <button class="d-btn" @click="show = false">
                关闭
              </button>
            </div>
          </div>
        </div>
      </div>
    </dialog>
  </Teleport>
</template>

<style scoped lang="postcss">
</style>
