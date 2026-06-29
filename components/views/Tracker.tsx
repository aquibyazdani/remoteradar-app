'use client';

import { useState } from 'react';
import {
  DndContext, closestCenter, PointerSensor, useSensor, useSensors,
  type DragEndEvent, DragOverlay, type DragStartEvent,
} from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Plus, X, Check, Shield, ExternalLink, Sparkles } from 'lucide-react';
import LogoChip from '@/components/ui/LogoChip';
import StatusPill from '@/components/ui/StatusPill';
import { STATUS_META, fmtMoney } from '@/lib/data';
import type { TrackerRow, Status } from '@/lib/types';

const COLS: Status[] = ['saved', 'applied', 'interviewing', 'offer', 'rejected'];
const CURRENCIES = ['USD', 'EUR', 'INR', 'MYR', 'GBP'] as const;
const SOURCES = ['LinkedIn', 'Referral', 'Recruiter', 'Company site', 'Wellfound', 'Toptal'];

function blankDraft(extra?: Partial<TrackerRow>): Partial<TrackerRow> {
  return {
    company: '', role: '', status: 'saved', ctcAsk: 0, budget: 0,
    currency: 'USD', source: 'LinkedIn', region: 'Worldwide', visa: false,
    date: new Date().toISOString().slice(0, 10), ...extra,
  };
}

