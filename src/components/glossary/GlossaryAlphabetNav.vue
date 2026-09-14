<template>
  <div class="flex flex-wrap items-center gap-2 font-inter">
    <button
      type="button"
      @click="$emit('select', null)"
      class="px-4 py-1.5 rounded-full text-sm font-semibold transition-colors"
      :class="activeLetter === null
        ? 'bg-primary-blue-obs text-white'
        : 'text-primary-gray-obs hover:bg-gray-100'"
    >
      Todos
    </button>
    <button
      v-for="letter in letters"
      :key="letter"
      type="button"
      :disabled="!availableLetters.has(letter)"
      @click="$emit('select', letter)"
      class="w-8 h-8 rounded-full text-sm font-semibold transition-colors"
      :class="[
        activeLetter === letter ? 'bg-primary-blue-obs text-white' : '',
        activeLetter !== letter && availableLetters.has(letter) ? 'text-primary-black-obs hover:bg-gray-100' : '',
        !availableLetters.has(letter) ? 'text-gray-300 cursor-not-allowed' : '',
      ]"
    >
      {{ letter }}
    </button>
  </div>
</template>

<script setup lang="ts">
const letters = Array.from({ length: 26 }, (_, i) => String.fromCharCode(65 + i))

defineProps<{
  activeLetter: string | null
  availableLetters: Set<string>
}>()

defineEmits<{ select: [letter: string | null] }>()
</script>
