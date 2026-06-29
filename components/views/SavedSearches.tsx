'use client';

import { ScanSearch, ExternalLink, X } from 'lucide-react';
import type { SavedSearch } from '@/lib/types';

const FREQ = ['off', 'daily', 'instant'] as const;
const FREQ_LABEL: Record<string, string> = { off: 'Alerts off', daily: 'Daily digest', instant: 'Instant' };

interface Props {
  searches: SavedSearch[];
  setSearches: (s: SavedSearch[]) => void;
  onNav: (r: string) => void;
}

export default function SavedSearches({ searches, setSearches, onNav }: Props) {
  const setFreq = (id: string, freq: SavedSearch['freq']) =>
    setSearches(searches.map((s) => (s.id === id ? { ...s, freq } : s)));
  const remove = (id: string) => setSearches(searches.filter((s) => s.id !== id));
  const totalNew = searches.reduce((a, s) => a + (s.freq !== 'off' ? s.matches : 0), 0);

  return (
    <div>
      <div className="section-head">
        <div>
          <h2>{searches.length} saved search{searches.length !== 1 ? 'es' : ''}</h2>
          <p className="muted" style={{ fontSize: 13, marginTop: 4 }}>
            {totalNew > 0
              ? `${totalNew} new matches across active alerts`
              : 'Turn on alerts to get pinged about new matches'}
          </p>
        </div>
        <button className="btn btn-sm" onClick={() => onNav('xray')}>
          <ScanSearch size={14} strokeWidth={1.9} /> Build a new search
        </button>
      </div>

      {searches.length === 0 ? (
        <div className="card empty" style={{ padding: 48 }}>
          No saved searches yet. Build a boolean string in <strong>Google X-Ray</strong> and hit &ldquo;Save search&rdquo;.
          <div style={{ marginTop: 16 }}>
            <button className="btn btn-primary btn-sm" onClick={() => onNav('xray')}>Open X-Ray builder</button>
          </div>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {searches.map((s) => (
            <div key={s.id} className="card" style={{ padding: 16 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 10 }}>
                <ScanSearch size={18} strokeWidth={1.9} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: 600, fontSize: 14 }}>{s.name}</div>
                  <div className="muted" style={{ fontSize: 12 }}>{s.sourceLabel} · saved {s.created}</div>
                </div>
                {s.freq !== 'off' && <span className="badge badge-accent">{s.matches} new</span>}
                <a className="btn btn-sm" href={s.url} target="_blank" rel="noopener">
                  <ExternalLink size={14} /> Run
                </a>
                <button className="btn btn-sm btn-ghost" onClick={() => remove(s.id)}>
                  <X size={15} />
                </button>
              </div>
              <div className="query-out" style={{ minHeight: 0, fontSize: 11.5, padding: '10px 12px', marginBottom: 10 }}>
                {s.query}
              </div>
              <div className="view-toggle" style={{ width: 'fit-content' }}>
                {FREQ.map((f) => (
                  <button key={f} className={s.freq === f ? 'on' : ''} onClick={() => setFreq(s.id, f)}>
                    {FREQ_LABEL[f]}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
