<script setup lang="ts">
import { CompilerOption } from '~/api/backend/components/schemas'

const props = defineProps<{
  option: CompilerOption
}>()

const value = toRef(props.option, 'value')
</script>

<template>
  <label
    v-if="option.format === 'string'"
    class="d-form-control w-full max-w-sm"
  >
    <div class="d-label">
      <span class="d-label-text">{{ option.label }}</span>
    </div>

    <input
      v-model="value"
      type="text"
      class="d-input d-input-bordered w-full max-w-sm"
    >
  </label>

  <label v-else-if="option.format === 'number'">
    <div class="d-label">
      <span class="d-label-text">{{ option.label }}</span>
    </div>

    <input
      v-model="value"
      type="number"
      class="d-input d-input-bordered w-full max-w-sm"
    >
  </label>

  <label v-else-if="option.format === 'boolean'">
    <SelectBox v-model="value" class="w-32">
      <SelectButton
        class="d-join-item d-select-lg d-select-bordered"
      >
        {{ value ? '是' : '否' }}
      </SelectButton>

      <template #options>
        <SelectOption class="d-btn-lg" :value="true">
          是
        </SelectOption>
        <SelectOption class="d-btn-lg" :value="false">
          否
        </SelectOption>
      </template>
    </SelectBox>
  </label>
</template>

<style scoped lang="postcss">
</style>
