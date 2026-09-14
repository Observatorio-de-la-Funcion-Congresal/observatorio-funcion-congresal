<template>
  <div class="font-inter">
    <Card padding="p-6" class="mb-8">
      <form @submit.prevent>
        <label for="glossary-search" class="sr-only">Buscar término</label>
        <div class="relative">
          <svg class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            id="glossary-search"
            v-model="search"
            type="search"
            :placeholder="placeholder"
            aria-label="Buscar término"
            class="w-full pl-9 pr-3 py-2.5 text-sm rounded-xl border border-gray-200 focus:outline-none focus:border-primary-blue-obs bg-gray-50"
          />
        </div>
      </form>

      <div class="mt-5">
        <GlossaryAlphabetNav
          :active-letter="activeLetter"
          :available-letters="availableLetters"
          @select="onSelectLetter"
        />
      </div>
    </Card>

    <p v-if="loading" class="text-center text-primary-gray-obs py-12">Cargando términos...</p>

    <p v-else-if="error" class="text-center text-red-600 py-12">{{ error }}</p>

    <p v-else-if="terms.length === 0" class="text-center text-primary-gray-obs py-12">
      No se encontraron términos con los filtros aplicados.
    </p>

    <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
      <GlossaryTermCard v-for="term in terms" :key="term.id" :term="term" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted } from 'vue'
import Card from '../ui/Card/Card.vue'
import GlossaryAlphabetNav from './GlossaryAlphabetNav.vue'
import GlossaryTermCard from './GlossaryTermCard.vue'
import { fetchGlossaryTerms, fetchGlossaryLetters } from './services/glossaryService'
import { debounce } from '../ui/Input/utils'
import type { GlossaryTerm } from './types'

const props = withDefaults(
  defineProps<{
    dataUrl: string
    searchDebounceMs?: number
    placeholder?: string
  }>(),
  {
    searchDebounceMs: 350,
    placeholder: 'Buscar término...',
  }
)

const search = ref('')
const activeLetter = ref<string | null>(null)
const terms = ref<GlossaryTerm[]>([])
const availableLetters = ref<Set<string>>(new Set())
const loading = ref(false)
const error = ref('')

async function loadTerms() {
  loading.value = true
  error.value = ''
  try {
    terms.value = await fetchGlossaryTerms(props.dataUrl, {
      search: search.value,
      letter: activeLetter.value,
    })
  } catch (e) {
    error.value = 'No se pudo cargar el glosario. Intenta nuevamente.'
  } finally {
    loading.value = false
  }
}

async function loadAvailableLetters() {
  try {
    availableLetters.value = await fetchGlossaryLetters(props.dataUrl, { search: search.value })
  } catch {
    // non-critical — nav just shows no letters enabled
  }
}

function refresh() {
  loadTerms()
  loadAvailableLetters()
}

const debouncedRefresh = debounce(refresh, props.searchDebounceMs)

function onSelectLetter(letter: string | null) {
  activeLetter.value = letter
  loadTerms()
}

watch(search, () => {
  debouncedRefresh()
})

onMounted(() => {
  refresh()
})
</script>
