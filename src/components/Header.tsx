import {
  Smartphone,
  Columns,
  Sliders,
  RotateCw,
  Gauge,
  ClipboardList,
  Maximize2,
  Minimize2,
  Monitor,
  Eye,
} from 'lucide-react';
import { ViewMode, DevicePreset, Orientation } from '../types';
import { DEVICE_PRESETS } from '../constants/devices';

interface HeaderProps {
  viewMode: ViewMode;
  onSelectViewMode: (mode: ViewMode) => void;
  activePreset: DevicePreset;
  onSelectPreset: (preset: DevicePreset) => void;
  orientation: Orientation;
  onToggleOrientation: () => void;
  scale: number;
  onChangeScale: (scale: number) => void;
  showBezel: boolean;
  onToggleBezel: () => void;
  onSyncRefresh: () => void;
  onRunBenchmark: () => void;
  isBenchmarking: boolean;
  onOpenQANotes: () => void;
  qaNotesCount: number;
  isZenMode: boolean;
  onToggleZenMode: () => void;
}

export function Header({
  viewMode,
  onSelectViewMode,
  activePreset,
  onSelectPreset,
  orientation,
  onToggleOrientation,
  scale,
  onChangeScale,
  showBezel,
  onToggleBezel,
  onSyncRefresh,
  onRunBenchmark,
  isBenchmarking,
  onOpenQANotes,
  qaNotesCount,
  isZenMode,
  onToggleZenMode,
}: HeaderProps) {
  return (
    <header className="shrink-0 bg-slate-950 border-b border-slate-800/80 sticky top-0 z-40">
      {/* Primary Top Bar (Strict 3-Zone Contract) */}
      <div className="h-14 px-4 sm:px-6 flex items-center justify-between">
        {/* Zone 1: Single text element wordmark */}
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-500 to-cyan-500 flex items-center justify-center text-slate-950 font-black text-sm tracking-tighter">
            CB
          </div>
          <div>
            <h1 className="text-base font-bold tracking-tight text-white font-display flex items-center gap-2">
              CatchMyBus Compare
              <span className="hidden sm:inline text-[11px] font-mono font-normal text-slate-400">
                v1 Legacy vs v2 Next
              </span>
            </h1>
          </div>
        </div>

        {/* Zone 2: Navigation / View Mode Segmented Controls */}
        <nav className="flex items-center p-1 bg-slate-900 border border-slate-800 rounded-lg">
          <button
            onClick={() => onSelectViewMode('device')}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap ${
              viewMode === 'device'
                ? 'bg-slate-800 text-white shadow-xs'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Dual Devices</span>
            <span className="md:hidden">Devices</span>
          </button>

          <button
            onClick={() => onSelectViewMode('split')}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap ${
              viewMode === 'split'
                ? 'bg-slate-800 text-white shadow-xs'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Columns className="w-3.5 h-3.5" />
            <span>Split Screen</span>
          </button>

          <button
            onClick={() => onSelectViewMode('slider')}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap ${
              viewMode === 'slider'
                ? 'bg-slate-800 text-white shadow-xs'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Sliders className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Curtain Diff</span>
            <span className="md:hidden">Diff</span>
          </button>

          <button
            onClick={() => onSelectViewMode('old-only')}
            className={`flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap ${
              viewMode === 'old-only'
                ? 'bg-amber-500/20 text-amber-300 shadow-xs'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
            <span>Old Only</span>
          </button>

          <button
            onClick={() => onSelectViewMode('new-only')}
            className={`flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap ${
              viewMode === 'new-only'
                ? 'bg-cyan-500/20 text-cyan-300 shadow-xs'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
            <span>New Only</span>
          </button>
        </nav>

        {/* Zone 3: Primary Actions */}
        <div className="flex items-center gap-2">
          <button
            onClick={onRunBenchmark}
            disabled={isBenchmarking}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-200 bg-slate-900 hover:bg-slate-800 border border-slate-700/80 rounded-lg transition-colors whitespace-nowrap"
          >
            <Gauge className={`w-3.5 h-3.5 ${isBenchmarking ? 'text-amber-400 animate-spin' : 'text-cyan-400'}`} />
            <span className="hidden sm:inline">Speed Benchmark</span>
          </button>

          <button
            onClick={onOpenQANotes}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg transition-colors whitespace-nowrap"
          >
            <ClipboardList className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden sm:inline">Review & Diff Notes</span>
            <span className="sm:hidden">Notes</span>
          </button>

          <button
            onClick={onToggleZenMode}
            title={isZenMode ? 'Exit Zen Mode' : 'Zen Viewport Mode'}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-900 border border-transparent hover:border-slate-800 transition-colors"
          >
            {isZenMode ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Secondary Context Toolbar (Device, Orientation, Zoom, Sync) */}
      {!isZenMode && (
        <div className="h-11 px-4 sm:px-6 bg-slate-900/60 border-t border-slate-800/60 flex items-center justify-between text-xs text-slate-400 overflow-x-auto gap-4">
          {/* Left: Device preset selector */}
          <div className="flex items-center gap-2 shrink-0">
            <span className="text-[11px] text-slate-500 font-medium">Device:</span>
            <div className="flex items-center gap-1">
              {DEVICE_PRESETS.map((preset) => (
                <button
                  key={preset.id}
                  onClick={() => onSelectPreset(preset)}
                  className={`px-2.5 py-1 text-[11px] font-medium rounded transition-colors whitespace-nowrap ${
                    activePreset.id === preset.id
                      ? 'bg-slate-800 text-cyan-300 ring-1 ring-cyan-500/30'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                  }`}
                >
                  {preset.shortName}
                </button>
              ))}
            </div>
          </div>

          {/* Right: Controls (Orientation, Scale, Bezel, Refresh) */}
          <div className="flex items-center gap-3 shrink-0">
            {/* Orientation */}
            <button
              onClick={onToggleOrientation}
              title={`Switch to ${orientation === 'portrait' ? 'Landscape' : 'Portrait'}`}
              className="flex items-center gap-1 px-2 py-1 rounded bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 transition-colors"
            >
              <RotateCw className="w-3 h-3 text-slate-400" />
              <span className="text-[11px] capitalize">{orientation}</span>
            </button>

            {/* Zoom / Scale */}
            <div className="flex items-center gap-1 bg-slate-900 rounded border border-slate-800 p-0.5">
              {[0.75, 0.9, 1.0].map((s) => (
                <button
                  key={s}
                  onClick={() => onChangeScale(s)}
                  className={`px-1.5 py-0.5 text-[10px] font-mono rounded ${
                    scale === s
                      ? 'bg-slate-800 text-white font-semibold'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {Math.round(s * 100)}%
                </button>
              ))}
            </div>

            {/* Bezel Toggle (only applicable for device view) */}
            {viewMode === 'device' && (
              <button
                onClick={onToggleBezel}
                className={`flex items-center gap-1 px-2 py-1 rounded text-[11px] transition-colors ${
                  showBezel
                    ? 'bg-slate-800 text-white border border-slate-700'
                    : 'text-slate-500 hover:text-slate-300'
                }`}
              >
                <Monitor className="w-3 h-3" />
                <span>Device Bezel</span>
              </button>
            )}

            {/* Synchronized Refresh */}
            <button
              onClick={onSyncRefresh}
              className="flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-medium text-slate-200 bg-slate-800 hover:bg-slate-700 rounded transition-colors whitespace-nowrap"
            >
              <RotateCw className="w-3 h-3 text-cyan-400" />
              <span>Sync Refresh</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
