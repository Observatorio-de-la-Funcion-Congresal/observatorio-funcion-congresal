<template>
  <div class="flex flex-col gap-6">
    <!-- Bar chart -->
    <Card padding="p-6">
      <h3 class="text-lg font-bold text-primary-black-obs mb-4">Comparación por Métrica</h3>
      <ComparisonBarChart :labels="barLabels" :datasets="barDatasets" />
    </Card>

    <!-- Radar chart (candidates only) -->
    <Card padding="p-6">
      <h3 class="text-lg font-bold text-primary-black-obs mb-4">Vista 360°</h3>
      <ComparisonRadarChart :labels="radarLabels" :datasets="radarDatasets" />
    </Card>

    <!-- Summary table -->
    <Card padding="p-6">
      <h3 class="text-xl font-bold mb-4">Resumen Comparativo</h3>
      <ComparisonTable
        :headers="tableHeaders"
        :selections="tableSelections"
        :metrics="activeMetrics"
      />
    </Card>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import Card from '../ui/Card/Card.vue'
import type { CandidateSelection, PartySelection, Metric, ComparisonMode } from './types'
import { getNestedValue, CANDIDATE_METRICS } from './composables/useComparison'
import ComparisonBarChart from './charts/ComparisonBarChart.vue'
import ComparisonRadarChart from './charts/ComparisonRadarChart.vue'
import ComparisonTable from './ComparisonTable.vue'

const props = defineProps<{
  mode: ComparisonMode
  candidateSelections: CandidateSelection[]
  partySelections: PartySelection[]
  activeMetrics: Metric[]
}>()

// Use the right selection list based on mode
const selections = computed(() =>
  props.mode === 'candidates'
    ? (props.candidateSelections as (CandidateSelection | PartySelection)[])
    : props.partySelections
)

// ── Bar chart ──────────────────────────────────────────────────────────────

const barLabels = computed(() => props.activeMetrics.map((m) => m.label))

const barDatasets = computed(() =>
  selections.value.map((sel) => ({
    label:
      props.mode === 'candidates'
        ? (sel as CandidateSelection).data.name
        : (sel as PartySelection).data.name,
    data: props.activeMetrics.map((m) =>
      getNestedValue(sel.data as Record<string, unknown>, m.key)
    ),
    color: sel.color,
  }))
)

// ── Radar chart (candidates only, all 6 axes) ─────────────────────────────

const radarLabels = CANDIDATE_METRICS.map((m) => m.label)

const radarDatasets = computed(() =>
  props.candidateSelections.map((sel) => ({
    label: sel.data.name,
    data: CANDIDATE_METRICS.map((m) => getNestedValue(sel.data as Record<string, unknown>, m.key)),
    color: sel.color,
  }))
)

// ── Table ──────────────────────────────────────────────────────────────────

const tableHeaders = computed(() =>
  selections.value.map((sel) => ({
    id: sel.id,
    label:
      props.mode === 'candidates'
        ? (sel as CandidateSelection).data.name.split(' ').slice(0, 2).join(' ')
        : (sel as PartySelection).data.name,
    color: sel.color,
  }))
)

const tableSelections = computed(() =>
  selections.value.map((sel) => ({
    id: sel.id,
    data: sel.data as Record<string, unknown>,
    color: sel.color,
  }))
)
</script>
