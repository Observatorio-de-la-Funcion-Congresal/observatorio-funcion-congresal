<template>
  <div class="flex flex-col gap-6">
    <Card padding="p-6">
      <h3 class="text-sm font-bold text-primary-black-obs mb-3">{{ data.faq.title }}</h3>
      <p
        v-for="(p, i) in data.faq.paragraphs"
        :key="i"
        class="text-sm text-primary-gray-obs leading-6 mb-2 last:mb-0"
        v-html="p"
      ></p>
    </Card>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card padding="p-6">
        <h3 class="text-sm font-bold text-primary-black-obs">{{ data.calendar.title }}</h3>
        <p class="text-xs text-regular-gray-obs mb-4">{{ data.calendar.subtitle }}</p>

        <div class="grid gap-1.5 items-center" style="grid-template-columns: 2.5rem repeat(12, minmax(0, 1fr))">
          <span></span>
          <span v-for="m in data.calendar.months" :key="m" class="text-[9px] text-regular-gray-obs text-center font-semibold">{{ m }}</span>
          <template v-for="row in data.calendar.rows" :key="row.year">
            <span class="text-[10px] text-regular-gray-obs">{{ row.year }}</span>
            <span
              v-for="(cell, i) in row.months"
              :key="i"
              class="aspect-square rounded-md"
              :style="{ backgroundColor: cellColors[cell] }"
              :title="`${data.calendar.months[i]} ${row.year}`"
            ></span>
          </template>
        </div>

        <ul class="flex flex-wrap gap-x-4 gap-y-1 mt-4 text-[10px] text-regular-gray-obs">
          <li v-for="(label, key) in data.calendar.legend" :key="key" class="flex items-center gap-1.5">
            <span class="w-2.5 h-2.5 rounded-sm" :style="{ backgroundColor: cellColors[key] }"></span>
            {{ label }}
          </li>
        </ul>
        <p class="text-[11px] text-regular-gray-obs mt-4">{{ data.calendar.caption }}</p>

        <div class="mt-4 bg-sky-blue-obs border border-light-blue-obs rounded-xl p-4">
          <p class="text-xs font-bold text-primary-blue-obs mb-1">{{ data.calendar.howCalculated.title }}</p>
          <p class="text-[11px] text-primary-gray-obs leading-relaxed">{{ data.calendar.howCalculated.text }}</p>
        </div>
      </Card>

      <Card padding="p-6">
        <p class="text-[10px] font-semibold tracking-wide uppercase text-gray-icon-obs mb-3">{{ data.summary.eyebrow }}</p>
        <div class="bg-primary-blue-obs text-white rounded-xl py-6 px-4 text-center mb-3">
          <p class="text-4xl font-bold">{{ fmtPct(data.summary.main.value) }}</p>
          <p class="text-sm font-semibold mt-1">{{ data.summary.main.label }}</p>
          <p class="text-[11px] text-white/70 mt-1">{{ data.summary.main.detail }}</p>
        </div>
        <div class="grid grid-cols-3 gap-3 mb-3">
          <div v-for="s in data.summary.stats.slice(0, 3)" :key="s.label" class="bg-pill-blue-obs rounded-xl p-3">
            <p class="text-base font-bold text-primary-blue-obs">{{ s.value }}</p>
            <p class="text-[10px] text-regular-gray-obs">{{ s.label }}</p>
          </div>
        </div>
        <div class="grid grid-cols-2 gap-3 mb-3">
          <div v-for="s in data.summary.stats.slice(3)" :key="s.label" class="bg-pill-blue-obs rounded-xl p-3">
            <p class="text-base font-bold text-primary-blue-obs">{{ s.value }}</p>
            <p class="text-[10px] text-regular-gray-obs">{{ s.label }}</p>
          </div>
        </div>
        <p class="text-[11px] text-accent-blue-obs bg-sky-blue-obs border border-light-blue-obs rounded-xl px-4 py-3">{{ data.summary.note }}</p>
      </Card>
    </div>

    <Card padding="p-6">
      <h3 class="text-sm font-bold text-primary-black-obs">{{ data.byCaucus.title }}</h3>
      <p class="text-xs text-regular-gray-obs mb-5">{{ data.byCaucus.subtitle }}</p>
      <ul class="flex flex-col gap-2">
        <li v-for="row in data.byCaucus.series" :key="row.label" class="flex items-center gap-3 text-[11px] text-primary-gray-obs">
          <span class="w-28 sm:w-44 shrink-0 text-right leading-tight">{{ row.label }}</span>
          <span class="flex-1 h-4 bg-lighter-gray-obs rounded-sm overflow-hidden">
            <span class="flex items-center justify-end h-full bg-primary-blue-obs rounded-r-full pr-2 text-white font-semibold text-[10px]" :style="{ width: barWidth(row.value) + '%' }">
              {{ fmtPct(row.value) }}
            </span>
          </span>
        </li>
      </ul>
      <div class="flex justify-between text-[10px] text-gray-icon-obs mt-2 ml-[7.75rem] sm:ml-[11.75rem]">
        <span v-for="t in ticks" :key="t">{{ t }} %</span>
      </div>
      <p class="mt-4 text-[11px] text-dark-yellow-obs bg-yellow-obs border border-amber-200 rounded-lg px-3 py-2">* {{ data.byCaucus.note }}</p>
    </Card>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import Card from '../ui/Card/Card.vue'
import { fmtPct } from '../../lib/format'
import type { ComplianceTab } from '../../types/previous'

const props = defineProps<{ data: ComplianceTab }>()

const cellColors: Record<string, string> = {
  ok: '#CEE5F2',
  partial: '#F5B700',
  missing: '#D62828',
  none: '#EEF2F6',
}

const ticks = computed(() => {
  const min = props.data.byCaucus.min
  const step = (100 - min) / 3
  return [0, 1, 2, 3].map((i) => Math.round(min + step * i))
})

const barWidth = (value: number) => {
  const min = props.data.byCaucus.min
  return Math.max(0, ((value - min) / (100 - min)) * 100)
}
</script>
