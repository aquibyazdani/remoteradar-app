import type { StringCard } from './types';

export interface Country {
  code?: string;
  label: string;
  flag: string;
}

export const COUNTRIES: Country[] = [
  { code: 'all', label: 'All Countries', flag: '🌍' },
  { label: 'United States', flag: '🇺🇸' },
  { label: 'United Kingdom', flag: '🇬🇧' },
  { label: 'Germany', flag: '🇩🇪' },
  { label: 'Netherlands', flag: '🇳🇱' },
  { label: 'Canada', flag: '🇨🇦' },
  { label: 'Australia', flag: '🇦🇺' },
  { label: 'Ireland', flag: '🇮🇪' },
  { label: 'Sweden', flag: '🇸🇪' },
  { label: 'Denmark', flag: '🇩🇰' },
  { label: 'Portugal', flag: '🇵🇹' },
  { label: 'Spain', flag: '🇪🇸' },
  { label: 'France', flag: '🇫🇷' },
  { label: 'Singapore', flag: '🇸🇬' },
  { label: 'UAE', flag: '🇦🇪' },
  { label: 'Japan', flag: '🇯🇵' },
  { label: 'Switzerland', flag: '🇨🇭' },
  { label: 'Poland', flag: '🇵🇱' },
  { label: 'Estonia', flag: '🇪🇪' },
];

export const HOWTO: Record<string, string[]> = {
  linkedin: [
    'Copy a string (or hit Open LinkedIn — it copies and opens the search for you).',
    'On LinkedIn, paste it into the search box and switch to the Jobs or Posts tab as noted on the card.',
    'Apply the listed filters (Remote, Experience, Date) in the left rail, then sort by "Most recent".',
  ],
  xray: [
    'Hit Open Google — the boolean string runs as a site: search across LinkedIn, ATS boards and more.',
    'X-Ray bypasses LinkedIn\'s result limits, so you see public profiles and job pages directly.',
    'Add a country from the dropdown to narrow results to one market.',
  ],
  other: [
    'Each card opens a remote-friendly board pre-filtered for frontend roles.',
    'Copy the string to reuse inside that board\'s own search box.',
    'These boards skew toward USD-paying, async, fully-remote companies.',
  ],
};

export interface CategoryData {
  blurb: string;
  warning: string | null;
  linkedin: StringCard[];
  xray: StringCard[];
  other: StringCard[];
}