function localParse(text: string): Partial<TrackerRow> {
  const d = blankDraft({ source: 'Import' });
  const urlMatch = text.match(/https?:\/\/[^\s]+/);
  if (urlMatch) {
    const u = urlMatch[0];
    const ghMatch = u.match(/greenhouse\.io\/([\w-]+)/);
    const lvMatch = u.match(/lever\.co\/([\w-]+)/);
    const ashMatch = u.match(/ashbyhq\.com\/([\w-]+)/);
    let co = ghMatch?.[1] || lvMatch?.[1] || ashMatch?.[1] || '';
    if (co) d.company = co.replace(/[-_]/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
    if (/linkedin\./.test(u)) d.source = 'LinkedIn';
    else if (/lever|greenhouse|ashby/.test(u)) d.source = 'Company site';
  }
  if (!d.company) {
    const co = text.match(/(?:at|@|company:)\s*([A-Z][A-Za-z0-9.& ]{1,28})/);
    if (co) d.company = co[1].trim();
  }
  const role = text.match(/(senior|staff|lead|principal)?\s*(frontend|front-end|react|ui|software|full[- ]?stack)\s*(engineer|developer)/i);
  if (role) d.role = role[0].replace(/\s+/g, ' ').trim().replace(/\b\w/g, (c) => c.toUpperCase());
  const cur = text.match(/\b(USD|EUR|INR|MYR)\b/);
  if (cur) d.currency = cur[1] as TrackerRow['currency'];
  else if (text.includes('₹')) d.currency = 'INR';
  else if (text.includes('€')) d.currency = 'EUR';
  const nums = (text.match(/\$?\s?(\d{2,3})[,\s]?(\d{3})/g) ?? []).map((s) => Number(s.replace(/[^\d]/g, '')));
  if (nums.length >= 2) { d.ctcAsk = Math.min(nums[0], nums[1]); d.budget = Math.max(nums[0], nums[1]); }
  else if (nums.length === 1) { d.budget = nums[0]; }
  if (/visa|sponsor|relocation|work permit|employment pass/i.test(text)) d.visa = true;
  if (/remote.*india|india.*remote|\bIST\b/i.test(text)) d.region = 'Remote India';
  else if (/worldwide|anywhere|global/i.test(text)) d.region = 'Worldwide';
  return d;
}

/* ---- Add/Edit Modal ---- */
function AddModal({ initial, title, submitLabel, onClose, onSave, onDelete }: {
  initial?: Partial<TrackerRow> | null;
  title?: string;
  submitLabel?: string;
  onClose: () => void;
  onSave: (r: TrackerRow) => void;
  onDelete?: (id: string) => void;
}) {
  const [f, setF] = useState<Partial<TrackerRow>>(initial ?? blankDraft());
  const set = <K extends keyof TrackerRow>(k: K, v: TrackerRow[K]) => setF((p) => ({ ...p, [k]: v }));

  const save = () => {
    if (!f.company?.trim() || !f.role?.trim()) return;
    onSave({ ...blankDraft(), ...f, id: f.id ?? 't' + Date.now(), ctcAsk: Number(f.ctcAsk) || 0, budget: Number(f.budget) || 0 } as TrackerRow);
  };

  return (
    <div className="modal-bg" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-head">
          <h3>{title ?? (f.id ? 'Edit application' : 'Add application')}</h3>
          <button className="tb-icon-btn" onClick={onClose}><X size={18} /></button>
        </div>
        <div className="modal-body">
          <div className="form-grid">
            <div className="full">
              <label className="field-label">Company</label>
              <input className="text-input" value={f.company ?? ''} onChange={(e) => set('company', e.target.value)} placeholder="e.g. Vercel" />
            </div>
            <div className="full">
              <label className="field-label">Role</label>
              <input className="text-input" value={f.role ?? ''} onChange={(e) => set('role', e.target.value)} placeholder="e.g. Senior Frontend Engineer" />
            </div>
            <div>
              <label className="field-label">CTC asked</label>
              <input className="text-input mono" type="number" value={f.ctcAsk ?? ''} onChange={(e) => set('ctcAsk', Number(e.target.value))} placeholder="180000" />
            </div>
            <div>
              <label className="field-label">Their budget</label>
              <input className="text-input mono" type="number" value={f.budget ?? ''} onChange={(e) => set('budget', Number(e.target.value))} placeholder="200000" />
            </div>
            <div>
              <label className="field-label">Currency</label>
              <select className="text-input" value={f.currency ?? 'USD'} onChange={(e) => set('currency', e.target.value as TrackerRow['currency'])}>
                {CURRENCIES.map((c) => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="field-label">Status</label>
              <select className="text-input" value={f.status ?? 'saved'} onChange={(e) => set('status', e.target.value as Status)}>
                {COLS.map((c) => <option key={c} value={c}>{STATUS_META[c].label}</option>)}
              </select>
            </div>
            <div>
              <label className="field-label">Source</label>
              <select className="text-input" value={f.source ?? 'LinkedIn'} onChange={(e) => set('source', e.target.value)}>
                {SOURCES.map((s) => <option key={s}>{s}</option>)}
              </select>
            </div>
            <div>
              <label className="field-label">Region / type</label>
              <input className="text-input" value={f.region ?? ''} onChange={(e) => set('region', e.target.value)} placeholder="Worldwide" />
            </div>
            <div className="full" style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <button className={`switch${f.visa ? ' on' : ''}`} onClick={() => set('visa', !f.visa)} type="button" />
              <span style={{ fontSize: 13.5, fontWeight: 500 }}>Sponsors visa / relocation</span>
            </div>
          </div>
        </div>
        <div className="modal-foot">
          {f.id && onDelete && (
            <button className="btn btn-ghost" style={{ marginRight: 'auto', color: 'var(--st-rejected)' }} onClick={() => onDelete(f.id!)}>
              <X size={15} /> Delete
            </button>
          )}
          <button className="btn" onClick={onClose}>Cancel</button>
          <button className="btn btn-primary" onClick={save}>
            <Check size={15} /> {submitLabel ?? (f.id ? 'Save changes' : 'Add to tracker')}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ---- Import Modal ---- */
function ImportModal({ onClose, onSave }: { onClose: () => void; onSave: (r: TrackerRow) => void }) {
  const [text, setText] = useState('');
  const [draft, setDraft] = useState<Partial<TrackerRow> | null>(null);
  const [busy, setBusy] = useState(false);
  const [note, setNote] = useState('');

  const run = async () => {
    if (!text.trim()) return;
    setBusy(true); setNote('');
    const d = localParse(text);
    setNote('Parsed locally — review the fields before saving.');
    setDraft(d);
    setBusy(false);
  };

  if (draft) {
    return (
      <AddModal
        initial={draft}
        title="Review imported role"
        submitLabel="Add to tracker"
        onClose={onClose}
        onSave={(r) => { onSave(r); onClose(); }}
      />
    );
  }

  return (
    <div className="modal-bg" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-head">
          <h3>Import a role</h3>
          <button className="tb-icon-btn" onClick={onClose}><X size={18} /></button>
        </div>
        <div className="modal-body">
          <label className="field-label">Paste a job URL or the job description</label>
          <textarea
            className="text-input"
            rows={7}
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder={`https://jobs.lever.co/acme/senior-frontend\n\n…or paste the full job description and we'll pull out the company, role, pay and visa info.`}
            style={{ resize: 'vertical' }}
          />
          <p className="muted" style={{ fontSize: 12, marginTop: 8 }}>We extract company, role, pay range, currency and visa support — you confirm before it lands in your tracker.</p>
          {note && <p className="muted" style={{ fontSize: 12, marginTop: 6 }}>{note}</p>}
        </div>
        <div className="modal-foot">
          <button className="btn" onClick={onClose}>Cancel</button>
          <button className="btn btn-primary" onClick={run} disabled={busy || !text.trim()}>
            {busy ? 'Reading…' : <><Sparkles size={15} /> Extract fields</>}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ---- Tracker Card (draggable) ---- */
function TCard({ row, onEdit }: { row: TrackerRow; onEdit: (r: TrackerRow) => void }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: row.id });
  const style = { transform: CSS.Transform.toString(transform), transition, opacity: isDragging ? 0.4 : 1 };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={`tcard${isDragging ? ' dragging' : ''}`}
      onClick={() => onEdit(row)}
    >
      <div className="tcard-top">
        <LogoChip name={row.company} size={30} />
        <div style={{ flex: 1, minWidth: 0 }}>
          <div className="tcard-role">{row.role}</div>
          <div className="tcard-co">{row.company}</div>
        </div>
      </div>
      <div className="tcard-money"><span className="lbl">CTC asked</span><span>{fmtMoney(row.ctcAsk, row.currency, row.hourly)}</span></div>
      <div className="tcard-money"><span className="lbl">Budget</span><span>{fmtMoney(row.budget, row.currency, row.hourly)}</span></div>
      <div className="tcard-foot">
        {row.visa && <span className="badge badge-visa" style={{ fontSize: 10.5, padding: '2px 7px' }}><Shield size={11} /> Visa</span>}
        <span className="badge mono" style={{ fontSize: 10.5, padding: '2px 7px' }}>{row.source}</span>
      </div>
    </div>
  );
}

/* ---- Main Tracker ---- */
interface Props {
  tracker: TrackerRow[];
  setTracker: (rows: TrackerRow[]) => void;
  showToast?: (msg: string) => void;
}

export default function Tracker({ tracker, setTracker, showToast }: Props) {
  const [view, setView] = useState<'board' | 'table'>('board');
  const [modal, setModal] = useState<TrackerRow | Partial<TrackerRow> | null>(null);
  const [importing, setImporting] = useState(false);
  const [activeId, setActiveId] = useState<string | null>(null);

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }));

  const save = (row: TrackerRow) => {
    setTracker(tracker.some((t) => t.id === row.id) ? tracker.map((t) => (t.id === row.id ? row : t)) : [row, ...tracker]);
    setModal(null);
  };
  const del = (id: string) => { setTracker(tracker.filter((t) => t.id !== id)); setModal(null); };

  const handleDragStart = (e: DragStartEvent) => setActiveId(String(e.active.id));
  const handleDragEnd = (e: DragEndEvent) => {
    const { active, over } = e;
    setActiveId(null);
    if (!over) return;
    const overId = String(over.id);
    const colStatus = COLS.find((c) => c === overId);
    if (colStatus) {
      setTracker(tracker.map((t) => t.id === active.id ? { ...t, status: colStatus } : t));
      return;
    }
    const overRow = tracker.find((t) => t.id === overId);
    if (overRow && active.id !== overId) {
      setTracker(tracker.map((t) => t.id === String(active.id) ? { ...t, status: overRow.status } : t));
    }
  };

  const activeRow = tracker.find((t) => t.id === activeId);

  return (
    <div>
      <div className="tracker-head">
        <div className="view-toggle">
          <button className={view === 'board' ? 'on' : ''} onClick={() => setView('board')}>Board</button>
          <button className={view === 'table' ? 'on' : ''} onClick={() => setView('table')}>Table</button>
        </div>
        <span className="muted" style={{ fontSize: 13 }}>{tracker.length} applications · drag cards to change status</span>
        <div style={{ marginLeft: 'auto', display: 'flex', gap: 8 }}>
          <button className="btn btn-sm" onClick={() => setImporting(true)}>
            <ExternalLink size={15} /> Import
          </button>
          <button className="btn btn-sm btn-primary" onClick={() => setModal({})}>
            <Plus size={15} /> Add application
          </button>
        </div>
      </div>

      {view === 'board' ? (
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
          <div className="kanban">
            {COLS.map((col) => {
              const rows = tracker.filter((t) => t.status === col);
              return (
                <DroppableColumn key={col} col={col} rows={rows} onEdit={setModal} onAddNew={() => setModal({ status: col })} />
              );
            })}
          </div>
          <DragOverlay>
            {activeRow ? (
              <div className="tcard dragging" style={{ opacity: 0.9, transform: 'rotate(2deg)' }}>
                <div className="tcard-top">
                  <LogoChip name={activeRow.company} size={30} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div className="tcard-role">{activeRow.role}</div>
                    <div className="tcard-co">{activeRow.company}</div>
                  </div>
                </div>
              </div>
            ) : null}
          </DragOverlay>
        </DndContext>
      ) : (
        <div className="card" style={{ overflowX: 'auto' }}>
          <table className="ttable">
            <thead>
              <tr>
                <th>Company</th><th>Role</th><th>Status</th><th>CTC asked</th>
                <th>Budget</th><th>Δ Gap</th><th>Currency</th><th>Source</th><th>Region</th><th>Updated</th>
              </tr>
            </thead>
            <tbody>
              {tracker.map((r) => {
                const gap = (r.budget ?? 0) - (r.ctcAsk ?? 0);
                return (
                  <tr key={r.id} style={{ cursor: 'pointer' }} onClick={() => setModal(r)}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
                        <LogoChip name={r.company} size={26} />
                        <span style={{ fontWeight: 600 }}>{r.company}</span>
                      </div>
                    </td>
                    <td>{r.role}</td>
                    <td><StatusPill status={r.status} /></td>
                    <td className="num">{fmtMoney(r.ctcAsk, r.currency, r.hourly)}</td>
                    <td className="num">{fmtMoney(r.budget, r.currency, r.hourly)}</td>
                    <td className="num" style={{ color: gap >= 0 ? 'var(--accent-d)' : 'var(--st-rejected)' }}>
                      {gap >= 0 ? '+' : ''}{fmtMoney(Math.abs(gap), r.currency, r.hourly)}
                    </td>
                    <td><span className="badge mono">{r.currency}</span></td>
                    <td className="muted">{r.source}</td>
                    <td className="muted">{r.region}{r.visa ? ' · visa' : ''}</td>
                    <td className="muted mono" style={{ fontSize: 12 }}>{r.date?.slice(5)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {modal !== null && (
        <AddModal
          initial={'id' in modal && modal.id ? modal as TrackerRow : modal}
          onClose={() => setModal(null)}
          onSave={save}
          onDelete={del}
        />
      )}
      {importing && (
        <ImportModal
          onClose={() => setImporting(false)}
          onSave={save}
        />
      )}
    </div>
  );
}

/* ---- Droppable Column ---- */
function DroppableColumn({ col, rows, onEdit, onAddNew }: {
  col: Status;
  rows: TrackerRow[];
  onEdit: (r: TrackerRow) => void;
  onAddNew: () => void;
}) {
  const [isOver, setIsOver] = useState(false);

  return (
    <SortableContext items={rows.map((r) => r.id)} strategy={verticalListSortingStrategy}>
      <div
        className={`kcol${isOver ? ' drag-over' : ''}`}
        onDragOver={() => setIsOver(true)}
        onDragLeave={() => setIsOver(false)}
        onDrop={() => setIsOver(false)}
        data-col={col}
      >
        <div className="kcol-head">
          <span className="kcol-dot" style={{ background: STATUS_META[col].color }} />
          <span className="kcol-title">{STATUS_META[col].label}</span>
          <span className="kcol-count">{rows.length}</span>
        </div>
        {rows.map((r) => <TCard key={r.id} row={r} onEdit={onEdit} />)}
        <button className="btn btn-sm btn-ghost" style={{ justifyContent: 'center' }} onClick={onAddNew}>
          <Plus size={14} /> Add
        </button>
      </div>
    </SortableContext>
  );
}
