'use client';

import { useState } from 'react';
import { Sparkles, Copy, Check } from 'lucide-react';
import type { TrackerRow, Profile } from '@/lib/types';

const TAILOR_MODES = [
  { id: 'bullets', label: 'Resume bullets',  hint: '3–4 punchy, metric-driven bullets aimed at this role.' },
  { id: 'cover',   label: 'Cover letter',    hint: 'A short, specific cover letter (under 180 words).' },
  { id: 'reply',   label: 'Recruiter reply', hint: 'A warm DM reply expressing interest + 2 proof points.' },
  { id: 'fit',     label: "Why I'm a fit",   hint: '3 crisp reasons tying my background to the role.' },
] as const;

type Mode = (typeof TAILOR_MODES)[number]['id'];

const DEFAULT_BG = `Senior Frontend Engineer, 7 years. Stack: React, TypeScript, Next.js, design systems.
- Led migration to a shared component library used by 40+ engineers.
- Shipped a real-time dashboard serving 2M requests/day.
- Mentored 4 engineers; drove accessibility + performance (LCP under 1.5s).
Fully remote-friendly, open to relocation with visa sponsorship. Targeting USD compensation.`;

function buildPrompt(mode: Mode, role: string, jd: string, bg: string): string {
  const target = `Target role: ${role || 'Senior Frontend Engineer'}.` + (jd ? `\nJob description / notes:\n${jd}` : '');
  const me = `Candidate background:\n${bg}`;
  const ask: Record<Mode, string> = {
    bullets: 'Write 3-4 resume bullet points tailored to the target role. Each starts with a strong verb, includes a metric where possible, and maps my background to what this role needs. Output only the bullets, one per line, prefixed with "• ".',
    cover:   'Write a concise, specific cover letter (max 180 words). Reference the company/role, lead with my strongest relevant proof, keep it confident and human. No clichés like "I am writing to apply".',
    reply:   'Write a short, warm reply (max 90 words) to a recruiter who posted this role. Express genuine interest, give 2 concrete proof points, and end with a clear next step. Sound like a real person, not a template.',
    fit:     'Give exactly 3 reasons I am a strong fit for this role. Each is one sentence, specific, and ties my experience to the role. Output as "1." "2." "3." lines.',
  };
  return `You are helping a job-seeker tailor application material.\n\n${target}\n\n${me}\n\nTask: ${ask[mode]}\nKeep it tight and specific. Do not invent employer names or facts not in my background.`;
}

function localFallback(mode: Mode, role: string): string {
  const r = role || 'this role';
  if (mode === 'bullets') return `• Shipped a React + TypeScript design system adopted by 40+ engineers, cutting UI build time ~30%.\n• Built a real-time dashboard handling 2M requests/day with sub-1.5s LCP.\n• Mentored 4 engineers and owned accessibility + performance for the web app.\n• 7 years remote-friendly delivery; ready to ramp fast on ${r}.`;
  if (mode === 'cover')   return `Hi team,\n\nI'm a senior frontend engineer with 7 years building production React/TypeScript apps, and ${r} lines up closely with what I do best. I led a design-system migration used by 40+ engineers and shipped a dashboard serving 2M requests/day at sub-1.5s LCP.\n\nI work async, care about accessibility and performance, and I'm targeting a remote role paying in USD. I'd love to talk about how I can help.\n\nBest,\nAman`;
  if (mode === 'reply')   return `Thanks for posting this — ${r} is right in my lane. I've spent 7 years in React/TypeScript, led a design system used by 40+ engineers, and shipped a 2M req/day dashboard. Remote-first and open to a quick call this week?`;
  return `1. 7 years of React/TypeScript directly matches the core stack for ${r}.\n2. I've led design-system and performance work at scale (40+ engineers, sub-1.5s LCP).\n3. Remote-first and async-ready, so I'll ramp without disrupting the team.`;
}

interface Props {
  tracker: TrackerRow[];
  profile: Profile;
}