export const SEARCH_STRINGS: Record<string, CategoryData> = {
  worldwide: {
    blurb: 'Find senior frontend / React remote roles worldwide paying in USD, EUR or GBP. Strings are tuned for LinkedIn Jobs and Google X-Ray to surface the highest-quality remote openings.',
    warning: null,
    linkedin: [
      { q: '"senior frontend engineer" OR "frontend engineer"', tab: 'Jobs', filters: 'Remote ✓, Experience: Mid-Senior, Location: [country]', quality: 'High', difficulty: 'easy', country: true },
      { q: '"frontend architect" OR "staff engineer" React', tab: 'Jobs', filters: 'Remote ✓, Experience: Mid-Senior', quality: 'High', difficulty: 'easy', country: true },
      { q: 'React TypeScript "remote"', tab: 'Jobs', filters: 'Remote ✓, Date: Past week, Location: [country]', quality: 'Medium', difficulty: 'easy', country: true },
      { q: '"senior frontend" ("work from anywhere" OR "fully remote")', tab: 'Posts', filters: 'Content tab, Date: Past 24h', quality: 'Medium', difficulty: 'medium', country: false },
    ],
    xray: [
      { q: '(site:jobs.lever.co OR site:boards.greenhouse.io OR site:jobs.ashbyhq.com) "senior frontend" remote -intern', filters: 'Add [country] to narrow', quality: 'High', difficulty: 'medium', country: true },
      { q: 'site:linkedin.com/jobs "frontend engineer" "remote" React', filters: 'Add [country] to narrow', quality: 'High', difficulty: 'easy', country: true },
      { q: '(site:weworkremotely.com OR site:remoteok.com) "senior" frontend', filters: 'Worldwide boards', quality: 'Medium', difficulty: 'easy', country: false },
    ],
    other: [
      { platform: 'We Work Remotely', q: 'frontend', url: 'https://weworkremotely.com/remote-jobs/search?term={q}', filters: 'Programming category', quality: 'High', difficulty: 'easy', country: false },
      { platform: 'Work at a Startup (YC)', q: 'frontend engineer remote', url: 'https://www.workatastartup.com/companies?query={q}', filters: 'USD, equity', quality: 'High', difficulty: 'easy', country: false },
      { platform: 'RemoteOK', q: 'frontend', url: 'https://remoteok.com/remote-front-end-dev-jobs', filters: 'Global, USD', quality: 'Medium', difficulty: 'easy', country: false },
    ],
  },
  india: {
    blurb: 'Remote roles that explicitly hire from India or the APAC timezone — including USD-paying platforms like Turing, Arc.dev and Toptal.',
    warning: null,
    linkedin: [
      { q: '"frontend engineer" "India" remote', tab: 'Jobs', filters: 'Remote ✓, Date: Past week', quality: 'Medium', difficulty: 'easy', country: false },
      { q: 'React "senior" remote', tab: 'Jobs', filters: 'Location: India, Remote ✓, Experience: Mid-Senior', quality: 'High', difficulty: 'easy', country: false },
      { q: '"frontend" ("APAC" OR "Asia timezone") remote', tab: 'Jobs', filters: 'Remote ✓', quality: 'High', difficulty: 'medium', country: false },
      { q: 'Turing OR Toptal OR Arc "senior frontend"', tab: 'Posts', filters: 'Content tab · USD platforms', quality: 'Medium', difficulty: 'medium', country: false },
    ],
    xray: [
      { q: 'site:linkedin.com/jobs "frontend" remote ("India" OR "IST" OR "Asia")', filters: 'India / APAC', quality: 'High', difficulty: 'medium', country: false },
      { q: '(site:turing.com OR site:arc.dev OR site:toptal.com) "frontend" remote', filters: 'USD-paying platforms', quality: 'High', difficulty: 'easy', country: false },
      { q: 'site:wellfound.com "frontend" remote India', filters: 'Startups hiring from India', quality: 'Medium', difficulty: 'easy', country: false },
    ],
    other: [
      { platform: 'Turing', q: 'frontend', url: 'https://www.turing.com/jobs/remote-front-end-developer-jobs', filters: 'USD, US companies', quality: 'High', difficulty: 'easy', country: false },
      { platform: 'Arc.dev', q: 'frontend', url: 'https://arc.dev/remote-jobs?role=front-end', filters: 'Vetted, USD', quality: 'High', difficulty: 'easy', country: false },
      { platform: 'Wellfound', q: 'frontend engineer', url: 'https://wellfound.com/role/r/frontend-engineer', filters: 'Filter: Remote · India', quality: 'Medium', difficulty: 'easy', country: false },
    ],
  },
  visa: {
    blurb: 'Find companies that actively sponsor work visas and relocation for senior frontend engineers. Pick a country to see its primary visa type.',
    warning: 'Always open the full job description and Ctrl+F for "no visa" or "must be authorized" — LinkedIn may still surface non-sponsoring roles in these results.',
    linkedin: [
      { q: '"senior frontend" "visa sponsorship"', tab: 'Jobs', filters: 'Location: [country], Experience: Mid-Senior, Date: Past week', quality: 'High', difficulty: 'easy', country: true },
      { q: '"frontend engineer" "relocation"', tab: 'Jobs', filters: 'Location: [country], Experience: Mid-Senior', quality: 'High', difficulty: 'easy', country: true },
      { q: 'React "Blue Card" OR "work permit"', tab: 'Jobs', filters: 'Location: Germany', quality: 'High', difficulty: 'medium', country: false },
      { q: '"frontend" "Skilled Worker" OR "visa sponsor"', tab: 'Jobs', filters: 'Location: United Kingdom', quality: 'High', difficulty: 'medium', country: false },
    ],
    xray: [
      { q: 'site:linkedin.com/jobs "frontend" ("visa sponsorship" OR relocation) "[country]"', filters: 'Pick a country', quality: 'High', difficulty: 'medium', country: true },
      { q: '(site:boards.greenhouse.io OR site:jobs.lever.co) "frontend" ("visa" OR relocation OR "work permit")', filters: 'ATS boards', quality: 'High', difficulty: 'medium', country: false },
      { q: '"we sponsor" OR "visa sponsorship available" "frontend engineer"', filters: 'Open web', quality: 'Medium', difficulty: 'medium', country: true },
    ],
    other: [
      { platform: 'Relocate.me', q: 'frontend', url: 'https://relocate.me/search?keywords=frontend', filters: 'Relocation + visa only', quality: 'High', difficulty: 'easy', country: false },
      { platform: 'Landing.jobs', q: 'frontend', url: 'https://landing.jobs/jobs?q=frontend', filters: 'EU, visa support', quality: 'High', difficulty: 'easy', country: false },
      { platform: 'Honeypot', q: 'frontend', url: 'https://www.honeypot.io/', filters: 'Germany / NL, relocation', quality: 'Medium', difficulty: 'easy', country: false },
    ],
  },
  freelance: {
    blurb: 'Hourly and fixed-term remote contracts paid in USD. Strings target contract-friendly platforms and LinkedIn contract listings.',
    warning: null,
    linkedin: [
      { q: '"frontend" (contract OR freelance OR "fractional")', tab: 'Jobs', filters: 'Job type: Contract, Remote ✓', quality: 'High', difficulty: 'easy', country: true },
      { q: 'React "3 month" OR "6 month" contract remote', tab: 'Jobs', filters: 'Remote ✓, Date: Past week', quality: 'Medium', difficulty: 'medium', country: false },
      { q: '"frontend developer" "hourly" remote', tab: 'Posts', filters: 'Content tab, Date: Past 24h', quality: 'Medium', difficulty: 'medium', country: false },
    ],
    xray: [
      { q: '(site:toptal.com OR site:braintrust.com OR site:gun.io) frontend remote', filters: 'Freelance networks', quality: 'High', difficulty: 'easy', country: false },
      { q: 'site:linkedin.com/jobs "frontend" contract remote "USD"', filters: 'Contract + USD', quality: 'High', difficulty: 'medium', country: false },
    ],
    other: [
      { platform: 'Braintrust', q: 'frontend', url: 'https://www.usebraintrust.com/jobs?search=frontend', filters: 'No fees, USD', quality: 'High', difficulty: 'easy', country: false },
      { platform: 'Toptal', q: 'frontend', url: 'https://www.toptal.com/talent/apply', filters: 'Vetted network', quality: 'High', difficulty: 'medium', country: false },
      { platform: 'Gun.io', q: 'frontend', url: 'https://www.gun.io/', filters: 'US-hours contracts', quality: 'Medium', difficulty: 'easy', country: false },
    ],
  },
  currency: {
    blurb: "Roles paying in USD, EUR or other strong currencies regardless of where you sit. Great for arbitrage if you're based in a lower-cost market.",
    warning: null,
    linkedin: [
      { q: '"frontend engineer" "USD" remote', tab: 'Jobs', filters: 'Remote ✓, Date: Past week', quality: 'High', difficulty: 'easy', country: false },
      { q: 'React "paid in USD" OR "$" remote', tab: 'Posts', filters: 'Content tab', quality: 'Medium', difficulty: 'medium', country: false },
      { q: '"senior frontend" "competitive USD" OR "EUR"', tab: 'Jobs', filters: 'Remote ✓, Experience: Mid-Senior', quality: 'Medium', difficulty: 'medium', country: false },
    ],
    xray: [
      { q: '(site:jobs.lever.co OR site:boards.greenhouse.io) "frontend" remote ("USD" OR "$")', filters: 'ATS boards, USD', quality: 'High', difficulty: 'medium', country: false },
      { q: 'site:linkedin.com/jobs "frontend" remote ("USD" OR "EUR" OR "GBP")', filters: 'Strong currencies', quality: 'High', difficulty: 'easy', country: false },
    ],
    other: [
      { platform: 'Turing', q: 'frontend', url: 'https://www.turing.com/jobs/remote-front-end-developer-jobs', filters: 'US companies, USD', quality: 'High', difficulty: 'easy', country: false },
      { platform: 'Deel jobs', q: 'frontend', url: 'https://www.deel.com/job-board/', filters: 'Global payroll, USD', quality: 'Medium', difficulty: 'easy', country: false },
    ],
  },
  people: {
    blurb: 'Skip the job board — find the actual people posting "we\'re hiring" so you can reply directly. These strings target LinkedIn Posts and recruiter profiles.',
    warning: 'Comment or DM within a few hours of the post — hiring posts get buried fast. Lead with one specific proof point, not "I\'m interested".',
    linkedin: [
      { q: '("we\'re hiring" OR "we are hiring") "frontend engineer" remote', tab: 'Posts', filters: 'Content tab, Date: Past 24h', quality: 'High', difficulty: 'easy', country: true },
      { q: '"hiring" "senior frontend" ("DM me" OR "comment")', tab: 'Posts', filters: 'Content tab, Date: Past week', quality: 'High', difficulty: 'easy', country: false },
      { q: '"join our team" React remote', tab: 'Posts', filters: 'Content tab', quality: 'Medium', difficulty: 'medium', country: false },
      { q: 'recruiter ("frontend" OR React) remote', tab: 'People', filters: 'People tab · connect + note', quality: 'Medium', difficulty: 'medium', country: true },
    ],
    xray: [
      { q: 'site:linkedin.com/posts ("we are hiring" OR "hiring") "frontend" remote', filters: 'Public hiring posts', quality: 'High', difficulty: 'easy', country: true },
      { q: 'site:twitter.com ("hiring" OR "we are hiring") "frontend engineer" remote', filters: 'X / Twitter posts', quality: 'Medium', difficulty: 'medium', country: false },
    ],
    other: [
      { platform: 'Hacker News — Who is hiring', q: 'frontend remote', url: 'https://hn.algolia.com/?query=frontend%20remote&type=comment', filters: 'Monthly thread, search comments', quality: 'High', difficulty: 'easy', country: false },
    ],
  },
};
