'use client';

import { useEffect, useState } from 'react';
import { useStore } from '@/lib/store';
import { SEARCH_STRINGS } from '@/lib/strings';
import { JOBS, COMPANIES } from '@/lib/data';
import Sidebar from './shell/Sidebar';
import Topbar from './shell/Topbar';
import Toast from './ui/Toast';
import Dashboard from './views/Dashboard';
import StringLibrary from './views/StringLibrary';
import XRay from './views/XRay';
import SavedSearches from './views/SavedSearches';
import RemoteCompanies from './views/RemoteCompanies';
import Keywords from './views/Keywords';
import Tracker from './views/Tracker';
import Tailor from './views/Tailor';
import Settings from './views/Settings';
import PeopleHiring from './views/PeopleHiring';

const ROUTE_META: Record<string, { t: string; s: string }> = {
  dashboard:  { t: 'Dashboard',            s: 'Your remote job hunt at a glance' },
  worldwide:  { t: 'Remote Worldwide',      s: 'Copy-paste search strings for hire-from-anywhere USD roles' },
  india:      { t: 'Remote India',          s: 'Search strings for remote-from-India & APAC roles' },
  visa:       { t: 'Visa Sponsorship',      s: 'Strings for roles with visa, work-permit or relocation' },
  freelance:  { t: 'Freelance & Contract',  s: 'Strings for hourly & fixed-term remote contracts' },
  currency:   { t: 'Foreign Currency',      s: 'Strings for roles paying in USD, EUR & strong currencies' },
  people:     { t: 'People Hiring',         s: 'Strings to find the people posting open roles right now' },
  xray:       { t: 'Google X-Ray',          s: 'Build boolean search strings to mine the open web' },
  companies:  { t: 'Remote Companies',      s: 'Remote-first employers and their hiring policy' },
  saved:      { t: 'Saved Searches',        s: 'Re-run boolean searches and get alerted on new matches' },
  tailor:     { t: 'Resume Tailor',         s: 'Generate tailored bullets, cover letters & replies' },
  keywords:   { t: 'My Keywords',           s: 'Reusable boolean blocks for every search' },
  tracker:    { t: 'My Tracker',            s: 'Pipeline with CTC asked, budget & status' },
  settings:   { t: 'Settings',              s: 'Alerts, currency and profile' },
};

const STRING_CATS = new Set(['worldwide', 'india', 'visa', 'freelance', 'currency', 'people']);

function strCount(cat: string) {
  const d = SEARCH_STRINGS[cat];
  if (!d) return 0;
  return (d.linkedin?.length ?? 0) + (d.xray?.length ?? 0) + (d.other?.length ?? 0);
}

export default function AppShell() {
  const {
    route, setRoute, profile, setProfile, theme, setTheme,
    tracker, setTracker, keywords, setKeywords, searches, setSearches,
    favorites, toggleFav, country, setCountry,
    navOpen, setNavOpen, toast, showToast,
  } = useStore();

  const [search, setSearch] = useState('');

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  useEffect(() => {
    setSearch('');
  }, [route]);

  const counts: Record<string, number | null> = {
    worldwide: strCount('worldwide'),
    india: strCount('india'),
    visa: strCount('visa'),
    freelance: strCount('freelance'),
    currency: strCount('currency'),
    people: strCount('people'),
    companies: COMPANIES.length,
    keywords: keywords.length,
    saved: searches.length || null,
    tracker: tracker.length,
  };

  const onSendKeyword = (value: string) => {
    const label = value.replace(/site:[^\s]+/g, '').replace(/[()"]/g, '').trim().split(/\s+/).slice(0, 4).join(' ') || 'Search string';
    setKeywords([{ id: 'k' + Date.now(), label, value }, ...keywords]);
    showToast('Added to My Keywords');
  };

  const onSaveSearch = (s: Parameters<typeof setSearches>[0][0]) => {
    setSearches([s, ...searches]);
    showToast('Search saved · alerts on');
  };

  const meta = ROUTE_META[route] ?? ROUTE_META.dashboard;
  const searchable = route === 'companies';

  let body: React.ReactNode;
  if (STRING_CATS.has(route)) {
    body = (
      <StringLibrary
        cat={route}
        country={country}
        setCountry={setCountry}
        favorites={favorites}
        onToggleFav={toggleFav}
        onSendKeyword={onSendKeyword}
      />
    );
  } else {
    switch (route) {
      case 'dashboard':
        body = <Dashboard tracker={tracker} onNav={setRoute} searches={searches} />;
        break;
      case 'xray':
        body = <XRay keywords={keywords} onSaveSearch={onSaveSearch} />;
        break;
      case 'saved':
        body = <SavedSearches searches={searches} setSearches={setSearches} onNav={setRoute} />;
        break;
      case 'companies':
        body = <RemoteCompanies search={search} />;
        break;
      case 'keywords':
        body = <Keywords keywords={keywords} setKeywords={setKeywords} />;
        break;
      case 'tracker':
        body = <Tracker tracker={tracker} setTracker={setTracker} showToast={showToast} />;
        break;
      case 'tailor':
        body = <Tailor tracker={tracker} profile={profile} />;
        break;
      case 'settings':
        body = <Settings theme={theme} setTheme={setTheme} profile={profile} setProfile={setProfile} />;
        break;
      default:
        body = <Dashboard tracker={tracker} onNav={setRoute} searches={searches} />;
    }
  }

  return (
    <div className={`rr-app${navOpen ? ' nav-open' : ''}`}>
      <div className="scrim" onClick={() => setNavOpen(false)} />
      <Sidebar route={route} onNav={setRoute} counts={counts} profile={profile} />
      <div className="rr-main">
        <Topbar
          title={meta.t}
          sub={meta.s}
          onBurger={() => setNavOpen(true)}
          search={searchable ? search : undefined}
          onSearch={searchable ? setSearch : undefined}
        />
        <div className="rr-content">
          <div className="content-inner">{body}</div>
        </div>
      </div>
      {toast && <Toast message={toast} />}
    </div>
  );
}
