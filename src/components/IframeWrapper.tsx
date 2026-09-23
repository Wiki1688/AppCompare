import { useState, useRef, useEffect } from 'react';
import { RefreshCw, ExternalLink, Copy, Check, AlertCircle } from 'lucide-react';
import { AppConfig } from '../types';

interface IframeWrapperProps {
  app: AppConfig;
  keyTrigger: number;
  onLoadReport?: (timeMs: number) => void;
  width?: number | string;
  height?: number | string;
  scale?: number;
  className?: string;
  showGlassBezel?: boolean;
}

export function IframeWrapper({
  app,
  keyTrigger,
  onLoadReport,
  width = '100%',
  height = '100%',
  scale = 1,
  className = '',
}: IframeWrapperProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [copied, setCopied] = useState(false);
  const startTimeRef = useRef<number>(Date.now());
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    setIsLoading(true);
    setHasError(false);
    startTimeRef.current = Date.now();
  }, [keyTrigger, app.url]);

  const handleLoad = () => {
    setIsLoading(false);
    const elapsed = Date.now() - startTimeRef.current;
    if (onLoadReport) {
      onLoadReport(elapsed);
    }
  };

  const copyUrl = async () => {
    try {
      await navigator.clipboard.writeText(app.url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback
    }
  };

  return (
    <div className={`relative flex flex-col w-full h-full bg-slate-950 overflow-hidden ${className}`}>
      {/* Loading Overlay */}
      {isLoading && (
        <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-slate-950/85 backdrop-blur-xs text-slate-300">
          <div className="relative w-10 h-10 mb-3">
            <div className="w-10 h-10 border-2 border-slate-700 rounded-full"></div>
            <div
              className={`absolute top-0 left-0 w-10 h-10 border-2 rounded-full border-t-transparent animate-spin ${
                app.id === 'old' ? 'border-amber-400' : 'border-cyan-400'
              }`}
            ></div>
          </div>
          <p className="text-xs font-medium text-slate-400">Loading {app.title}...</p>
          <span className="text-[11px] text-slate-500 font-mono mt-1">{app.url}</span>
        </div>
      )}

      {/* Error Fallback */}
      {hasError && (
        <div className="absolute inset-0 z-30 flex flex-col items-center justify-center p-6 text-center bg-slate-900 text-slate-300">
          <AlertCircle className="w-8 h-8 text-amber-400 mb-2" />
          <h4 className="text-sm font-semibold text-slate-200">Unable to embed iframe</h4>
          <p className="text-xs text-slate-400 max-w-xs mt-1">
            Browser or network security prevented direct embed of this frame.
          </p>
          <div className="flex gap-2 mt-4">
            <a
              href={app.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-white bg-slate-800 hover:bg-slate-700 rounded-md transition-colors"
            >
              Open in New Window <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      )}

      {/* Main Iframe */}
      <div className="relative w-full h-full flex-1 overflow-hidden bg-white">
        <iframe
          ref={iframeRef}
          key={`${app.id}-${keyTrigger}`}
          src={app.url}
          title={app.title}
          width={width}
          height={height}
          onLoad={handleLoad}
          onError={() => setHasError(true)}
          style={{
            transform: scale !== 1 ? `scale(${scale})` : undefined,
            transformOrigin: 'top center',
          }}
          className="w-full h-full border-0 block"
          sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-modals"
          allow="geolocation; camera; microphone; clipboard-read; clipboard-write"
        />
      </div>

      {/* Tiny Bottom Helper Tray if needed */}
      <div className="h-6 shrink-0 bg-slate-900/90 border-t border-slate-800/80 px-2.5 flex items-center justify-between text-[10px] text-slate-400">
        <div className="flex items-center gap-1.5 truncate max-w-[70%]">
          <span
            className={`w-1.5 h-1.5 rounded-full ${
              isLoading ? 'bg-amber-400 animate-pulse' : 'bg-emerald-400'
            }`}
          />
          <span className="truncate font-mono">{app.url.replace('https://', '')}</span>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={copyUrl}
            title="Copy URL"
            className="hover:text-slate-200 transition-colors flex items-center gap-1"
          >
            {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
          </button>
          <a
            href={app.url}
            target="_blank"
            rel="noopener noreferrer"
            title="Open in new window"
            className="hover:text-slate-200 transition-colors flex items-center gap-1"
          >
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </div>
    </div>
  );
}
