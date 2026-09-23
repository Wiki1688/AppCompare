import { useState, useRef, useEffect, useCallback } from 'react';
import { RotateCcw, Sliders, Smartphone } from 'lucide-react';
import { AppConfig, DevicePreset, Orientation } from '../types';
import { IframeWrapper } from './IframeWrapper';

interface DiffSliderProps {
  oldApp: AppConfig;
  newApp: AppConfig;
  preset: DevicePreset;
  orientation: Orientation;
  scale: number;
  oldKey: number;
  newKey: number;
  onRefreshBoth: () => void;
  onLoadOld: (timeMs: number) => void;
  onLoadNew: (timeMs: number) => void;
}

export function DiffSlider({
  oldApp,
  newApp,
  preset,
  orientation,
  scale,
  oldKey,
  newKey,
  onRefreshBoth,
  onLoadOld,
  onLoadNew,
}: DiffSliderProps) {
  const [sliderPos, setSliderPos] = useState<number>(50); // percentage 0 to 100
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const isLandscape = orientation === 'landscape';
  const width = isLandscape ? preset.height : preset.width;
  const height = isLandscape ? preset.width : preset.height;

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!isDragging || !containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const pct = (x / rect.width) * 100;
      setSliderPos(Math.min(Math.max(pct, 2), 98));
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

  return (
    <div className="flex flex-col items-center select-none py-4">
      {/* Top instruction / controls */}
      <div
        style={{ width: `${width * scale}px` }}
        className="flex items-center justify-between mb-3 px-2 text-xs"
      >
        <div className="flex items-center gap-2">
          <Sliders className="w-3.5 h-3.5 text-cyan-400" />
          <span className="font-semibold text-slate-200">Overlay Diff Curtain</span>
          <span className="text-[11px] text-slate-400">
            Slide to inspect pixel & layout changes
          </span>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[11px] font-mono text-slate-400 tabular-nums">
            {Math.round(sliderPos)}% Old / {Math.round(100 - sliderPos)}% New
          </span>
          <button
            onClick={onRefreshBoth}
            title="Reload both layers"
            className="p-1 rounded text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Frame Container */}
      <div
        style={{
          width: `${width * scale}px`,
          height: `${height * scale}px`,
        }}
        className="relative"
      >
        <div
          ref={containerRef}
          style={{
            width: `${width}px`,
            height: `${height}px`,
            transform: `scale(${scale})`,
            transformOrigin: 'top left',
          }}
          className="relative rounded-2xl overflow-hidden ring-1 ring-slate-700 bg-slate-950 shadow-2xl"
        >
          {/* Prevent iframes intercepting mouse events when dragging */}
          {isDragging && <div className="absolute inset-0 z-50 cursor-ew-resize" />}

          {/* Under layer: Old App (Visible on the left up to sliderPos) */}
          <div className="absolute inset-0 z-10 w-full h-full">
            <IframeWrapper
              app={oldApp}
              keyTrigger={oldKey}
              onLoadReport={onLoadOld}
              width={width}
              height={height}
              className="w-full h-full pointer-events-auto"
            />
            {/* Old watermark label */}
            <div className="absolute top-3 left-3 z-30 pointer-events-none px-2 py-0.5 rounded bg-amber-500/80 text-black text-[10px] font-bold shadow-md">
              OLD (v1)
            </div>
          </div>

          {/* Over layer: New App (Clipped from left at sliderPos) */}
          <div
            style={{
              clipPath: `polygon(${sliderPos}% 0, 100% 0, 100% 100%, ${sliderPos}% 100%)`,
            }}
            className="absolute inset-0 z-20 w-full h-full"
          >
            <IframeWrapper
              app={newApp}
              keyTrigger={newKey}
              onLoadReport={onLoadNew}
              width={width}
              height={height}
              className="w-full h-full pointer-events-auto"
            />
            {/* New watermark label */}
            <div className="absolute top-3 right-3 z-30 pointer-events-none px-2 py-0.5 rounded bg-cyan-400/90 text-black text-[10px] font-bold shadow-md">
              NEW (v2)
            </div>
          </div>

          {/* Draggable Divider Line */}
          <div
            style={{ left: `${sliderPos}%` }}
            onMouseDown={handleMouseDown}
            className="absolute top-0 bottom-0 z-40 w-1 -ml-0.5 bg-white cursor-ew-resize flex items-center justify-center shadow-lg"
          >
            {/* Drag Handle Knob */}
            <div className="w-7 h-7 -ml-0.5 rounded-full bg-slate-900 border-2 border-white flex items-center justify-center text-white shadow-xl hover:scale-110 active:scale-95 transition-transform">
              <span className="text-[10px] font-mono font-bold tracking-tighter">⇄</span>
            </div>
          </div>
        </div>
      </div>

      {/* Info footer */}
      <div className="mt-3 flex items-center gap-3 text-xs text-slate-400">
        <span className="flex items-center gap-1">
          <Smartphone className="w-3.5 h-3.5 text-slate-500" />
          {preset.name} ({width} × {height} px)
        </span>
        <span aria-hidden="true" className="text-slate-600">·</span>
        <span>Double-click or drag slider to inspect differences</span>
      </div>
    </div>
  );
}
