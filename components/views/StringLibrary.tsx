'use client';

import { useState } from 'react';
import { Copy, Check, ExternalLink, Search, Globe, Tag, Bookmark, Filter, ArrowRight } from 'lucide-react';
import LogoChip from '@/components/ui/LogoChip';
import { SEARCH_STRINGS, COUNTRIES, HOWTO } from '@/lib/strings';
import type { StringCard } from '@/lib/types';

const SOURCES = [
  { id: 'linkedin', label: 'LinkedIn',        Icon: ExternalLink },
  { id: 'xray',    label: 'Google X-Ray',    Icon: Search },
  { id: 'other',   label: 'Other Platforms', Icon: Globe },
] as const;

type Source = 'linkedin' | 'xray' | 'other';

function effectiveQuery(card: StringCard, source: Source, countryLabel: string): string {
  if (source === 'other') return card.q;
  if (card.country && countryLabel) return `${card.q} "${countryLabel}"`;
  return card.q;
}

function fillFilters(filters: string, countryLabel: string): string {
  return filters.replace('[country]', countryLabel || 'Anywhere');
}

function openUrl(card: StringCard, source: Source, countryLabel: string): string {
  const enc = encodeURIComponent;
  if (source === 'linkedin') {
    const kw = enc(card.q);
    if (card.tab === 'Posts') return `https://www.linkedin.com/search/results/content/?keywords=${kw}&sortBy=%22date_posted%22`;
    if (card.tab === 'People') return `https://www.linkedin.com/search/results/people/?keywords=${kw}`;
    let u = `https://www.linkedin.com/jobs/search/?keywords=${kw}&f_WT=2`;
    if (countryLabel) u += `&location=${enc(countryLabel)}`;
    return u;
  }
  if (source === 'xray') {
    return `https://www.google.com/search?q=${enc(effectiveQuery(card, 'xray', countryLabel))}`;
  }
  return (card.url ?? '').replace('{q}', enc(card.q));
}

function QualityBadge({ q }: { q: 'High' | 'Medium' }) {
  const high = q === 'High';
  return (
    <span className="badge" style={{
      background: high ? 'var(--accent-sf)' : 'oklch(0.95 0.04 75)',
      color: high ? 'var(--accent-d)' : 'oklch(0.48 0.12 60)',
      borderColor: 'transparent',
    }}>
      {high ? '★' : '◆'} {q}
    </span>
  );
}

function DiffBadge({ d }: { d: string }) {
  const c = { easy: 'var(--accent-d)', medium: 'oklch(0.55 0.12 60)', hard: 'var(--st-rejected)' }[d] ?? 'var(--text-3)';
  return <span className="badge mono" style={{ color: c }}>{d}</span>;
}

