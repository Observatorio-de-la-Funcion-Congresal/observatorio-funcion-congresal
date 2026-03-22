<template>
  <Card padding="p-6">
    <p class="text-xl font-bold mb-3">Tipo de Comparación</p>
    <div class="p-1 flex gap-4">
      <button
        v-for="tab in tabs"
        :key="tab.value"
        @click="$emit('change', tab.value)"
        class="flex-1 rounded-xl px-6 py-5 text-left transition-all cursor-pointer"
        :class="
          mode === tab.value
            ? 'bg-sky-blue-obs border border-primary-blue-obs'
            : 'hover:bg-gray-50 border border-lighten-gray-obs'
        "
      >
        <p class="font-bold text-lg">{{ tab.title }}</p>
        <p class="font-inter font-medium text-sm mt-2 text-primary-gray-obs">{{ tab.description }}</p>
      </button>
    </div>
  </Card>
</template>

<script setup lang="ts">
import Card from '../ui/Card/Card.vue';
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
