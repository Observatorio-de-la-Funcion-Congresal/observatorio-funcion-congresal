<template>
  <div class="font-inter">
    <!-- Mode tabs -->
    <div class="mb-6">
      <ComparadorMode :mode="mode" @change="onModeChange" />
    </div>

    <!-- Main layout -->
    <div class="flex flex-col lg:flex-row gap-6 items-start">
      <!-- Left: selector + metrics -->
      <div class="w-full lg:w-96 shrink-0 flex flex-col gap-4">
        <CandidateSelectorPanel
          v-if="mode === 'candidates'"
          :candidates="candidateList"
          :selected-ids="selectedCandidates.map((s) => s.id)"
          :picture-base="candidatePictureBase"
          :loading="listLoading"
          :loading-id="loadingId"
          @toggle="toggleCandidate"
        />
        <PartySelectorPanel
          v-else
          :parties="partyList"
          :selected-ids="selectedParties.map((s) => s.id)"
          :picture-base="partyPictureBase"
          :loading-id="loadingId"
          @toggle="toggleParty"
        />
        <MetricSelector
          :metrics="currentMetrics"
          :active-keys="activeMetricKeys"
          @toggle="toggleMetric"
        />
      </div>

      <!-- Right: selection chips + results -->
      <div class="flex-1 min-w-0 flex flex-col gap-6">
        <!-- Candidate selection chips -->
        <CurrentSelection
          v-if="mode === 'candidates'"
          :selections="candidateChips"
          :picture-base="candidatePictureBase"
          empty-message="Selecciona congresistas para comparar"
          @remove="toggleCandidate"
        />
        <!-- Party selection chips -->
        <CurrentSelection
          v-else
          :selections="partyChips"
          :picture-base="partyPictureBase"
          empty-message="Selecciona partidos para comparar"
          @remove="toggleParty"
        />

        <!-- Results (shown when ≥2 selected) -->
        <ComparisonResults
          v-if="isReadyToCompare"
          :mode="mode"
          :candidate-selections="selectedCandidates"
          :party-selections="selectedParties"
          :active-metrics="activeMetrics"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useComparison } from './composables/useComparison'
import type { ComparisonMode } from './types'

import ComparadorMode from './ComparadorMode.vue'
import CandidateSelectorPanel from './CandidateSelectorPanel.vue'
import PartySelectorPanel from './PartySelectorPanel.vue'
import MetricSelector from './MetricSelector.vue'
import CurrentSelection from './CurrentSelection.vue'
import ComparisonResults from './ComparisonResults.vue'

const props = defineProps<{
  dataUrl: string
  candidatePictureBase: string
  partyPictureBase: string
}>()

const {
  mode,
  candidateList,
  partyList,
  selectedCandidates,
  selectedParties,
  activeMetricKeys,
  activeMetrics,
  currentMetrics,
  isReadyToCompare,
  listLoading,
  loadingId,
  loadCandidateList,
  loadPartyList,
  toggleCandidate,
  toggleParty,
  toggleMetric,
} = useComparison(props.dataUrl)

onMounted(() => {
  loadCandidateList()
  loadPartyList()
})

function onModeChange(value: ComparisonMode) {
  mode.value = value
}

// Transform selection data into generic chip format for CurrentSelection
const candidateChips = computed(() =>
  selectedCandidates.value.map((sel) => ({
    id: sel.id,
    color: sel.color,
    picture: sel.data.picture,
    label: sel.data.name,
  }))
)

const partyChips = computed(() =>
  selectedParties.value.map((sel) => ({
    id: sel.id,
    color: sel.color,
    picture: sel.data.picture,
    label: sel.data.name,
  }))
)
</script>
