<template>
  <Card padding="p-4">
    <p class="text-sm font-semibold text-primary-black-obs mb-1">Métricas a Comparar</p>

    <ul class="flex flex-col gap-1 mt-3">
      <li
        v-for="metric in metrics"
        :key="metric.key"
        @click="$emit('toggle', metric.key)"
        class="flex items-center justify-between px-3 py-2.5 rounded-xl border cursor-pointer transition-colors select-none"
        :class="
          activeKeys.includes(metric.key)
            ? 'border-primary-blue-obs bg-sky-blue-obs'
            : 'border-gray-100 bg-gray-50 hover:bg-gray-100'
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
          class="w-2.5 h-2.5 rounded-full shrink-0 transition-colors"
          :class="activeKeys.includes(metric.key) ? 'bg-primary-blue-obs' : 'bg-gray-300'"
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
