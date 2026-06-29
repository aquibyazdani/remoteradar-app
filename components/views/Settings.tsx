'use client';

import { useState } from 'react';
import { Settings as SettingsIcon, X, Check, ExternalLink, Shield } from 'lucide-react';
import { nameInitials } from '@/lib/data';
import { useStore } from '@/lib/store';
import type { Profile } from '@/lib/types';

const ACCENT_SWATCHES = ['#2f7d5b', '#3a6ea5', '#7a5aa8', '#a8682f', '#b0563f', '#3f8a8a'];

function SwitchBtn({ on, onClick }: { on: boolean; onClick: () => void }) {
  return <button className={`switch${on ? ' on' : ''}`} onClick={onClick} type="button" />;
}

/* ---- Edit Profile Modal ---- */
function EditProfileModal({ profile, onClose, onSave }: {
  profile: Profile;
  onClose: () => void;
  onSave: (p: Profile) => void;
}) {
  const [f, setF] = useState({ ...profile });
  const set = <K extends keyof Profile>(k: K, v: Profile[K]) => setF((p) => ({ ...p, [k]: v }));

  return (
    <div className="modal-bg" onClick={onClose}>
      <div className="modal" style={{ maxWidth: 580 }} onClick={(e) => e.stopPropagation()}>
        <div className="modal-head">
          <h3>Edit profile</h3>
          <button className="tb-icon-btn" onClick={onClose}><X size={18} /></button>
        </div>
        <div className="modal-body">
          {/* Avatar preview */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 20, padding: '14px 16px', background: 'var(--surface-2)', borderRadius: 12 }}>
            <div style={{ width: 52, height: 52, borderRadius: '50%', background: 'var(--accent-d)', color: '#fff', display: 'grid', placeItems: 'center', fontFamily: 'var(--disp)', fontWeight: 700, fontSize: 20, flexShrink: 0 }}>
              {nameInitials(f.name || '?')}
            </div>
            <div>
              <div style={{ fontWeight: 700, fontSize: 16 }}>{f.name || 'Your name'}</div>
              <div style={{ fontSize: 13, color: 'var(--text-2)', marginTop: 2 }}>{f.title || 'Your title'} {f.yoe ? `· ${f.yoe} yrs` : ''}</div>
              <div style={{ fontSize: 12, color: 'var(--text-3)', marginTop: 2 }}>{f.location}</div>
            </div>
          </div>

          <div className="form-grid">
            <div><label className="field-label">Full name</label><input className="text-input" value={f.name} onChange={(e) => set('name', e.target.value)} placeholder="Your name" /></div>
            <div><label className="field-label">Current title</label><input className="text-input" value={f.title} onChange={(e) => set('title', e.target.value)} placeholder="Senior Frontend Engineer" /></div>
            <div><label className="field-label">Years of experience</label><input className="text-input" type="number" min="0" max="40" value={f.yoe} onChange={(e) => set('yoe', e.target.value)} placeholder="7" /></div>
            <div><label className="field-label">Location</label><input className="text-input" value={f.location} onChange={(e) => set('location', e.target.value)} placeholder="City, Country" /></div>
            <div><label className="field-label">Email</label><input className="text-input" type="email" value={f.email} onChange={(e) => set('email', e.target.value)} placeholder="you@example.com" /></div>
            <div><label className="field-label">LinkedIn URL</label><input className="text-input" value={f.linkedin} onChange={(e) => set('linkedin', e.target.value)} placeholder="linkedin.com/in/..." /></div>
            <div><label className="field-label">GitHub URL</label><input className="text-input" value={f.github} onChange={(e) => set('github', e.target.value)} placeholder="github.com/..." /></div>
            <div><label className="field-label">Notice period</label><input className="text-input" value={f.noticePeriod} onChange={(e) => set('noticePeriod', e.target.value)} placeholder="30 days / Immediate" /></div>
            <div className="full"><label className="field-label">Core skills</label><input className="text-input" value={f.skills} onChange={(e) => set('skills', e.target.value)} placeholder="React, TypeScript, Next.js…" /></div>
            <div><label className="field-label">Target CTC / salary</label><input className="text-input mono" type="number" value={f.targetCTC} onChange={(e) => set('targetCTC', e.target.value)} placeholder="180000" /></div>
            <div>
              <label className="field-label">Preferred currency</label>
              <select className="text-input" value={f.currency} onChange={(e) => set('currency', e.target.value)}>
                {['USD', 'EUR', 'INR', 'MYR', 'GBP'].map((c) => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div className="full" style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <SwitchBtn on={f.openToVisa} onClick={() => set('openToVisa', !f.openToVisa)} />
                <span style={{ fontSize: 13.5, fontWeight: 500 }}>Open to visa sponsorship &amp; relocation</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <SwitchBtn on={f.openToRelocation} onClick={() => set('openToRelocation', !f.openToRelocation)} />
                <span style={{ fontSize: 13.5, fontWeight: 500 }}>Open to physical relocation</span>
              </div>
            </div>
            <div className="full">
              <label className="field-label">Short bio <span className="muted" style={{ fontWeight: 400 }}>(used in Resume Tailor)</span></label>
              <textarea className="text-input" rows={3} value={f.bio} onChange={(e) => set('bio', e.target.value)}
                placeholder="A sentence or two about your background and what you're looking for…" style={{ resize: 'vertical' }} />
            </div>
          </div>
        </div>
        <div className="modal-foot">
          <button className="btn" onClick={onClose}>Cancel</button>
          <button className="btn btn-primary" onClick={() => { onSave(f); onClose(); }}>
            <Check size={15} /> Save profile
          </button>
        </div>
      </div>
    </div>
  );
}

/* ---- Settings View ---- */
interface Props {
  theme: 'light' | 'dark';
  setTheme: (t: 'light' | 'dark') => void;
  profile: Profile;
  setProfile: (p: Profile) => void;
}

export default function Settings({ theme, setTheme, profile, setProfile }: Props) {
  const { alerts, setAlerts } = useStore();
  const [editing, setEditing] = useState(false);
  const toggleAlert = (k: keyof typeof alerts) => setAlerts({ ...alerts, [k]: !alerts[k] });

  const applyAccent = (color: string) => {
    document.documentElement.style.setProperty('--accent', color);
    document.documentElement.style.setProperty('--accent-d', `color-mix(in oklch, ${color} 78%, black)`);
    document.documentElement.style.setProperty('--accent-sf', `color-mix(in oklch, ${color} 13%, white)`);
  };

  return (
    <div style={{ maxWidth: 680 }}>
      {/* Profile */}
      <div className="section-head"><h2>Profile</h2></div>
      <div className="card" style={{ marginBottom: 20 }}>
        <div className="set-row" style={{ alignItems: 'flex-start', gap: 16 }}>
          <div style={{ width: 48, height: 48, borderRadius: '50%', background: 'var(--accent-d)', color: '#fff', display: 'grid', placeItems: 'center', fontFamily: 'var(--disp)', fontWeight: 700, fontSize: 18, flexShrink: 0 }}>
            {nameInitials(profile.name)}
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <h4 style={{ fontSize: 15, fontWeight: 700 }}>{profile.name}</h4>
            <p style={{ fontSize: 13, color: 'var(--text-2)', marginTop: 2 }}>{profile.title} · {profile.yoe} yrs</p>
            <p style={{ fontSize: 12.5, color: 'var(--text-3)', marginTop: 3 }}>{profile.location}</p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 10 }}>
              {profile.skills.split(',').map((s) => s.trim()).filter(Boolean).map((s) => (
                <span key={s} className="badge mono" style={{ fontSize: 11 }}>{s}</span>
              ))}
            </div>
            <div style={{ display: 'flex', gap: 14, marginTop: 10, fontSize: 12.5, color: 'var(--text-3)', flexWrap: 'wrap', alignItems: 'center' }}>
              {profile.email && <span>✉ {profile.email}</span>}
              {profile.noticePeriod && <span>⏱ {profile.noticePeriod}</span>}
              {profile.openToVisa && <span className="badge badge-visa" style={{ fontSize: 11, padding: '2px 8px' }}><Shield size={11} /> Visa OK</span>}
            </div>
            <div style={{ display: 'flex', gap: 10, marginTop: 10 }}>
              {profile.linkedin && <a className="btn btn-sm btn-ghost" href={`https://${profile.linkedin.replace(/^https?:\/\//, '')}`} target="_blank" rel="noopener"><ExternalLink size={13} /> LinkedIn</a>}
              {profile.github && <a className="btn btn-sm btn-ghost" href={`https://${profile.github.replace(/^https?:\/\//, '')}`} target="_blank" rel="noopener"><ExternalLink size={13} /> GitHub</a>}
            </div>
          </div>
          <button className="btn btn-sm btn-primary" onClick={() => setEditing(true)}>
            <SettingsIcon size={14} /> Edit profile
          </button>
        </div>
      </div>

      {/* Appearance */}
      <div className="section-head"><h2>Appearance</h2></div>
      <div className="card" style={{ marginBottom: 16 }}>
        <div className="set-row">
          <div className="set-info"><h4>Dark mode</h4><p>Switch the whole workspace to a dark theme.</p></div>
          <div className="set-ctrl"><SwitchBtn on={theme === 'dark'} onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')} /></div>
        </div>
        <div className="set-row">
          <div className="set-info"><h4>Theme colour</h4><p>Accent colour used across the app.</p></div>
          <div className="set-ctrl" style={{ display: 'flex', gap: 8 }}>
            {ACCENT_SWATCHES.map((c) => (
              <button key={c} onClick={() => applyAccent(c)}
                style={{ width: 26, height: 26, borderRadius: '50%', background: c, border: '2px solid var(--border)', cursor: 'pointer', flexShrink: 0 }}
                title={c} />
            ))}
          </div>
        </div>
        <div className="set-row">
          <div className="set-info"><h4>Preferred currency</h4><p>Used as default in your tracker and tailor.</p></div>
          <div className="set-ctrl">
            <select className="text-input" value={profile.currency} onChange={(e) => setProfile({ ...profile, currency: e.target.value })} style={{ width: 120 }}>
              {['USD', 'EUR', 'INR', 'MYR', 'GBP'].map((c) => <option key={c}>{c}</option>)}
            </select>
          </div>
        </div>
      </div>

      {/* Job alerts */}
      <div className="section-head"><h2>Job alerts</h2></div>
      <div className="card">
        {[
          { k: 'digest'  as const, h: 'Daily digest',          p: 'One email each morning with new search matches.' },
          { k: 'instant' as const, h: 'Instant alerts',         p: 'Ping me the moment a high-match role appears.' },
          { k: 'visaOnly'as const, h: 'Visa-sponsoring only',   p: 'Filter every list to roles that sponsor a visa.' },
          { k: 'usdOnly' as const, h: 'Foreign currency pay only', p: 'Hide roles paying only in local currency.' },
        ].map(({ k, h, p }) => (
          <div key={k} className="set-row">
            <div className="set-info"><h4>{h}</h4><p>{p}</p></div>
            <div className="set-ctrl"><SwitchBtn on={alerts[k]} onClick={() => toggleAlert(k)} /></div>
          </div>
        ))}
      </div>

      {editing && <EditProfileModal profile={profile} onClose={() => setEditing(false)} onSave={setProfile} />}
    </div>
  );
}
