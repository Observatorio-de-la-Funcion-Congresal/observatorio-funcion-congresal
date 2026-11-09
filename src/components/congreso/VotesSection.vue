<template>
  <div>
    <div class="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-5">
      <div class="max-w-xl">
        <h2 class="text-xl md:text-2xl font-bold text-dark-blue-obs mb-2">{{ data.title }}</h2>
        <p class="text-sm text-primary-gray-obs">{{ data.description }}</p>
      </div>
      <Button size="sm" @click="downloadMembers" class="text-xs shrink-0">
        <span v-html="xlsIconPath" class="inline-block mr-2 icon fill-white"></span>
        Descargar votación de cada congresista
      </Button>
    </div>

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

    <Card v-if="active === 'law'" padding="p-0">
      <div class="overflow-x-auto">
        <table class="w-full text-left min-w-[640px]">
          <thead>
            <tr class="text-[11px] font-semibold text-primary-blue-obs border-b border-lighten-gray-obs">
              <th class="px-5 py-3">Ley y nombre</th>
              <th class="px-3 py-3">Votación considerada</th>
              <th class="px-3 py-3 w-56">Resultado</th>
            </tr>
          </thead>
          <tbody>
            <template v-for="law in data.laws" :key="law.number">
              <tr
                class="border-b border-lighter-border-gray-obs cursor-pointer hover:bg-lighter-gray-obs"
                tabindex="0"
              >
                <td class="px-5 py-3 align-top">
                  <p class="text-sm font-bold text-primary-blue-obs">
                    <span class="text-gray-icon-obs text-xs mr-1">›</span>Ley {{ law.number }}
                  </p>
                  <p class="text-xs text-primary-gray-obs pl-4">{{ law.title }}</p>
                  <p v-if="law.partial" class="text-[10px] text-dark-yellow-obs bg-yellow-obs border border-amber-200 rounded px-2 py-0.5 mt-1 ml-4 inline-block">
                    Votación parcial: solo {{ law.recorded }} de {{ totalMembers }} congresistas tienen voto registrado.
                  </p>
                </td>
                <td class="px-3 py-3 align-top text-xs text-primary-gray-obs">
                  {{ voteTypes[law.voteType].label }}
                </td>
                <td class="px-3 py-3 align-top">
                  <div class="flex h-2.5 rounded-sm overflow-hidden bg-lighten-gray-obs">
                    <span class="bg-primary-blue-obs" :style="{ width: share(law, law.yes) + '%' }"></span>
                    <span class="bg-red-obs" :style="{ width: share(law, law.no) + '%' }"></span>
                  </div>
                  <p class="text-[10px] font-mono mt-1 flex gap-3">
                    <span class="text-primary-blue-obs font-bold">Sí {{ law.yes }}</span>
                    <span class="text-red-obs font-bold">No {{ law.no }}</span>
                    <span class="text-gray-icon-obs">Abst. {{ law.abstain }}</span>
                  </p>
                </td>
              </tr>
            </template>
          </tbody>
        </table>
      </div>
      <div class="flex flex-wrap items-center justify-between gap-2 px-5 py-3 text-[10px] text-regular-gray-obs">
        <ul class="flex gap-4">
          <li class="flex items-center gap-1.5"><span class="w-2 h-2 rounded-sm bg-primary-blue-obs"></span>Sí</li>
          <li class="flex items-center gap-1.5"><span class="w-2 h-2 rounded-sm bg-red-obs"></span>No</li>
          <li class="flex items-center gap-1.5"><span class="w-2 h-2 rounded-sm bg-lighten-gray-obs"></span>Abstención</li>
        </ul>
        <span>Haz clic en una fila para ver el detalle por bancada</span>
      </div>
    </Card>

    <Card v-else padding="p-5">
      <div class="overflow-x-auto">
        <table class="w-full min-w-160 border-separate border-spacing-1">
          <thead>
            <tr class="text-[10px] text-primary-blue-obs">
              <th class="text-left font-semibold px-2 pb-2">Partido</th>
              <th v-for="law in mapLaws" :key="law.number" class="font-semibold px-1 pb-2">
                Ley {{ law.number }}
                <span class="block font-normal text-regular-gray-obs text-[9px]">{{ law.short }}</span>
              </th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="p in data.parties" :key="p.party">
              <th class="text-left px-2 py-1 text-xs font-semibold text-primary-black-obs">
                {{ p.party }}
                <span class="block text-[10px] font-normal text-regular-gray-obs">{{ p.members }} integrantes</span>
              </th>
              <td v-for="law in mapLaws" :key="law.number" class="text-center">
                <span
                  class="block rounded-lg py-2 text-[11px] font-mono font-bold"
                  :style="{ backgroundColor: bucket(p.rates[lawIndex(law.number)]).bg, color: bucket(p.rates[lawIndex(law.number)]).fg }"
                >
                  {{ fmtPct(p.rates[lawIndex(law.number)]) }}
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="flex flex-wrap items-center gap-2 mt-4 text-[10px] text-regular-gray-obs">
        <span>% a favor</span>
        <span v-for="b in buckets" :key="b.label" class="flex items-center gap-1">
          <span class="inline-block w-4 h-4 rounded" :style="{ backgroundColor: b.bg }"></span>{{ b.label }}
        </span>
      </div>
      <p class="text-[11px] text-gray-icon-obs mt-3">Porcentajes sobre el total de congresistas del partido; incluye a quienes se ausentaron o no votaron.</p>
      <p v-for="law in partialLaws" :key="law.number" class="mt-3 text-[11px] text-dark-yellow-obs bg-yellow-obs border border-amber-200 rounded-lg px-3 py-2">
        La Ley {{ law.number }} es una votación parcial: solo {{ law.recorded }} de {{ totalMembers }} congresistas tienen voto registrado, por lo que los porcentajes son bajos.
      </p>
    </Card>
      <div v-if="selectedLaw" class="fixed inset-0 z-50 flex justify-end" role="dialog" aria-modal="true" :aria-label="`Ley ${selectedLaw.number}`">
        <div class="absolute inset-0 bg-black/40" @click="close"></div>
        <aside class="relative w-full max-w-[22rem] sm:max-w-sm bg-white h-full overflow-y-auto shadow-2xl p-6">
          <button type="button" class="absolute top-4 right-4 text-gray-icon-obs hover:text-primary-black-obs text-xl leading-none" aria-label="Cerrar" @click="close">×</button>
          <p class="text-[10px] font-bold tracking-wide uppercase text-primary-blue-obs mb-1">Ley {{ selectedLaw.number }}</p>
          <h3 class="text-sm font-bold text-primary-black-obs pr-6 mb-5">{{ selectedLaw.title }}</h3>

          <div class="grid grid-cols-2 gap-3 mb-5">
            <div class="bg-lighter-gray-obs rounded-xl p-3">
              <p class="text-[9px] font-semibold tracking-wide uppercase text-gray-icon-obs mb-1">PL de origen</p>
              <p class="text-[11px] font-mono text-primary-gray-obs">{{ selectedLaw.originBill || 'Por confirmar' }}</p>
            </div>
            <div class="bg-lighter-gray-obs rounded-xl p-3">
              <p class="text-[9px] font-semibold tracking-wide uppercase text-gray-icon-obs mb-1">Votación considerada</p>
              <p class="text-[11px] text-primary-gray-obs">{{ voteTypes[selectedLaw.voteType].label }}</p>
            </div>
          </div>

          <p class="text-[10px] font-semibold tracking-wide uppercase text-gray-icon-obs mb-2">Resultado</p>
          <div class="flex h-5 rounded-full overflow-hidden bg-lighten-gray-obs mb-2 text-[10px] font-semibold text-white">
            <span v-if="selectedLaw.yes" class="flex items-center justify-center bg-primary-blue-obs" :style="{ width: share(selectedLaw, selectedLaw.yes) + '%' }">{{ selectedLaw.yes }}</span>
            <span v-if="selectedLaw.no" class="flex items-center justify-center bg-red-obs" :style="{ width: share(selectedLaw, selectedLaw.no) + '%' }">{{ selectedLaw.no }}</span>
            <span v-if="selectedLaw.abstain" class="bg-lighten-gray-obs" :style="{ width: share(selectedLaw, selectedLaw.abstain) + '%' }"></span>
          </div>
          <ul class="flex flex-wrap gap-x-4 gap-y-1 text-[10px] text-primary-gray-obs mb-5">
            <li class="flex items-center gap-1.5"><span class="w-2 h-2 rounded-sm bg-primary-blue-obs"></span><strong class="font-mono">{{ selectedLaw.yes }}</strong> Sí</li>
            <li class="flex items-center gap-1.5"><span class="w-2 h-2 rounded-sm bg-red-obs"></span><strong class="font-mono">{{ selectedLaw.no }}</strong> No</li>
            <li class="flex items-center gap-1.5"><span class="w-2 h-2 rounded-sm bg-light-gray-obs"></span><strong class="font-mono">{{ selectedLaw.abstain }}</strong> Abs</li>
          </ul>
          <p v-if="selectedLaw.partial" class="text-[10px] text-dark-yellow-obs bg-yellow-obs border border-amber-200 rounded px-2 py-1 mb-5">
            Votación parcial: solo {{ selectedLaw.recorded }} de {{ totalMembers }} congresistas tienen voto registrado.
          </p>

          <p class="text-[10px] font-semibold tracking-wide uppercase text-gray-icon-obs mb-2">Cómo votó cada bancada</p>
          <ul class="flex flex-col gap-2 mb-2">
            <li v-for="p in data.parties" :key="p.party" class="flex items-center gap-3 text-[11px] text-primary-gray-obs">
              <span class="w-32 shrink-0 leading-tight" :title="p.party">{{ p.party }}</span>
              <span class="flex-1 h-3.5 bg-lighter-gray-obs rounded-sm overflow-hidden">
                <span class="block h-full" :style="{ width: p.rates[selectedIndex] + '%', backgroundColor: bucket(p.rates[selectedIndex]).bg }"></span>
              </span>
              <span class="w-12 text-right font-mono font-bold text-primary-blue-obs">{{ fmtPct(p.rates[selectedIndex]) }}</span>
            </li>
          </ul>
          <p class="text-[10px] text-gray-icon-obs mb-5">% de congresistas del partido que votaron a favor</p>

          <div class="border border-lighten-gray-obs rounded-xl p-4 text-center">
            <p class="text-[10px] font-semibold tracking-wide uppercase text-gray-icon-obs mb-1">¿Por qué fue polémica?</p>
            <p class="text-sm text-gray-icon-obs">Próximamente</p>
          </div>
        </aside>
      </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import Button from '../ui/Button/Button.vue'
