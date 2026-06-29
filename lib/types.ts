export type Status = 'saved' | 'applied' | 'interviewing' | 'offer' | 'rejected';

export interface TrackerRow {
  id: string;
  company: string;
  role: string;
  status: Status;
  ctcAsk: number;
  budget: number;
  currency: 'USD' | 'EUR' | 'INR' | 'MYR' | 'GBP';
  source: string;
  region: string;
  date: string;
  visa: boolean;
  hourly?: boolean;
}

export interface Keyword {
  id: string;
  label: string;
  value: string;
}

export interface SavedSearch {
  id: string;
  name: string;
  query: string;
  url: string;
  sourceLabel: string;
  freq: 'off' | 'daily' | 'instant';
  matches: number;
  created: string;
}

export interface Profile {
  name: string;
  title: string;
  yoe: string;
  location: string;
  email: string;
  linkedin: string;
  github: string;
  skills: string;
  noticePeriod: string;
  currency: string;
  targetCTC: string;
  openToVisa: boolean;
  openToRelocation: boolean;
  bio: string;
}

export interface AlertPrefs {
  digest: boolean;
  instant: boolean;
  visaOnly: boolean;
  usdOnly: boolean;
}

export interface StringCard {
  q: string;
  tab?: string;
  filters: string;
  quality: 'High' | 'Medium';
  difficulty: 'easy' | 'medium' | 'hard';
  country: boolean;
  platform?: string;
  url?: string;
}

export interface Job {
  id: string;
  role: string;
  company: string;
  region: string;
  remote: string;
  currency: string;
  min: number;
  max: number;
  period: 'yr' | 'hr';
  visa: boolean;
  visaNote?: string;
  type: string;
  source: string;
  posted: string;
  tags: string[];
  desc: string;
}

export interface Company {
  name: string;
  region: string;
  website?: string;
  linkedin?: string;
  policy?: string;
  visa?: boolean;
  currency?: string;
  roles?: number;
  note?: string;
}

export interface HiringPost {
  name: string;
  title: string;
  when: string;
  text: string;
  role: string;
  company: string;
}
