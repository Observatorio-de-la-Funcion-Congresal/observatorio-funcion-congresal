<template>
  <Card padding="p-6" class="rounded-2xl! h-full flex flex-col">
    <h3 class="text-lg font-bold text-primary-black-obs">{{ term.term }}</h3>
    <p class="text-sm text-primary-gray-obs mt-3 flex-1">{{ term.definition }}</p>
    <div class="border-t border-gray-100 mt-4 pt-3 flex items-center gap-2 text-xs text-primary-gray-obs">
      <svg class="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
        <polyline points="14 2 14 8 20 8"/>
        <line x1="16" y1="13" x2="8" y2="13"/>
        <line x1="16" y1="17" x2="8" y2="17"/>
      </svg>
      <span class="truncate">Fuente: {{ term.source }}</span>
    </div>
  </Card>
</template>

<script setup lang="ts">
import Card from '../ui/Card/Card.vue'
import type { GlossaryTerm } from './types'

defineProps<{ term: GlossaryTerm }>()
</script>
