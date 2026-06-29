'use client';

import { STATUS_META } from '@/lib/data';
import type { Status } from '@/lib/types';

export default function StatusPill({ status }: { status: Status }) {
  const m = STATUS_META[status] ?? STATUS_META.saved;
  return (
    <span
      className="status-pill"
      style={{ background: `color-mix(in oklch, ${m.color} 15%, transparent)`, color: m.color }}
    >
      <span className="status-dot" style={{ background: m.color }} />
      {m.label}
    </span>
  );
}
