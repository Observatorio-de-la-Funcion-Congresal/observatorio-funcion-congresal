export type GeneralData = {
  label: string;
  value: number;
};

export type CompositionData = {
  party: string;
  color: string;
  seats: number;
};

export type CompositionSection = {
  description: string;
  start: CompositionData[];
  end: CompositionData[];
  note: string;
};

export type BillStatus = {
  key: string;
  label: string;
  description: string;
  count: number;
  color: string;
};

export type BillsSection = {
  title: string;
  total: number;
  statuses: BillStatus[];
  promulgated: { label: string; value: number; caption: string };
  observed: { label: string; text: string };
};

export type MotionBreakdown = {
  label: string;
  count: number;
  color: string;
  badge?: string;
};

export type MotionCard = {
  key: string;
  title: string;
  info?: string;
  total: number;
  breakdown?: MotionBreakdown[];
  items?: { label: string; count: number }[];
  warning?: string;
};

export type MotionsSection = {
  title: string;
  description: string;
  note: string;
  cards: MotionCard[];
};

export type LabeledValue = { label: string; value: number };
export type PartyValue = { party: string; value: number; color: string };

export type CommissionsSection = {
  title: string;
  intro: { question: string; text: string };
  total: number;
  names: string[];
  average: {
    question: string;
    perYear: {
      value: number;
      unit: string;
      series: LabeledValue[];
      footnote: string;
    };
    fiveYears: {
      value: number;
      unit: string;
      median: number;
      max: number;
      howCalculated: string;
    };
  };
  presidencies: {
    title: string;
    subtitle: string;
    series: PartyValue[];
    insight: string;
  };
};

export type CalendarCell = 'ok' | 'partial' | 'missing' | 'none';

export type StatItem = { value: string; label: string };

export type ComplianceTab = {
  faq: { title: string; paragraphs: string[] };
  calendar: {
    title: string;
    subtitle: string;
    months: string[];
    legend: Record<Exclude<CalendarCell, 'none'>, string>;
    rows: { year: number; months: CalendarCell[] }[];
    caption: string;
    howCalculated: { title: string; text: string };
  };
  summary: {
    eyebrow: string;
    main: { value: number; label: string; detail: string };
    stats: StatItem[];
    note: string;
  };
  byCaucus: {
    title: string;
    subtitle: string;
    min: number;
    series: LabeledValue[];
    note: string;
  };
};

export type MemberHighlight = {
  label: string;
  name: string;
  detail: string;
  score: number;
};

export type QualityTab = {
  overview: {
    eyebrow: string;
    name: string;
    info: string;
    score: number;
    scoreCaption: string;
    stats: StatItem[];
    distribution: {
      title: string;
      levels: { label: string; value: number; color: string }[];
      note: string;
    };
  };
  perMember: {
    eyebrow: string;
    stats: StatItem[];
    highest: MemberHighlight;
    lowest: MemberHighlight;
    note: string;
  };
  byCaucus: {
    title: string;
    subtitle: string;
    series: LabeledValue[];
    note: string;
  };
  dimensions: {
    title: string;
    items: { name: string; weight: number; color: string; description: string }[];
    methodologyLabel: string;
  };
  banner: { title: string; stats: StatItem[] };
};

export type WeeksStatus = CalendarCell;

export type WeeksSection = {
  title: string;
  subtitle: string;
  intro: { title: string; paragraphs: string[] };
  calendar: {
    title: string;
    subtitle: string;
    months: string[];
    rows: { year: number; months: WeeksStatus[] }[];
    legend: { status: Exclude<WeeksStatus, 'none'>; lines: string[] }[];
    note: string;
  };
  compliance: {
    title: string;
    subtitle: string;
    main: { value: string; label: string; detail: string };
    stats: { icon: 'user' | 'check' | 'users' | 'bill'; value: string; label: string }[];
    alert: { value: string; label: string };
    note: string;
  };
  groups: {
    title: string;
    subtitle: string;
    ticks: number[];
    series: { name: string; value: number; outlier?: boolean }[];
    note: string;
  };
  qualityCta: { title: string; text: string; linkLabel: string; url: string };
};

export type RepresentationSection = {
  title: string;
  compliance: ComplianceTab;
  quality: QualityTab;
  weeks?: WeeksSection;
};

export type LawVote = {
  number: string;
  title: string;
  short: string;
  voteType: 'regular' | 'exonerated' | 'none';
  yes: number;
  no: number;
  abstain: number;
  noVote: number;
  recorded: number;
  partial: boolean;
  originBill?: string | null;
};

export type PartyVotes = {
  party: string;
  members: number;
  rates: number[];
};

export type VotesSection = {
  title: string;
  description: string;
  laws: LawVote[];
  parties: PartyVotes[];
};

export type MemberVotes = {
  order: number;
  name: string;
  party: string;
  votes: (string | null)[];
};

export type MemberVotesData = {
  laws: { number: string; label: string }[];
  members: MemberVotes[];
};

export interface PreviousData {
  general: GeneralData[];
  composition?: CompositionSection;
  bills?: BillsSection;
  motions?: MotionsSection;
  commissions?: CommissionsSection;
  representation?: RepresentationSection;
  votes?: VotesSection;
}
