<template>
  <div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-1 flex gap-1">
    <button
      v-for="tab in tabs"
      :key="tab.value"
      @click="$emit('change', tab.value)"
      class="flex-1 rounded-xl px-4 py-3 text-left transition-all"
      :class="
        mode === tab.value
          ? 'bg-primary-blue-obs text-white shadow-sm'
          : 'text-primary-black-obs hover:bg-gray-50'
      "
    >
      <p class="font-semibold text-sm">{{ tab.title }}</p>
      <p class="text-xs mt-0.5 opacity-70 leading-snug">{{ tab.description }}</p>
    </button>
  </div>
</template>

<script setup lang="ts">
import type { ComparisonMode } from './types'

defineProps<{ mode: ComparisonMode }>()
defineEmits<{ change: [value: ComparisonMode] }>()

const tabs = [
  {
    value: 'candidates' as ComparisonMode,
    title: 'Comparar Congresistas',
    description: 'Compara el desempeño individual de hasta 4 congresistas',
  },
  {
    value: 'parties' as ComparisonMode,
    title: 'Comparar Partidos',
    description: 'Compara el desempeño promedio de hasta 4 partidos políticos',
  },
]
</script>
