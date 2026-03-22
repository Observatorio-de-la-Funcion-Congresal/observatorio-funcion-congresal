<template>
  <div class="overflow-x-auto">
    <table class="w-full text-sm">
      <thead>
        <tr class="border-b border-gray-100">
          <th class="text-left py-2 pr-4 text-primary-gray-obs font-medium">Métrica</th>
          <th
            v-for="header in headers"
            :key="header.id"
            class="text-center py-2 px-3 font-semibold"
            :style="{ color: header.color }"
          >
            {{ header.label }}
          </th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="row in rows"
          :key="row.metric.key"
          class="border-b border-gray-50 last:border-0"
        >
          <td class="py-2.5 pr-4 text-primary-gray-obs text-sm">{{ row.metric.label }}</td>
          <td
            v-for="(val, i) in row.values"
            :key="i"
            class="py-2.5 px-3 text-center font-semibold text-primary-black-obs"
          >
            {{ val }}{{ row.metric.unit }}
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup lang="ts">
import type { Metric } from './types'
import { getNestedValue } from './composables/useComparison'
import { computed } from 'vue'

interface Header {
  id: number
  label: string
  color: string
}

interface SelectionData {
  id: number
  data: Record<string, unknown>
  color: string
}

interface Row {
  metric: Metric
  values: (number | string)[]
}

const props = defineProps<{
  headers: Header[]
  selections: SelectionData[]
  metrics: Metric[]
}>()

const rows = computed(() => 
  props.metrics.map((metric): Row => {
    console.log('Processing metric:', metric.key, props.selections)
    return {
      metric,
      values: props.selections.map((sel) => {
        const val = getNestedValue(sel.data as Record<string, unknown>, metric.key)
        return metric.unit === '%' ? val : val
      }),
    }
  })
)
</script>
