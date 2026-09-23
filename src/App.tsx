import { useState, useCallback } from 'react';
import { ViewMode, DevicePreset, Orientation, BenchmarkMetrics } from './types';
import { DEVICE_PRESETS, OLD_APP, NEW_APP } from './constants/devices';
import { Header } from './components/Header';
import { DeviceFrame } from './components/DeviceFrame';
import { SplitView } from './components/SplitView';
import { DiffSlider } from './components/DiffSlider';
import { IframeWrapper } from './components/IframeWrapper';
import { BenchmarkBanner } from './components/BenchmarkBanner';
import { QANotesModal } from './components/QANotesModal';

export default function App() {
  const [viewMode, setViewMode] = useState<ViewMode>('device');
  const [activePreset, setActivePreset] = useState<DevicePreset>(DEVICE_PRESETS[0]);
  const [orientation, setOrientation] = useState<Orientation>('portrait');
  const [scale, setScale] = useState<number>(0.9);
  const [showBezel, setShowBezel] = useState<boolean>(true);
  const [isZenMode, setIsZenMode] = useState<boolean>(false);
  const [isQANotesOpen, setIsQANotesOpen] = useState<boolean>(false);

  // Refresh counters to trigger iframe reloads
  const [oldKey, setOldKey] = useState<number>(1);
  const [newKey, setNewKey] = useState<number>(1);

  // Speed Benchmark
  const [benchmarkMetrics, setBenchmarkMetrics] = useState<BenchmarkMetrics>({
    oldLoadTimeMs: null,
    newLoadTimeMs: null,
    isRunning: false,
    lastRanAt: null,
  });

  // Track single load reports
  const handleLoadOld = useCallback((timeMs: number) => {
    setBenchmarkMetrics((prev) => ({
      ...prev,
      oldLoadTimeMs: timeMs,
      isRunning: prev.isRunning && prev.newLoadTimeMs === null ? true : false,
    }));
  }, []);

  const handleLoadNew = useCallback((timeMs: number) => {
    setBenchmarkMetrics((prev) => ({
      ...prev,
      newLoadTimeMs: timeMs,
      isRunning: prev.isRunning && prev.oldLoadTimeMs === null ? true : false,
    }));
  }, []);

  // Synchronized reload
  const handleSyncRefresh = () => {
    setOldKey((k) => k + 1);
    setNewKey((k) => k + 1);
  };

  // Run Benchmark (simultaneously reload both and measure times)
  const handleRunBenchmark = () => {
    setBenchmarkMetrics({
      oldLoadTimeMs: null,
      newLoadTimeMs: null,
      isRunning: true,
      lastRanAt: new Date().toLocaleTimeString(),
    });
    setOldKey((k) => k + 1);
    setNewKey((k) => k + 1);
  };

  const toggleOrientation = () => {
    setOrientation((o) => (o === 'portrait' ? 'landscape' : 'portrait'));
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100 selection:bg-cyan-500/30">
      {/* Top Header */}
      <Header
        viewMode={viewMode}
        onSelectViewMode={setViewMode}
        activePreset={activePreset}
        onSelectPreset={setActivePreset}
        orientation={orientation}
        onToggleOrientation={toggleOrientation}
        scale={scale}
        onChangeScale={setScale}
        showBezel={showBezel}
        onToggleBezel={() => setShowBezel((b) => !b)}
        onSyncRefresh={handleSyncRefresh}
        onRunBenchmark={handleRunBenchmark}
        isBenchmarking={benchmarkMetrics.isRunning}
        onOpenQANotes={() => setIsQANotesOpen(true)}
        qaNotesCount={5}
        isZenMode={isZenMode}
        onToggleZenMode={() => setIsZenMode((z) => !z)}
      />

      {/* Speed Benchmark Results Banner */}
      <BenchmarkBanner
        metrics={benchmarkMetrics}
        onDismiss={() =>
          setBenchmarkMetrics((prev) => ({
            ...prev,
            oldLoadTimeMs: null,
            newLoadTimeMs: null,
            isRunning: false,
          }))
        }
        onRerun={handleRunBenchmark}
      />

      {/* Main Comparative Viewport Workspace */}
      <main className="flex-1 flex flex-col relative overflow-hidden">
        {/* MODE 1: Dual Device Mockups (Side-by-Side) */}
        {viewMode === 'device' && (
          <div className="flex-1 w-full overflow-auto py-8 px-4 flex flex-col items-center justify-start">
            <div className="flex flex-wrap items-start justify-center gap-8 lg:gap-12 max-w-full">
              {/* Old Application Device Frame */}
              <DeviceFrame
                app={OLD_APP}
                preset={activePreset}
                orientation={orientation}
                scale={scale}
                showBezel={showBezel}
                refreshKey={oldKey}
                onRefreshOne={() => setOldKey((k) => k + 1)}
                onLoadReport={handleLoadOld}
                onToggleMaximize={() => setViewMode('old-only')}
              />

              {/* New Application Device Frame */}
              <DeviceFrame
                app={NEW_APP}
                preset={activePreset}
                orientation={orientation}
                scale={scale}
                showBezel={showBezel}
                refreshKey={newKey}
                onRefreshOne={() => setNewKey((k) => k + 1)}
                onLoadReport={handleLoadNew}
                onToggleMaximize={() => setViewMode('new-only')}
              />
            </div>
          </div>
        )}

        {/* MODE 2: Split View (Resizable 50/50 Screen) */}
        {viewMode === 'split' && (
          <div className="flex-1 w-full h-[calc(100vh-3.5rem)] flex flex-col">
            <SplitView
              oldApp={OLD_APP}
              newApp={NEW_APP}
              oldKey={oldKey}
              newKey={newKey}
              onRefreshOld={() => setOldKey((k) => k + 1)}
              onRefreshNew={() => setNewKey((k) => k + 1)}
              onLoadOld={handleLoadOld}
              onLoadNew={handleLoadNew}
            />
          </div>
        )}

        {/* MODE 3: Curtain Diff Slider (Overlay) */}
        {viewMode === 'slider' && (
          <div className="flex-1 w-full overflow-auto py-4 px-4 flex justify-center">
            <DiffSlider
              oldApp={OLD_APP}
              newApp={NEW_APP}
              preset={activePreset}
              orientation={orientation}
              scale={scale}
              oldKey={oldKey}
              newKey={newKey}
              onRefreshBoth={handleSyncRefresh}
              onLoadOld={handleLoadOld}
              onLoadNew={handleLoadNew}
            />
          </div>
        )}

        {/* MODE 4: Old Only (Focused View) */}
        {viewMode === 'old-only' && (
          <div className="flex-1 w-full h-[calc(100vh-3.5rem)] flex flex-col">
            <div className="h-10 shrink-0 px-4 bg-slate-900 border-b border-slate-800 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                <span className="font-semibold text-white">{OLD_APP.title}</span>
                <span className="text-[11px] font-mono text-slate-400">({OLD_APP.url})</span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setOldKey((k) => k + 1)}
                  className="px-2.5 py-1 text-slate-300 hover:text-white bg-slate-800 rounded text-xs"
                >
                  Reload
                </button>
                <button
                  onClick={() => setViewMode('device')}
                  className="px-2.5 py-1 text-cyan-300 hover:text-cyan-200 bg-cyan-950/60 border border-cyan-800 rounded text-xs"
                >
                  Back to Side-by-Side
                </button>
              </div>
            </div>
            <div className="flex-1 w-full h-full">
              <IframeWrapper
                app={OLD_APP}
                keyTrigger={oldKey}
                onLoadReport={handleLoadOld}
                className="w-full h-full"
              />
            </div>
          </div>
        )}

        {/* MODE 5: New Only (Focused View) */}
        {viewMode === 'new-only' && (
          <div className="flex-1 w-full h-[calc(100vh-3.5rem)] flex flex-col">
            <div className="h-10 shrink-0 px-4 bg-slate-900 border-b border-slate-800 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-cyan-500" />
                <span className="font-semibold text-white">{NEW_APP.title}</span>
                <span className="text-[11px] font-mono text-slate-400">({NEW_APP.url})</span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setNewKey((k) => k + 1)}
                  className="px-2.5 py-1 text-slate-300 hover:text-white bg-slate-800 rounded text-xs"
                >
                  Reload
                </button>
                <button
                  onClick={() => setViewMode('device')}
                  className="px-2.5 py-1 text-cyan-300 hover:text-cyan-200 bg-cyan-950/60 border border-cyan-800 rounded text-xs"
                >
                  Back to Side-by-Side
                </button>
              </div>
            </div>
            <div className="flex-1 w-full h-full">
              <IframeWrapper
                app={NEW_APP}
                keyTrigger={newKey}
                onLoadReport={handleLoadNew}
                className="w-full h-full"
              />
            </div>
          </div>
        )}
      </main>

      {/* Clean Unboxed Footer with Typographic Separators */}
      {!isZenMode && (
        <footer className="shrink-0 h-10 px-4 sm:px-6 bg-slate-950 border-t border-slate-800/60 flex items-center justify-between text-[11px] text-slate-500">
          <div className="flex items-center gap-2">
            <span>Left: catchmybus88.vercel.app</span>
            <span aria-hidden="true">·</span>
            <span>Right: catchmybusnew.vercel.app</span>
            <span aria-hidden="true">·</span>
            <span>Singapore LTA Bus Timing & Weather</span>
          </div>

          <div className="hidden sm:flex items-center gap-3">
            <span>Interactive Side-by-Side Comparison Workspace</span>
            <span aria-hidden="true">·</span>
            <span>Double-click divider to center</span>
          </div>
        </footer>
      )}

      {/* QA Notes & Verification Drawer Modal */}
      <QANotesModal
        isOpen={isQANotesOpen}
        onClose={() => setIsQANotesOpen(false)}
        oldLoadTime={benchmarkMetrics.oldLoadTimeMs}
        newLoadTime={benchmarkMetrics.newLoadTimeMs}
      />
    </div>
  );
}
