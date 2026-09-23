import { useState } from 'react';
import { RotateCcw, ExternalLink, Copy, Check, Maximize2, Smartphone, Tablet } from 'lucide-react';
import { AppConfig, DevicePreset, Orientation } from '../types';
import { IframeWrapper } from './IframeWrapper';

interface DeviceFrameProps {
  app: AppConfig;
  preset: DevicePreset;
  orientation: Orientation;
  scale: number;
  showBezel: boolean;
  refreshKey: number;
  onRefreshOne: () => void;
  onLoadReport: (timeMs: number) => void;
  onToggleMaximize?: () => void;
  isMaximized?: boolean;
}

export function DeviceFrame({
  app,
  preset,
  orientation,
  scale,
  showBezel,
  refreshKey,
  onRefreshOne,
  onLoadReport,
  onToggleMaximize,
  isMaximized = false,
}: DeviceFrameProps) {
  const [copied, setCopied] = useState(false);

  // Compute effective width & height based on orientation
  const isLandscape = orientation === 'landscape';
  const frameWidth = isLandscape ? preset.height : preset.width;
  const frameHeight = isLandscape ? preset.width : preset.height;

  const copyUrl = async () => {
    try {
      await navigator.clipboard.writeText(app.url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback
    }
  };

  const isOld = app.id === 'old';

  return (
    <div className="flex flex-col items-center select-none">
      {/* Device Header Bar */}
      <div
        style={{ width: `${frameWidth * scale}px` }}
        className="flex items-center justify-between mb-3 px-2 text-xs transition-all duration-200"
      >
        <div className="flex items-center gap-2">
          <span
            className={`w-2.5 h-2.5 rounded-full ${
              isOld ? 'bg-amber-500' : 'bg-cyan-500'
            } shadow-sm shadow-current`}
          />
          <span className="font-semibold text-slate-200 text-sm tracking-tight">{app.title}</span>
          <span
            className={`text-[11px] font-mono px-1.5 py-0.5 rounded border text-xs ${
              isOld
                ? 'border-amber-500/30 text-amber-300 bg-amber-500/10'
                : 'border-cyan-500/30 text-cyan-300 bg-cyan-500/10'
            }`}
          >
            {app.versionTag}
          </span>
        </div>

        <div className="flex items-center gap-1.5 text-slate-400">
          <span className="text-[11px] font-mono mr-1 text-slate-500 tabular-nums">
            {frameWidth}×{frameHeight}
          </span>

          <button
            onClick={onRefreshOne}
            title="Reload this application"
            className="p-1.5 rounded-md hover:bg-slate-800 hover:text-slate-200 text-slate-400 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={copyUrl}
            title="Copy URL"
            className="p-1.5 rounded-md hover:bg-slate-800 hover:text-slate-200 text-slate-400 transition-colors"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
          </button>

          <a
            href={app.url}
            target="_blank"
            rel="noopener noreferrer"
            title="Open in new tab"
            className="p-1.5 rounded-md hover:bg-slate-800 hover:text-slate-200 text-slate-400 transition-colors"
          >
            <ExternalLink className="w-3.5 h-3.5" />
          </a>

          {onToggleMaximize && (
            <button
              onClick={onToggleMaximize}
              title={isMaximized ? 'Restore dual view' : 'Maximize this view'}
              className="p-1.5 rounded-md hover:bg-slate-800 hover:text-slate-200 text-slate-400 transition-colors"
            >
              <Maximize2 className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Frame Container Scaled */}
      <div
        style={{
          width: `${frameWidth * scale}px`,
          height: `${frameHeight * scale}px`,
        }}
        className="relative transition-all duration-200"
      >
        <div
          style={{
            width: `${frameWidth}px`,
            height: `${frameHeight}px`,
            transform: `scale(${scale})`,
            transformOrigin: 'top left',
          }}
          className={`relative overflow-hidden transition-shadow duration-300 ${
            showBezel
              ? preset.type === 'tablet'
                ? 'rounded-[32px] p-3 bg-neutral-900 ring-1 ring-white/15 shadow-2xl shadow-black/80'
                : 'rounded-[46px] p-2.5 bg-neutral-950 ring-1 ring-white/20 shadow-2xl shadow-black/90'
              : 'rounded-xl ring-1 ring-slate-800 shadow-xl'
          }`}
        >
          {/* Subtle Outer Metal Trim Edge */}
          {showBezel && (
            <div className="absolute inset-0 pointer-events-none rounded-[inherit] border border-white/10" />
          )}

          {/* Notch or Dynamic Island if iPhone mobile */}
          {showBezel && preset.os === 'ios' && preset.type === 'mobile' && !isLandscape && (
            <div className="absolute top-4.5 left-1/2 -translate-x-1/2 z-30 w-28 h-6 bg-black rounded-full flex items-center justify-between px-2 pointer-events-none shadow-xs">
              <div className="w-2.5 h-2.5 rounded-full bg-[#111] ring-1 ring-white/10" />
              <div className="w-2.5 h-2.5 rounded-full bg-[#0a101d] ring-1 ring-cyan-500/20" />
            </div>
          )}

          {/* Android Camera Pin */}
          {showBezel && preset.os === 'android' && preset.type === 'mobile' && !isLandscape && (
            <div className="absolute top-4 left-1/2 -translate-x-1/2 z-30 w-3.5 h-3.5 bg-black rounded-full ring-1 ring-white/10 pointer-events-none" />
          )}

          {/* Inner Screen Canvas */}
          <div
            className={`w-full h-full relative overflow-hidden bg-slate-950 ${
              showBezel
                ? preset.type === 'tablet'
                  ? 'rounded-[24px]'
                  : 'rounded-[38px]'
                : 'rounded-lg'
            }`}
          >
            <IframeWrapper
              app={app}
              keyTrigger={refreshKey}
              onLoadReport={onLoadReport}
              width={frameWidth}
              height={frameHeight}
              className="w-full h-full"
            />
          </div>

          {/* iOS Bottom Home Bar */}
          {showBezel && preset.os === 'ios' && (
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-30 w-32 h-1 bg-white/40 rounded-full pointer-events-none backdrop-blur-xs" />
          )}
        </div>
      </div>

      {/* Device Specification Tag below frame */}
      <div className="mt-3 flex items-center gap-2 text-[11px] text-slate-500">
        {preset.type === 'tablet' ? (
          <Tablet className="w-3 h-3 text-slate-400" />
        ) : (
          <Smartphone className="w-3 h-3 text-slate-400" />
        )}
        <span>{preset.name}</span>
        <span aria-hidden="true">·</span>
        <span className="tabular-nums">
          {frameWidth} × {frameHeight} px
        </span>
        <span aria-hidden="true">·</span>
        <span>{Math.round(scale * 100)}% zoom</span>
      </div>
    </div>
  );
}
