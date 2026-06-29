'use client';

import { Menu, Search, Bell } from 'lucide-react';

interface Props {
  title: string;
  sub: string;
  onBurger: () => void;
  search?: string;
  onSearch?: (v: string) => void;
}

export default function Topbar({ title, sub, onBurger, search, onSearch }: Props) {
  return (
    <header className="topbar">
      <button className="tb-burger tb-icon-btn" onClick={onBurger} aria-label="Menu">
        <Menu size={18} strokeWidth={1.9} />
      </button>
      <div>
        <div className="tb-title">{title}</div>
        {sub && <div className="tb-sub">{sub}</div>}
      </div>
      <div className="tb-search">
        <Search size={16} strokeWidth={1.9} />
        <input
          placeholder="Search roles, companies, keywords…"
          value={search ?? ''}
          onChange={(e) => onSearch?.(e.target.value)}
        />
      </div>
      <button className="tb-icon-btn" aria-label="Notifications">
        <Bell size={18} strokeWidth={1.9} />
      </button>
    </header>
  );
}
