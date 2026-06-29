'use client';

import { useMemo, useState } from 'react';
import { Copy, Check, ScanSearch, Bell, ExternalLink } from 'lucide-react';
import type { Keyword, SavedSearch } from '@/lib/types';

const XRAY_SOURCES: Record<string, { label: string; base: string }> = {
  'li-profiles': { label: 'LinkedIn profiles',               base: 'site:linkedin.com/in' },
  'li-hiring':   { label: 'LinkedIn "hiring" posts',          base: 'site:linkedin.com/posts ("hiring" OR "we are hiring" OR "join our team")' },
  'ats':         { label: 'ATS boards (Lever/Greenhouse/Ashby)', base: '(site:jobs.lever.co OR site:boards.greenhouse.io OR site:jobs.ashbyhq.com)' },
  'twitter':     { label: 'X / Twitter posts',               base: 'site:twitter.com ("hiring" OR "we are hiring")' },
};

const XRAY_REGIONS: Record<string, { label: string; q: string }> = {
  worldwide: { label: 'Worldwide', q: '("remote worldwide" OR "remote global" OR "anywhere")' },
  india:     { label: 'India',     q: '("remote india" OR "based in india" OR "ist")' },
  usa:       { label: 'USA',       q: '("united states" OR "us-based" OR "remote us")' },
  europe:    { label: 'Europe',    q: '(europe OR eu OR "cet" OR "remote europe")' },
  malaysia:  { label: 'Malaysia',  q: '(malaysia OR "kuala lumpur" OR "employment pass")' },
};

interface Props {
  keywords: Keyword[];
  onSaveSearch: (s: SavedSearch) => void;
}

export default function XRay({ keywords, onSaveSearch }: Props) {
  const [role, setRole] = useState('("Senior Frontend" OR "Frontend Engineer" OR "React Developer")');
  const [source, setSource] = useState('li-hiring');
  const [regions, setRegions] = useState<Record<string, boolean>>({ worldwide: true });
  const [opts, setOpts] = useState({ remote: true, visa: false, usd: true });
  const [copied, setCopied] = useState(false);
  const [saved, setSaved] = useState(false);

  const toggleRegion = (r: string) => setRegions((p) => ({ ...p, [r]: !p[r] }));
  const toggleOpt = (o: keyof typeof opts) => setOpts((p) => ({ ...p, [o]: !p[o] }));

  const query = useMemo(() => {
    const parts = [XRAY_SOURCES[source].base];
    if (role.trim()) parts.push(role.trim());
    if (opts.remote) parts.push('(remote OR "work from home" OR distributed)');
    if (opts.visa)   parts.push('("visa sponsorship" OR relocation OR "work permit")');
    if (opts.usd)    parts.push('(USD OR "$" OR "paid in dollars")');
    const rkeys = Object.keys(regions).filter((r) => regions[r]);
    if (rkeys.length) parts.push('(' + rkeys.map((r) => XRAY_REGIONS[r].q).join(' OR ') + ')');
    return parts.join(' ');
  }, [role, source, regions, opts]);

  const url = 'https://www.google.com/search?q=' + encodeURIComponent(query);

  const copy = () => {
    navigator.clipboard?.writeText(query);
    setCopied(true);
    setTimeout(() => setCopied(false), 1400);
  };

  const save = () => {
    const rkeys = Object.keys(regions).filter((r) => regions[r]).map((r) => XRAY_REGIONS[r].label);
    const name = `${role.replace(/[()"]/g, '').split(' OR ')[0].trim() || 'Frontend'} · ${rkeys.join(', ') || 'Any region'}`;
    onSaveSearch({
      id: 's' + Date.now(), name, query, url,
      sourceLabel: XRAY_SOURCES[source].label,
      freq: 'daily',
      matches: 3 + Math.floor(Math.random() * 9),
      created: 'just now',
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 1600);
  };

  return (
    <div>
      <div className="section-head" style={{ marginBottom: 16 }}>
        <div>
          <h2>Google X-Ray search builder</h2>
          <p className="muted" style={{ fontSize: 13, marginTop: 4, maxWidth: 560 }}>
            Toggle what you want and copy a ready-made boolean string. X-Ray search pulls profiles, hiring posts and job pages straight out of Google.
          </p>
        </div>
      </div>

      <div className="xray-grid">
        <div className="card xray-panel">
          <div className="field">
            <label className="field-label">Role keywords</label>
            <textarea
              className="text-input"
              rows={2}
              value={role}
              onChange={(e) => setRole(e.target.value)}
              style={{ fontFamily: 'var(--mono)', fontSize: 12.5, resize: 'vertical' }}
            />
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 8 }}>
              {keywords.slice(0, 4).map((k) => (
                <button key={k.id} className="opt-toggle" onClick={() => setRole(k.value)}>{k.label}</button>
              ))}
            </div>
          </div>

          <div className="field">
            <label className="field-label">Search on</label>
            <div className="toggle-row">
              {Object.entries(XRAY_SOURCES).map(([k, v]) => (
                <button key={k} className={`opt-toggle${source === k ? ' on' : ''}`} onClick={() => setSource(k)}>{v.label}</button>
              ))}
            </div>
          </div>

          <div className="field">
            <label className="field-label">Regions</label>
            <div className="toggle-row">
              {Object.entries(XRAY_REGIONS).map(([k, v]) => (
                <button key={k} className={`opt-toggle${regions[k] ? ' on' : ''}`} onClick={() => toggleRegion(k)}>{v.label}</button>
              ))}
            </div>
          </div>

          <div className="field" style={{ marginBottom: 0 }}>
            <label className="field-label">Must mention</label>
            <div className="toggle-row">
              <button className={`opt-toggle${opts.remote ? ' on' : ''}`} onClick={() => toggleOpt('remote')}>Remote</button>
              <button className={`opt-toggle${opts.visa ? ' on' : ''}`} onClick={() => toggleOpt('visa')}>Visa / relocation</button>
              <button className={`opt-toggle${opts.usd ? ' on' : ''}`} onClick={() => toggleOpt('usd')}>USD / foreign pay</button>
            </div>
          </div>
        </div>

        <div className="card xray-panel">
          <label className="field-label">Generated search string</label>
          <div className="query-out">{query}</div>
          <div className="source-btns">
            <button className="btn" onClick={copy}>
              {copied ? <><Check size={15} /> Copied</> : <><Copy size={15} /> Copy string</>}
            </button>
            <a className="btn btn-primary" href={url} target="_blank" rel="noopener">
              <ScanSearch size={15} /> Search on Google
            </a>
          </div>
          <button className="btn" style={{ width: '100%', justifyContent: 'center', marginTop: 8 }} onClick={save}>
            {saved ? <><Check size={15} /> Saved to alerts</> : <><Bell size={15} /> Save search &amp; alert me</>}
          </button>
          <div style={{ marginTop: 18, paddingTop: 16, borderTop: '1px solid var(--border)' }}>
            <label className="field-label">Open the same search elsewhere</label>
            <div className="source-btns" style={{ marginTop: 0 }}>
              <a className="btn btn-sm" href={`https://www.bing.com/search?q=${encodeURIComponent(query)}`} target="_blank" rel="noopener">
                <ExternalLink size={14} /> Bing
              </a>
              <a className="btn btn-sm" href={`https://duckduckgo.com/?q=${encodeURIComponent(query)}`} target="_blank" rel="noopener">
                <ExternalLink size={14} /> DuckDuckGo
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
