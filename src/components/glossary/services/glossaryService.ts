import type { GlossaryTerm } from '../types'

export interface FetchGlossaryParams {
  search?: string
  letter?: string | null
}

// Mock endpoint: filters client-side until a real search API exists.
export async function fetchGlossaryTerms(
  dataUrl: string,
  { search = '', letter = null }: FetchGlossaryParams = {}
): Promise<GlossaryTerm[]> {
  const params = new URLSearchParams()
  if (search) params.set('search', search)
  if (letter) params.set('letter', letter)

  const query = params.toString()
  const res = await fetch(`${dataUrl}/glossary.json${query ? `?${query}` : ''}`)
  if (!res.ok) throw new Error('Failed to load the glossary')

  const terms: GlossaryTerm[] = await res.json()
  const q = search.trim().toLowerCase()

  return terms.filter((t) => {
    const matchesSearch = q === '' || t.term.toLowerCase().includes(q) || t.definition.toLowerCase().includes(q)
    const matchesLetter = !letter || t.term.trim()[0]?.toUpperCase() === letter
    return matchesSearch && matchesLetter
  })
}

// Dedicated endpoint so available letters stay correct once glossary.json is paginated server-side.
export async function fetchGlossaryLetters(dataUrl: string): Promise<Set<string>> {
  const res = await fetch(`${dataUrl}/glossary-letters.json`)
  if (!res.ok) throw new Error('Failed to load the glossary letters')

  const letters: string[] = await res.json()
  return new Set(letters.map((l) => l.toUpperCase()))
}
