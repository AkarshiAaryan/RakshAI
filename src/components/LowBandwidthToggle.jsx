import React from 'react';
import { Wifi, WifiOff } from 'lucide-react';
import { locales } from '../locales/strings';
import { logger } from '../utils/logger';

export default function LowBandwidthToggle({ isLowBandwidth, onToggle, lang }) {
  const t = locales[lang] || locales.en;

  const handleToggle = () => {
    onToggle(!isLowBandwidth);
    logger.log('low_bandwidth_toggled', { newState: !isLowBandwidth });
  };

  return (
    <button
      onClick={handleToggle}
      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all border ${
        isLowBandwidth 
          ? 'bg-amber-500 text-slate-950 border-amber-400 font-bold shadow-sm' 
          : 'bg-slate-800/80 hover:bg-slate-700 text-slate-300 border-slate-700'
      }`}
      title="Toggle Low Bandwidth Text-Only Mode"
    >
      {isLowBandwidth ? (
        <>
          <WifiOff className="w-3.5 h-3.5 text-slate-950" />
          <span>Low Data Active</span>
        </>
      ) : (
        <>
          <Wifi className="w-3.5 h-3.5 text-teal-400" />
          <span>{t.lowBandwidth}</span>
        </>
      )}
    </button>
  );
}
