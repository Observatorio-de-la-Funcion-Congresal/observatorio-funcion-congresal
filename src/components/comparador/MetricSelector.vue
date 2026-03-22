<template>
  <Card padding="p-6">
    <p class="text-xl font-bold mb-4">Métricas a Comparar</p>

    <ul class="flex flex-col gap-2">
      <li
        v-for="metric in metrics"
        :key="metric.key"
        @click="$emit('toggle', metric.key)"
        class="flex items-center justify-between px-3 py-2.5 rounded-xl border-2 cursor-pointer transition-colors select-none"
        :class="
          activeKeys.includes(metric.key)
            ? 'border-primary-blue-obs bg-sky-blue-obs'
            : 'border-lighten-gray-obs bg-white hover:bg-light-gray-obs/10'
        "
      >
        <span
          class="text-sm"
          :class="activeKeys.includes(metric.key) ? 'text-primary-blue-obs font-medium' : 'text-primary-gray-obs'"
        >
          {{ metric.label }}
        </span>
        <!-- Dot indicator -->
        <span
          v-if="activeKeys.includes(metric.key)"
          class="w-2 h-2 rounded-full bg-primary-blue-obs"
        />
      </li>
    </ul>
  </Card>
</template>

<script setup lang="ts">
import Card from '../ui/Card/Card.vue'
import type { Metric } from './types'

defineProps<{ metrics: Metric[]; activeKeys: string[] }>()
defineEmits<{ toggle: [key: string] }>()
</script>
