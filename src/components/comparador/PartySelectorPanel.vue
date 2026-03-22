<template>
  <Card padding="p-6">
    <p class="text-xl font-bold">Seleccionar Partidos</p>
    <p class="font-inter text-sm text-primary-gray-obs mt-4">
      Máximo {{ MAX_SELECTIONS }} selecciones
    </p>

    <ul class="flex flex-col gap-2 max-h-72 overflow-y-auto pr-1 mt-4">
      <li
        v-for="party in filtered"
        :key="party.id"
        @click="onToggle(party.id)"
        class="flex items-center gap-3 p-3.5 rounded-xl cursor-pointer transition-colors"
        :class="[
          isSelected(party.id) ? 'bg-sky-blue-obs border-2 border-primary-blue-obs' : 'hover:bg-gray-50 border-2 border-lighten-gray-obs',
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
        <div class="rounded-full w-2 h-2 bg-primary-blue-obs" v-if="isSelected(party.id)"></div>
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
