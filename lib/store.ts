'use client';

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { TrackerRow, Keyword, SavedSearch, Profile, AlertPrefs } from './types';
import { KEYWORD_SETS, PROFILE_DEFAULT } from './data';

interface AppStore {
  route: string;
  setRoute: (r: string) => void;

  profile: Profile;
  setProfile: (p: Profile) => void;

  theme: 'light' | 'dark';
  setTheme: (t: 'light' | 'dark') => void;

  tracker: TrackerRow[];
  setTracker: (rows: TrackerRow[]) => void;

  keywords: Keyword[];
  setKeywords: (kws: Keyword[]) => void;

  searches: SavedSearch[];
  setSearches: (s: SavedSearch[]) => void;

  favorites: string[];
  toggleFav: (id: string) => void;

  country: string;
  setCountry: (c: string) => void;

  alerts: AlertPrefs;
  setAlerts: (a: AlertPrefs) => void;

  navOpen: boolean;
  setNavOpen: (v: boolean) => void;

  toast: string | null;
  showToast: (msg: string) => void;
}

export const useStore = create<AppStore>()(
  persist(
    (set, get) => ({
      route: 'dashboard',
      setRoute: (r) => set({ route: r, navOpen: false }),

      profile: PROFILE_DEFAULT,
      setProfile: (p) => set({ profile: p }),

      theme: 'light',
      setTheme: (t) => set({ theme: t }),

      tracker: [],
      setTracker: (rows) => set({ tracker: rows }),

      keywords: KEYWORD_SETS,
      setKeywords: (kws) => set({ keywords: kws }),

      searches: [],
      setSearches: (s) => set({ searches: s }),

      favorites: [],
      toggleFav: (id) => {
        const favs = get().favorites;
        set({ favorites: favs.includes(id) ? favs.filter((f) => f !== id) : [id, ...favs] });
      },

      country: 'all',
      setCountry: (c) => set({ country: c }),

      alerts: { digest: true, instant: false, visaOnly: false, usdOnly: true },
      setAlerts: (a) => set({ alerts: a }),

      navOpen: false,
      setNavOpen: (v) => set({ navOpen: v }),

      toast: null,
      showToast: (msg) => {
        set({ toast: msg });
        setTimeout(() => set({ toast: null }), 1800);
      },
    }),
    {
      name: 'rr_store',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        route: state.route,
        profile: state.profile,
        theme: state.theme,
        tracker: state.tracker,
        keywords: state.keywords,
        searches: state.searches,
        favorites: state.favorites,
        country: state.country,
        alerts: state.alerts,
      }),
    }
  )
);
