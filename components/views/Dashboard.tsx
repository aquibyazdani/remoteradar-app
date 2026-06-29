'use client';

import { Kanban, Briefcase, Users, TrendingUp, ArrowRight, Bell, ScanSearch, Sparkles, Globe, MapPin, Shield } from 'lucide-react';
import { STATUS_META } from '@/lib/data';
import type { TrackerRow, SavedSearch } from '@/lib/types';

const ACTIVITY = [
  { s: 'interviewing', t: 'Linear — round 2 scheduled', w: '2h ago' },
  { s: 'offer',        t: 'Postman extended an offer',   w: '1d ago' },
  { s: 'applied',      t: 'Applied to GitLab (Senior FE)', w: '2d ago' },
  { s: 'saved',        t: 'Saved Spotify — Sweden relocation', w: '2d ago' },
  { s: 'rejected',     t: 'Toptal contract — not moving forward', w: '4d ago' },
];

const PIPE_ORDER = [
  ['saved', 'Saved'],
  ['applied', 'Applied'],
  ['interviewing', 'Interviewing'],
  ['offer', 'Offer'],
  ['rejected', 'Rejected'],
] as const;

interface Props {
  tracker: TrackerRow[];
  onNav: (r: string) => void;
  searches?: SavedSearch[];
}

export default function Dashboard({ tracker, onNav, searches = [] }: Props) {
  const counts = PIPE_ORDER.reduce((a, [k]) => {
    a[k] = tracker.filter((t) => t.status === k).length;
    return a;
  }, {} as Record<string, number>);

  const total = tracker.length;
  const maxC = Math.max(1, ...Object.values(counts));

  const stats = [
    { label: 'In pipeline',       Icon: Kanban,    num: total,                                         delta: '+3 this week',     up: true },
    { label: 'Applications sent', Icon: Briefcase, num: counts.applied + counts.interviewing + counts.offer, delta: 'across 6 sources' },
    { label: 'Interviewing',      Icon: Users,     num: counts.interviewing,                            delta: '2 this week',       up: true },
    { label: 'Offers',            Icon: TrendingUp, num: counts.offer,                                  delta: counts.offer ? 'review pending' : '—', up: !!counts.offer },
  ];

  const activeAlerts = searches.filter((s) => s.freq !== 'off');
  const totalNew = activeAlerts.reduce((a, s) => a + s.matches, 0);

  return (
    <div>
      <div className="stat-grid">
        {stats.map((s) => (
          <div key={s.label} className="card stat">
            <div className="stat-label"><s.Icon size={15} strokeWidth={1.9} />{s.label}</div>
            <div className="stat-num">{s.num}</div>
            <div className={`stat-delta${s.up ? ' up' : ''}`}>{s.delta}</div>
          </div>
        ))}
      </div>

      <div className="dash-grid">
        <div className="card" style={{ padding: 20 }}>
          <div className="section-head" style={{ marginBottom: 14 }}>
            <h2>Pipeline</h2>
            <button className="btn btn-sm btn-ghost" onClick={() => onNav('tracker')}>
              Open tracker <ArrowRight size={14} strokeWidth={1.9} />
            </button>
          </div>
          {PIPE_ORDER.map(([k, label]) => (
            <div key={k} className="pipeline-row">
              <span className="pipe-dot" style={{ background: STATUS_META[k].color }} />
              <span style={{ width: 96, fontSize: 13, fontWeight: 500 }}>{label}</span>
              <span className="pipe-bar">
                <span className="pipe-fill" style={{ width: `${(counts[k] / maxC) * 100}%`, background: STATUS_META[k].color }} />
              </span>
              <span className="pipe-count">{counts[k]}</span>
            </div>
          ))}
        </div>

        <div className="card" style={{ padding: 20 }}>
          <div className="section-head" style={{ marginBottom: 8 }}><h2>Recent activity</h2></div>
          {ACTIVITY.map((a, i) => (
            <div key={i} className="act-item">
              <span className="act-dot" style={{ background: STATUS_META[a.s]?.color }} />
              <span>{a.t}</span>
              <span className="act-when">{a.w}</span>
            </div>
          ))}
        </div>
      </div>

      {activeAlerts.length > 0 && (
        <div className="card" style={{ padding: 20, marginTop: 16 }}>
          <div className="section-head" style={{ marginBottom: 12 }}>
            <h2>
              Search alerts{' '}
              <span className="badge badge-accent" style={{ marginLeft: 8 }}>
                <Bell size={12} /> {totalNew} new
              </span>
            </h2>
            <button className="btn btn-sm btn-ghost" onClick={() => onNav('saved')}>
              Manage <ArrowRight size={14} strokeWidth={1.9} />
            </button>
          </div>
          {activeAlerts.slice(0, 3).map((s) => (
            <div key={s.id} className="pipeline-row" style={{ gap: 12 }}>
              <ScanSearch size={16} strokeWidth={1.9} />
              <span style={{ flex: 1, minWidth: 0, fontSize: 13.5, fontWeight: 500, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{s.name}</span>
              <span className="badge">{s.matches} new</span>
              <a className="btn btn-sm btn-ghost" href={s.url} target="_blank" rel="noopener">
                <ArrowRight size={15} strokeWidth={1.9} />
              </a>
            </div>
          ))}
        </div>
      )}

      <div className="card" style={{ padding: 20, marginTop: 16 }}>
        <div className="section-head" style={{ marginBottom: 14 }}>
          <h2>
            Start a search{' '}
            <span className="badge badge-accent" style={{ marginLeft: 8 }}>
              <Sparkles size={12} /> copy &amp; go
            </span>
          </h2>
          <button className="btn btn-sm btn-ghost" onClick={() => onNav('xray')}>
            X-Ray builder <ArrowRight size={14} strokeWidth={1.9} />
          </button>
        </div>
        <div className="quick-grid">
          {[
            { id: 'worldwide', Icon: Globe,   label: 'Remote Worldwide',  sub: 'USD roles, anywhere' },
            { id: 'visa',      Icon: Shield,  label: 'Visa Sponsorship',  sub: 'Relocation & work permits' },
            { id: 'india',     Icon: MapPin,  label: 'Remote India',      sub: 'India / APAC, USD platforms' },
            { id: 'people',    Icon: Users,   label: 'People Hiring',     sub: 'Reply to hiring posts' },
          ].map(({ id, Icon, label, sub }) => (
            <button key={id} className="quick-card" onClick={() => onNav(id)}>
              <span className="quick-ic"><Icon size={18} strokeWidth={1.9} /></span>
              <span style={{ flex: 1, minWidth: 0 }}>
                <span className="quick-label">{label}</span>
                <span className="quick-sub">{sub}</span>
              </span>
              <ArrowRight size={16} strokeWidth={1.9} />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
