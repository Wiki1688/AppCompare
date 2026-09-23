import { DevicePreset, AppConfig, QACheckItem } from '../types';

export const DEVICE_PRESETS: DevicePreset[] = [
  {
    id: 'iphone-16-pro',
    name: 'iPhone 16 Pro',
    shortName: 'iPhone 16 Pro',
    width: 393,
    height: 852,
    type: 'mobile',
    os: 'ios',
  },
  {
    id: 'pixel-9-pro',
    name: 'Google Pixel 9 Pro',
    shortName: 'Pixel 9 Pro',
    width: 412,
    height: 915,
    type: 'mobile',
    os: 'android',
  },
  {
    id: 'iphone-se',
    name: 'iPhone SE (Compact)',
    shortName: 'iPhone SE',
    width: 375,
    height: 667,
    type: 'mobile',
    os: 'ios',
  },
  {
    id: 'galaxy-s24',
    name: 'Samsung Galaxy S24',
    shortName: 'Galaxy S24',
    width: 384,
    height: 832,
    type: 'mobile',
    os: 'android',
  },
  {
    id: 'ipad-mini',
    name: 'iPad Mini (Tablet)',
    shortName: 'iPad Mini',
    width: 768,
    height: 1024,
    type: 'tablet',
    os: 'ios',
  },
  {
    id: 'fluid-mobile',
    name: 'Fluid Mobile (420 × 800)',
    shortName: 'Fluid Mobile',
    width: 420,
    height: 800,
    type: 'mobile',
    os: 'generic',
  },
];

export const OLD_APP: AppConfig = {
  id: 'old',
  title: 'CatchMyBus (Legacy)',
  versionTag: 'v1.0 (Old)',
  url: 'https://catchmybus88.vercel.app/',
  themeColor: '#f97316', // orange / amber
  tagline: 'Production Legacy Build (catchmybus88)',
  badgeLabel: 'Old Release',
  accentBorder: 'border-amber-500/40',
  accentBg: 'bg-amber-500/10',
  accentText: 'text-amber-400',
};

export const NEW_APP: AppConfig = {
  id: 'new',
  title: 'CatchMyBus (New)',
  versionTag: 'v2.0 (New)',
  url: 'https://catchmybusnew.vercel.app/',
  themeColor: '#06b6d4', // cyan / emerald
  tagline: 'Latest Updated Build (catchmybusnew)',
  badgeLabel: 'New Release',
  accentBorder: 'border-cyan-500/40',
  accentBg: 'bg-cyan-500/10',
  accentText: 'text-cyan-400',
};

export const DEFAULT_QA_ITEMS: QACheckItem[] = [
  {
    id: 'qa-1',
    category: 'UX & Design',
    title: 'Mobile Header & Navigation Bar',
    description: 'Verify title readability, search icon positioning, and safe area insets on notched screens.',
    oldStatus: 'pass',
    newStatus: 'pass',
    notes: 'Compare header visual polish and tap targets.',
  },
  {
    id: 'qa-2',
    category: 'Bus Timing',
    title: 'Real-time Arrival Countdown',
    description: 'Check bus arrival time accuracy, crowding indicator (seats available / standing), and double-decker bus icons.',
    oldStatus: 'pass',
    newStatus: 'pass',
    notes: 'Verify Singapore LTA Datamall live feed freshness.',
  },
  {
    id: 'qa-3',
    category: 'Weather & Search',
    title: 'Singapore 2-Hour Weather Widget',
    description: 'Validate rainfall and temperature forecast icons linked to current bus stop precinct.',
    oldStatus: 'untested',
    newStatus: 'pass',
    notes: 'Ensure weather syncs without layout shifts.',
  },
  {
    id: 'qa-4',
    category: 'Performance',
    title: 'Cold Start & Animation Smoothness',
    description: 'Initial render time and fluidity of bus stop search and service drawer opening.',
    oldStatus: 'pass',
    newStatus: 'pass',
    notes: 'Run the benchmark test to compare ms loading times.',
  },
  {
    id: 'qa-5',
    category: 'UX & Design',
    title: 'Bus Route / Stop Bookmarking (Favorites)',
    description: 'Adding and removing frequent bus routes to quick access tray.',
    oldStatus: 'untested',
    newStatus: 'untested',
    notes: 'Verify localStorage persistence.',
  },
];
