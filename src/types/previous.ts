export type GeneralData = {
  label: string;
  value: number;
};

export type CompositionData = {
  party: string;
  color: string;
  seats: number;
};

export interface PreviousData {
  general: GeneralData[];
  composition?: CompositionData[];
}