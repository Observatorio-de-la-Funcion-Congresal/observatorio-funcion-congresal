<template>
  <Card padding="p-4">
    <!-- Search -->
    <div class="relative mb-3">
      <span class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
        <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
        </svg>
      </span>
      <input
        v-model="search"
        type="search"
        placeholder="Buscar partido..."
        class="w-full pl-9 pr-3 py-2 text-sm rounded-xl border border-gray-200 focus:outline-none focus:border-primary-blue-obs bg-gray-50"
      />
    </div>

    <p class="text-xs text-primary-gray-obs mb-2">
      Seleccionar Partidos
      <span class="ml-1 text-gray-400">Máximo {{ MAX_SELECTIONS }} selecciones</span>
    </p>

    <ul class="flex flex-col gap-1 max-h-72 overflow-y-auto pr-1">
      <li
        v-for="party in filtered"
        :key="party.id"
        @click="onToggle(party.id)"
        class="flex items-center gap-3 px-3 py-2.5 rounded-xl cursor-pointer transition-colors"
        :class="[
          isSelected(party.id) ? 'bg-sky-blue-obs' : 'hover:bg-gray-50',
          loadingId === party.id ? 'opacity-50 pointer-events-none' : '',
          atMax && !isSelected(party.id) ? 'opacity-40 pointer-events-none' : '',
        ]"
      >
        <!-- Badge -->
        <div
          class="w-9 h-9 rounded-xl shrink-0 flex items-center justify-center text-white font-bold text-xs"
          :style="{ backgroundColor: badgeColor(party.id) }"
        >
          {{ initials(party.name) }}
        </div>
        <!-- Info -->
        <div class="flex-1 min-w-0">
          <p class="text-sm font-medium text-primary-black-obs truncate leading-tight">{{ party.name }}</p>
          <p class="text-xs text-primary-gray-obs">{{ party.senator_count + party.deputy_count }} congresistas</p>
        </div>
        <!-- Check icon -->
        <svg
          v-if="isSelected(party.id)"
          class="w-4 h-4 text-primary-blue-obs shrink-0"
          viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"
        >
          <polyline points="20 6 9 17 4 12"/>
        </svg>
        <!-- Loading spinner -->
        <svg
          v-else-if="loadingId === party.id"
          class="w-4 h-4 text-primary-blue-obs animate-spin shrink-0"
          viewBox="0 0 24 24" fill="none"
        >
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
        </svg>
      </li>
      <li v-if="filtered.length === 0" class="text-sm text-primary-gray-obs text-center py-4">
        No se encontraron partidos.
      </li>
    </ul>
  </Card>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import Card from '../ui/Card/Card.vue'
import type { PartySummary } from './types'
import { MAX_SELECTIONS } from './composables/useComparison'

const BADGE_COLORS = ['#023E7D', '#D62828', '#059669', '#7C3AED', '#D97706', '#0369A1', '#BE185D', '#065F46', '#9A3412', '#164E63']

const props = defineProps<{
  parties: PartySummary[]
  selectedIds: number[]
  pictureBase: string
  loadingId: number | null
}>()

const emit = defineEmits<{ toggle: [id: number] }>()

const search = ref('')

const filtered = computed(() => {
  const q = search.value.trim().toLowerCase()
  return q ? props.parties.filter((p) => p.name.toLowerCase().includes(q)) : props.parties
})

const atMax = computed(() => props.selectedIds.length >= MAX_SELECTIONS)

function isSelected(id: number) { return props.selectedIds.includes(id) }

function onToggle(id: number) {
  if (atMax.value && !isSelected(id)) return
  emit('toggle', id)
}

function initials(name: string): string {
  return name
    .split(' ')
    .filter((w) => w.length > 2 && !['de', 'la', 'el', 'y', 'por', 'del'].includes(w.toLowerCase()))
    .map((w) => w[0].toUpperCase())
    .join('')
    .substring(0, 3)
}

function badgeColor(id: number): string {
  return BADGE_COLORS[id % BADGE_COLORS.length]
}
</script>
