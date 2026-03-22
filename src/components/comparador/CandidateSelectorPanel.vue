<template>
  <Card padding="p-6">
    <!-- Search -->
    <!-- 
    <div class="relative mb-3">
      <span class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
        <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
        </svg>
      </span>
      <input
        v-model="search"
        type="search"
        placeholder="Buscar candidato..."
        class="w-full pl-9 pr-3 py-2 text-sm rounded-xl border border-gray-200 focus:outline-none focus:border-primary-blue-obs bg-gray-50"
      />
    </div>
    -->
    <p class="text-xl font-bold">Seleccionar Congresistas</p>
    <p class="font-inter text-sm text-primary-gray-obs mt-4">
      Máximo {{ MAX_SELECTIONS }} selecciones
    </p>

    <!-- Candidate list -->
    <ul class="flex flex-col gap-2 max-h-72 overflow-y-auto pr-1 mt-4">
      <li
        v-for="candidate in filtered"
        :key="candidate.id"
        @click="onToggle(candidate.id)"
        class="flex items-center gap-3 p-3.5 rounded-xl cursor-pointer transition-colors"
        :class="[
          isSelected(candidate.id) ? 'bg-sky-blue-obs border-2 border-primary-blue-obs' : 'hover:bg-gray-50 border-2 border-lighten-gray-obs',
          loadingId === candidate.id ? 'opacity-50 pointer-events-none' : '',
          atMax && !isSelected(candidate.id) ? 'opacity-40 pointer-events-none' : '',
        ]"
      >
        <!-- Photo -->
        <div class="w-8 h-8 rounded-full overflow-hidden bg-gray-200 shrink-0 relative">
          <img
            :src="pictureBase + candidate.picture"
            :alt="candidate.name"
            class="w-full h-full object-cover"
          />
        </div>
        <!-- Info -->
        <div class="flex-1 min-w-0 font-inter font-medium">
          <p class="truncate">{{ candidate.name }}</p>
          <p class="text-xs text-regular-gray-obs truncate">{{ candidate.party }}</p>
        </div>
        <!-- Loading spinner -->
        <svg
          v-if="loadingId === candidate.id"
          class="w-4 h-4 text-primary-blue-obs animate-spin shrink-0"
          viewBox="0 0 24 24" fill="none"
        >
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
        </svg>
        <div class="rounded-full w-2 h-2 bg-primary-blue-obs" v-if="isSelected(candidate.id)"></div>
      </li>
      <li v-if="filtered.length === 0" class="text-sm text-primary-gray-obs text-center py-4">
        No se encontraron candidatos.
      </li>
    </ul>
  </Card>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import Card from '../ui/Card/Card.vue'
import type { CandidateSummary } from './types'
import { MAX_SELECTIONS } from './composables/useComparison'

const props = defineProps<{
  candidates: CandidateSummary[]
  selectedIds: number[]
  pictureBase: string
  loadingId: number | null
}>()

const emit = defineEmits<{ toggle: [id: number] }>()

const search = ref('')

const filtered = computed(() => {
  const q = search.value.trim().toLowerCase()
  return q ? props.candidates.filter((c) => c.name.toLowerCase().includes(q) || c.party.toLowerCase().includes(q)) : props.candidates
})

const atMax = computed(() => props.selectedIds.length >= MAX_SELECTIONS)

function isSelected(id: number) {
  return props.selectedIds.includes(id)
}

function onToggle(id: number) {
  if (atMax.value && !isSelected(id)) return
  emit('toggle', id)
}
</script>
