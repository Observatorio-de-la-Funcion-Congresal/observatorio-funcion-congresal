<template>
  <div class="flex flex-col gap-6">
    <Card padding="p-6">
      <p class="text-[10px] font-semibold tracking-wide uppercase text-gray-icon-obs">{{ data.overview.eyebrow }}</p>
      <h3 class="text-base font-bold text-primary-blue-obs mb-4">
        {{ data.overview.name }}
        <span class="text-gray-icon-obs text-xs cursor-help" :title="data.overview.info">ⓘ</span>
      </h3>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div class="flex flex-col items-center">
          <div class="relative w-44">
            <svg viewBox="0 0 160 90" class="w-full" role="img" :aria-label="`ICR promedio ${fmtDec(data.overview.score)} de 100`">
              <path d="M 20 80 A 60 60 0 0 1 140 80" fill="none" stroke="#E5E7EB" stroke-width="12" stroke-linecap="round" pathLength="100" />
              <path
                d="M 20 80 A 60 60 0 0 1 140 80"
                fill="none"
                stroke="#023E7D"
                stroke-width="12"
                stroke-linecap="round"
                pathLength="100"
                :stroke-dasharray="`${data.overview.score} 100`"
              />
            </svg>
            <div class="absolute inset-x-0 bottom-2 text-center">
              <p class="text-3xl font-bold text-primary-blue-obs leading-none">{{ fmtDec(data.overview.score) }}</p>
              <p class="text-[11px] text-regular-gray-obs">de 100 puntos</p>
            </div>
            <div class="flex justify-between text-[9px] text-gray-icon-obs px-3"><span>0</span><span>100</span></div>
          </div>
          <p class="text-[11px] text-regular-gray-obs mt-2 mb-4">{{ data.overview.scoreCaption }}</p>
          <div class="grid grid-cols-4 gap-2 w-full max-w-sm">
            <div v-for="s in data.overview.stats" :key="s.label" class="bg-lighter-gray-obs rounded-lg py-2 text-center">
              <p class="text-xs font-bold text-primary-blue-obs">{{ s.value }}</p>
              <p class="text-[9px] text-regular-gray-obs">{{ s.label }}</p>
            </div>
          </div>
        </div>

        <div>
          <p class="text-[10px] font-semibold tracking-wide uppercase text-gray-icon-obs mb-3">{{ data.overview.distribution.title }}</p>
          <div class="flex h-6 rounded-full overflow-hidden mb-3">
            <div
              v-for="l in data.overview.distribution.levels"
              :key="l.label"
              class="flex items-center justify-center text-[10px] font-semibold"
              :class="l.color === '#9FCBEE' ? 'text-primary-blue-obs' : 'text-white'"
              :style="{ width: l.value + '%', backgroundColor: l.color }"
            >
              {{ fmtPct(l.value) }}
            </div>
          </div>
          <ul class="flex flex-wrap gap-x-4 gap-y-1 text-[11px] text-primary-gray-obs mb-2">
            <li v-for="l in data.overview.distribution.levels" :key="l.label" class="flex items-center gap-1.5">
              <span class="w-2 h-2 rounded-full" :style="{ backgroundColor: l.color }"></span>
              {{ l.label }} <strong>{{ fmtPct(l.value) }}</strong>
            </li>
          </ul>
          <p class="text-[11px] text-gray-icon-obs">{{ data.overview.distribution.note }}</p>
        </div>
      </div>
    </Card>

    <Card padding="p-6">
      <p class="text-[10px] font-semibold tracking-wide uppercase text-gray-icon-obs mb-3">{{ data.perMember.eyebrow }}</p>
      <ul class="flex flex-wrap gap-x-8 gap-y-2 mb-5">
        <li v-for="s in data.perMember.stats" :key="s.label">
          <p class="text-lg font-bold text-primary-blue-obs font-mono">{{ s.value }}</p>
          <p class="text-[10px] text-regular-gray-obs">{{ s.label }}</p>
        </li>
      </ul>
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
        <div v-for="(m, i) in [data.perMember.highest, data.perMember.lowest]" :key="m.label" class="bg-lighter-gray-obs rounded-xl p-4">
          <p class="text-[10px] font-semibold tracking-wide uppercase text-primary-blue-obs mb-1">{{ m.label }}</p>
          <p class="text-sm font-bold text-primary-black-obs">{{ m.name }}</p>
          <p class="text-xs text-regular-gray-obs mb-2">{{ m.detail }}</p>
          <p class="text-2xl font-bold font-mono" :class="i === 0 ? 'text-primary-blue-obs' : 'text-regular-gray-obs'">{{ fmtDec(m.score) }}</p>
        </div>
      </div>
      <p class="text-[11px] text-gray-icon-obs">{{ data.perMember.note }}</p>
    </Card>

    <Card padding="p-6">
      <h3 class="text-sm font-bold text-primary-black-obs">{{ data.byCaucus.title }}</h3>
      <p class="text-xs text-regular-gray-obs mb-5">{{ data.byCaucus.subtitle }}</p>
      <ul class="flex flex-col gap-2">
        <li v-for="row in data.byCaucus.series" :key="row.label" class="flex items-center gap-3 text-[11px] text-primary-gray-obs">
          <span class="w-28 sm:w-44 shrink-0 text-right leading-tight">{{ row.label }}</span>
          <span class="flex-1 h-4 bg-lighter-gray-obs rounded-sm overflow-hidden">
            <span class="block h-full bg-primary-blue-obs" :style="{ width: row.value + '%' }"></span>
          </span>
          <span class="w-9 font-semibold text-primary-black-obs">{{ fmtDec(row.value) }}</span>
        </li>
      </ul>
      <div class="flex justify-between text-[10px] text-gray-icon-obs mt-2 ml-[7.75rem] sm:ml-[11.75rem] mr-12">
        <span v-for="t in [0, 25, 50, 75, 100]" :key="t">{{ t }}</span>
      </div>
      <p class="mt-4 text-[11px] text-dark-yellow-obs bg-yellow-obs border border-amber-200 rounded-lg px-3 py-2">* {{ data.byCaucus.note }}</p>
    </Card>

    <Card padding="p-6">
      <p class="text-[10px] font-semibold tracking-wide uppercase text-gray-icon-obs mb-3">{{ data.dimensions.title }}</p>
      <div class="flex h-4 rounded-sm overflow-hidden mb-5">
        <div
          v-for="d in data.dimensions.items"
          :key="d.name"
          class="flex items-center justify-center text-[9px] font-semibold text-white"
          :style="{ width: d.weight + '%', backgroundColor: d.color }"
          :title="`${d.name}: ${d.weight} %`"
        >
          <span v-if="d.weight >= 10">{{ d.weight }}%</span>
        </div>
      </div>
      <ol class="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-4">
        <li v-for="(d, i) in data.dimensions.items" :key="d.name" class="flex gap-3">
          <span class="w-5 h-5 rounded-full text-white text-[10px] font-bold flex items-center justify-center shrink-0" :style="{ backgroundColor: d.color }">{{ i + 1 }}</span>
          <div>
            <p class="text-sm font-semibold text-primary-black-obs">
              {{ d.name }} <span class="text-[10px] text-gray-icon-obs font-normal">{{ d.weight }} %</span>
            </p>
            <p class="text-xs text-regular-gray-obs">{{ d.description }}</p>
          </div>
        </li>
      </ol>
      <a :href="METHODOLOGY_URL" target="_blank" rel="noopener" class="inline-block mt-5 text-xs font-semibold text-accent-blue-obs hover:underline">
        {{ data.dimensions.methodologyLabel }}
      </a>
    </Card>

    <div class="bg-primary-blue-obs rounded-2xl p-6 text-white">
      <p class="text-sm font-bold mb-4">{{ data.banner.title }}</p>
      <ul class="grid grid-cols-2 md:grid-cols-5 gap-3">
        <li v-for="s in data.banner.stats" :key="s.label" class="bg-white/10 rounded-xl p-4">
          <p class="text-lg font-bold">{{ s.value }}</p>
          <p class="text-[10px] text-white/70">{{ s.label }}</p>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">
import Card from '../ui/Card/Card.vue'
import { fmtDec, fmtPct } from '../../lib/format'
import { METHODOLOGY_URL } from '../../constants'
import type { QualityTab } from '../../types/previous'

defineProps<{ data: QualityTab }>()
</script>
