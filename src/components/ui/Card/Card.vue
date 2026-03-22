<template>
  <div :class="['bg-white rounded-2xl shadow-sm border border-gray-100', padding]">
    <slot />
  </div>
</template>

<script setup lang="ts">
const { padding = 'p-5' } = defineProps<{ padding?: string }>()
</script>
