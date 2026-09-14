import type { GlossaryTerm } from '../types'

export interface FetchGlossaryParams {
  search?: string
  letter?: string | null
}

// Backend applies the search/letter filters; the client just fetches and renders the result.
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

  return res.json()
}

// Dedicated endpoint so available letters stay correct once glossary.json is paginated server-side.
// Backend applies the search filter and returns only the letters that have matching terms.
export async function fetchGlossaryLetters(dataUrl: string, { search = '' }: FetchGlossaryParams = {}): Promise<Set<string>> {
  const params = new URLSearchParams()
  if (search) params.set('search', search)

  const query = params.toString()
  const res = await fetch(`${dataUrl}/glossary-letters.json${query ? `?${query}` : ''}`)
  if (!res.ok) throw new Error('Failed to load the glossary letters')

  const letters: string[] = await res.json()
  return new Set(letters.map((l) => l.toUpperCase()))
}
