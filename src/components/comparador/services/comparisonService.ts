import type { CandidateDetail, PartyDetail } from '../types'

export async function fetchCandidateDetail(
  dataUrl: string,
  id: number,
  cache: Record<number, CandidateDetail>
): Promise<CandidateDetail | null> {
  if (cache[id]) return cache[id]
  try {
    const res = await fetch(`${dataUrl}/candidates/${id}.json`)
    if (!res.ok) return null
    const data: CandidateDetail = await res.json()
    cache[id] = data
    return data
  } catch {
    return null
  }
}

export async function fetchPartyDetail(
  dataUrl: string,
  id: number,
  cache: Record<number, PartyDetail>
): Promise<PartyDetail | null> {
  if (cache[id]) return cache[id]
  try {
    const res = await fetch(`${dataUrl}/parties/${id}.json`)
    if (!res.ok) return null
    const data: PartyDetail = await res.json()
    cache[id] = data
    return data
  } catch {
    return null
  }
}
