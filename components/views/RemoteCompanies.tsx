'use client';

import { useState, useMemo } from 'react';
import { Globe, Shield, MapPin, ExternalLink } from 'lucide-react';
import LogoChip from '@/components/ui/LogoChip';
import { COMPANIES } from '@/lib/data';

interface Props {
  search: string;
}

const ALL_REGIONS = Array.from(
  new Set(
    COMPANIES.flatMap((c) =>
      c.region.split(',').map((r) => r.trim())
    )
  )
).sort();

export default function RemoteCompanies({ search }: Props) {
  const [visaFilter, setVisaFilter] = useState(false);
  const [regionFilter, setRegionFilter] = useState('All');

  const filtered = useMemo(() => {
    let list = COMPANIES;
    if (visaFilter) list = list.filter((c) => c.visa);
    if (regionFilter !== 'All') {
      list = list.filter((c) =>
        c.region.split(',').map((r) => r.trim()).includes(regionFilter)
      );
    }
    if (search) {
      const q = search.toLowerCase();
      list = list.filter((c) =>
        (c.name + c.region + (c.policy ?? '') + (c.note ?? '')).toLowerCase().includes(q)
      );
    }
    return list;
  }, [visaFilter, regionFilter, search]);

  return (
    <div>
      {/* Filter chips */}
      <div className="chips">
        <button className={`chip${!visaFilter ? ' active' : ''}`} onClick={() => setVisaFilter(false)}>
          All companies
        </button>
        <button className={`chip${visaFilter ? ' active' : ''}`} onClick={() => setVisaFilter(true)}>
          <Shield size={13} /> Sponsors visa
        </button>
      </div>

      {/* Region quick-filters — top 8 */}
      <div className="chips" style={{ marginTop: -8 }}>
        {['All', 'Worldwide', 'Europe', 'USA', 'North America, UK', 'Asia'].map((r) => (
          <button
            key={r}
            className={`chip${regionFilter === r ? ' active' : ''}`}
            onClick={() => setRegionFilter(r)}
            style={{ fontSize: 12 }}
          >
            {r}
          </button>
        ))}
      </div>

      <div className="section-head">
        <h2>{filtered.length} remote-friendly companies</h2>
        <span className="muted" style={{ fontSize: 13 }}>{COMPANIES.length} total in directory</span>
      </div>

      <div className="job-grid">
        {filtered.map((c) => (
          <div key={c.name} className="card job-card">
            <div className="job-top">
              <LogoChip name={c.name} size={42} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div className="job-role">{c.name}</div>
                <div className="job-co" style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                  <MapPin size={11} strokeWidth={1.9} />
                  {c.region}
                </div>
              </div>
              {c.roles != null && (
                <span className="badge mono">{c.roles} open</span>
              )}
            </div>

            {c.note && <div className="job-desc">{c.note}</div>}

            <div className="job-tags">
              {c.policy && <span className="badge">{c.policy}</span>}
              {c.currency && <span className="badge mono">{c.currency}</span>}
              {c.visa && (
                <span className="badge badge-visa">
                  <Shield size={11} /> Visa sponsor
                </span>
              )}
            </div>

            <div className="job-foot">
              {c.website && (
                <a
                  className="btn btn-sm btn-ghost"
                  href={c.website}
                  target="_blank"
                  rel="noopener"
                  title="Company website"
                >
                  <Globe size={13} /> Website
                </a>
              )}
              {c.linkedin ? (
                <a
                  className="btn btn-sm btn-primary"
                  style={{ marginLeft: 'auto' }}
                  href={c.linkedin}
                  target="_blank"
                  rel="noopener"
                >
                  <ExternalLink size={13} /> Jobs
                </a>
              ) : (
                <a
                  className="btn btn-sm btn-ghost"
                  style={{ marginLeft: 'auto' }}
                  href={`https://www.google.com/search?q=${encodeURIComponent(`${c.name} careers frontend remote`)}`}
                  target="_blank"
                  rel="noopener"
                >
                  Careers <ExternalLink size={13} />
                </a>
              )}
            </div>
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="card empty" style={{ padding: 48 }}>
          No companies match your filters.
        </div>
      )}
    </div>
  );
}
