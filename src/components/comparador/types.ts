export type ComparisonMode = 'candidates' | 'parties'

export interface CandidateSummary {
  id: number
  name: string
  picture: string
  party: string
  partyId: number
  region: string
  applyTo: string
  attendance: number
  projects: number
}

export interface CandidateDetail {
  id: number
  picture: string
  name: string
  region: string
  party: string
  partyId: number
  attendance: number
  abstentions: number
  projects: number
  commissions_count: number
  applyTo: string
  performance: {
    attendance: number
    abstentions: number
    session_week: number
    accomplishment: number
    projects: number
    participation: number
  }
  bills: {
    presented: number
    approved: number
    approval_rate: number
    as_author: number
    as_adherent: number
  }
  additional_info: {
    representation_week: number
    party_change: boolean
    commission_participation: string
  }
  commissions: string[]
}

export interface PartySummary {
  id: number
  name: string
  picture: string
  senator_count: number
  deputy_count: number
  leader: string
  founded_year: string
}

export interface PartyDetail extends PartySummary {
  metrics: {
    attendance: number
    accomplishment: number
    projects: number
  }
}

export interface Metric {
  key: string
  label: string
  unit: string
}

export interface CandidateSelection {
  id: number
  data: CandidateDetail
  color: string
}

export interface PartySelection {
  id: number
  data: PartyDetail
  color: string
}
