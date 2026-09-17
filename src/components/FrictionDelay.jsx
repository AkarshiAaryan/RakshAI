import React from 'react';
import { Hourglass, Sparkles } from 'lucide-react';
import { locales } from '../locales/strings';

export default function FrictionDelay({ lang }) {
  const t = locales[lang] || locales.en;

  return (
    <div className="flex items-center gap-3 p-3 bg-amber-50 border border-amber-200 rounded-xl text-amber-900 text-xs shadow-sm animate-pulse">
      <div className="p-1.5 bg-amber-200 rounded-lg text-amber-800">
        <Hourglass className="w-4 h-4 animate-spin" />
      </div>
      <div className="flex-1">
        <p className="font-semibold text-amber-950 flex items-center gap-1">
          {t.frictionNotice}
          <Sparkles className="w-3 h-3 text-amber-600" />
        </p>
      </div>
    </div>
  );
}
