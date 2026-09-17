import React from 'react';
import { CheckCircle2, AlertCircle, AlertOctagon } from 'lucide-react';
import { locales } from '../locales/strings';

export default function ConfidenceTag({ tag, lang, isEnabled = true }) {
  if (!isEnabled) return null;

  const t = locales[lang] || locales.en;

  if (tag === 'confident') {
    return (
      <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 border border-emerald-300">
        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
        <span>✅ {t.tagConfident}</span>
      </div>
    );
  }

  if (tag === 'unsure') {
    return (
      <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-100 text-amber-900 border border-amber-300">
        <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
        <span>🤔 {t.tagUnsure}</span>
      </div>
    );
  }

  if (tag === 'grownUp') {
    return (
      <div className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-full text-xs font-bold bg-rose-100 text-rose-900 border border-rose-400 animate-pulse-slow">
        <AlertOctagon className="w-4 h-4 text-rose-600" />
        <span>🛑 {t.tagGrownUp}</span>
      </div>
    );
  }

  return null;
}