function StringCardItem({ card, source, countryLabel, isFav, onFav, onSend }: {
  card: StringCard;
  source: Source;
  countryLabel: string;
  isFav: boolean;
  onFav: () => void;
  onSend: (v: string) => void;
}) {
  const [copied, setCopied] = useState(false);
  const [sent, setSent] = useState(false);
  const display = effectiveQuery(card, source, countryLabel);
  const url = openUrl(card, source, countryLabel);
  const openLabel = source === 'linkedin' ? 'Open LinkedIn' : source === 'xray' ? 'Open Google' : `Open ${card.platform}`;

  const doCopy = () => {
    navigator.clipboard?.writeText(display);
    setCopied(true);
    setTimeout(() => setCopied(false), 1300);
  };
  const doOpen = () => {
    navigator.clipboard?.writeText(display);
    window.open(url, '_blank', 'noopener');
  };
  const doSend = () => {
    onSend(display);
    setSent(true);
    setTimeout(() => setSent(false), 1300);
  };

  return (
    <div className="card str-card">
      {source === 'other' && card.platform && (
        <div className="str-platform">
          <LogoChip name={card.platform} size={26} />
          <span>{card.platform}</span>
        </div>
      )}
      <div className="str-code">{display}</div>
      <div className="str-filters">
        <span className="str-filters-lbl">Filters:</span> {fillFilters(card.filters, countryLabel)}
      </div>
      <div className="str-tags">
        <span className="badge mono">{source === 'linkedin' ? 'LinkedIn' : source === 'xray' ? 'Google' : card.platform}</span>
        {card.tab && <span className="badge" style={{ background: 'var(--surface-2)' }}>{card.tab} tab</span>}
        <QualityBadge q={card.quality} />
        <DiffBadge d={card.difficulty} />
      </div>
      <div className="str-actions">
        <button className="btn btn-sm" onClick={doCopy}>
          {copied ? <><Check size={14} /> Copied</> : <><Copy size={14} /> Copy</>}
        </button>
        <button className="btn btn-sm btn-primary" onClick={doOpen}>
          <ExternalLink size={14} /> {openLabel}
        </button>
        <div className="str-icons">
          <button className="tb-icon-btn str-ibtn" title="Send to My Keywords" onClick={doSend}>
            {sent ? <Check size={16} /> : <Tag size={16} />}
          </button>
          <button className={`tb-icon-btn str-ibtn${isFav ? ' fav-on' : ''}`} title="Favorite" onClick={onFav}>
            <Bookmark size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}

interface Props {
  cat: string;
  country: string;
  setCountry: (c: string) => void;
  favorites: string[];
  onToggleFav: (id: string) => void;
  onSendKeyword: (v: string) => void;
}

export default function StringLibrary({ cat, country, setCountry, favorites, onToggleFav, onSendKeyword }: Props) {
  const data = SEARCH_STRINGS[cat];
  const [source, setSource] = useState<Source>('linkedin');
  const [howOpen, setHowOpen] = useState(false);

  if (!data) return null;

  const countryLabel = country && country !== 'all' ? country : '';
  const cards = (data[source] ?? []) as StringCard[];

  return (
    <div>
      <p className="muted" style={{ fontSize: 14, lineHeight: 1.5, maxWidth: 760, marginBottom: 18 }}>{data.blurb}</p>

      {data.warning && (
        <div className="callout-warn" style={{ marginBottom: 16 }}>
          <Filter size={17} strokeWidth={1.9} />
          <span>{data.warning}</span>
        </div>
      )}

      <div className="card howto" style={{ marginBottom: 16 }}>
        <button className="howto-head" onClick={() => setHowOpen((o) => !o)}>
          <Filter size={16} strokeWidth={1.9} />
          <span style={{ fontWeight: 600 }}>How to use</span>
          <span style={{ marginLeft: 'auto', transform: howOpen ? 'rotate(90deg)' : 'none', transition: 'transform .15s', display: 'inline-flex' }}>
            <ArrowRight size={16} strokeWidth={1.9} />
          </span>
        </button>
        {howOpen && (
          <ol className="howto-body">
            {HOWTO[source].map((s, i) => <li key={i}>{s}</li>)}
          </ol>
        )}
      </div>

      <div className="lib-toolbar">
        <div className="lib-tabs">
          {SOURCES.map(({ id, label, Icon }) => (
            <button key={id} className={source === id ? 'on' : ''} onClick={() => setSource(id as Source)}>
              <Icon size={15} strokeWidth={1.9} /> {label}
            </button>
          ))}
        </div>
        {source !== 'other' && (
          <select className="lib-country" value={country} onChange={(e) => setCountry(e.target.value)}>
            {COUNTRIES.map((c) => (
              <option key={c.label} value={c.code ?? c.label}>{c.flag} {c.label}</option>
            ))}
          </select>
        )}
      </div>

      <h3 className="lib-section">
        {source === 'linkedin' ? 'LinkedIn search strings' : source === 'xray' ? 'Google X-Ray strings' : 'Other remote platforms'}
        {countryLabel && source !== 'other' && (
          <span className="badge badge-accent" style={{ marginLeft: 10 }}>{countryLabel}</span>
        )}
      </h3>
      <p className="muted" style={{ fontSize: 12.5, marginTop: -6, marginBottom: 16 }}>
        {source === 'linkedin'
          ? 'Paste into LinkedIn search, then pick the tab shown on each card.'
          : source === 'xray'
          ? 'Open runs the boolean string directly on Google.'
          : 'Each opens a remote-friendly board, pre-filtered.'}
      </p>

      <div className="str-grid">
        {cards.map((card, i) => {
          const fid = `${cat}.${source}.${i}`;
          return (
            <StringCardItem
              key={fid}
              card={card}
              source={source}
              countryLabel={countryLabel}
              isFav={favorites.includes(fid)}
              onFav={() => onToggleFav(fid)}
              onSend={onSendKeyword}
            />
          );
        })}
      </div>
    </div>
  );
}
