<script setup lang="ts">
import { IconMoon, IconSun } from '@tabler/icons-vue'

// defineOptions({
//   inheritAttrs: false,
// })

const theme = useTheme()
function changeTheme () {
  theme.value = theme.value === 'dark' ? 'light' : 'dark'
}
</script>

<template>
  <label
    class="d-swap"
    :class="theme === 'light' && 'd-swap-active'"
    @click="changeTheme"
  >

    <div class="d-swap-on">
      <IconSun class="size-8" />
    </div>
    <div class="d-swap-off">
      <IconMoon class="size-8" />
    </div>
  </label>
</template>

<style scoped lang="postcss">
</style>
