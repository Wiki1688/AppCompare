import { Gauge, CheckCircle2, X, RefreshCw } from 'lucide-react';
import { BenchmarkMetrics } from '../types';

interface BenchmarkBannerProps {
  metrics: BenchmarkMetrics;
  onDismiss: () => void;
  onRerun: () => void;
}

export function BenchmarkBanner({ metrics, onDismiss, onRerun }: BenchmarkBannerProps) {
  const { oldLoadTimeMs, newLoadTimeMs, isRunning } = metrics;

  if (oldLoadTimeMs === null && newLoadTimeMs === null && !isRunning) {
    return null;
  }

  const isBothComplete = oldLoadTimeMs !== null && newLoadTimeMs !== null && !isRunning;
  const diffMs = isBothComplete ? oldLoadTimeMs! - newLoadTimeMs! : 0;
  const isNewFaster = isBothComplete && diffMs > 0;
  const pct = isBothComplete && oldLoadTimeMs! > 0
    ? Math.abs(Math.round((diffMs / oldLoadTimeMs!) * 100))
    : 0;

  return (
    <div className="shrink-0 bg-slate-900 border-b border-slate-800 px-4 sm:px-6 py-2.5 flex items-center justify-between text-xs">
      <div className="flex items-center gap-3 overflow-x-auto">
        <div className="flex items-center gap-1.5 font-medium text-slate-300">
          <Gauge className="w-4 h-4 text-cyan-400 shrink-0" />
          <span>Cold-Load Benchmark:</span>
        </div>

        {isRunning ? (
          <div className="flex items-center gap-2 text-amber-300 animate-pulse">
            <RefreshCw className="w-3.5 h-3.5 animate-spin" />
            <span>Reloading both applications & measuring response latency...</span>
          </div>
        ) : (
          <div className="flex items-center gap-3 text-slate-300 font-mono text-[11px]">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-amber-400" />
              Old App: <strong className="text-white tabular-nums">{oldLoadTimeMs} ms</strong>
            </span>
            <span className="text-slate-600">vs</span>
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-cyan-400" />
              New App: <strong className="text-white tabular-nums">{newLoadTimeMs} ms</strong>
            </span>

            {isBothComplete && (
              <span
                className={`px-2 py-0.5 rounded text-[11px] font-sans font-medium flex items-center gap-1 ${
                  isNewFaster
                    ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30'
                    : 'bg-amber-500/15 text-amber-300 border border-amber-500/30'
                }`}
              >
                <CheckCircle2 className="w-3 h-3" />
                {isNewFaster
                  ? `New build is ${diffMs}ms faster (~${pct}% gain)`
                  : `Old build was ${Math.abs(diffMs!)}ms faster`}
              </span>
            )}
          </div>
        )}
      </div>

      <div className="flex items-center gap-2 shrink-0 ml-3">
        <button
          onClick={onRerun}
          disabled={isRunning}
          className="text-slate-400 hover:text-white transition-colors flex items-center gap-1 text-[11px]"
        >
          <RefreshCw className="w-3 h-3" />
          <span>Re-test</span>
        </button>
        <button
          onClick={onDismiss}
          className="p-1 text-slate-500 hover:text-slate-300 transition-colors"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}
