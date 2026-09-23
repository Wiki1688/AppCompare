import { useState, useEffect } from 'react';
import {
  X,
  CheckCircle,
  AlertTriangle,
  XCircle,
  HelpCircle,
  Copy,
  Check,
  Star,
  Download,
  Share2,
  ExternalLink,
} from 'lucide-react';
import { QACheckItem } from '../types';
import { OLD_APP, NEW_APP, DEFAULT_QA_ITEMS } from '../constants/devices';

interface QANotesModalProps {
  isOpen: boolean;
  onClose: () => void;
  oldLoadTime: number | null;
  newLoadTime: number | null;
}

const STORAGE_KEY_ITEMS = 'catchmybus_qa_items_v1';
const STORAGE_KEY_NOTES = 'catchmybus_qa_notes_v1';
const STORAGE_KEY_RATINGS = 'catchmybus_qa_ratings_v1';

export function QANotesModal({ isOpen, onClose, oldLoadTime, newLoadTime }: QANotesModalProps) {
  const [items, setItems] = useState<QACheckItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_ITEMS);
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return DEFAULT_QA_ITEMS;
  });

  const [notes, setNotes] = useState<string>(() => {
    try {
      return localStorage.getItem(STORAGE_KEY_NOTES) || '';
    } catch {
      return '';
    }
  });

  const [ratings, setRatings] = useState<{
    oldDesign: number;
    newDesign: number;
    oldSpeed: number;
    newSpeed: number;
  }>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_RATINGS);
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return { oldDesign: 3, newDesign: 5, oldSpeed: 4, newSpeed: 5 };
  });

  const [copied, setCopied] = useState(false);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_ITEMS, JSON.stringify(items));
    } catch {
      // ignore
    }
  }, [items]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_NOTES, notes);
    } catch {
      // ignore
    }
  }, [notes]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_RATINGS, JSON.stringify(ratings));
    } catch {
      // ignore
    }
  }, [ratings]);

  if (!isOpen) return null;

  const cycleStatus = (itemId: string, target: 'old' | 'new') => {
    const sequence: ('pass' | 'partial' | 'fail' | 'untested')[] = [
      'pass',
      'partial',
      'fail',
      'untested',
    ];
    setItems((prev) =>
      prev.map((item) => {
        if (item.id !== itemId) return item;
        const current = target === 'old' ? item.oldStatus : item.newStatus;
        const nextIdx = (sequence.indexOf(current) + 1) % sequence.length;
        const nextVal = sequence[nextIdx];
        return target === 'old'
          ? { ...item, oldStatus: nextVal }
          : { ...item, newStatus: nextVal };
      })
    );
  };

  const getStatusBadge = (status: 'pass' | 'partial' | 'fail' | 'untested') => {
    switch (status) {
      case 'pass':
        return (
          <span className="flex items-center gap-1 text-[11px] font-medium text-emerald-400">
            <CheckCircle className="w-3.5 h-3.5" /> Pass
          </span>
        );
      case 'partial':
        return (
          <span className="flex items-center gap-1 text-[11px] font-medium text-amber-400">
            <AlertTriangle className="w-3.5 h-3.5" /> Notice
          </span>
        );
      case 'fail':
        return (
          <span className="flex items-center gap-1 text-[11px] font-medium text-rose-400">
            <XCircle className="w-3.5 h-3.5" /> Issue
          </span>
        );
      default:
        return (
          <span className="flex items-center gap-1 text-[11px] font-medium text-slate-500">
            <HelpCircle className="w-3.5 h-3.5" /> Untested
          </span>
        );
    }
  };

  const generateReportText = () => {
    let report = `# CatchMyBus Comparison Evaluation Report\n\n`;
    report += `Date: ${new Date().toLocaleDateString()}\n`;
    report += `Old (Legacy): ${OLD_APP.url}\n`;
    report += `New (Updated): ${NEW_APP.url}\n\n`;

    report += `## Performance Latency\n`;
    report += `- Old App Cold Load: ${oldLoadTime ? `${oldLoadTime}ms` : 'Not tested'}\n`;
    report += `- New App Cold Load: ${newLoadTime ? `${newLoadTime}ms` : 'Not tested'}\n\n`;

    report += `## Feature Checklist\n`;
    items.forEach((item) => {
      report += `- [${item.category}] ${item.title}: Old=${item.oldStatus.toUpperCase()} | New=${item.newStatus.toUpperCase()}\n`;
    });

    if (notes) {
      report += `\n## Reviewer Notes\n${notes}\n`;
    }

    return report;
  };

  const handleCopyReport = async () => {
    try {
      await navigator.clipboard.writeText(generateReportText());
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs">
      <div className="relative w-full max-w-2xl max-h-[85vh] flex flex-col bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl overflow-hidden">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-white font-display">
              CatchMyBus Evaluation & Diff Notes
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Side-by-side QA verification between legacy and new versions
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Target App Links Card */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="p-3 rounded-xl bg-slate-950/60 border border-amber-500/20">
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="font-semibold text-amber-400">Old Version (catchmybus88)</span>
                <a
                  href={OLD_APP.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-slate-400 hover:text-white"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
              <p className="text-xs font-mono text-slate-300 truncate">{OLD_APP.url}</p>
              <div className="mt-2 text-[11px] text-slate-500 flex items-center gap-2">
                <span>Bundle: assets/index-BbWw4ee5.js</span>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-slate-950/60 border border-cyan-500/20">
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="font-semibold text-cyan-400">New Version (catchmybusnew)</span>
                <a
                  href={NEW_APP.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-slate-400 hover:text-white"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
              <p className="text-xs font-mono text-slate-300 truncate">{NEW_APP.url}</p>
              <div className="mt-2 text-[11px] text-slate-500 flex items-center gap-2">
                <span>Bundle: assets/index-CKQ7VBUg.js</span>
              </div>
            </div>
          </div>

          {/* Verification Criteria Table */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-xs font-semibold text-slate-200">
                Functional Verification Checklist
              </h4>
              <span className="text-[11px] text-slate-500">
                Click status pill to cycle Pass / Notice / Issue
              </span>
            </div>

            <div className="divide-y divide-slate-800 border border-slate-800 rounded-xl overflow-hidden bg-slate-950/40">
              {items.map((item) => (
                <div key={item.id} className="p-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                  <div className="flex-1 pr-2">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] uppercase font-mono text-slate-500">
                        {item.category}
                      </span>
                      <span aria-hidden="true" className="text-slate-700">·</span>
                      <span className="font-medium text-slate-200">{item.title}</span>
                    </div>
                    <p className="text-[11px] text-slate-400 mt-0.5">{item.description}</p>
                  </div>

                  <div className="flex items-center gap-4 shrink-0">
                    <button
                      onClick={() => cycleStatus(item.id, 'old')}
                      title="Click to toggle Old status"
                      className="px-2.5 py-1 rounded bg-slate-900 border border-slate-800 hover:border-slate-700 transition-colors"
                    >
                      <div className="text-[10px] text-slate-500 text-left">Old:</div>
                      {getStatusBadge(item.oldStatus)}
                    </button>

                    <button
                      onClick={() => cycleStatus(item.id, 'new')}
                      title="Click to toggle New status"
                      className="px-2.5 py-1 rounded bg-slate-900 border border-slate-800 hover:border-slate-700 transition-colors"
                    >
                      <div className="text-[10px] text-slate-500 text-left">New:</div>
                      {getStatusBadge(item.newStatus)}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Qualitative Star Ratings */}
          <div className="p-4 rounded-xl bg-slate-950/40 border border-slate-800">
            <h4 className="text-xs font-semibold text-slate-200 mb-3">Overall Assessment</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <span className="text-amber-400 font-medium">Old Build Rating:</span>
                <div className="flex items-center gap-1 mt-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      onClick={() => setRatings((prev) => ({ ...prev, oldDesign: star }))}
                      className="text-amber-400 hover:scale-110 transition-transform"
                    >
                      <Star
                        className={`w-4 h-4 ${
                          star <= ratings.oldDesign ? 'fill-amber-400' : 'text-slate-700'
                        }`}
                      />
                    </button>
                  ))}
                  <span className="ml-2 text-slate-400 font-mono text-[11px]">
                    {ratings.oldDesign}/5
                  </span>
                </div>
              </div>

              <div>
                <span className="text-cyan-400 font-medium">New Build Rating:</span>
                <div className="flex items-center gap-1 mt-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      onClick={() => setRatings((prev) => ({ ...prev, newDesign: star }))}
                      className="text-cyan-400 hover:scale-110 transition-transform"
                    >
                      <Star
                        className={`w-4 h-4 ${
                          star <= ratings.newDesign ? 'fill-cyan-400' : 'text-slate-700'
                        }`}
                      />
                    </button>
                  ))}
                  <span className="ml-2 text-slate-400 font-mono text-[11px]">
                    {ratings.newDesign}/5
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Custom Reviewer Notes */}
          <div>
            <label htmlFor="qa-notes-input" className="block text-xs font-semibold text-slate-200 mb-1.5">
              Reviewer Findings & Observations
            </label>
            <textarea
              id="qa-notes-input"
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Bus arrival countdown is sharper on the new build, weather pill renders smoothly, responsive layout handles mobile landscape properly..."
              className="w-full px-3 py-2 text-xs text-slate-200 bg-slate-950 border border-slate-800 rounded-xl focus:outline-hidden focus:border-cyan-500/80 resize-none"
            />
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3 border-t border-slate-800 bg-slate-950/70 flex items-center justify-between">
          <button
            onClick={handleCopyReport}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-200 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg transition-colors"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span>Copied to Clipboard!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Copy Evaluation Report</span>
              </>
            )}
          </button>

          <button
            onClick={onClose}
            className="px-4 py-1.5 text-xs font-medium text-white bg-cyan-600 hover:bg-cyan-500 rounded-lg transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
