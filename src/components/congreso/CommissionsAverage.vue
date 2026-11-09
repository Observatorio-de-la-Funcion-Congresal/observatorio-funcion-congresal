<template>
  <Card>
    <h3 class="text-sm font-bold text-primary-black-obs mb-4">{{ data.question }}</h3>

    <div class="inline-flex bg-lighter-gray-obs rounded-xl p-1 mb-5" role="tablist">
      <button
        v-for="tab in tabs"
        :key="tab.key"
        role="tab"
        :aria-selected="active === tab.key"
        type="button"
        class="px-3 py-1.5 text-xs rounded-lg transition-colors"
        :class="active === tab.key ? 'bg-white shadow text-primary-black-obs font-semibold' : 'text-regular-gray-obs'"
        @click="active = tab.key"
      >
        {{ tab.label }}
      </button>
    </div>

    <template v-if="active === 'year'">
      <p class="mb-5">
        <span class="text-3xl font-bold text-primary-blue-obs">{{ fmtDec(data.perYear.value) }}</span>
        <span class="text-xs text-regular-gray-obs ml-2">{{ data.perYear.unit }}</span>
      </p>
      <ul class="flex flex-col gap-2 mb-4">
        <li v-for="row in data.perYear.series" :key="row.label" class="flex items-center gap-3 text-[11px] text-primary-gray-obs">
          <span class="w-16 shrink-0">{{ row.label }}</span>
          <span class="flex-1 h-2.5 bg-lighten-gray-obs rounded-full overflow-hidden">
            <span class="block h-full bg-primary-blue-obs rounded-full" :style="{ width: (row.value / maxYear) * 100 + '%' }"></span>
          </span>
          <span class="w-8 text-right font-semibold text-primary-blue-obs">{{ fmtDec(row.value) }}</span>
        </li>
      </ul>
      <p class="text-xs text-regular-gray-obs">{{ data.perYear.footnote }}</p>
    </template>

    <template v-else>
      <p class="mb-5">
        <span class="text-3xl font-bold text-primary-blue-obs">{{ fmtDec(data.fiveYears.value) }}</span>
        <span class="text-xs text-regular-gray-obs ml-2">{{ data.fiveYears.unit }}</span>
      </p>
      <div class="grid grid-cols-2 gap-3 mb-4">
        <div class="bg-pill-blue-obs rounded-xl p-4">
          <p class="text-lg font-bold text-primary-blue-obs">{{ data.fiveYears.median }}</p>
          <p class="text-[11px] text-regular-gray-obs">Mediana</p>
        </div>
        <div class="bg-pill-blue-obs rounded-xl p-4">
          <p class="text-lg font-bold text-primary-blue-obs">{{ data.fiveYears.max }}</p>
          <p class="text-[11px] text-regular-gray-obs">Máximo</p>
        </div>
      </div>
      <div class="bg-lighter-gray-obs rounded-xl p-4">
        <p class="text-xs font-bold text-primary-black-obs mb-1">Cómo se calcula</p>
        <p class="text-[11px] text-regular-gray-obs leading-relaxed">{{ data.fiveYears.howCalculated }}</p>
      </div>
    </template>
  </Card>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import Card from '../ui/Card/Card.vue'
import { fmtDec } from '../../lib/format'
import type { CommissionsSection } from '../../types/previous'

const props = defineProps<{ data: CommissionsSection['average'] }>()

const tabs = [
  { key: 'year', label: 'Por año' },
  { key: 'five', label: 'En los 5 años' },
]
const active = ref('year')
const maxYear = computed(() => Math.max(...props.data.perYear.series.map((s) => s.value)) * 1.15)
</script>
