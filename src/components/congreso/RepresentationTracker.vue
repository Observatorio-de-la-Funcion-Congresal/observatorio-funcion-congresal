<template>
  <div>
    <h2 class="text-xl md:text-2xl font-bold text-dark-blue-obs mb-4">{{ data.title }}</h2>

      <div class="inline-flex bg-lighten-gray-obs rounded-xl p-1 mb-5" role="tablist">
        <button
          v-for="tab in tabs"
          :key="tab.key"
          role="tab"
          type="button"
          :aria-selected="active === tab.key"
          class="px-4 py-1.5 text-xs rounded-lg transition-colors"
          :class="active === tab.key ? 'bg-white shadow text-primary-blue-obs font-semibold' : 'text-regular-gray-obs'"
          @click="active = tab.key"
        >
          {{ tab.label }}
        </button>
      </div>

      <ComplianceTab v-if="active === 'compliance'" :data="data.compliance" />
      <QualityTab v-else :data="data.quality" />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import ComplianceTab from './ComplianceTab.vue'
import QualityTab from './QualityTab.vue'
import type { RepresentationSection } from '../../types/previous'

defineProps<{ data: RepresentationSection }>()

const tabs = [
  { key: 'compliance', label: 'Cumplimiento de informes' },
  { key: 'quality', label: 'Calidad del informe (ICR)' },
]
const active = ref('compliance')
</script>
