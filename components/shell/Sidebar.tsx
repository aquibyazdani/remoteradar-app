'use client';

import {
  LayoutDashboard, Globe, MapPin, Shield, Briefcase, DollarSign, Users,
  ScanSearch, Bell, Building2, Tag, Kanban, Sparkles, Settings,
} from 'lucide-react';
import { nameInitials } from '@/lib/data';
import type { Profile } from '@/lib/types';

const NAV = [
  { group: 'Overview', items: [
    { id: 'dashboard', label: 'Dashboard', Icon: LayoutDashboard },
  ]},
  { group: 'Find roles', items: [
    { id: 'worldwide', label: 'Remote Worldwide', Icon: Globe },
    { id: 'india', label: 'Remote India', Icon: MapPin },
    { id: 'visa', label: 'Visa Sponsorship', Icon: Shield },
    { id: 'freelance', label: 'Freelance & Contract', Icon: Briefcase },
    { id: 'currency', label: 'Foreign Currency', Icon: DollarSign },
    { id: 'people', label: 'People Hiring', Icon: Users },
  ]},
  { group: 'Sourcing tools', items: [
    { id: 'xray', label: 'Google X-Ray', Icon: ScanSearch },
    { id: 'saved', label: 'Saved Searches', Icon: Bell },
    { id: 'companies', label: 'Remote Companies', Icon: Building2 },
    { id: 'keywords', label: 'My Keywords', Icon: Tag },
  ]},
  { group: 'Pipeline', items: [
    { id: 'tracker', label: 'My Tracker', Icon: Kanban },
    { id: 'tailor', label: 'Resume Tailor', Icon: Sparkles },
    { id: 'settings', label: 'Settings', Icon: Settings },
  ]},
];

interface Props {
  route: string;
  onNav: (r: string) => void;
  counts: Record<string, number | null | undefined>;
  profile: Profile;
}

export default function Sidebar({ route, onNav, counts, profile }: Props) {
  const name = profile?.name || 'Aman Kapoor';
  const title = profile?.title || 'Senior Frontend Engineer';

  return (
    <aside className="sidebar">
      <div className="sb-brand">
        <div className="sb-logo">R</div>
        <div>
          <div className="sb-brand-name">RemoteRadar</div>
          <div className="sb-brand-sub">Remote job command center</div>
        </div>
      </div>

      <nav className="sb-nav">
        {NAV.map((g) => (
          <div key={g.group}>
            <div className="sb-group-label">{g.group}</div>
            {g.items.map(({ id, label, Icon }) => (
              <button
                key={id}
                className={`sb-item${route === id ? ' active' : ''}`}
                onClick={() => onNav(id)}
              >
                <Icon size={18} strokeWidth={1.9} />
                <span>{label}</span>
                {counts[id] != null && (
                  <span className="sb-count">{counts[id]}</span>
                )}
              </button>
            ))}
          </div>
        ))}
      </nav>

      <div className="sb-foot">
        <div className="sb-avatar">{nameInitials(name)}</div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div className="sb-foot-name">{name}</div>
          <div className="sb-foot-sub">{title}</div>
        </div>
        <button className="tb-icon-btn" style={{ width: 30, height: 30, flexShrink: 0 }} onClick={() => onNav('settings')}>
          <Settings size={15} strokeWidth={1.9} />
        </button>
      </div>
    </aside>
  );
}