import Card from '../ui/Card/Card.vue'
import { completeSvgIcon } from '../ui/Icon/icons'
import { buildXlsx } from '../../lib/export-xls'
import { fmtPct } from '../../lib/format'
import type { LawVote, MemberVotesData, VotesSection } from '../../types/previous'

const props = defineProps<{ data: VotesSection; members: MemberVotesData }>()

const tabs = [
  { key: 'law', label: 'Por ley' },
  { key: 'party', label: 'Por partido' },
]
const active = ref('law')
const selected = ref<string | null>(null)

const voteTypes = {
  regular: { label: 'Votación regular', info: '' },
  exonerated: {
    label: 'Exoneración de 2.ª votación',
    info: 'El Pleno aprobó exonerar la ley de la segunda votación.',
  },
  none: {
    label: 'No hubo 2.ª votación',
    info: 'La ley se aprobó en una sola votación.',
  },
}

const buckets = [
  { label: '0-19 %', min: 0, bg: '#EAF2FA', fg: '#4A5565' },
  { label: '20-39 %', min: 20, bg: '#A9D1F0', fg: '#0A2847' },
  { label: '40-59 %', min: 40, bg: '#5BAEE6', fg: '#0A2847' },
  { label: '60-79 %', min: 60, bg: '#2B7BC4', fg: '#FFFFFF' },
  { label: '80-100 %', min: 80, bg: '#023E7D', fg: '#FFFFFF' },
]

