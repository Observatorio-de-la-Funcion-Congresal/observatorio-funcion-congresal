import { ref, computed, watch } from 'vue'
import type {
  ComparisonMode,
  CandidateSummary,
  CandidateDetail,
  PartySummary,
  PartyDetail,
  Metric,
  CandidateSelection,
  PartySelection,
} from '../types'

export const COMPARISON_COLORS = ['#023E7D', '#D62828', '#059669', '#D97706']
export const MAX_SELECTIONS = 4

export const CANDIDATE_METRICS: Metric[] = [
  { key: 'performance.attendance',     label: '% Asistencia al Pleno',       unit: '%' },
  { key: 'performance.abstentions',    label: '% Votos en Abstención',        unit: '%' },
  { key: 'performance.session_week',   label: '% Semana de Representación',   unit: '%' },
  { key: 'performance.accomplishment', label: 'Cumplimiento de Promesas',     unit: '%' },
  { key: 'performance.participation',  label: 'Participación en Comisiones',  unit: '%' },
  { key: 'performance.projects',       label: 'Proyectos de Ley (Autor)',     unit: ''  },
]

export const PARTY_METRICS: Metric[] = [
  { key: 'metrics.attendance_average',     label: '% Asistencia Promedio',   unit: '%' },
  { key: 'metrics.accomplishment_average', label: '% Cumplimiento Promedio', unit: '%' },
  { key: 'metrics.projects_average',       label: 'Proyectos Promedio',      unit: ''  },
]

export function getNestedValue(obj: Record<string, unknown>, path: string): number {
  const result = path
    .split('.')
    .reduce<unknown>(
      (acc, key) => (acc !== null && typeof acc === 'object' ? (acc as Record<string, unknown>)[key] : undefined),
      obj
    )
  return typeof result === 'number' ? result : 0
}

function nextColor(current: CandidateSelection[] | PartySelection[]): string {
  const used = new Set(current.map((s) => s.color))
  return COMPARISON_COLORS.find((c) => !used.has(c)) ?? COMPARISON_COLORS[0]
}

export function useComparison(dataUrl: string) {
  const mode = ref<ComparisonMode>('candidates')

  // Lightweight lists (loaded at mount for search/select)
  const candidateList = ref<CandidateSummary[]>([])
  const partyList = ref<PartySummary[]>([])

  // Selected items (with full detail, fetched on demand)
  const selectedCandidates = ref<CandidateSelection[]>([])
  const selectedParties = ref<PartySelection[]>([])

  // Caches so we don't re-fetch the same detail
  const candidateDetailCache: Record<number, CandidateDetail> = {}
  const partyDetailCache: Record<number, PartyDetail> = {}

  const loadingId = ref<number | null>(null)
  const listLoading = ref(false)

  // Active metric keys (all on by default, per mode)
  const activeMetricKeys = ref<string[]>(CANDIDATE_METRICS.map((m) => m.key))

  // Switch metric set when mode changes
  watch(mode, (m) => {
    activeMetricKeys.value =
      m === 'candidates' ? CANDIDATE_METRICS.map((x) => x.key) : PARTY_METRICS.map((x) => x.key)
  })

  const currentMetrics = computed(() =>
    mode.value === 'candidates' ? CANDIDATE_METRICS : PARTY_METRICS
  )

  const activeMetrics = computed(() =>
    currentMetrics.value.filter((m) => activeMetricKeys.value.includes(m.key))
  )

  const isReadyToCompare = computed(() =>
    mode.value === 'candidates'
      ? selectedCandidates.value.length >= 2
      : selectedParties.value.length >= 2
  )

  // ── Data loaders ──────────────────────────────────────────────────────────

  async function loadCandidateList() {
    listLoading.value = true
    try {
      const res = await fetch(`${dataUrl}/candidate.json`)
      candidateList.value = await res.json()
    } finally {
      listLoading.value = false
    }
  }

  async function loadPartyList() {
    try {
      const res = await fetch(`${dataUrl}/party.json`)
      partyList.value = await res.json()
    } catch { /* silent */ }
  }

  async function fetchCandidateDetail(id: number): Promise<CandidateDetail | null> {
    if (candidateDetailCache[id]) return candidateDetailCache[id]
    // In production this would be: fetch(`${dataUrl}/candidates/${id}.json`)
    const res = await fetch(`${dataUrl}/candidate-complete.json`)
    const all: CandidateDetail[] = await res.json()
    all.forEach((c) => { candidateDetailCache[c.id] = c })
    return candidateDetailCache[id] ?? null
  }

  async function fetchPartyDetail(id: number): Promise<PartyDetail | null> {
    if (partyDetailCache[id]) return partyDetailCache[id]
    const res = await fetch(`${dataUrl}/party-complete.json`)
    const all: PartyDetail[] = await res.json()
    all.forEach((p) => { partyDetailCache[p.id] = p })
    return partyDetailCache[id] ?? null
  }

  // ── Toggle selections ──────────────────────────────────────────────────────

  async function toggleCandidate(id: number) {
    const idx = selectedCandidates.value.findIndex((s) => s.id === id)
    if (idx !== -1) {
      selectedCandidates.value.splice(idx, 1)
      return
    }
    if (selectedCandidates.value.length >= MAX_SELECTIONS) return
    loadingId.value = id
    try {
      const data = await fetchCandidateDetail(id)
      if (!data) return
      selectedCandidates.value.push({ id, data, color: nextColor(selectedCandidates.value) })
    } finally {
      loadingId.value = null
    }
  }

  async function toggleParty(id: number) {
    const idx = selectedParties.value.findIndex((s) => s.id === id)
    if (idx !== -1) {
      selectedParties.value.splice(idx, 1)
      return
    }
    if (selectedParties.value.length >= MAX_SELECTIONS) return
    loadingId.value = id
    try {
      const data = await fetchPartyDetail(id)
      if (!data) return
      selectedParties.value.push({ id, data, color: nextColor(selectedParties.value) })
    } finally {
      loadingId.value = null
    }
  }

  function isCandidateSelected(id: number) {
    return selectedCandidates.value.some((s) => s.id === id)
  }

  function isPartySelected(id: number) {
    return selectedParties.value.some((s) => s.id === id)
  }

  function toggleMetric(key: string) {
    const idx = activeMetricKeys.value.indexOf(key)
    if (idx === -1) {
      activeMetricKeys.value.push(key)
    } else if (activeMetricKeys.value.length > 1) {
      // Always keep at least 1 metric active
      activeMetricKeys.value.splice(idx, 1)
    }
  }

  return {
    mode,
    candidateList,
    partyList,
    selectedCandidates,
    selectedParties,
    loadingId,
    listLoading,
    activeMetricKeys,
    activeMetrics,
    currentMetrics,
    isReadyToCompare,
    loadCandidateList,
    loadPartyList,
    toggleCandidate,
    toggleParty,
    isCandidateSelected,
    isPartySelected,
    toggleMetric,
  }
}
