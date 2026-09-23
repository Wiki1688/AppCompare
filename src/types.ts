export type ViewMode = 'device' | 'split' | 'slider' | 'old-only' | 'new-only';

export type Orientation = 'portrait' | 'landscape';

export interface DevicePreset {
  id: string;
  name: string;
  shortName: string;
  width: number;
  height: number;
  type: 'mobile' | 'tablet' | 'desktop';
  os: 'ios' | 'android' | 'desktop' | 'generic';
}

export interface AppConfig {
  id: 'old' | 'new';
  title: string;
  versionTag: string;
  url: string;
  themeColor: string;
  tagline: string;
  badgeLabel: string;
  accentBorder: string;
  accentBg: string;
  accentText: string;
}

export interface BenchmarkMetrics {
  oldLoadTimeMs: number | null;
  newLoadTimeMs: number | null;
  isRunning: boolean;
  lastRanAt: string | null;
}

export interface QACheckItem {
  id: string;
  category: 'UX & Design' | 'Performance' | 'Bus Timing' | 'Weather & Search';
  title: string;
  description: string;
  oldStatus: 'pass' | 'partial' | 'fail' | 'untested';
  newStatus: 'pass' | 'partial' | 'fail' | 'untested';
  notes: string;
}