const bucket = (rate: number) => [...buckets].reverse().find((b) => rate >= b.min) ?? buckets[0]

const totalMembers = computed(() => Math.max(...props.data.laws.map((l) => l.recorded)))
const mapLaws = computed(() => props.data.laws)
const partialLaws = computed(() => props.data.laws.filter((l) => l.partial))
const lawIndex = (number: string) => props.data.laws.findIndex((l) => l.number === number)

const share = (law: LawVote, value: number) => {
  const total = law.yes + law.no + law.abstain
  return total ? (value / total) * 100 : 0
}

const selectedIndex = computed(() => (selected.value ? lawIndex(selected.value) : -1))
const selectedLaw = computed(() => props.data.laws[selectedIndex.value] ?? null)

const open = (number: string) => {
  selected.value = number
}
const close = () => {
  selected.value = null
}

const onKeydown = (e: KeyboardEvent) => {
  if (e.key === 'Escape') close()
}
onMounted(() => window.addEventListener('keydown', onKeydown))
onBeforeUnmount(() => window.removeEventListener('keydown', onKeydown))
watch(selected, (value) => {
  document.body.style.overflow = value ? 'hidden' : ''
})

const voteLabels: Record<string, string> = {
  SI: 'Sí',
  NO: 'No',
  'ABST.': 'Abstención',
  AUS: 'Ausente',
  LP: 'Licencia personal',
  LE: 'Licencia por enfermedad',
  LO: 'Licencia oficial',
  SUS: 'Suspendido',
  SINRES: 'Sin respuesta',
}

const xlsIconPath = completeSvgIcon.find((icon) => icon.name === 'xls')?.path

const downloadMembers = () => {
  const header = ['Orden', 'Congresista', 'Partido', ...props.members.laws.map((l) => l.label)]
  const rows = props.members.members.map((m) => [
    m.order,
    m.name,
    m.party,
    ...m.votes.map((v) => (v === null ? 'Sin registro' : (voteLabels[v] ?? v))),
  ])
  const buf = buildXlsx('Votación por congresista', [header, ...rows], [8, 40, 36, ...props.members.laws.map(() => 28)])
  const blob = new Blob([buf as BlobPart], {
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = 'votacion-congresistas-9-leyes.xlsx'
  a.click()
  URL.revokeObjectURL(url)
}
</script>

<style scoped>
:deep(.icon svg) {
  width: 20px;
  height: 20px;
}
</style>
