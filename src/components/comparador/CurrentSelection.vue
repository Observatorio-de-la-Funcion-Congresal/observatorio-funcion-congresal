<template>
  <Card>
    <h3 class="text-xl font-bold mb-4">Selección Actual</h3>

    <!-- Empty state -->
    <div
      v-if="selections.length === 0"
      class="flex flex-col items-center justify-center py-10 border-2 border-dashed border-gray-200 rounded-xl text-primary-gray-obs gap-2"
    >
      <svg class="w-8 h-8 text-gray-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
        <circle cx="12" cy="12" r="10"/>
        <line x1="12" y1="8" x2="12" y2="16"/>
        <line x1="8" y1="12" x2="16" y2="12"/>
      </svg>
      <p class="text-sm">{{ emptyMessage }}</p>
    </div>

    <!-- Chips -->
    <div v-else class="flex flex-wrap gap-2">
      <div
        v-for="sel in selections"
        :key="sel.id"
        class="flex items-center gap-2 px-3 py-2 rounded-lg border text-sm font-medium bg-sky-blue-obs border-light-blue-obs"
      >
        <!-- Avatar/Logo -->
        <img
          v-if="sel.picture"
          :src="pictureBase + sel.picture"
          :alt="sel.label"
          class="w-8 h-8 rounded-full object-cover border border-white/50 shrink-0"
        />
        <!-- Name -->
        <p class="font-inter text-sm max-w-40 truncate">{{ sel.label }}</p>
        <!-- Remove -->
        <button
          @click="$emit('remove', sel.id)"
          class="w-4 h-4 rounded-full flex items-center justify-center hover:bg-black/10 transition-colors shrink-0"
          :aria-label="`Quitar ${sel.label}`"
        >
          <svg class="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"/>
            <line x1="6" y1="6" x2="18" y2="18"/>
          </svg>
        </button>
      </div>
    </div>

    <!-- Helper text when 1 selected -->
    <p v-if="selections.length === 1" class="text-xs text-primary-gray-obs mt-3">
      Selecciona al menos uno más para comparar.
    </p>
  </Card>
</template>

<script setup lang="ts">
import Card from '../ui/Card/Card.vue'
interface SelectionChip {
  id: number
  color: string
  picture: string
  label: string
}

withDefaults(
  defineProps<{
    selections: SelectionChip[]
    pictureBase: string
    emptyMessage?: string
  }>(),
  { emptyMessage: 'Selecciona elementos para comparar' }
)

defineEmits<{ remove: [id: number] }>()
</script>
