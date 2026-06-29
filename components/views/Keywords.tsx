'use client';

import { useState } from 'react';
import { Copy, Check, X, Plus } from 'lucide-react';
import type { Keyword } from '@/lib/types';

interface Props {
  keywords: Keyword[];
  setKeywords: (kws: Keyword[]) => void;
}

export default function Keywords({ keywords, setKeywords }: Props) {
  const [copiedAll, setCopiedAll] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const update = (id: string, value: string) =>
    setKeywords(keywords.map((k) => (k.id === id ? { ...k, value } : k)));
  const updateLabel = (id: string, label: string) =>
    setKeywords(keywords.map((k) => (k.id === id ? { ...k, label } : k)));
  const add = () =>
    setKeywords([...keywords, { id: 'k' + Date.now(), label: 'New set', value: '' }]);
  const remove = (id: string) =>
    setKeywords(keywords.filter((k) => k.id !== id));
  const copy = (val: string, id: string) => {
    navigator.clipboard?.writeText(val);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1200);
  };
  const copyAll = () => {
    navigator.clipboard?.writeText(keywords.map((k) => k.value).join(' '));
    setCopiedAll(true);
    setTimeout(() => setCopiedAll(false), 1400);
  };

  return (
    <div>
      <div className="section-head">
        <div>
          <h2>My keywords</h2>
          <p className="muted" style={{ fontSize: 13, marginTop: 4 }}>
            Reusable boolean blocks. Combine them in the X-Ray builder or paste into LinkedIn / Google.
          </p>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button className="btn btn-sm" onClick={copyAll}>
            {copiedAll ? <><Check size={14} /> Copied all</> : <><Copy size={14} /> Copy all</>}
          </button>
          <button className="btn btn-sm btn-primary" onClick={add}>
            <Plus size={14} /> New set
          </button>
        </div>
      </div>

      <div className="card">
        {keywords.map((k) => (
          <div key={k.id} className="kw-row">
            <input
              className="kw-label text-input"
              value={k.label}
              onChange={(e) => updateLabel(k.id, e.target.value)}
            />
            <input
              className="kw-value text-input"
              value={k.value}
              onChange={(e) => update(k.id, e.target.value)}
            />
            <button className="btn btn-sm btn-ghost" onClick={() => copy(k.value, k.id)}>
              {copiedId === k.id ? <Check size={15} /> : <Copy size={15} />}
            </button>
            <button className="btn btn-sm btn-ghost" onClick={() => remove(k.id)}>
              <X size={15} />
            </button>
          </div>
        ))}
        {keywords.length === 0 && (
          <div className="empty" style={{ padding: 32 }}>No keyword sets yet. Hit &ldquo;New set&rdquo; to add one.</div>
        )}
      </div>
    </div>
  );
}