export default function Tailor({ tracker, profile }: Props) {
  const [mode, setMode] = useState<Mode>('bullets');
  const [roleSel, setRoleSel] = useState('');
  const [jd, setJd] = useState('');
  const [bg, setBg] = useState(profile.bio || DEFAULT_BG);
  const [out, setOut] = useState('');
  const [busy, setBusy] = useState(false);
  const [copied, setCopied] = useState(false);
  const [note, setNote] = useState('');

  const generate = async () => {
    setBusy(true); setOut(''); setNote('');
    const prompt = buildPrompt(mode, roleSel, jd, bg);
    try {
      const res = await fetch('/api/tailor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt }),
      });
      const data = await res.json();
      if (data.error === 'no_key') {
        setNote('No API key configured — showing a smart template you can edit.');
        setOut(localFallback(mode, roleSel));
      } else if (data.text) {
        setOut(data.text.trim() || localFallback(mode, roleSel));
      } else {
        setNote('Generation returned empty — showing a template.');
        setOut(localFallback(mode, roleSel));
      }
    } catch {
      setNote("Couldn't reach the model — showing a template instead.");
      setOut(localFallback(mode, roleSel));
    }
    setBusy(false);
  };

  const copy = () => {
    navigator.clipboard?.writeText(out);
    setCopied(true);
    setTimeout(() => setCopied(false), 1400);
  };

  const modeData = TAILOR_MODES.find((m) => m.id === mode)!;

  return (
    <div>
      <div className="section-head" style={{ marginBottom: 16 }}>
        <div>
          <h2>Resume &amp; cover-letter tailor</h2>
          <p className="muted" style={{ fontSize: 13, marginTop: 4, maxWidth: 560 }}>
            Pick a role from your tracker (or paste a job description) and generate tailored material in seconds.
          </p>
        </div>
      </div>

      <div className="xray-grid">
        <div className="card xray-panel">
          <div className="field">
            <label className="field-label">Target role</label>
            <select className="text-input" value={roleSel} onChange={(e) => setRoleSel(e.target.value)}>
              <option value="">— Choose from your tracker —</option>
              {tracker.map((t) => (
                <option key={t.id} value={`${t.role} at ${t.company}`}>{t.company} — {t.role}</option>
              ))}
            </select>
          </div>

          <div className="field">
            <label className="field-label">Job description / notes <span className="muted" style={{ fontWeight: 400 }}>(optional)</span></label>
            <textarea
              className="text-input"
              rows={3}
              value={jd}
              onChange={(e) => setJd(e.target.value)}
              placeholder="Paste the JD or key requirements to sharpen the output…"
              style={{ resize: 'vertical' }}
            />
          </div>

          <div className="field">
            <label className="field-label">Output</label>
            <div className="toggle-row">
              {TAILOR_MODES.map((m) => (
                <button key={m.id} className={`opt-toggle${mode === m.id ? ' on' : ''}`} onClick={() => setMode(m.id)}>
                  {m.label}
                </button>
              ))}
            </div>
            <p className="muted" style={{ fontSize: 12, marginTop: 8 }}>{modeData.hint}</p>
          </div>

          <div className="field" style={{ marginBottom: 0 }}>
            <label className="field-label">Your background</label>
            <textarea
              className="text-input"
              rows={6}
              value={bg}
              onChange={(e) => setBg(e.target.value)}
              style={{ resize: 'vertical', fontSize: 12.5, lineHeight: 1.55 }}
            />
          </div>

          <button
            className="btn btn-primary"
            style={{ marginTop: 16, width: '100%', justifyContent: 'center' }}
            onClick={generate}
            disabled={busy}
          >
            {busy ? 'Generating…' : <><Sparkles size={15} /> Generate {modeData.label.toLowerCase()}</>}
          </button>
        </div>

        <div className="card xray-panel">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
            <label className="field-label" style={{ margin: 0 }}>Result</label>
            {out && !busy && (
              <div style={{ display: 'flex', gap: 8 }}>
                <button className="btn btn-sm btn-ghost" onClick={generate}>
                  <Sparkles size={14} /> Regenerate
                </button>
                <button className="btn btn-sm" onClick={copy}>
                  {copied ? <><Check size={14} /> Copied</> : <><Copy size={14} /> Copy</>}
                </button>
              </div>
            )}
          </div>
          {busy ? (
            <div className="shimmer-block"><span /><span /><span /><span /></div>
          ) : out ? (
            <div className="tailor-out">{out}</div>
          ) : (
            <div className="empty" style={{ padding: '42px 16px' }}>
              <Sparkles size={26} strokeWidth={1.5} />
              <br />
              Choose a role and hit generate.
            </div>
          )}
          {note && <p className="muted" style={{ fontSize: 12, marginTop: 10 }}>{note}</p>}
        </div>
      </div>
    </div>
  );
}
