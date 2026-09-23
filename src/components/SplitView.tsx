import { useState, useRef, useEffect, useCallback } from 'react';
import { RotateCcw, ExternalLink, Copy, Check, GripVertical } from 'lucide-react';
import { AppConfig } from '../types';
import { IframeWrapper } from './IframeWrapper';

interface SplitViewProps {
  oldApp: AppConfig;
  newApp: AppConfig;
  oldKey: number;
  newKey: number;
  onRefreshOld: () => void;
  onRefreshNew: () => void;
  onLoadOld: (timeMs: number) => void;
  onLoadNew: (timeMs: number) => void;
}

export function SplitView({
  oldApp,
  newApp,
  oldKey,
  newKey,
  onRefreshOld,
  onRefreshNew,
  onLoadOld,
  onLoadNew,
}: SplitViewProps) {
  const [splitPercent, setSplitPercent] = useState<number>(50);
  const [isDragging, setIsDragging] = useState(false);
  const [copiedOld, setCopiedOld] = useState(false);
  const [copiedNew, setCopiedNew] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!isDragging || !containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const percent = (x / rect.width) * 100;
      // Clamp between 20% and 80%
      const clamped = Math.min(Math.max(percent, 20), 80);
      setSplitPercent(clamped);
    },
    [isDragging]
  );

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    } else {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    }
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, handleMouseMove, handleMouseUp]);

  const copyUrl = async (url: string, isOld: boolean) => {
    try {
      await navigator.clipboard.writeText(url);
      if (isOld) {
        setCopiedOld(true);
        setTimeout(() => setCopiedOld(false), 2000);
      } else {
        setCopiedNew(true);
        setTimeout(() => setCopiedNew(false), 2000);
      }
    } catch {
      // fallback
    }
  };

  return (
    <div
      ref={containerRef}
      className="relative flex-1 w-full h-full flex overflow-hidden select-none bg-slate-950"
    >
      {/* If dragging, render an invisible backdrop overlay to prevent iframes from capturing mouse events */}
      {isDragging && <div className="absolute inset-0 z-50 cursor-col-resize" />}

      {/* Left Panel: Old App */}
      <div
        style={{ width: `${splitPercent}%` }}
        className="h-full flex flex-col border-r border-slate-800/80 bg-slate-950"
      >
        {/* Left Sub-Header */}
        <div className="h-10 shrink-0 px-3 bg-slate-900/90 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500 shadow-xs" />
            <span className="text-xs font-semibold text-slate-200">{oldApp.title}</span>
            <span className="text-[10px] font-mono px-1.5 py-0.5 rounded border border-amber-500/30 text-amber-300 bg-amber-500/10">
              {oldApp.versionTag}
            </span>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={onRefreshOld}
              title="Refresh Old App"
              className="p-1 rounded text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => copyUrl(oldApp.url, true)}
              title="Copy URL"
              className="p-1 rounded text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors"
            >
              {copiedOld ? (
                <Check className="w-3.5 h-3.5 text-emerald-400" />
              ) : (
                <Copy className="w-3.5 h-3.5" />
              )}
            </button>
            <a
              href={oldApp.url}
              target="_blank"
              rel="noopener noreferrer"
              title="Open in new window"
              className="p-1 rounded text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors"
            >
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>

        {/* Left Iframe Area */}
        <div className="flex-1 w-full h-full relative">
          <IframeWrapper
            app={oldApp}
            keyTrigger={oldKey}
            onLoadReport={onLoadOld}
            className="w-full h-full"
          />
        </div>
      </div>

      {/* Interactive Draggable Split Divider */}
      <div
        onMouseDown={handleMouseDown}
        onDoubleClick={() => setSplitPercent(50)}
        title="Drag to resize split (Double-click to reset to 50%)"
        className="relative z-40 w-3 -mx-1.5 flex items-center justify-center cursor-col-resize group select-none hover:bg-cyan-500/20 active:bg-cyan-500/30 transition-colors"
      >
        <div className="w-1 h-full bg-slate-800 group-hover:bg-cyan-500/80 transition-colors" />
        <div className="absolute top-1/2 -translate-y-1/2 w-6 h-12 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-400 group-hover:text-cyan-300 group-hover:border-cyan-500/50 shadow-lg">
          <GripVertical className="w-3.5 h-3.5" />
        </div>
      </div>

      {/* Right Panel: New App */}
      <div
        style={{ width: `${100 - splitPercent}%` }}
        className="h-full flex flex-col bg-slate-950"
      >
        {/* Right Sub-Header */}
        <div className="h-10 shrink-0 px-3 bg-slate-900/90 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-500 shadow-xs" />
            <span className="text-xs font-semibold text-slate-200">{newApp.title}</span>
            <span className="text-[10px] font-mono px-1.5 py-0.5 rounded border border-cyan-500/30 text-cyan-300 bg-cyan-500/10">
              {newApp.versionTag}
            </span>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={onRefreshNew}
              title="Refresh New App"
              className="p-1 rounded text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => copyUrl(newApp.url, false)}
              title="Copy URL"
              className="p-1 rounded text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors"
            >
              {copiedNew ? (
                <Check className="w-3.5 h-3.5 text-emerald-400" />
              ) : (
                <Copy className="w-3.5 h-3.5" />
              )}
            </button>
            <a
              href={newApp.url}
              target="_blank"
              rel="noopener noreferrer"
              title="Open in new window"
              className="p-1 rounded text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors"
            >
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>

        {/* Right Iframe Area */}
        <div className="flex-1 w-full h-full relative">
          <IframeWrapper
            app={newApp}
            keyTrigger={newKey}
            onLoadReport={onLoadNew}
            className="w-full h-full"
          />
        </div>
      </div>
    </div>
  );
}
